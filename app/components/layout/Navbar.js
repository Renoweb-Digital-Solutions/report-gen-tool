'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Layers, Globe, MapPin, Camera, Briefcase, Palette, Sparkles, ArrowRight, Menu, X, Building2, User, Zap, ArrowRightLeft, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleCtaClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const featureItems = [
    { name: 'Full Report', desc: 'Flagship 6-channel digital report', href: '/full-report', icon: Layers, color: '#308fef' },
    { name: 'Website Anatomy', desc: 'Technical SEO & Core Web Vitals', href: '/website-anatomy', icon: Globe, color: '#4460ef' },
    { name: 'GMB Audit', desc: 'Local search & GBP completeness', href: '/gmb-audit', icon: MapPin, color: '#4ec8ef' },
    { name: 'Instagram Audit', desc: 'Engagement & content funnel', href: '/instagram-audit', icon: Camera, color: '#ffc857' },
    { name: 'LinkedIn Audit', desc: 'Company page & B2B strategy', href: '/linkedin-audit', icon: Briefcase, color: '#023dbb' },
    { name: 'Visual Brand Match', desc: 'Cross-platform brand consistency', href: '/visual-brand-match', icon: Palette, color: '#9d4edd' },
    { name: 'AI Visibility Audit', desc: 'ChatGPT & AI search discoverability', href: '/ai-visibility-audit', icon: Sparkles, color: '#10b981' },
  ];

  const solutionItems = [
    { name: 'For Agencies', href: '/for-agencies', icon: Building2 },
    { name: 'For Freelancers', href: '/for-freelancers-consultants', icon: User },
    { name: 'Free Website Audit', href: '/free-website-audit', icon: Zap },
    { name: 'How It Works', href: '/how-it-works', icon: Layers },
  ];

  const featureRoutes = featureItems.map(item => item.href);
  const isFeatureActive = featureRoutes.some(route => pathname?.startsWith(route));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFeaturesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}

      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-b border-brandDeep/10 z-[1000] transition-all duration-300">
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-brandInk/70">
            {/* Home */}
            <Link
              href="/"
              className={`transition-colors ${
                pathname === '/' ? 'text-brandDeep font-bold border-b-2 border-brandDeep pb-1' : 'hover:text-brandDeep'
              }`}
            >
              Home
            </Link>

            {/* Features Dropdown Trigger */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsFeaturesOpen(true)}
              onMouseLeave={() => setIsFeaturesOpen(false)}
            >
              <button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className={`flex items-center gap-1.5 py-2 transition-colors ${
                  isFeatureActive || isFeaturesOpen ? 'text-brandDeep font-bold border-b-2 border-brandDeep pb-1' : 'hover:text-brandDeep'
                }`}
              >
                <span>Features</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Panel */}
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full -left-20 w-96 bg-white/95 backdrop-blur-xl rounded-3xl p-4 border border-white/60 shadow-2xl shadow-brandDeep/15 z-50 mt-2"
                  >
                    <div className="px-3 py-2 border-b border-brandInk/5 mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-brandDeep/60">
                        Audit Modules & Features
                      </span>
                      <span className="text-[10px] bg-brandCyan/20 text-brandDeep font-extrabold px-2 py-0.5 rounded-full">
                        7 Modules
                      </span>
                    </div>

                    <div className="space-y-1">
                      {featureItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsFeaturesOpen(false)}
                            className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all group ${
                              isActive
                                ? 'bg-blue-50/80 text-brandDeep border border-brandCyan/30'
                                : 'hover:bg-slate-100/80 text-brandInk hover:text-brandDeep'
                            }`}
                          >
                            <div 
                              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                              style={{ backgroundColor: `${item.color}15`, color: item.color }}
                            >
                              <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold truncate group-hover:text-brandDeep">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-brandInk/50 truncate font-normal">
                                {item.desc}
                              </div>
                            </div>
                            <ArrowRight size={14} className="text-brandInk/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pricing */}
            <Link
              href="/pricing"
              className={`transition-colors ${
                pathname === '/pricing' ? 'text-brandDeep font-bold border-b-2 border-brandDeep pb-1' : 'hover:text-brandDeep'
              }`}
            >
              Pricing
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`transition-colors ${
                pathname === '/about' ? 'text-brandDeep font-bold border-b-2 border-brandDeep pb-1' : 'hover:text-brandDeep'
              }`}
            >
              About
            </Link>

            {/* FAQ */}
            <Link
              href="/faq"
              className={`transition-colors ${
                pathname === '/faq' ? 'text-brandDeep font-bold border-b-2 border-brandDeep pb-1' : 'hover:text-brandDeep'
              }`}
            >
              FAQ
            </Link>
          </div>

          {/* Right Header Buttons: CTA + Mobile Hamburger Toggle */}
          <div className="flex items-center gap-3">
            <MagneticButton
              onClick={handleCtaClick}
              className="px-5 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-brandAmber to-amber-400 text-brandDark rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-glow-amber transition-all border-none"
            >
              <span>Get Started</span>
            </MagneticButton>

            {/* 2026 Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-slate-100 border border-brandDeep/10 flex items-center justify-center text-brandInk hover:text-brandDeep focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* 2026 FULL-SCREEN MOBILE HIGH-CONTRAST COMMAND DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 top-20 bg-[#070c18] text-white z-[999] overflow-y-auto p-6 md:hidden flex flex-col justify-between border-t border-white/10 shadow-2xl"
          >
            <div className="space-y-6">
              
              {/* Primary Navigation Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20 hover:bg-white/25"
                >
                  Home
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20 hover:bg-white/25"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20 hover:bg-white/25"
                >
                  About
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20 hover:bg-white/25"
                >
                  FAQ
                </Link>
              </div>

              {/* Categorized Features Accordion / Grid */}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-brandCyan mb-3">
                  Audit Modules & Features
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {featureItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
                      >
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${item.color}35`, color: '#ffffff' }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white">{item.name}</div>
                          <div className="text-[11px] text-white/70 truncate">{item.desc}</div>
                        </div>
                        <ArrowRight size={14} className="text-white/60" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Solutions & Compare Quick Links */}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-brandAmber mb-3">
                  Solutions & Comparisons
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {solutionItems.map((sol) => (
                    <Link
                      key={sol.href}
                      href={sol.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white hover:bg-white/20 flex items-center gap-2"
                    >
                      <sol.icon size={14} className="text-brandCyan shrink-0" />
                      <span className="truncate">{sol.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/compare/flawdits-vs-leadsgorilla"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white hover:bg-white/20 flex items-center gap-2 col-span-2"
                  >
                    <ArrowRightLeft size={14} className="text-brandCyan shrink-0" />
                    <span>Compare vs Competitors</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-6 border-t border-white/15 mt-6">
              <button
                onClick={handleCtaClick}
                className="w-full py-4 bg-gradient-to-r from-brandAmber to-amber-400 text-brandDark font-extrabold rounded-2xl text-sm shadow-2xl flex items-center justify-center gap-2"
              >
                <span>Start Free Audit Report →</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
