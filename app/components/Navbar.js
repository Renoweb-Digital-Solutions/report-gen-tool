'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="navbar-left">
        {onMenuClick && (
          <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
        )}
        <Image
          src="/logo.png"
          alt="Renoweb logo"
          height={32}
          width={140}
          className="navbar-logo"
          priority
          style={{ width: 'auto', height: '32px', objectFit: 'contain' }}
        />
        <span className="navbar-title">Digital Presence Report Suite</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11.5px',
          color: 'rgba(25, 25, 25, 0.5)',
          background: 'rgba(25, 25, 25, 0.03)',
          padding: '6px 12px',
          borderRadius: '16px',
          border: '1px solid rgba(25, 25, 25, 0.06)',
          userSelect: 'none'
        }}
        title="Your inputs and reports persist across page refreshes but clear when this tab is closed."
      >
        <span aria-hidden="true">🔒</span>
        Session data clears on tab close
      </div>
    </nav>
  );
}
