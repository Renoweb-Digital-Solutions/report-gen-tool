/** Existing branded authentication modal, integrating browser-bound OTP and recovery flows. */
'use client';
import { useState, useEffect, useRef } from 'react';
import { loginUser, registerUser, forgotPasswordRequestOtp, forgotPasswordVerifyOtp, forgotPasswordReset } from '@/app/lib/api';
import { Lock, User, Loader2, BarChart3, Globe, ShieldCheck, X, Eye, EyeOff } from 'lucide-react';
import disposableDomains from 'disposable-email-domains';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { markSession, clearSessionHint } from '@/app/features/auth/api';
import { useOtpChallenge } from '@/app/features/auth/hooks/useOtpChallenge';
import OtpFields from '@/app/features/auth/components/OtpFields';
import GoogleAuthButton from '@/app/features/auth/components/GoogleAuthButton';
import { startGoogle, cancelGoogle } from '@/app/features/auth/google';
import googleStyles from '@/app/features/auth/google.module.css';
import authStyles from '@/app/features/auth/auth.module.css';

export default function AuthModal({ onSuccess, onClose, initialView = 'login', profileEmail = null, initialGoogleResult = null }) {
  // Google and password forms share presentation/countdowns, but use separate
  // backend challenge purposes. Callback data arrives through a private cookie,
  // never through query parameters or a Google token stored in JavaScript.
  const [googleActive, setGoogleActive] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const flow = useOtpChallenge('user', googleActive ? 'google' : 'password');
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const [recoveryChallenge, setRecoveryChallenge] = useState('');
  const [view, setView] = useState(initialView); // 'login', 'register', 'forgot_email', 'forgot_otp', 'forgot_reset'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [resetEmail, setResetEmail] = useState(profileEmail || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  loadingRef.current = loading;
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });

  };

  useEffect(() => {
    if (!initialGoogleResult) return;
    if (initialGoogleResult.status === 'otp_required') {
      setGoogleActive(true);
      flow.begin(initialGoogleResult);
      setUsername('');
      setView('login_otp');
    } else {
      // Explicit Google signup with an existing mailbox switches to sign-in.
      // Preserve the password form and clearly explain that no duplicate was made.
      setView('login');
      if (initialGoogleResult.email) setUsername(initialGoogleResult.email);
      showToast(initialGoogleResult.message || 'Please sign in to continue.', initialGoogleResult.status === 'account_exists' ? 'info' : 'error');
    }
    // This consumes an initial prop once per callback result, not each render of
    // the hook's functions. The result endpoint itself remains repeatable on reload.
  }, [initialGoogleResult]);

  useEffect(() => {
    // Restoring the original page with browser Back can reuse its in-memory
    // loading state from before Google's redirect. Make the form usable again.
    const restore = event => {
      if (event.persisted) { setLoading(false); setGoogleBusy(false); }
    };
    window.addEventListener('pageshow', restore);
    return () => window.removeEventListener('pageshow', restore);
  }, []);

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true);
    setGoogleBusy(true);
    setToast(null);
    try {
      const data = await startGoogle(view === 'register' ? 'signup' : 'login');
      window.location.assign(data.authorization_url);
    } catch (error) {
      showToast(error.message || 'Google sign-in could not be started. Please try again.');
      setLoading(false);
      setGoogleBusy(false);
    }
  };

  const handleBack = async () => {
    setLoading(true);
    setToast(null);
    try {
      if (googleActive) await cancelGoogle();
      flow.reset();
      setGoogleActive(false);
      setUsername('');
      setPassword('');
      setView('login');
    } catch (error) { showToast(error.message); }
    finally { setLoading(false); }
  };

  const handleClose = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (googleActive || initialGoogleResult) await cancelGoogle();
      onClose?.();
    } catch (error) { showToast(error.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setToast(null);
    if (view === 'login_otp') {
      setLoading(true);
      try {
        await flow.verify(username);
        if (onSuccess) onSuccess();
      } catch (err) {
        showToast(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (view === 'login' || view === 'register') {
      if (!username || !password || (view === 'register' && !email)) {
        showToast('Please fill all fields');
        return;
      }

      if (view === 'register') {
        const domain = email.split('@')[1]?.toLowerCase();
        const customBlocklist = ['playboot.com', 'luxusmail.com', 'fexpost.com', 'fexbox.org', 'fexbox.ru', 'freemail.su'];

        if (!domain || disposableDomains.includes(domain) || customBlocklist.includes(domain)) {
          showToast('Disposable or temporary email addresses are not allowed.');
          return;
        }
      }

      setLoading(true);
      try {
        if (view === 'login') {
          const data = await loginUser(username, password);
          setPassword('');
          if (data.status === 'otp_required') {
            flow.begin(data);
            setView('login_otp');
          } else {
            markSession();
            if (onSuccess) onSuccess();
          }
        } else {
          await registerUser({ username, email, password });
          showToast('Registration successful! Please log in.', 'success');
          setView('login');
          setPassword('');
        }
      } catch (err) {
        showToast(err.message || (view === 'login' ? 'Login failed' : 'Username taken'));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (view === 'forgot_email') {
      if (!resetEmail) {
        showToast('Please enter your email');
        return;
      }
      setLoading(true);
      try {
        const data = await forgotPasswordRequestOtp(resetEmail);
        setRecoveryChallenge(data.challenge_id);
        setOtp('');
        showToast(data.message || 'OTP sent successfully', 'success');
        setView('forgot_otp');
      } catch (err) {
        showToast(err.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (view === 'forgot_otp') {
      if (!otp) {
        showToast('Please enter the OTP');
        return;
      }
      setLoading(true);
      try {
        await forgotPasswordVerifyOtp(resetEmail, otp, recoveryChallenge);
        showToast('OTP verified successfully', 'success');
        setView('forgot_reset');
      } catch (err) {
        showToast(err.message || 'Invalid OTP');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (view === 'forgot_reset') {
      if (!newPassword || !confirmPassword) {
        showToast('Please fill all fields');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('Passwords do not match');
        return;
      }
      setLoading(true);
      try {
        const data = await forgotPasswordReset(resetEmail, otp, newPassword, confirmPassword);
        showToast(data.message || 'Password resetted successfully', 'success');
        clearSessionHint();
        setView('login');
        setPassword('');
        setOtp('');
      } catch (err) {
        showToast(err.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  // Keep modal keyboard focus inside the form and restore focus to its trigger on exit.
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog.querySelectorAll('input:not(:disabled), button:not(:disabled), [tabindex="0"]')).filter(node => node.offsetParent !== null);
    (dialog.querySelector('input:not(:disabled)') || focusable()[0])?.focus();
    const handleKey = event => {
      if (event.key === 'Escape' && onClose && !loadingRef.current) dialog.querySelector('.auth-close-btn')?.click();
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener('keydown', handleKey);
    return () => { dialog.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [onClose]);

  const handleResend = async () => {
    setLoading(true);
    setToast(null);
    try { await flow.resend(); showToast('A new code has been sent. Use the latest email.', 'success'); }
    catch (error) { showToast(error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-modal-overlay" style={{ zIndex: 10001 }}>
      <motion.div layout transition={{ layout: { duration: reducedMotion ? 0 : 0.3 } }} className="auth-modal-container" style={{ maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto' }} ref={dialogRef} role="dialog" aria-modal="true" aria-label="Flawdits authentication">

        {/* LEFT SIDE - Form */}
        <div className="auth-modal-left">
          {onClose && (
            <button className="auth-close-btn" onClick={handleClose} type="button" disabled={loading} aria-label="Close">
              <X size={20} />
            </button>
          )}
          <AnimatePresence mode="wait" initial={false}>
          <motion.div key={view} initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}>
          <div className="auth-header">
            {view === 'login_otp' && <><h2>Check your email</h2><p>{googleActive && flow.challenge?.is_new_account ? 'Choose a username and verify your email to finish signing up' : 'One more step to securely sign in'}</p></>}
            {view === 'login' && (
              <>
                <h2>Welcome Back</h2>
                <p>Log in to access your reports</p>
              </>
            )}
            {view === 'register' && (
              <>
                <h2>Create an Account</h2>
                <p>Sign up to generate comprehensive audits</p>
              </>
            )}
            {view === 'forgot_email' && (
              <>
                <h2>Reset Password</h2>
                <p>Enter your email to receive an OTP</p>
              </>
            )}
            {view === 'forgot_otp' && (
              <>
                <h2>Verify OTP</h2>
                <p>Enter the 6-digit code sent to your email</p>
              </>
            )}
            {view === 'forgot_reset' && (
              <>
                <h2>New Password</h2>
                <p>Use at least 12 characters for your new password</p>
              </>
            )}
          </div>

          {(view === 'login' || view === 'register') && (
            <>
              <GoogleAuthButton intent={view === 'register' ? 'signup' : 'login'} busy={googleBusy} disabled={loading} onClick={handleGoogle} />
              <div className={googleStyles.divider}>or continue with your email</div>
            </>
          )}

          <form onSubmit={handleSubmit} className="auth-form" aria-busy={loading}>
            {view === 'login_otp' && googleActive && flow.challenge?.is_new_account && (
              <div className="auth-input-group">
                <label htmlFor="google-signup-username">Choose your username</label>
                <div className="auth-input-wrapper">
                  <User size={18} className="auth-icon" />
                  <input id="google-signup-username" type="text" value={username} onChange={event => setUsername(event.target.value)}
                    placeholder="Your Flawdits username" autoComplete="username" minLength={3} maxLength={40}
                    pattern={'[A-Za-z0-9_][A-Za-z0-9_.\\-]{2,39}'} required disabled={loading} aria-describedby="google-username-help" />
                </div>
                <p id="google-username-help" className={authStyles.hint}>3–40 characters. Letters, numbers, underscores, dots, and hyphens.</p>
              </div>
            )}
            {view === 'login_otp' && <OtpFields flow={flow} loading={loading} onResend={handleResend} onBack={handleBack} />}
            {(view === 'login' || view === 'register') && (
              <>
                <div className="auth-input-group">
                  <label>{view === 'login' ? 'Username or email' : 'Username'}</label>
                  <div className="auth-input-wrapper">
                    <User size={18} className="auth-icon" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={view === 'login' ? 'Enter username or email' : 'Enter username'} autoComplete="username" disabled={loading}
                      required
                    />
                  </div>
                </div>

                {view === 'register' && (
                  <div className="auth-input-group">
                    <label>Email</label>
                    <div className="auth-input-wrapper">
                      <Globe size={18} className="auth-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="auth-input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ margin: 0 }}>Password</label>
                    {view === 'login' && (
                      <button
                        type="button"
                        className="auth-forgot-password-link"
                        disabled={loading} onClick={() => { setToast(null); setView('forgot_email'); }}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="auth-input-wrapper" style={{ marginTop: '5px' }}>
                    <Lock size={18} className="auth-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password" autoComplete={view === 'register' ? 'new-password' : 'current-password'} disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {view === 'forgot_email' && (
              profileEmail ? (
                <div className="auth-input-group">
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                    An OTP will be sent to your registered email (<strong>{profileEmail}</strong>) to verify your identity before changing your password.
                  </p>
                </div>
              ) : (
                <div className="auth-input-group">
                  <label>Email</label>
                  <div className="auth-input-wrapper">
                    <Globe size={18} className="auth-icon" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter registered email"
                      required
                    />
                  </div>
                </div>
              )
            )}

            {view === 'forgot_otp' && (
              <div className="auth-input-group">
                <label>6-Digit OTP</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-icon" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter OTP" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" autoFocus
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            )}

            {view === 'forgot_reset' && (
              <>
                <div className="auth-input-group">
                  <label>New Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password" minLength={12} autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="auth-input-group">
                  <label>Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading || (view === 'login_otp' && (flow.otp.length !== 6 || flow.expiresIn === 0))}>
              {loading ? <Loader2 className="spinner" size={20} /> : (
                view === 'login' ? 'Log In' :
                  view === 'login_otp' ? (googleActive && flow.challenge?.is_new_account ? 'Verify & create account' : 'Verify & log in') :
                  view === 'register' ? 'Sign Up' :
                    view === 'forgot_email' ? 'Send OTP' :
                      view === 'forgot_otp' ? 'Verify OTP' :
                        'Reset Password'
              )}
            </button>
          </form>

          <div className="auth-toggle">
            {(view === 'login' || view === 'register') && (
              <>
                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button disabled={loading} onClick={() => { setToast(null); setView(view === 'login' ? 'register' : 'login'); }} className="auth-toggle-btn" type="button">
                  {view === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </>
            )}
          </div>

          {view.startsWith('forgot_') && <button className="auth-toggle-btn" type="button" disabled={loading}
            style={{ marginTop: '16px' }} onClick={() => { setOtp(''); setToast(null); setView('login'); }}>Back to sign in</button>}
          </motion.div>
          </AnimatePresence>
          {toast && (
            <div className={authStyles.feedback} data-tone={toast.type} role={toast.type === 'error' ? 'alert' : 'status'}>
              {toast.msg}
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Illustration */}
        <div className="auth-modal-right">
          <div className="auth-illustration">
            <div className="auth-card floating-1">
              <div className="auth-card-icon"><BarChart3 size={24} color="#023dbb" /></div>
              <div className="auth-card-lines">
                <div className="auth-line long"></div>
                <div className="auth-line short"></div>
              </div>
            </div>
            <div className="auth-card floating-2">
              <div className="auth-card-icon"><Globe size={24} color="#308fef" /></div>
              <div className="auth-card-lines">
                <div className="auth-line full"></div>
                <div className="auth-line short"></div>
              </div>
            </div>
            <div className="auth-card floating-3">
              <div className="auth-card-icon"><ShieldCheck size={24} color="#ffc857" /></div>
              <div className="auth-card-lines">
                <div className="auth-line mid"></div>
                <div className="auth-line long"></div>
              </div>
            </div>

            {/* Background glowing effects */}
            <div className="auth-glow blob-1"></div>
            <div className="auth-glow blob-2"></div>
          </div>

          <div className="auth-right-text">
            <h3>Automated Precision</h3>
            <p>Generate in-depth reports seamlessly, backed by our advanced audit engine.</p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
