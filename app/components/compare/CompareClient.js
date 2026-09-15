'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Sparkles, HelpCircle, ChevronDown, CheckCircle2, ArrowRightLeft, Layers, ShieldCheck, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

import { COMPARISONS } from '../../data/comparisons';
import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { CtaBanner } from '../ui/CtaBanner';
import { ScrollReveal } from '../home/ScrollReveal';

export default function CompareClient({ initialSlug = 'flawdits-vs-leadsgorilla' }) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const data = COMPARISONS[activeSlug] || COMPARISONS['flawdits-vs-leadsgorilla'];

  const handleTabChange = (slug) => {
    setActiveSlug(slug);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/compare/${slug}`);
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
    { slug: 'flawdits-vs-leadsgorilla', name: 'LeadsGorilla', category: 'Lead Prospecting' },
    { slug: 'flawdits-vs-similarweb', name: 'Similarweb', category: 'Traffic Intelligence' },
    { slug: 'flawdits-vs-semrush', name: 'Semrush', category: 'SEO Suite' },
    { slug: 'flawdits-vs-merchynt', name: 'Merchynt', category: 'GBP Automation' },
    { slug: 'flawdits-vs-local-ranking', name: 'Local Ranking', category: 'Geo-Grid Tracking' },
    { slug: 'flawdits-vs-gmbaudit', name: 'GMBAudit.com', category: 'Single GBP Check' },
    { slug: 'flawdits-vs-taplio', name: 'Taplio', category: 'LinkedIn Scheduling' },
    { slug: 'flawdits-vs-kleo', name: 'Kleo', category: 'AI Voice Writing' },
    { slug: 'flawdits-vs-sandcastles', name: 'Sandcastles.ai', category: 'Viral Video Research' },
  ];

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
      <Script id="compare-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* MAIN HERO & FLOATING GLASS SELECTOR GRID */}
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: FLOATING FRONT GLASS SELECTOR BOX */}
            <div className="lg:col-span-4 sticky top-28 z-30">
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/60 shadow-2xl shadow-brandDeep/10 relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brandCyan/20 blur-2xl rounded-full pointer-events-none" />

                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-brandDeep/10 text-brandDeep flex items-center justify-center">
                    <ArrowRightLeft size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-brandDeep">Compare Platform</h3>
                    <p className="text-xs text-brandInk/50 font-medium">Select a tool to view analysis:</p>
                  </div>
                </div>

                <div className="my-4 h-px bg-brandInk/10" />

                {/* Competitor Selector Buttons */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {tabs.map((tab) => {
                    const isActive = activeSlug === tab.slug;
                    return (
                      <button
                        key={tab.slug}
                        onClick={() => handleTabChange(tab.slug)}
                        className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                          isActive
                            ? 'bg-gradient-to-r from-brandDeep to-brandIndigo text-white shadow-md shadow-brandDeep/20 border border-brandCyan/30'
                            : 'bg-white/60 hover:bg-white text-brandInk/80 hover:text-brandDeep border border-brandInk/5 hover:border-brandDeep/20'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-brandInk group-hover:text-brandDeep'}`}>
                            Flawdits vs {tab.name}
                          </span>
                          <span className={`text-[10px] font-medium ${isActive ? 'text-brandCyan' : 'text-brandInk/50'}`}>
                            {tab.category}
                          </span>
                        </div>

                        {isActive ? (
                          <div className="w-6 h-6 rounded-full bg-brandCyan/20 text-brandCyan flex items-center justify-center shrink-0">
                            <Check size={14} />
                          </div>
                        ) : (
                          <ArrowRight size={14} className="text-brandInk/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-brandInk/10 text-center">
                  <span className="text-[11px] font-bold text-brandInk/40 uppercase tracking-widest">
                    9 Platform Comparisons
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: HERO CONTENT FOR ACTIVE COMPARISON */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlug}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/60 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/60 shadow-xl"
                >
                  <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-brandAmber/20 to-amber-300/30 text-brandDark border border-brandAmber/40 text-xs font-bold shadow-sm">
                    Flawdits vs {data.competitor}
                  </span>

                  <TextReveal
                    as="h1"
                    text={data.hero.h1}
                    className="text-3xl sm:text-4xl font-extrabold text-brandDeep tracking-tight mb-6"
                  />

                  <p className="text-base sm:text-lg text-brandInk/70 leading-relaxed mb-8">
                    {data.hero.subtitle}
                  </p>

                  {/* Side-by-side Highlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-left">
                    {/* Flawdits Card */}
                    <div className="bg-gradient-to-br from-white to-blue-50/70 p-6 rounded-2xl border-2 border-brandCyan/50 shadow-md">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-3 h-3 rounded-full bg-brandCyan animate-pulse" />
                        <h3 className="text-lg font-extrabold text-brandDeep">Flawdits</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {data.hero.flawditsHighlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-brandInk/90">
                            <CheckCircle2 size={16} className="text-brandCyan shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Competitor Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-3 h-3 rounded-full bg-slate-400" />
                        <h3 className="text-lg font-bold text-slate-700">{data.competitor}</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {data.hero.competitorHighlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    <MagneticButton onClick={handleCtaClick} className="px-8 py-3.5 bg-gradient-to-r from-brandDeep to-brandIndigo text-white rounded-full text-sm font-bold shadow-glow-blue hover:shadow-xl transition-all flex items-center gap-2">
                      <span>Generate a Free Audit Report</span>
                      <ArrowRight size={16} />
                    </MagneticButton>

                    <Link
                      href="/pricing"
                      className="px-6 py-3.5 bg-white text-brandDeep border border-brandDeep/20 rounded-full text-sm font-bold shadow-sm hover:bg-blue-50 transition-all"
                    >
                      See Full Pricing
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* DYNAMIC CONTENT FOR ACTIVE COMPARISON */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlug}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          {/* FEATURE GRID — COMPARISON TABLE */}
          <section className="py-20 bg-white border-y border-brandDeep/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-3xl font-extrabold text-brandDeep mb-3">{data.table.h2}</h2>
                <p className="text-sm text-brandInk/70 leading-relaxed">{data.table.subtitle}</p>
              </div>

              {/* Widescreen Table */}
              <div className="overflow-x-auto rounded-2xl border border-brandDeep/15 shadow-lg bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-brandDark via-brandDeep to-brandIndigo text-white text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-bold w-1/4">Dimension</th>
                      <th className="py-4 px-6 font-bold w-3/8 bg-brandCyan/20 text-brandCyan border-x border-white/10">
                        Flawdits
                      </th>
                      <th className="py-4 px-6 font-bold w-3/8">{data.competitor}</th>
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
            </div>
          </section>

          {/* FEATURE-BY-FEATURE BREAKDOWN */}
          <section className="py-20 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl font-extrabold text-brandDeep mb-3">{data.breakdown.h2}</h2>
                <p className="text-sm text-brandInk/60">Detailed breakdown across all core capabilities.</p>
              </div>

              <div className="space-y-12 max-w-5xl mx-auto">
                {data.breakdown.sections.map((sec, sIdx) => (
                  <ScrollReveal key={sIdx} className="bg-white rounded-3xl p-8 sm:p-10 border border-brandDeep/10 shadow-sm">
                    <h3 className="text-2xl font-extrabold text-brandDeep mb-2">{sec.h3}</h3>
                    <p className="text-sm text-brandInk/60 mb-8">{sec.subtitle}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Flawdits list */}
                      <div className="bg-blue-50/50 rounded-2xl p-6 border border-brandCyan/30">
                        <div className="text-xs font-extrabold uppercase tracking-widest text-brandDeep mb-4 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-brandCyan" /> Flawdits Capabilities
                        </div>
                        <ul className="space-y-3">
                          {sec.flawdits.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-brandInk/90">
                              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Competitor list */}
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-400" /> {data.competitor} Capabilities
                        </div>
                        <ul className="space-y-3">
                          {sec.competitor.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* CHOOSE FLAWDITS OR COMPETITOR? */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-brandDeep mb-3">{data.whoShouldUse.h2}</h2>
                <p className="text-sm text-brandInk/60">Identify which tool fits your agency workflow best.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Choose Flawdits */}
                <ScrollReveal className="bg-gradient-to-br from-brandDeep to-brandIndigo text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white mb-6">Choose Flawdits if…</h3>
                    <ul className="space-y-4 mb-8">
                      {data.whoShouldUse.flawdits.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-white/90">
                          <div className="w-5 h-5 rounded-full bg-brandCyan/20 text-brandCyan flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={14} />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <MagneticButton onClick={handleCtaClick} className="w-full py-3.5 bg-brandAmber text-brandDark rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <span>Start Free Audit with Flawdits</span>
                    <ArrowRight size={16} />
                  </MagneticButton>
                </ScrollReveal>

                {/* Choose Competitor */}
                <ScrollReveal delay={0.1} className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between border border-slate-800">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-200 mb-6">Choose {data.competitor} if…</h3>
                    <ul className="space-y-4 mb-8">
                      {data.whoShouldUse.competitor.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                          <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-400 font-medium text-center py-2 bg-slate-800/50 rounded-full border border-slate-800">
                    Built for specific specialized workflows
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* PAIRING / WORKFLOW BLOCK */}
          {data.pairing && (
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/40 border-t border-brandDeep/10">
              <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-brandDeep/15 shadow-lg">
                  <div className="inline-block px-3 py-1 rounded-full bg-brandDeep/10 text-brandDeep text-xs font-bold uppercase tracking-wider mb-4">
                    Workflow Strategy
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-brandDeep mb-4">{data.pairing.h2}</h2>
                  <p className="text-sm sm:text-base text-brandInk/70 leading-relaxed mb-8">{data.pairing.body}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {data.pairing.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-brandCyan/20 text-xs sm:text-sm font-semibold text-brandInk">
                        <span className="w-6 h-6 rounded-full bg-brandDeep text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {data.pairing.workflowTitle && (
                    <div className="p-6 bg-gradient-to-r from-brandDark to-brandDeep text-white rounded-2xl">
                      <h4 className="text-base font-bold mb-2 text-brandCyan">{data.pairing.workflowTitle}</h4>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{data.pairing.workflowDesc}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* FAQ ACCORDION */}
          <section className="py-20 bg-white border-t border-brandDeep/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-brandDeep mb-4">Frequently Asked Questions</h2>
                <p className="text-sm text-brandInk/60">Common comparison questions about Flawdits vs {data.competitor}.</p>
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
            title={data.cta.h2}
            subtitle="Run a complete digital presence report covering SEO, social, local, and visual brand consistency in minutes." 
            buttonText={data.cta.primaryBtn}
            secondaryButtonText={data.cta.secondaryBtn}
            secondaryButtonHref="/pricing"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
