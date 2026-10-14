/** Cookie-only authentication transport used by API adapters, login forms, and route guards. */

// ============================================================================
// AUTH TRANSPORT AND NON-SECRET NAVIGATION HINTS
// Used by the existing report API adapters, login screens, and route guards.
// The browser owns HttpOnly cookies; JavaScript never reads an auth token.
// Local storage contains only a navigation hint, which is not authorization.
// Protected endpoints and page-entry checks always consult the server session.
// ============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/** Force CORS preflight for mutations and include host-only HttpOnly auth cookies. */
export function browserFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});
  // The backend requires this non-simple header for mutations. Across origins,
  // it forces browser preflight, which the explicit CORS allowlist controls.
  headers.set('X-Flawdits-Request', '1');
  // Include backend cookies even when the frontend uses a separate origin.
  // Do not cache authentication responses or allow caller options to omit cookies.
  return fetch(url, { ...options, headers, credentials: 'include', cache: 'no-store' });
}

/** Share server errors and Retry-After metadata with login and OTP components. */
async function responseData(response) {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(typeof data.detail === 'string' ? data.detail : 'Please check your details and try again.');
    error.status = response.status;
    // Keep Retry-After metadata for the OTP hook: its displayed resend timer can
    // follow the server throttle instead of relying only on a local 60-second guess.
    error.retryAfter = Number(response.headers.get('Retry-After') || 0);
    throw error;
  }
  return data;
}

/** Call security routes without putting secrets in localStorage or URL parameters. */
async function action(path, body) {
  return responseData(await browserFetch(`${BASE_URL}/auth/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }));
}

/** Verify a browser-bound login challenge, optionally beginning seven-day device trust. */
export async function verifyLogin(challengeId, otp, rememberDevice, kind = 'user') {
  const data = await action('login/verify', { challenge_id: challengeId, otp, remember_device: rememberDevice, kind });
  // Set the hint only after server authentication succeeds. It may become stale
  // after expiry/revocation, so it must never authorize protected content.
  markSession(kind);
  return data;
}

/** Replace a login code; the server enforces cooldowns, attempts, and the absolute deadline. */
export function resendLogin(challengeId, kind = 'user') {
  return action('login/resend', { challenge_id: challengeId, kind });
}

/** Keep a non-secret navigation hint; all actual authorization remains server-side. */
export function markSession(kind = 'user') {
  if (typeof window === 'undefined') return;
  // Remove legacy bearer credentials during the cookie-session migration.
  // Do not write OTPs, session tokens, recovery grants, or device tokens here.
  localStorage.removeItem('access_token');
  localStorage.removeItem('admin_access_token');
  // This plain value only helps CTA routing. Editing it grants no API access;
  // the dashboard still validates the actual HttpOnly cookie with the backend.
  localStorage.setItem(`flawdits_${kind}_session_hint`, '1');
}

/** Return only a UX hint for CTA routing; dashboards always validate the real cookie session. */
export function hasSessionHint(kind = 'user') {
  return typeof window !== 'undefined' && localStorage.getItem(`flawdits_${kind}_session_hint`) === '1';
}

/** Remove this scope's non-secret hint without clearing theme or analytics preferences. */
export function clearSessionHint(kind = 'user') {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`flawdits_${kind}_session_hint`);
  localStorage.removeItem(kind === 'admin' ? 'admin_access_token' : 'access_token');
  // Clear this tab's cached report state on user sign-out, while preserving
  // unrelated local preferences such as theme and analytics consent.
  if (kind === 'user') sessionStorage.clear();
}

/** Ask the backend to authorize route entry, including reloads and revoked sessions. */
export async function checkSession(kind = 'user') {
  try {
    const data = await responseData(await browserFetch(`${BASE_URL}/auth/session?kind=${kind}`));
    markSession(kind);
    return data;
  } catch (error) {
    // An explicit unauthorized response invalidates the hint. Network failures
    // are not evidence that the server has revoked a session; propagate the error.
    if (error.status === 401) clearSessionHint(kind);
    throw error;
  }
}

/** Revoke the session before navigation; optional forget also removes browser trust. */
export async function logoutSession(kind = 'user', forgetDevice = false) {
  // Wait for server-side revocation before reporting successful logout. Normal
  // logout retains selected browser trust; forget revokes trust and the session.
  await action(forgetDevice ? 'devices/forget' : 'logout', { kind });
  clearSessionHint(kind);
  // Notify listening screens so they can leave protected UI after revocation.
  // Events are UI coordination only; server authorization remains authoritative.
  window.dispatchEvent(new Event(kind === 'admin' ? 'admin-auth-expired' : 'auth-expired'));
}

/** Sign out and forget every browser for this account using its current authenticated session. */
export async function revokeAllDevices(kind = 'user') {
  // Global revocation requires a current authenticated session. The backend
  // bumps the account version and removes grants for every browser in this scope.
  await action('devices/revoke-all', { kind });
  clearSessionHint(kind);
  // Notify listening screens so they can leave protected UI after revocation.
  // Events are UI coordination only; server authorization remains authoritative.
  window.dispatchEvent(new Event(kind === 'admin' ? 'admin-auth-expired' : 'auth-expired'));
}
