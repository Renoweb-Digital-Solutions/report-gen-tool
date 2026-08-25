'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { adminLogin } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await adminLogin(username, password);
      localStorage.setItem('admin_access_token', data.access_token);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background aesthetics */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'var(--brand-deep)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--brand-cyan)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '40px 48px', boxShadow: 'var(--shadow-elevated)', position: 'relative', zIndex: 10, border: '1px solid var(--color-border)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div className="section-icon-chip" style={{ width: '56px', height: '56px', borderRadius: '16px' }}>
            <ShieldCheck size={28} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="form-panel-title">Admin Portal</h1>
          <p className="form-panel-subtitle" style={{ marginBottom: 0 }}>Restricted access. Please enter your credentials.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="error-banner"
            style={{ marginBottom: '24px' }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="form-grid">
          <div className="form-field">
            <label className="form-label">Username or Email</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin@renoweb.in"
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••"
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '16px', height: '48px' }}
          >
            {loading ? (
              <Loader2 size={20} className="spinner" />
            ) : (
              <>
                Authenticate <ArrowRight size={18} strokeWidth={2.5} style={{ marginLeft: '4px' }} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'rgba(25,25,25,0.4)', fontWeight: 600, letterSpacing: '0.05em' }}>RENOWEB SECURE SYSTEMS</p>
        </div>
      </motion.div>
    </div>
  );
}
