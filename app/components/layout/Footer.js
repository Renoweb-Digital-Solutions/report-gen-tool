'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp, ArrowRight, ShieldCheck, Sparkles, Layers, ExternalLink } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-brandDark via-[#0b1329] to-brandDeep text-white pt-20 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brandCyan/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-brandIndigo/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Header Row with Logo & Tagline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Logo & Info (Col 1 to 5) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 shadow-md">
                <Image
                  src="/logo.png"
                  alt="Flawdits Logo"
                  width={140}
                  height={32}
                  className="h-7 w-auto object-contain brightness-0 invert"
                />
              </div>
            </Link>

            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              Flawdits is the digital presence audit tool built by Renoweb to help agencies, freelancers, and small business owners audit SEO, social, local, and visual brand consistency in one client-ready report.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-brandCyan">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Sparkles size={14} className="text-brandAmber" /> Part of Renoweb+ Suite
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <ShieldCheck size={14} className="text-emerald-400" /> Client-Ready PDFs
              </span>
            </div>
          </div>

          {/* Nav Columns (Col 6 to 12) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Col 1: Audit Modules */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brandCyan mb-4">
                Audit Modules
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70 font-medium">
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">Website Anatomy</Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">GMB Audit</Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">Instagram Audit</Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">LinkedIn Audit</Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">Visual Brand Match</Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">AI Visibility Audit</Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brandCyan mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70 font-medium">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">About Flawdits</Link>
                </li>
                <li>
                  <Link href="/compare/flawdits-vs-leadsgorilla" className="hover:text-white transition-colors">Compare vs Competitors</Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">FAQ & Support</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Renoweb+ Suite */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-brandCyan mb-4">
                Renoweb+ Suite
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70 font-medium">
                <li className="flex items-center gap-1.5 font-bold text-white">
                  <span>Flawdits</span>
                  <span className="text-[10px] bg-brandDeep px-1.5 py-0.5 rounded text-brandCyan">Active</span>
                </li>
                <li>
                  <span className="text-white/50 cursor-not-allowed flex items-center gap-1">
                    SimpLeads <span className="text-[10px] text-white/40">(Lead Gen)</span>
                  </span>
                </li>
                <li>
                  <span className="text-white/50 cursor-not-allowed flex items-center gap-1">
                    Snooptel <span className="text-[10px] text-white/40">(Research)</span>
                  </span>
                </li>
                <li className="pt-2">
                  <a
                    href="https://www.renowebhq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brandAmber font-semibold hover:underline"
                  >
                    <span>Renoweb Agency</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50 font-medium">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Renoweb"
              width={90}
              height={22}
              className="h-5 w-auto object-contain brightness-0 invert opacity-60"
            />
            <span className="w-px h-3.5 bg-white/20" />
            <p>© {new Date().getFullYear()} Renoweb. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <span>Built by Operators for Agencies & Founders</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
