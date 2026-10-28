/**
 * Account-cookie billing transport used by app/lib/api.js and CreditBalance.
 * One UUID identifies one click across transport retries. Browsers never select
 * prices, user IDs or settlement actions and never receive the internal token.
 * Long REST jobs and disconnected WebSockets recover via owned FastAPI job reads.
 */
import { browserFetch, clearSessionHint } from '@/app/features/auth/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// ============================================================================
// SAFE ERRORS AND CUSTOMER READS
// Wallet refresh events carry no account/report content. Failed reads must clear
// stale balances in the component rather than presenting guessed zero credits.
// ============================================================================
/** Notify the dashboard to fetch a fresh authoritative balance and job list. */
export function refreshCredits() {
  window.dispatchEvent(new Event('credits-changed'));
}

/** Read JSON with cookie auth; preserve readable FastAPI billing/validation errors. */
async function read(response) {
  if (response.status === 401) {
    clearSessionHint();
    window.dispatchEvent(new Event('auth-expired'));
  }
  const body = await response.json();
  if (!response.ok) {
    const detail = body.detail;
    const message = typeof detail === 'string' ? detail : detail?.message;
    const error = new Error(message || (Array.isArray(detail) ? detail.map(item => item.msg).join('; ') : 'Credit request could not be completed.'));
    error.status = response.status;
    throw error;
  }
  return body;
}

/** Load only the signed-in account's available/reserved balance from FastAPI. */
export async function getCreditBalance() {
  return read(await browserFetch(`${BASE_URL}/credits/balance`, { signal: AbortSignal.timeout(15000), cache: 'no-store' }));
}

/** List safe job summaries; recovery remains available for one hour after settlement. */
export async function getCreditJobs() {
  return read(await browserFetch(`${BASE_URL}/credits/jobs`, { signal: AbortSignal.timeout(15000), cache: 'no-store' }));
}

/** Read one owner-scoped job; the server only includes results after settlement. */
export async function getCreditJob(jobId) {
  return read(await browserFetch(`${BASE_URL}/credits/jobs/${encodeURIComponent(jobId)}`, { signal: AbortSignal.timeout(15000), cache: 'no-store' }));
}

/** Wait without posting again; a service outage must never start another audit. */
export async function recoverCreditJob(jobId, onProgress, signal) {
  const deadline = Date.now() + 2 * 60 * 60 * 1000;
  let failures = 0;
  while (Date.now() < deadline) {
    // Recovery UI can unmount during tab changes; abort only observation, never
    // the server-owned job or its settlement. Report transports omit this signal.
    if (signal?.aborted) throw new Error('Recovery view closed.');
    let job;
    try {
      job = await getCreditJob(jobId);
      failures = 0;
    } catch (error) {
      if ([401, 404, 410].includes(error.status) || ++failures >= 5) throw error;
      await new Promise(resolve => setTimeout(resolve, 3000));
      continue;
    }
    if (job.state === 'COMPLETED') { refreshCredits(); return job.result; }
    if (job.state === 'FAILED') { refreshCredits(); throw new Error(job.error || 'Audit generation failed.'); }
    // Pending settlement is private bookkeeping; show report preparation instead.
    onProgress?.(job.state.endsWith('PENDING') ? 'Preparing your report...' : 'Audit is running. You can recover it here if the connection drops.');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error('The audit is taking longer than expected. Check its status under Credits before starting another run.');
}

// ============================================================================
// IDEMPOTENT AUDIT SUBMISSION
// A fresh intentional click gets a new key. Only network/5xx retries reuse that
// key. FormData retains the browser's multipart boundary and original uploads.
// ============================================================================
/** Submit once logically, retaining the UUID if an HTTP response is lost. */
async function submit(path, payload, key) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const multipart = payload instanceof FormData;
      const response = await browserFetch(`${BASE_URL}${path}`, {
        method: 'POST', headers: { 'Idempotency-Key': key, ...(multipart ? {} : { 'Content-Type': 'application/json' }) },
        body: multipart ? payload : JSON.stringify(payload),
      });
      const body = await read(response);
      refreshCredits();
      return { body, pending: response.status === 202 };
    } catch (error) {
      if ((error.status && error.status < 500) || attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

/** Run existing report REST paths and poll 202 responses using their durable ID. */
export async function creditReport(path, payload) {
  try {
    const { body, pending } = await submit(path, payload, crypto.randomUUID());
    return pending ? await recoverCreditJob(body.job_id) : body;
  } finally { refreshCredits(); }
}

/**
 * Stream existing WS paths; after a known job disconnects, poll rather than rerun.
 * Initial-payload sockets reconnect with the same UUID if no job ID was received.
 * Timers are cleared on every exit, and normal socket close without a result also
 * falls back to recovery so the UI cannot remain stuck in a loading state.
 */
export async function creditStream(path, payload, onProgress, creationPath) {
  const key = crypto.randomUUID();
  let jobId = null;
  try {
    if (creationPath) {
      const { body } = await submit(creationPath, payload, key);
      jobId = body.job_id;
    }
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const outcome = await new Promise((resolve, reject) => {
        const query = new URLSearchParams(jobId ? { job_id: jobId } : { credit_request_id: key });
        const socket = new WebSocket(`${BASE_URL.replace(/^http/, 'ws')}${path}?${query}`);
        let finished = false;
        let ping = null;
        let watchdog = null;

        /** Settle once despite browsers emitting both onerror and onclose. */
        function finish(value, error) {
          if (finished) return;
          finished = true;
          clearInterval(ping);
          clearTimeout(watchdog);
          socket.close();
          if (error) reject(error); else resolve(value);
        }

        /** Fall back to owned-job reads when the stream stops making progress. */
        function armWatchdog() {
          clearTimeout(watchdog);
          watchdog = setTimeout(() => finish({ recover: true }), 60000);
        }

        socket.onopen = () => {
          if (!creationPath) socket.send(JSON.stringify(payload));
          if (creationPath) {
            ping = setInterval(() => {
              if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'ping' }));
            }, 30000);
          }
          armWatchdog();
        };
        socket.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            armWatchdog();
            if (data.job_id) { jobId = data.job_id; refreshCredits(); }
            if (data.type === 'result') finish({ result: data });
            else if (data.type === 'error') finish(null, new Error(data.message || 'Audit generation failed.'));
            else if (data.type === 'progress') onProgress?.(data.message);
          } catch { finish(null, new Error('The report stream returned an unreadable message.')); }
        };
        socket.onerror = () => finish({ recover: true });
        socket.onclose = () => finish({ recover: true });
        armWatchdog();
      });
      if (outcome.result) return outcome.result;
      if (jobId) return await recoverCreditJob(jobId, onProgress);
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
    throw new Error('Could not connect to the audit. Check your recent audits before trying again.');
  } finally { refreshCredits(); }
}
