'use client';
import { useState, useEffect } from 'react';
import { X, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileModal({ onClose }) {
  const router = useRouter();
  const [username, setUsername] = useState('Loading...');
  const [initial, setInitial] = useState('N');

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        if (payload.sub) {
          setUsername(payload.sub);
          setInitial(payload.sub.charAt(0).toUpperCase());
        } else {
          setUsername('User');
          setInitial('U');
        }
      } else {
        setUsername('Guest');
        setInitial('G');
      }
    } catch(e) {
      setUsername('User');
      setInitial('U');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/?login=true');
    onClose();
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
          <button className="profile-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
