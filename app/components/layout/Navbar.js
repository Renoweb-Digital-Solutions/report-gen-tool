'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCtaClick = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}

      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-brandDeep/10 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Flawdits"
              width={140}
              height={32}
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-brandInk/70">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors ${
                    isActive ? 'text-brandDeep font-bold' : 'hover:text-brandDeep'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <MagneticButton
            onClick={handleCtaClick}
            className="px-6 py-2.5 bg-gradient-to-r from-brandAmber to-amber-400 text-brandDark rounded-full text-sm font-bold shadow-md hover:shadow-glow-amber transition-all border-none"
          >
            <span>Get Started</span>
          </MagneticButton>

        </div>
      </nav>
    </>
  );
}
