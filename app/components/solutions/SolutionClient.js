'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Sparkles, Building2, User, Zap, ArrowRightLeft, ChevronDown, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

import { SOLUTIONS } from '../../data/solutions';
import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { ScrollReveal } from '../home/ScrollReveal';

export default function SolutionClient({ initialSlug = 'for-agencies' }) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const data = SOLUTIONS[activeSlug] || SOLUTIONS['for-agencies'];

  const handleTabChange = (slug) => {
    setActiveSlug(slug);
    if (typeof window !== 'undefined') {
      const targetPath = slug === 'flawdits-vs-vendasta-snapshot-report'
        ? '/compare/flawdits-vs-vendasta-snapshot-report'
        : `/${slug}`;
      window.history.pushState(null, '', targetPath);
    }
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const tabs = [
    { slug: 'for-agencies', label: 'For Agencies', icon: Building2 },
    { slug: 'for-freelancers-consultants', label: 'For Freelancers', icon: User },
    { slug: 'free-website-audit', label: 'Free Website Audit', icon: Zap },
    { slug: 'flawdits-vs-vendasta-snapshot-report', label: 'vs Vendasta', icon: ArrowRightLeft },
  ];

  const currentTab = tabs.find(t => t.slug === activeSlug) || tabs[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (data.faqs || []).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-brandInk font-sans overflow-x-hidden pt-28">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}
      <Script id="solution-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* TOP FLOATING GLASS TAB SELECTOR */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-brandDeep/10 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          
          {/* Label (Desktop Only) */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-brandInk/60 uppercase tracking-widest shrink-0">
            <Building2 size={16} className="text-brandBlue" /> Solutions & Use Cases:
          </div>

          {/* 2026 Mobile Select Picker (< md) */}
          <div className="md:hidden w-full relative">
            <div className="flex items-center gap-2 w-full bg-slate-100 p-2 rounded-2xl border border-brandDeep/10">
              <currentTab.icon size={16} className="text-brandBlue shrink-0 ml-1" />
              <select
                value={activeSlug}
                onChange={(e) => handleTabChange(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-brandDeep focus:outline-none appearance-none pr-6 cursor-pointer"
              >
                {tabs.map((tab) => (
                  <option key={tab.slug} value={tab.slug}>
                    Solution: {tab.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="text-brandInk/50 pointer-events-none absolute right-3" />
            </div>
          </div>

          {/* Desktop Tabs (>= md) */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {tabs.map((tab) => {
              const isActive = activeSlug === tab.slug;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.slug}
                  onClick={() => handleTabChange(tab.slug)}
                  className={`relative px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-brandInk/70 hover:text-brandDeep bg-slate-100 hover:bg-slate-200/80 border border-brandDeep/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSolutionTab"
                      className="absolute inset-0 bg-gradient-to-r from-brandDeep to-brandIndigo rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={14} className={`relative z-10 ${isActive ? 'text-brandCyan' : 'text-brandInk/60'}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlug}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          {/* HERO SECTION */}
          <section className="pt-12 pb-16 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-brandAmber/20 to-amber-300/30 text-brandDark border border-brandAmber/40 text-xs font-bold shadow-sm">
                {data.eyebrow}
              </span>

              <TextReveal
                as="h1"
                text={data.hero.h1}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brandDeep tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
              />

              <p className="text-base sm:text-lg text-brandInk/70 leading-relaxed max-w-3xl mx-auto mb-8">
                {data.hero.subtitle}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
                <MagneticButton onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-brandDeep to-brandIndigo text-white rounded-full text-base font-bold shadow-glow-blue hover:shadow-xl transition-all flex items-center gap-3">
                  <span>{data.hero.ctaText}</span>
                  <ArrowRight size={18} />
                </MagneticButton>
              </div>

              {/* IF VENDASTA TABLE */}
              {data.table ? (
                <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-brandDeep/15 shadow-xl bg-white text-left my-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-brandDark via-brandDeep to-brandIndigo text-white text-xs uppercase tracking-wider">
                        <th className="py-4 px-6 font-bold w-1/3">Feature / Capability</th>
                        <th className="py-4 px-6 font-bold w-1/3 bg-brandCyan/20 text-brandCyan border-x border-white/10">
                          Flawdits
                        </th>
                        <th className="py-4 px-6 font-bold w-1/3">Vendasta Snapshot Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brandDeep/10 text-xs sm:text-sm">
                      {data.table.rows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                          <td className="py-4 px-6 font-bold text-brandInk">{row.dimension}</td>
                          <td className="py-4 px-6 bg-blue-50/50 font-semibold text-brandDeep border-x border-brandDeep/10">
                            {row.flawdits}
                          </td>
                          <td className="py-4 px-6 text-brandInk/70 font-normal">{row.competitor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* HERO MOCKUP CARD FOR SOLUTIONS */
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-brandDark via-[#0b1329] to-brandDeep p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-brandCyan/40 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="text-xs font-mono text-white/50 ml-2">flawdits.com/solution-{activeSlug}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Client-Ready PDF Engine
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                      <div className="text-xs text-white/50 uppercase font-bold mb-1">White Labeling</div>
                      <div className="text-2xl font-extrabold text-emerald-400 mb-2">100% Branded</div>
                      <div className="text-xs text-white/70 font-medium">Your logo, your custom colors</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                      <div className="text-xs text-white/50 uppercase font-bold mb-1">Audit Speed</div>
                      <div className="text-2xl font-extrabold text-brandCyan mb-2">&lt; 60 Seconds</div>
                      <div className="text-xs text-white/70 font-medium">No complex crawler setup</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                      <div className="text-xs text-white/50 uppercase font-bold mb-1">Client Conversion</div>
                      <div className="text-2xl font-extrabold text-brandAmber mb-2">3.4x Pitch Lift</div>
                      <div className="text-xs text-white/70 font-medium">Evidenced audit proposal</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* CONTENT BLOCKS GRID */}
          <section className="py-20 bg-white border-y border-brandDeep/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
                {data.contentBlocks.map((block, idx) => (
                  <ScrollReveal key={idx} delay={idx * 0.1} className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-8 rounded-3xl border border-brandDeep/10 shadow-sm flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-brandDeep mb-4">{block.h2}</h2>
                      <p className="text-sm text-brandInk/70 leading-relaxed">{block.body}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* FEATURE GRID ITEMS */}
          {data.featureGrid && (
            <section className="py-20 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                  <h2 className="text-3xl font-extrabold text-brandDeep mb-3">{data.featureGrid.h2}</h2>
                  <p className="text-sm text-brandInk/60">Designed specifically for your workflow demands.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {data.featureGrid.items.map((item, idx) => (
                    <ScrollReveal key={idx} delay={idx * 0.05} className="bg-white p-6 rounded-2xl border border-brandCyan/30 shadow-sm hover:shadow-md transition-all">
                      <div className="w-10 h-10 rounded-xl bg-brandDeep/10 text-brandDeep flex items-center justify-center mb-4">
                        <CheckCircle2 size={20} className="text-brandBlue" />
                      </div>
                      <h3 className="text-base font-bold text-brandInk mb-2">{item.title}</h3>
                      <p className="text-xs text-brandInk/70 leading-relaxed">{item.desc}</p>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ ACCORDION */}
          <section className="py-20 bg-white border-t border-brandDeep/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-brandDeep mb-4">Frequently Asked Questions</h2>
                <p className="text-sm text-brandInk/60">Common questions about {data.title}.</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-brandBlue/20 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">
                    <button 
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-brandInk text-base md:text-lg focus:outline-none"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                    >
                      <span className="pr-8">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: openFaqIndex === idx ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "anticipate" }}
                        className="text-brandBlue shrink-0"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaqIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                          <div className="px-6 pb-6 text-brandInk/70 text-sm md:text-base leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA BAND */}
          <section className="py-20 bg-gradient-to-br from-brandDark to-brandDeep text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
              <ScrollReveal className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  {data.ctaBand.headline}
                </h2>
                
                <p className="text-base sm:text-lg text-white/70 mb-8 max-w-xl mx-auto">
                  Run a complete digital presence report covering SEO, social, local, and visual brand consistency in minutes.
                </p>

                <MagneticButton onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-brandAmber to-amber-400 text-brandDark rounded-full text-base font-bold shadow-glow-amber hover:shadow-2xl transition-all inline-flex items-center gap-3">
                  <span>{data.ctaBand.btnText}</span>
                  <ArrowRight size={18} />
                </MagneticButton>
              </ScrollReveal>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
