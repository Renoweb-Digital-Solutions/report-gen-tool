/** Existing report API adapters; cookie transport is shared with features/auth/api.js. */
import { browserFetch, clearSessionHint } from '@/app/features/auth/api';
// Billing transports preserve one request UUID across retries and recover settled
// reports through cookie-protected jobs; no wallet credential enters this module.
import { creditReport, creditStream } from '@/app/features/credits/api';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Normalise an error from a fetch response into a human-readable string.
 */
async function extractError(res) {
  try {
    const body = await res.json();
    const detail = body.detail;

    // FastAPI can return detail as a plain string
    if (typeof detail === 'string') return detail;

    // FastAPI validation errors come as an array: [{loc, msg, type}, ...]
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
    }

    // Some APIs return detail as a nested object
    if (detail && typeof detail === 'object') {
      return JSON.stringify(detail);
    }

    return body.message || body.error || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

/**
 * Authenticated fetch wrapper
 */
async function authFetch(url, options = {}) {
  const res = await browserFetch(url, options);
  if (res.status === 401 && typeof window !== 'undefined') {
    clearSessionHint();
    window.dispatchEvent(new Event('auth-expired'));
  }
  return res;
}

/** Use the independent admin cookie and redirect on a revoked/expired session. */
async function adminAuthFetch(url, options = {}) {
  const res = await browserFetch(url, options);
  if (res.status === 401 && typeof window !== 'undefined') {
    clearSessionHint('admin');
    window.location.href = '/admin/login';
  }
  return res;
}

/**
 * Register a new user
 */
export async function registerUser(payload) {
  const res = await browserFetch(`${BASE_URL}/auth/create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return true;
}

/**
 * Validate credentials and receive an OTP challenge or authenticated cookie session
 */
export async function loginUser(username, password) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await browserFetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Forgot password - request OTP
 */
export async function forgotPasswordRequestOtp(email) {
  const res = await browserFetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Forgot password - verify OTP
 */
export async function forgotPasswordVerifyOtp(email, otp, challengeId) {
  const res = await browserFetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, challenge_id: challengeId }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Forgot password - reset password
 */
export async function forgotPasswordReset(email, otp, newPassword, confirmPassword) {
  const res = await browserFetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, new_password: newPassword, confirm_password: confirmPassword }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate a Full Report.
 * Returns { html_report, ... }
 */
export async function generateFullReport(payload) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditReport('/report/generate-full', payload);
}

/**
 * Get current user profile details
 */
export async function getUserProfile() {
  const res = await authFetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Create a new support ticket
 */
export async function createTicket(payload) {
  const res = await authFetch(`${BASE_URL}/auth/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Get tickets submitted by the current user
 */
export async function getUserTickets() {
  const res = await authFetch(`${BASE_URL}/auth/tickets/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Match user query against FAQs using Groq semantic scoring.
 * Public endpoint — no auth required.
 */
export async function matchFaqs(query, faqs) {
  const res = await browserFetch(`${BASE_URL}/auth/support/faq-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, faqs }),
  });
  if (!res.ok) {
    if (res.status === 429) return { matches: [] }; // Rate limited, return empty
    throw new Error(await extractError(res));
  }
  return res.json();
}

/**
 * Generate a Website Anatomy (SEO) Report.
 */
export async function generateWebsiteReport(payload) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditReport('/report/generate-seo', payload);
}

/**
 * Generate an Instagram Audit Report.
 */
export async function generateInstagramReport(payload) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditStream('/ws/report/generate-instagram', payload);
}

/**
 * Generate a LinkedIn Audit Report.
 */
export async function generateLinkedInReport(payload) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditReport('/report/generate-linkedin', payload);
}

/**
 * Generate a LinkedIn Personal/Company Audit Report via the 2-step WebSocket flow.
 *
 * Step 1: POST /report/generate-linkedin-personal → { job_id }
 * Step 2: WS  /ws/report/generate-linkedin?job_id=<id> (HttpOnly cookie session) → progress + result
 */
export async function generateLinkedInPersonalReport(payload) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditStream('/ws/report/generate-linkedin', payload, undefined, '/report/generate-linkedin-personal');
}

/**
 * Generate a Visual Brand Match Report.
 * payload is a FormData object (multipart/form-data).
 */
export async function generateVisualReport(formData) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditReport('/report/check-website-instagram-alignment', formData);
}

/**
 * Search Google Maps for businesses matching a query.
 */
export async function searchGmbBusinesses(payload) {
  const res = await authFetch(`${BASE_URL}/gmb/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate a GMB Audit Report.
 */
export async function generateGmbReport(payload) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditReport('/report/generate-gmb', payload);
}

/**
 * Convert an HTML string to a PDF blob.
 * Returns a Blob of type application/pdf.
 * Do NOT use for client-side PDF generation (no WeasyPrint / html2pdf).
 */
export async function convertHtmlToPdf(htmlReport, filename) {
  if (!htmlReport) throw new Error('HTML content is empty.');
  const res = await authFetch(`${BASE_URL}/report/html-to-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html: htmlReport, filename }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.blob();
}

/**
 * Trigger a browser download from a Blob.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Fetch all users for the admin panel
 */
export async function getAdminUsers() {
  const res = await adminAuthFetch(`${BASE_URL}/admin/users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

// ============================================================================
// ADMIN ACCOUNT RUN HISTORY
// Independent admin-cookie authorization is required on every page read. Return
// only the server's confirmed per-run usage; never derive costs from run counts.
// ============================================================================
/** Load one selected user's paginated reports and actual consumed credits. */
export async function getAdminUserReports(username, page = 1, limit = 5) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await adminAuthFetch(`${BASE_URL}/credits/admin/users/${encodeURIComponent(username)}/reports?${query}`, {
    cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Suspend a user from the admin panel
 */
export async function suspendAdminUser(username, reason) {
  const res = await adminAuthFetch(`${BASE_URL}/admin/users/${encodeURIComponent(username)}/suspend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Unsuspend a user from the admin panel
 */
export async function unsuspendAdminUser(username) {
  const res = await adminAuthFetch(`${BASE_URL}/admin/users/${encodeURIComponent(username)}/unsuspend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Fetch all support tickets for the admin panel
 */
export async function getAdminTickets() {
  const res = await adminAuthFetch(`${BASE_URL}/auth/admin/tickets`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

// ============================================================================
// ADMIN SUPPORT WORKFLOW
// The server owns status, revision checks, private archiving and mail delivery.
// These calls use the independent admin cookie and never send a recipient or
// alter report pipelines. Failed requests leave TicketDesk's current row intact.
// ============================================================================
/** Persist an explicit ticket change with the revision currently displayed. */
export async function updateAdminTicket(ticketId, payload) {
  const response = await adminAuthFetch(`${BASE_URL}/auth/admin/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await extractError(response));
  return response.json();
}

/** Retry a known failed/stale notification after explicit admin confirmation. */
export async function retryAdminTicketEmail(ticketId, notificationId) {
  const response = await adminAuthFetch(`${BASE_URL}/auth/admin/tickets/${encodeURIComponent(ticketId)}/notification/retry`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notification_id: notificationId }),
  });
  if (!response.ok) throw new Error(await extractError(response));
  return response.json();
}

/**
 * Login specifically for admin portal
 */
export async function adminLogin(username, password) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await browserFetch(`${BASE_URL}/auth/admin/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Send analytics event
 */
export async function sendAnalyticsEvent(payload) {
  try {
    const res = await browserFetch(`${BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error("Analytics error", err);
    return false;
  }
}

/**
 * Get analytics summary for admin
 */
export async function getAnalyticsSummary(filters = {}) {
  // All dashboard panels share the same validated calendar/module filters.
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null));
  const res = await adminAuthFetch(`${BASE_URL}/analytics/summary?${query}`, {
    method: 'GET',
    // A reporting outage must produce an actionable error, never endless loading.
    signal: AbortSignal.timeout(12000),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

// ============================================================================
// ISOLATED INTERACTION TRANSPORT
// AnalyticsProvider uses a short timeout and keepalive for navigation flushes.
// This adapter never clears authentication, emits auth-expired, or throws into
// report handlers. Admin reads use their existing independent cookie transport.
// ============================================================================
/** Send a bounded interaction batch; return false on timeout/server/network failure. */
export async function sendAnalyticsBatch(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await browserFetch(`${BASE_URL}/analytics/batch`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal, keepalive: true,
    });
    return response.ok;
  } catch { return false; }
  finally { clearTimeout(timeout); }
}

/** Load safe session detail using exactly the dashboard's current date/module window. */
export async function getAnalyticsSession(sessionId, filters = {}) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null));
  const response = await adminAuthFetch(`${BASE_URL}/analytics/sessions/${encodeURIComponent(sessionId)}?${query}`, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(await extractError(response));
  return response.json();
}

/**
 * Export a fresh analytics summary using only the independent admin cookie.
 * AnalyticsDashboard supplies explicit dates/module matching the displayed
 * report. The dedicated server renderer accepts no HTML or browser metrics and
 * never uses the audit PDF pipeline. A failed/expired read becomes a UI error.
 */
export async function downloadAnalyticsPdf(filters) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null));
  const response = await adminAuthFetch(`${BASE_URL}/analytics/export.pdf?${query}`, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(await extractError(response));
  if (!response.headers.get('content-type')?.includes('application/pdf')) throw new Error('The server did not return a PDF. Please retry.');
  return response.blob();
}

/**
 * Unified Ads Library Report Generation (Google & Meta)
 * 2-step WebSocket flow: POST /ads-library/search/job -> WS /ws/ads-library/search
 */
export async function generateAdsLibraryReport(payload, onProgress) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditStream('/ws/ads-library/search', payload, onProgress, '/ads-library/search/job');
}

/**
 * Get Meta Ads Library supported countries
 */
export async function getMetaCountries() {
  const res = await authFetch(`${BASE_URL}/ads-library/meta/countries`);
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Search Meta Page Candidates
 */
export async function searchMetaPages(payload) {
  const res = await authFetch(`${BASE_URL}/ads-library/meta/pages/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Get Google Ads supported regions
 */
export async function getGoogleRegions() {
  const res = await authFetch(`${BASE_URL}/ads-library/google/regions`);
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Search Google Advertiser Candidates
 */
export async function searchGoogleAdvertisers(payload) {
  const res = await authFetch(`${BASE_URL}/ads-library/google/advertisers/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}


/**
 * Generate a UI/UX Audit Report.
 */
export async function generateUiUxAudit(payload, onProgress) {
  // Reserve/settle on FastAPI and recover this same audit after transport failure.
  return creditStream('/ws/report/generate-ui-ux', payload, onProgress);
}


/**
 * Get report history for the current user
 */
export async function getUserReports(page = 1, limit = 10) {
  const res = await authFetch(`${BASE_URL}/auth/reports/me?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Generate AI email for admin
 */
export async function generateAdminEmail(payload) {
  const res = await adminAuthFetch(`${BASE_URL}/admin/emails/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/**
 * Send admin email
 */
export async function sendAdminEmail(payload) {
  const res = await adminAuthFetch(`${BASE_URL}/admin/emails/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

// ============================================================================
// EXPLICIT ACCOUNT FEEDBACK
// Dashboard calls use the user cookie; inbox reads require the admin cookie.
// Keep status codes for cross-tab cooldown conflicts and never retry POSTs here.
// ============================================================================
/** Read server-owned eligibility before a dashboard reminder opens. */
export async function getFeedbackStatus() {
  const res = await authFetch(`${BASE_URL}/feedback/status`);
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

/** Submit a selected rating/optional text; only a successful write starts cooldown. */
export async function submitFeedback(payload) {
  const res = await authFetch(`${BASE_URL}/feedback`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = new Error(await extractError(res));
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/** Read one bounded admin inbox page; customer APIs never receive these records. */
export async function getAdminFeedback(page = 1) {
  const res = await adminAuthFetch(`${BASE_URL}/feedback/admin?page=${page}&limit=20`);
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}
