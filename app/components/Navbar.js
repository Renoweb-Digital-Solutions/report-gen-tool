'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import ApiHealthBadge from './ApiHealthBadge';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onMenuClick }) {
  return (
    <>
      <div className="beta-banner">
        <span className="truncate max-w-full block px-4 w-full text-center">
          The application is in beta. If anything breaks please let us know through support.
        </span>
      </div>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="flex items-center gap-2 md:gap-6 navbar-left">
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
        <span className="navbar-title hidden sm:block">Digital Presence Report Suite</span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <ApiHealthBadge />
        <div
          className="session-pill hidden md:flex items-center gap-[6px] text-[11.5px] text-brandInk/50 bg-brandInk/5 px-3 py-1.5 rounded-2xl border border-brandInk/10 select-none"
          title="Your inputs and reports persist across page refreshes but clear when this tab is closed."
        >
          <span aria-hidden="true">🔒</span>
          Session data clears on tab close
        </div>
        <ThemeToggle />
      </div>
    </nav>
    </>
  );
}

