'use client';
import { useState } from 'react';
import { loginUser, registerUser, forgotPasswordRequestOtp, forgotPasswordVerifyOtp, forgotPasswordReset } from '@/app/lib/api';
import { Lock, User, Loader2, BarChart3, Globe, ShieldCheck, X, Eye, EyeOff } from 'lucide-react';
import disposableDomains from 'disposable-email-domains';

export default function AuthModal({ onSuccess, onClose, initialView = 'login', profileEmail = null }) {
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
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          localStorage.setItem('access_token', data.access_token);
          if (onSuccess) onSuccess();
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
        await forgotPasswordVerifyOtp(resetEmail, otp);
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
        setView('login');
        setPassword('');
      } catch (err) {
        showToast(err.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        
        {/* LEFT SIDE - Form */}
        <div className="auth-modal-left">
          {onClose && (
            <button className="auth-close-btn" onClick={onClose} type="button">
              <X size={20} />
            </button>
          )}
          <div className="auth-header">
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
                <p>Enter your new password below</p>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {(view === 'login' || view === 'register') && (
              <>
                <div className="auth-input-group">
                  <label>Username</label>
                  <div className="auth-input-wrapper">
                    <User size={18} className="auth-icon" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username" 
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
                        onClick={() => setView('forgot_email')}
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
                      placeholder="Enter password" 
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
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP" 
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
                      placeholder="Enter new password" 
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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : (
                view === 'login' ? 'Log In' :
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
                <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="auth-toggle-btn" type="button">
                  {view === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </>
            )}
            {(view === 'forgot_email' || view === 'forgot_otp' || view === 'forgot_reset') && (
              <>
                Remembered your password?{' '}
                <button onClick={() => setView('login')} className="auth-toggle-btn" type="button">
                  Log in
                </button>
              </>
            )}
          </div>
          
          {toast && (
            <div className={`auth-toast ${toast.type}`}>
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

      </div>
    </div>
  );
}
