/**
 * Cookie-authenticated adapter for report_main.py's stateless POST /agent/task.
 * AgentWorkspace supplies visible conversation text; this module enforces the
 * actual 2,000-character server limit and preserves structured failure results.
 * It never selects tools, invents progress, retries a task, or stores credentials.
 */
import { browserFetch, clearSessionHint } from '@/app/features/auth/api';

// ============================================================================
// REQUEST BOUNDARIES
// Python counts Unicode code points, so use Array.from rather than UTF-16 length.
// Real Website Anatomy reports run provider actors: allow 15 minutes for the
// controller's 14-minute budget plus knowledge retrieval and response transport.
// ============================================================================
export const TASK_LIMIT = 2000;
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const OUTCOMES = new Set([
  'completed',
  'needs_input',
  'needs_verification',
  'rejected',
  'failed',
]);

/** Count server-compatible characters for both the composer and request guard. */
export function taskLength(value) {
  return Array.from(value).length;
}

/**
 * Re-submit visible conversation text because the backend has no conversation ID
 * or continuation API. Never silently truncate an original task or clarification.
 * Follow-ups can execute tools again; previous tool payloads are not replayed as
 * trusted results. A full context must fit the same bound as a standalone task.
 */
export function composeTask(messages, input) {
  const text = input.trim();
  if (!text) throw new Error('Write a message to get started.');
  const task = messages.length
    ? // Keep the latest request first: the backend's knowledge-only verifier checks
      // informational wording at the beginning, and the planner must distinguish
      // the current goal from prior conversation supplied only as context.
      `${text}\n\nPrevious conversation (context only; answer the latest request above):\n${messages.map((message) => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.text}`).join('\n\n')}`
    : text;
  if (taskLength(task) > TASK_LIMIT) {
    throw new Error(
      'This conversation has reached its context limit. Start a new chat with your next request, or shorten your message.',
    );
  }
  return task;
}

/**
 * Send one task with the shared cookie/CSRF transport. 400/409/502 may carry valid
 * agent outcomes and usable partial data; transport/auth/validation errors throw.
 * Aborting stops browser waiting only: there is no server cancellation endpoint.
 * Timers and abort listeners are always released, including JSON/network failures.
 */
export async function runAgentTask(task, signal) {
  // Guard the exported transport too, so future callers cannot bypass the same
  // request bound enforced by AgentWorkspace's conversation composer.
  if (
    typeof task !== 'string' ||
    !task.trim() ||
    taskLength(task) > TASK_LIMIT
  ) {
    throw new Error('Send a nonempty request of at most 2,000 characters.');
  }
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 900_000);

  try {
    const response = await browserFetch(`${BASE_URL}/agent/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
      signal: controller.signal,
    });
    if (response.status === 401) {
      clearSessionHint();
      window.dispatchEvent(new Event('auth-expired'));
      throw new Error('Your session has expired. Please sign in again.');
    }
    const body = await response.json().catch(() => null);
    // Parsing can itself be aborted after headers arrive. Preserve stop semantics
    // instead of turning that interrupted body into a misleading server error.
    if (controller.signal.aborted)
      throw new DOMException('Waiting stopped', 'AbortError');
    // HTTP authorization/throttling errors must never masquerade as agent results.
    if (
      [200, 400, 409, 502].includes(response.status) &&
      OUTCOMES.has(body?.status) &&
      typeof body.message === 'string'
    ) {
      return body;
    }
    const detail = typeof body?.detail === 'string' ? body.detail : null;
    throw new Error(
      detail ||
        (response.status === 429
          ? 'Too many requests. Please wait a moment before trying again.'
          : `The agent could not respond (${response.status}). Please try again.`),
    );
  } catch (error) {
    if (timedOut) {
      throw new Error(
        'The agent is taking longer than expected. Waiting has stopped; the request may still finish on the server.',
      );
    }
    if (error.name === 'TypeError') {
      throw new Error(
        'Could not reach the agent. Check your connection and try again.',
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
