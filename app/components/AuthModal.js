'use client';
import { useState } from 'react';
import { loginUser, registerUser } from '@/app/lib/api';
import { Lock, User, Loader2, BarChart3, Globe, ShieldCheck, X, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({ onSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser(username, password);
        localStorage.setItem('access_token', data.access_token);
        if (onSuccess) onSuccess();
      } else {
        await registerUser({ username, password });
        showToast('Registration successful! Please log in.', 'success');
        setIsLogin(true);
        // Clear password to prompt user to enter it for login
        setPassword('');
      }
    } catch (err) {
      showToast(err.message || (isLogin ? 'Login failed' : 'Username taken'));
    } finally {
      setLoading(false);
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
            <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
            <p>{isLogin ? 'Log in to access your reports' : 'Sign up to generate comprehensive audits'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle-btn" type="button">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
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
