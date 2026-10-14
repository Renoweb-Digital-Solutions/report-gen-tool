'use client';
import { getUserProfile } from '@/app/lib/api';
import { logoutSession, revokeAllDevices } from '@/app/features/auth/api';
import { useState, useEffect } from 'react';
import { X, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileModal({ onClose }) {
  const router = useRouter();
  const [username, setUsername] = useState('Loading...');
  const [initial, setInitial] = useState('N');

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    getUserProfile().then(profile => {
      setUsername(profile.username);
      setInitial(profile.username.charAt(0).toUpperCase());
    }).catch(() => { setUsername('User'); setInitial('U'); });
  }, []);

  const handleLogout = async (forget = false, all = false) => {
    setBusy(true);
    setError('');
    try {
      if (all) await revokeAllDevices(); else await logoutSession('user', forget);
      router.push('/?login=true');
      onClose();
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-modal-overlay" style={{ zIndex: 10000 }}>
      <div className="profile-modal-card">
        <button className="profile-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <div className="profile-header">
          <div className="profile-avatar-large">{initial}</div>
          <h2>{username}</h2>
          <p>Authenticated User</p>
        </div>

        <div className="profile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="profile-logout-btn" 
            style={{ background: '#e0e7ff', color: '#4338ca', borderColor: '#c7d2fe' }}
            onClick={() => {
              onClose();
              router.push('/dashboard/profile');
            }}
          >
            <UserIcon size={18} />
            <span>View Profile & Tickets</span>
          </button>
          <button className="profile-logout-btn" disabled={busy} onClick={() => handleLogout()}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
          <button className="profile-logout-btn" disabled={busy} onClick={() => handleLogout(true)}>Forget this device & sign out</button>
          <button className="profile-logout-btn" disabled={busy} onClick={() => handleLogout(false, true)}>Sign out & forget all devices</button>
          {error && <p role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
}
