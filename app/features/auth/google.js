/** Google auth adapters consumed by GoogleAuthButton, completion page, and the OTP hook. */
import { authAction, markSession } from './api';

// ============================================================================
// PROVIDER SECRETS STAY ON THE BACKEND
// ============================================================================
// These calls use the existing credentialed transport and CSRF header. Google
// returns to the backend callback; the frontend reads a cookie-bound handoff.
// No Google client secret, identity token, OTP, or session token is put in a URL
// or persistent browser storage. Redirect destinations are fixed server settings.

/** Obtain the authorization URL for a server-bound sign-in/sign-up request. */
export async function startGoogle(intent = 'login') {
  const data = await authAction('google/start', { intent });
  const url = new URL(data.authorization_url);
  // Navigation accepts only Google's fixed HTTPS authorization endpoint. Never
  // pass an arbitrary URL or javascript: value into location.assign.
  if (url.origin !== 'https://accounts.google.com' || url.pathname !== '/o/oauth2/v2/auth') {
    throw new Error('Google sign-in returned an invalid destination. Please try again.');
  }
  return data;
}

/** Recover the callback handoff after redirect/reload, with fresh server countdowns. */
export function googleResult() {
  return authAction('google/result');
}

/** Verify OTP before account creation/linking; only then record a non-secret session hint. */
export async function verifyGoogle(challengeId, otp, rememberDevice, username) {
  const data = await authAction('google/verify', {
    challenge_id: challengeId, otp, remember_device: rememberDevice,
    username: username?.trim() || null,
  });
  markSession();
  return data;
}

/** Replace an OTP without extending the Google-approved challenge or resetting its guesses. */
export function resendGoogle(challengeId) {
  return authAction('google/resend', { challenge_id: challengeId });
}

/** Revoke unfinished provider flow, OTP, and pending registration before leaving the screen. */
export function cancelGoogle() {
  return authAction('google/cancel');
}
