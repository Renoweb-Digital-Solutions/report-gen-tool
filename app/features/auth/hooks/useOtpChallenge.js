/** OTP state and server-informed countdowns shared by user/admin verification screens. */

// ============================================================================
// SHARED OTP SCREEN STATE FOR USER AND ADMIN LOGIN
// The caller owns page transitions/loading/error presentation; this hook owns
// challenge metadata, typed code, opt-in trust, and display countdowns.
// Client clocks are advisory. Backend expiry, resend cooldowns, and attempt limits
// remain authoritative even if a user changes browser time or modifies this state.
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { resendLogin, verifyLogin } from '../api';
import { resendGoogle, verifyGoogle } from '../google';

export function useOtpChallenge(kind = 'user', provider = 'password') {
  // Keep the public reference and masked email in memory only. The independent
  // secret browser binding is an HttpOnly cookie managed by the server.
  const [challenge, setChallenge] = useState(null);
  const [otp, setOtp] = useState('');
  // Trust starts unchecked for each new challenge, avoiding accidental
  // remembering on shared devices or when switching accounts.
  const [remember, setRemember] = useState(false);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    if (!challenge) return;
    // Refresh display time only while a challenge exists. Cleanup prevents timers
    // from continuing after cancellation, a changed challenge, or unmount.
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [challenge]);

  /** Start a new code screen and clear the previous code/trust selection. */
  const begin = (data) => {
    const instant = Date.now();
    // Convert server-relative seconds into display deadlines once on receipt.
    // These deadlines are not stored server-side and cannot extend any real grant.
    setChallenge({ ...data, expiresAt: instant + data.expires_in * 1000, resendAt: instant + data.resend_after * 1000 });
    setClock(instant);
    setOtp('');
    setRemember(false);
  };

  /** Resend clears the old input while retaining the user's checkbox choice. */
  const resend = async () => {
    try {
      // Both providers share display state; the backend keeps their OTP purposes
      // separate so a Google challenge cannot finish a password-only login route.
      const data = provider === 'google'
        ? await resendGoogle(challenge.challenge_id)
        : await resendLogin(challenge.challenge_id, kind);
      const instant = Date.now();
      // A resend replaces the code and refreshes display metadata. Keep the existing
      // trust choice, but clear the typed code because the previous generation is invalid.
      setChallenge({ ...data, expiresAt: instant + data.expires_in * 1000, resendAt: instant + data.resend_after * 1000 });
      setClock(instant);
      setOtp('');
    } catch (error) {
      // Honor the server throttle when the resend is refused. Still rethrow so the
      // caller can show a clear explanation instead of silently swallowing the failure.
      if (error.retryAfter) setChallenge(previous => ({ ...previous, resendAt: Date.now() + error.retryAfter * 1000 }));
      throw error;
    }
  };

  /** Reset state when changing accounts or cancelling a challenge. */
  // Resetting clears local form state; it does not create a session or revoke
  // server grants. Restarting login replaces the old browser challenge on the server.
  const reset = () => { setChallenge(null); setOtp(''); setRemember(false); };

  return {
    challenge, otp, setOtp, remember, setRemember, begin, resend, reset,
    verify: (username) => provider === 'google'
      ? verifyGoogle(challenge.challenge_id, otp, remember, username)
      : verifyLogin(challenge.challenge_id, otp, remember, kind),
    // Clamp expired display values to zero. The component can disable submit,
    // but the API must also reject expired codes independently of this display.
    expiresIn: challenge ? Math.max(0, Math.ceil((challenge.expiresAt - clock) / 1000)) : 0,
    resendIn: challenge ? Math.max(0, Math.ceil((challenge.resendAt - clock) / 1000)) : 0,
  };
}
