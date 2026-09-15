'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Zap, Shield, Sparkles, Building2, HelpCircle, Users, TrendingUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { ScrollReveal } from '../home/ScrollReveal';
import { CtaBanner } from '../ui/CtaBanner';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

export default function PricingClient() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  const TIERS = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      trial: 'Up to 14 days free trial',
      allowance: '1 report daily (full or part report)',
      description: 'Ideal for trying out the audit format and testing single site checks.',
      popular: false,
      cta: 'Get Started Free',
      features: [
        '1 report daily limit',
        'Website & Social basic scanning',
        'Standard PDF exports',
        'Community support',
        'No credit card required'
      ]
    },
    {
      name: 'Pro',
      price: '$59',
      period: '/month',
      trial: 'Instant access',
      allowance: 'Up to 3 part reports + 1 full report daily',
      description: 'Built for solo consultants & freelancers with steady client audit needs.',
      popular: false,
      cta: 'Start Pro Plan',
      features: [
        '3 part reports daily',
        '1 full report daily',
        'All 6 audit modules unlocked',
        'Priority PDF generation',
        'Email support'
      ]
    },
    {
      name: 'Advanced',
      price: '$79',
      period: '/month',
      trial: 'Instant access',
      allowance: 'Up to 6 part reports + 4 full reports daily',
      description: 'For growing operators needing higher volume & daily client audits.',
      popular: true,
      cta: 'Start Advanced Plan',
      features: [
        '6 part reports daily',
        '4 full reports daily',
        'AI visibility scoring',
        'Visual Brand Match module',
        'Faster PDF rendering engine',
        'Priority support'
      ]
    },
    {
      name: 'Custom (Agency)',
      price: 'Custom',
      period: '',
      trial: 'Dedicated onboarding',
      allowance: 'Unlimited part/full reports daily',
      description: 'For agencies & enterprises requiring white label branding & custom scale.',
      popular: false,
      cta: 'Contact Sales',
      features: [
        'Unlimited daily reports',
        'Full White Label branding (Your Logo & Colors)',
        'Custom domain PDF exports',
        'Multi-user team workspace',
        'Dedicated account manager'
      ]
    }
  ];



  const PRICING_FAQS = [
    {
      q: "How much does a white label digital audit tool cost?",
      a: "White label branding is included from the Agency plan up — see the pricing table above for current tiers and monthly report allowances."
    },
    {
      q: "Is there a free plan for generating client audit reports?",
      a: "Yes, the Free tier lets you generate a limited number of full audit reports each month with no credit card required."
    },
    {
      q: "What's a fair price for an SEO, social and brand audit tool for agencies?",
      a: "Flawdits' Agency plan is priced against the digital audit tool cost comparison of running six separate point tools, typically at a fraction of that combined cost."
    },
    {
      q: "How does audit report pricing compare to Vendasta Snapshot Report?",
      a: "Flawdits positions itself as an affordable Vendasta Snapshot alternative — see the full comparison page for a feature-by-feature breakdown."
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": PRICING_FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-brandInk font-sans overflow-x-hidden">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}
      <Script id="pricing-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-brandAmber/20 to-amber-300/30 text-brandDark border border-brandAmber/40 text-xs font-bold shadow-sm">
              Simple, Transparent Pricing
            </span>
          </motion.div>

          <TextReveal
            as="h1"
            text="Digital Audit Tool Pricing: Plans for Every Team Size"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brandDeep tracking-tight mb-6 max-w-4xl mx-auto"
          />

          <p className="text-lg sm:text-xl text-brandInk/70 leading-relaxed max-w-3xl mx-auto">
            Flawdits&apos; digital audit tool pricing is built around how you actually work — occasional checks, steady freelance client work, or high-volume agency reporting, not a one-size-fits-all subscription.
          </p>
        </div>
      </section>

      {/* PRICING TIERS GRID */}
      <section className="pb-24 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brandDeep mb-2">Plans at a Glance</h2>
            <p className="text-sm text-brandInk/60">All plans are billed as a monthly subscription.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {TIERS.map((tier, idx) => (
              <ScrollReveal
                key={idx}
                delay={idx * 0.1}
                className={`relative bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                  tier.popular
                    ? 'border-brandDeep shadow-2xl scale-105 z-10 bg-gradient-to-b from-white to-blue-50/50'
                    : 'border-brandDeep/10 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brandDeep to-brandIndigo text-white text-xs font-extrabold shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-brandInk">{tier.name}</h3>
                    <span className="text-xs font-bold text-brandDeep bg-brandDeep/10 px-2.5 py-1 rounded-full">
                      {tier.trial}
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-brandDeep">{tier.price}</span>
                    <span className="text-sm font-semibold text-brandInk/60">{tier.period}</span>
                  </div>

                  <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-brandCyan/30 mb-6">
                    <div className="text-xs font-bold text-brandDeep mb-1">Allowance:</div>
                    <div className="text-xs text-brandInk/80 font-medium">{tier.allowance}</div>
                  </div>

                  <p className="text-xs text-brandInk/60 leading-relaxed mb-6">{tier.description}</p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs text-brandInk/80 font-medium">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <MagneticButton
                  onClick={handleCtaClick}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-brandDeep to-brandIndigo text-white shadow-glow-blue hover:shadow-xl'
                      : 'bg-brandInk/5 text-brandInk hover:bg-brandDeep hover:text-white'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight size={14} />
                </MagneticButton>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-8 text-xs font-semibold text-brandInk/50">
            All plans are billed as a monthly subscription. No hidden fees. Cancel anytime.
          </div>
        </div>
      </section>


      {/* CONTENT BLOCKS GRID */}
      <section className="py-32 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            
            {/* Block 1 (Wide Bento Card) */}
            <ScrollReveal className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row hover:shadow-xl hover:border-brandCyan/30 transition-all duration-500 group">
              <div className="p-8 sm:p-10 lg:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-brandDeep mb-4 leading-tight group-hover:text-brandCyan transition-colors">Audit Report Generator Plans, Side by Side</h2>
                <p className="text-sm sm:text-base text-brandInk/70 leading-relaxed">
                  These audit report generator plans scale with usage: a Free tier for testing the format, a Pro tier for solo consultants and steady report needs, an Advanced tier for higher-volume users, and a Custom tier for agencies and enterprises needing unlimited reporting and white label branding.
                </p>
              </div>
              <div className="mt-auto lg:mt-0 lg:w-1/2 p-8 pt-0 lg:pt-8 lg:pl-0 flex items-center">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group-hover:shadow-md transition-shadow">
                  <Image src="/pricing_plans_infographic.png" alt="Pricing Plans Infographic" fill className="object-cover object-top" />
                </div>
              </div>
            </ScrollReveal>

            {/* Block 2 (Tall Bento Card) */}
            <ScrollReveal delay={0.1} className="lg:col-span-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-brandCyan/30 transition-all duration-500 group">
              <div className="p-8 sm:p-10 pb-6">
                <h2 className="text-2xl font-extrabold text-brandDeep mb-4 leading-tight group-hover:text-brandCyan transition-colors">White Label Pricing for Agencies</h2>
                <p className="text-sm sm:text-base text-brandInk/70 leading-relaxed">
                  White label pricing sits on the Agency plan, where reports carry your logo and colors instead of Flawdits.
                </p>
              </div>
              <div className="mt-auto px-8 pb-8 pt-2">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group-hover:shadow-md transition-shadow">
                  <Image src="/white_label_infographic.png" alt="White Label Branding Options" fill className="object-cover object-top" />
                </div>
              </div>
            </ScrollReveal>

            {/* Block 3 (Tall Bento Card) */}
            <ScrollReveal delay={0.2} className="lg:col-span-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-brandCyan/30 transition-all duration-500 group">
              <div className="p-8 sm:p-10 pb-6">
                <h2 className="text-2xl font-extrabold text-brandDeep mb-4 leading-tight group-hover:text-brandCyan transition-colors">Free Plan & Pay-Per-Report</h2>
                <p className="text-sm sm:text-base text-brandInk/70 leading-relaxed">
                  For teams with irregular usage, pay-per-report vs. subscription pricing means you're not paying for a monthly plan you'll only use twice a quarter.
                </p>
              </div>
              <div className="mt-auto px-8 pb-8 pt-2">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group-hover:shadow-md transition-shadow">
                  <Image src="/pay_per_report_infographic.png" alt="Pay Per Report Dashboard" fill className="object-cover object-top" />
                </div>
              </div>
            </ScrollReveal>

            {/* Block 4 (Wide Bento Card Reversed) */}
            <ScrollReveal delay={0.3} className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row-reverse hover:shadow-xl hover:border-brandCyan/30 transition-all duration-500 group">
              <div className="p-8 sm:p-10 lg:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-brandDeep mb-4 leading-tight group-hover:text-brandCyan transition-colors">Why Flawdits Costs What It Costs</h2>
                <p className="text-sm sm:text-base text-brandInk/70 leading-relaxed">
                  Covering website, SEO, social and local visibility with separate point tools plus expertise adds up fast. Flawdits is priced for founders funding their own growth: one platform doing the job.
                </p>
              </div>
              <div className="mt-auto lg:mt-0 lg:w-1/2 p-8 pt-0 lg:pt-8 lg:pr-0 flex items-center">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group-hover:shadow-md transition-shadow">
                  <Image src="/cost_value_infographic.png" alt="Consolidated Platform Infographic" fill className="object-cover object-top" />
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* PRICING FAQ ACCORDION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brandDeep mb-4">Frequently Asked Questions</h2>
            <p className="text-base text-brandInk/60">Common questions about Flawdits pricing, report allowances, and white labeling.</p>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto space-y-4">
            {PRICING_FAQS.map((faq, idx) => (
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
        title="Start free, upgrade only when you need to" 
        subtitle="No credit card required to run your first report. Choose a plan when your daily report needs grow." 
        buttonText="See Full Pricing Details" 
      />

      <Footer />
    </div>
  );
}
