'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Sparkles, Layers, FileText, Download, ShieldCheck, ChevronDown, CheckCircle2, Globe, MapPin, Camera, Briefcase, Palette, MousePointerClick, SlidersHorizontal, FileCheck2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { CtaBanner } from '../ui/CtaBanner';
import { ScrollReveal } from '../home/ScrollReveal';

export default function HowItWorksClient() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleCtaClick = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const faqs = [
    {
      q: 'Do I need to create an account to try it?',
      a: 'No — Flawdits works as a no-credit-card audit tool, so you can generate a first report before deciding on a plan.'
    },
    {
      q: 'Is my session data stored?',
      a: 'Session data privacy for audits is built in: the dashboard clears session data on tab close, so nothing lingers beyond your active session unless you save or export it.'
    },
    {
      q: 'How long does an audit report take to generate?',
      a: 'Most single-module reports return in under a minute; the Full Report, covering every module, typically takes a little longer.'
    },
    {
      q: 'Does the audit logic change over time?',
      a: 'Yes, the Flawdits team ships continuously through its own CI/CD pipeline, so checks and scoring are refined on an ongoing basis rather than held for infrequent big releases.'
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const steps = [
    {
      number: '01',
      title: 'Choose Your Audit Module',
      subtitle: 'Pick the Full Report for everything at once, or choose an audit module individually.',
      body: 'Pick the Full Report for everything at once, or choose your audit module individually — Website Anatomy, GMB Audit, Instagram Audit, LinkedIn Audit, Visual Brand Match, or AI Visibility Audit — depending on what you need right now.',
      icon: MousePointerClick,
      color: '#308fef',
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Enter Website and Social Handles',
      subtitle: 'Provide the domain, handle, or Google Maps listing you want to analyze.',
      body: 'You enter website and social handles relevant to the module: a domain, an Instagram username, a LinkedIn company URL, a LinkedIn personal profile URL or a Google Maps listing. Optional fields like target audience, hashtags, or company size sharpen the analysis further.',
      icon: SlidersHorizontal,
      color: '#4460ef',
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Download the PDF Audit Report',
      subtitle: 'Instant automated scan, grading, and client-ready export.',
      body: 'Hit Generate, and Flawdits scans, scores and formats the results into a document you can download PDF audit report style — client-ready, with grades up front and evidence underneath, in the same automated digital audit process every time.',
      icon: FileCheck2,
      color: '#10b981',
      badge: 'Step 3'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-brandInk font-sans overflow-x-hidden pt-28">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}
      <Script id="howitworks-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* HERO SECTION */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-brandAmber/20 to-amber-300/30 text-brandDark border border-brandAmber/40 text-xs font-bold shadow-sm">
            3-Step Automated Process
          </span>

          <TextReveal
            as="h1"
            text="How Digital Audit Reports Are Generated in Flawdits"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brandDeep tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
          />

          <p className="text-base sm:text-lg text-brandInk/70 leading-relaxed max-w-3xl mx-auto mb-10">
            Understanding how digital audit reports are generated in Flawdits comes down to three steps: choose a module, enter the target details, and generate. No crawlers to configure, no API keys to manage.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
            <MagneticButton onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-brandDeep to-brandIndigo text-white rounded-full text-base font-bold shadow-glow-blue hover:shadow-xl transition-all flex items-center gap-3">
              <span>Generate My First Report →</span>
              <ArrowRight size={18} />
            </MagneticButton>
          </div>

          {/* DASHBOARD & SCREENSHOT PREVIEW PANEL */}
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-brandDark via-[#0b1329] to-brandDeep p-6 sm:p-10 rounded-3xl shadow-2xl border-4 border-brandCyan/40 text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs font-mono text-white/50 ml-2">flawdits.com/dashboard/report-builder</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                No API Key Required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 Visual Card */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="text-xs font-bold uppercase tracking-widest text-brandCyan mb-2">Step 1</div>
                <h4 className="text-lg font-bold text-white mb-2">Choose Module</h4>
                <p className="text-xs text-white/60 mb-4">Select Full Report or any individual audit module from the sidebar.</p>
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2 text-xs text-white/90 font-semibold">
                  <Layers size={16} className="text-brandCyan" /> Full Report (6 Modules)
                </div>
              </div>

              {/* Step 2 Visual Card */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="text-xs font-bold uppercase tracking-widest text-brandCyan mb-2">Step 2</div>
                <h4 className="text-lg font-bold text-white mb-2">Enter Details</h4>
                <p className="text-xs text-white/60 mb-4">Type in a domain URL, Instagram handle, GMB listing or LinkedIn URL.</p>
                <div className="p-3 bg-white/10 rounded-xl border border-white/10 font-mono text-xs text-white/90">
                  https://example.com
                </div>
              </div>

              {/* Step 3 Visual Card */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Step 3</div>
                <h4 className="text-lg font-bold text-white mb-2">Export Report</h4>
                <p className="text-xs text-white/60 mb-4">Instant PDF report generated with grades up front and evidence underneath.</p>
                <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <span>Report Ready</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 rounded text-[10px]">Grade A+</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* DETAILED 3-STEP PROCESS SECTION */}
      <section className="py-20 bg-white border-y border-brandDeep/10">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-brandDeep mb-3">The 3-Step Audit Process</h2>
            <p className="text-sm text-brandInk/60">From domain entry to a client-ready deliverable in under 60 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200 pb-16">
            {steps.map((step, idx) => {
              const placeholderImages = ['/why_built_16x9.png', '/dashboard.png', '/operators_16x9.png'];
              
              return (
                <ScrollReveal key={idx} delay={idx * 0.1} className="flex flex-col bg-white px-4 sm:px-8 md:px-6 lg:px-12 py-10 md:py-0 md:pt-4">
                  {/* Top Image */}
                  <div className="w-full aspect-[4/3] sm:aspect-video md:aspect-[4/3] xl:aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 mb-8 mx-auto relative group">
                    <Image src={placeholderImages[idx]} alt={step.title} fill className="object-cover object-left-top group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col flex-1 text-center items-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-2xl font-black text-slate-300">{step.number}.</span>
                      <h3 className="text-lg lg:text-xl font-extrabold text-brandDeep leading-tight">{step.title}</h3>
                    </div>
                    <p className="text-sm font-bold text-brandInk/80 mb-3">{step.subtitle}</p>
                    <p className="text-sm text-brandInk/60 leading-relaxed max-w-sm">
                      {step.body}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-20 bg-white border-t border-brandDeep/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-brandDeep mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-brandInk/60">Everything you need to know about generating your first report.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
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
        badge="No Credit Card Required"
        title="Three steps, one client-ready report" 
        subtitle="Run a complete digital presence report covering SEO, social, local, and visual brand consistency in minutes." 
        buttonText="Generate My First Report →" 
      />
    </div>
  );
}
