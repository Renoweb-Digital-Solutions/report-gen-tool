'use client';

import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
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
    </nav>
  );
}
