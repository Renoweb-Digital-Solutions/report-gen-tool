/** Accessible OTP fields shared by the existing user and admin login designs. */

// ============================================================================
// ACCESSIBLE PRESENTATION SHARED BY THE EXISTING LOGIN DESIGNS
// This component renders fields only: it does not call SMTP, create grants, or
// issue sessions. The parent supplies loading/actions; the hook supplies state.
// Reuse existing auth classes so branding stays consistent. The scoped CSS adds
// only OTP-specific spacing, numeric display, instructions, and browser-trust controls.
// ============================================================================

'use client';

import { useId } from 'react';
import { Lock } from 'lucide-react';
import styles from '../auth.module.css';

export default function OtpFields({ flow, loading, onResend, onBack }) {
  // Create unique label/help IDs for each component instance so user and admin
  // forms cannot accidentally share accessibility associations.
  const id = useId();
  // Text inputs preserve leading zeroes, while inputMode requests a mobile
  // numeric keyboard and one-time-code enables supported browser autofill.
  // Paste sanitization runs before native maxlength truncation, so a copied
  // code with spaces such as "12 34 56" can still become six digits.
  // The associated instructions and expiry are available to screen readers.
  // 
  // The checkbox is explicit opt-in. Disabling actions while loading prevents
  // duplicate submissions; the backend still enforces atomic single use.
  // Resend/back buttons are type="button" so they never submit the OTP form.
  return (
    <div className={styles.fields}>
      <p className={styles.instructions} id={`${id}-instructions`}>
        Enter the six-digit code sent to <strong>{flow.challenge.masked_email}</strong>. Check your spam folder if it hasn’t arrived.
      </p>
      <div className="auth-input-group">
        <label htmlFor={`${id}-otp`}>Verification code</label>
        <div className="auth-input-wrapper">
          <Lock size={18} className="auth-icon" />
          <input id={`${id}-otp`} type="text" inputMode="numeric" autoComplete="one-time-code"
            autoFocus value={flow.otp} onChange={event => flow.setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            onPaste={event => { event.preventDefault(); flow.setOtp(event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)); }}
            placeholder="000000" pattern="[0-9]{6}" maxLength={6} required disabled={loading}
            aria-describedby={`${id}-instructions ${id}-expiry`} className={styles.code} />
        </div>
      </div>
      <p id={`${id}-expiry`} className={styles.hint}>
        {flow.expiresIn > 0 ? `Code expires in ${Math.floor(flow.expiresIn / 60)}:${String(flow.expiresIn % 60).padStart(2, '0')}.` : 'Your code has expired. Request a new code or return to sign in.'}
      </p>
      <label className={styles.remember}>
        <input type="checkbox" checked={flow.remember} disabled={loading} onChange={event => flow.setRemember(event.target.checked)} />
        <span>Remember this device for 7 days<span className={styles.hint}>Skip email codes on this browser. Use only on a device you trust.</span></span>
      </label>
      <div className={styles.actions}>
        <button type="button" className="auth-toggle-btn" disabled={loading || flow.resendIn > 0} onClick={onResend}>
          {flow.resendIn > 0 ? `Resend code in ${flow.resendIn}s` : 'Resend code'}
        </button>
        <button type="button" className="auth-toggle-btn" disabled={loading} onClick={onBack}>Back to sign in</button>
      </div>
    </div>
  );
}
