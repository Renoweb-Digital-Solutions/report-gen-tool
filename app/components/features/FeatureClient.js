'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Sparkles, Layers, ShieldCheck, HelpCircle, ChevronDown, CheckCircle2, Globe, MapPin, Camera, Briefcase, Palette, Info, Gauge, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

import { FEATURES } from '../../data/features';
import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { CtaBanner } from '../ui/CtaBanner';
import { ScrollReveal } from '../home/ScrollReveal';
import TabbedContentBlocks from './TabbedContentBlocks';

export default function FeatureClient({ initialSlug = 'full-report' }) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const data = FEATURES[activeSlug] || FEATURES['full-report'];

  const handleTabChange = (slug) => {
    setActiveSlug(slug);
    if (typeof window !== 'undefined') {
      const targetPath = slug === 'full-report' ? '/full-report' : `/${slug}`;
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

  const modules = [
    { slug: 'full-report', name: 'Full Report', icon: Layers, color: '#308fef' },
    { slug: 'website-anatomy', name: 'Website Anatomy', icon: Globe, color: '#4460ef' },
    { slug: 'gmb-audit', name: 'GMB Audit', icon: MapPin, color: '#4ec8ef' },
    { slug: 'instagram-audit', name: 'Instagram Audit', icon: Camera, color: '#ffc857' },
    { slug: 'linkedin-audit', name: 'LinkedIn Audit', icon: Briefcase, color: '#023dbb' },
    { slug: 'linkedin-personal-audit', name: 'LinkedIn Personal', icon: User, color: '#308fef' },
    { slug: 'visual-brand-match', name: 'Visual Brand Match', icon: Palette, color: '#9d4edd' },
    { slug: 'ai-visibility-audit', name: 'AI Visibility Audit', icon: Sparkles, color: '#10b981' },
  ];

  const currentModule = modules.find(m => m.slug === activeSlug);
  const isModule = !!currentModule;

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
      <Script id="feature-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {isModule && (
        <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-brandDeep/10 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
            
            {/* Label (Desktop Only) */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-brandInk/60 uppercase tracking-widest shrink-0">
              <Gauge size={16} className="text-brandBlue" /> Select Module:
            </div>

            {/* 2026 Mobile Select Picker (< md) */}
            <div className="md:hidden w-full relative">
              <div className="flex items-center gap-2 w-full bg-slate-100 p-2 rounded-2xl border border-brandDeep/10">
                <currentModule.icon size={16} className="text-brandBlue shrink-0 ml-1" />
                <select
                  value={activeSlug}
                  onChange={(e) => handleTabChange(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-brandDeep focus:outline-none appearance-none pr-6 cursor-pointer"
                >
                  {modules.map((mod) => (
                    <option key={mod.slug} value={mod.slug}>
                      Module: {mod.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-brandInk/50 pointer-events-none absolute right-3" />
              </div>
            </div>

            {/* Desktop Horizontal Tabs (>= md) */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {modules.map((mod) => {
                const isActive = activeSlug === mod.slug;
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.slug}
                    onClick={() => handleTabChange(mod.slug)}
                    className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-brandInk/70 hover:text-brandDeep bg-slate-100 hover:bg-slate-200/80 border border-brandDeep/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFeatureTab"
                        className="absolute inset-0 bg-gradient-to-r from-brandDeep to-brandIndigo rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon size={14} className={`relative z-10 ${isActive ? 'text-brandCyan' : 'text-brandInk/60'}`} />
                    <span className="relative z-10">{mod.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

              {data.roadmapNotice && (
                <div className="max-w-2xl mx-auto mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-xs text-amber-900 font-semibold text-left">
                  <Info size={18} className="text-amber-600 shrink-0" />
                  <span>{data.roadmapNotice}</span>
                </div>
              )}

              <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
                <MagneticButton onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-brandDeep to-brandIndigo text-white rounded-full text-base font-bold shadow-glow-blue hover:shadow-xl transition-all flex items-center gap-3">
                  <span>{data.hero.ctaText}</span>
                  <ArrowRight size={18} />
                </MagneticButton>
              </div>

              {/* MOCKUP / UI SCREENSHOT PANEL */}
              {isModule && (
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-brandDark via-[#0b1329] to-brandDeep p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-brandCyan/40 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="text-xs font-mono text-white/50 ml-2">flawdits.com/app/report-{activeSlug}</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live Audit engine
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                      <div className="text-xs text-white/50 uppercase font-bold mb-1">Overall Health</div>
                      <div className="text-4xl font-extrabold text-emerald-400 mb-2">92 / 100</div>
                      <div className="text-xs text-white/70 font-medium">Grade A+ • Client Ready PDF</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                      <div className="text-xs text-white/50 uppercase font-bold mb-1">Audit Coverage</div>
                      <div className="text-2xl font-extrabold text-brandCyan mb-2">6 Active Modules</div>
                      <div className="text-xs text-white/70 font-medium">SEO • GMB • Social • AI • Brand</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                      <div className="text-xs text-white/50 uppercase font-bold mb-1">Export Speed</div>
                      <div className="text-2xl font-extrabold text-brandAmber mb-2">60 Seconds</div>
                      <div className="text-xs text-white/70 font-medium">Automated PDF Generator</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* CONTENT BLOCKS TABS (CLICKUP STYLE) */}
          <TabbedContentBlocks blocks={data.contentBlocks} />

          {/* FEATURE GRID ITEMS ("WHAT [MODULE] COVERS") */}
          {data.featureGrid && (
            <section className="py-20 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                  <h2 className="text-3xl font-extrabold text-brandDeep mb-3">{data.featureGrid.h2}</h2>
                  <p className="text-sm text-brandInk/60">Comprehensive audit metrics included in every report.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {data.featureGrid.items.map((item, idx) => (
                    <ScrollReveal key={idx} delay={idx * 0.05} className="bg-white p-6 sm:p-8 rounded-2xl border border-brandCyan/30 shadow-sm hover:shadow-md transition-all">
                      <div className="w-10 h-10 rounded-xl bg-brandDeep/10 text-brandDeep flex items-center justify-center mb-4">
                        <CheckCircle2 size={20} className="text-brandBlue" />
                      </div>
                      <h3 className="text-lg font-bold text-brandInk mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-brandInk/70 leading-relaxed">{item.desc}</p>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* AUDIENCE GRID ("WHO SHOULD USE") */}
          {data.audienceGrid && (
            <section className="py-20 bg-white border-y border-brandDeep/10">
              <div className="max-w-7xl mx-auto px-6">
                <ScrollReveal className="text-center mb-16 max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-brandDeep mb-4">{data.audienceGrid.h2}</h2>
                  <p className="text-base text-brandInk/60">{data.audienceGrid.subtitle}</p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {data.audienceGrid.items.map((item, idx) => (
                    <ScrollReveal key={idx} delay={idx * 0.1} className="relative bg-gradient-to-br from-slate-50 to-blue-50/40 p-8 sm:p-10 rounded-3xl border border-brandDeep/10 shadow-sm hover:shadow-md transition-all group">
                      <div className="text-4xl mb-5">{item.emoji}</div>
                      <h3 className="text-xl font-extrabold text-brandDeep mb-3">{item.title}</h3>
                      <p className="text-sm text-brandInk/70 leading-relaxed">{item.body}</p>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}
          <section className="py-20 bg-white border-t border-brandDeep/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-brandDeep mb-4">Frequently Asked Questions</h2>
                <p className="text-sm text-brandInk/60">Common questions about the {data.title} module.</p>
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
          <CtaBanner 
            title={data.ctaBand.headline}
            subtitle="Run a complete digital presence report covering SEO, social, local, and visual brand consistency in minutes." 
            buttonText={data.ctaBand.btnText}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
