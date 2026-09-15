'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

import AuthModal from './components/AuthModal';
import { FeatureGrid } from './components/home/FeatureGrid';
import { FaqAccordion } from './components/home/FaqAccordion';
import { ScrollReveal } from './components/home/ScrollReveal';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { MagneticButton } from './components/ui/MagneticButton';
import { TextReveal } from './components/home/TextReveal';
import { ConsolidationSection } from './components/home/ConsolidationSection';
import { CtaBanner } from './components/ui/CtaBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

export default function LandingPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('login=true')) {
      setShowAuthModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleCtaClick = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-brandInk font-sans overflow-x-hidden">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}

      <Navbar />

      {/* HERO - DARK MODE, VIBRANT GLOW (ClickUp Style) */}
      <section ref={heroRef} className="relative pt-32 pb-0 flex flex-col items-center overflow-hidden bg-[#050914] text-white selection:bg-brandCyan/30">
        {/* Massive vibrant background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1200px] h-[600px] bg-gradient-to-r from-brandDeep via-brandCyan to-brandAmber rounded-[100%] opacity-20 blur-[120px] pointer-events-none" />

        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 relative z-10 pb-20 md:pb-32"
            >
              <span className="inline-flex px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 text-brandCyan text-xs font-bold shadow-lg tracking-wide uppercase">
                No credit card required
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tight mb-6 leading-tight">
                Your Complete Digital <br className="hidden md:block" /> Presence Audit Tool
              </h1>

              <p className="text-lg sm:text-xl text-brandCyan/90 max-w-2xl mx-auto mb-4 font-semibold tracking-wide">
                A Website and Social Media Audit Tool in One Dashboard
              </p>
              <p className="text-base sm:text-lg text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed">
                As a combined website and social media audit tool, Flawdits covers technical SEO health, Google Business Profile completeness, and content performance across Instagram, LinkedIn company pages, and LinkedIn personal profiles so you're not toggling between separate platforms to answer one simple question: is this brand's digital presence actually working?
              </p>

              <div className="flex flex-col items-center gap-4">
                <MagneticButton onClick={handleCtaClick} className="px-10 py-5 bg-white text-[#050914] rounded-full text-base font-extrabold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all flex items-center gap-3">
                  <span>Run a Free Audit</span>
                  <ArrowRight size={18} />
                </MagneticButton>
                <p className="text-xs font-medium text-white/40">See your digital presence in one report</p>
              </div>
            </motion.div>
          }
        >
          <div className="relative w-full h-full overflow-hidden bg-white">
            <Image
              src="/dashboard.png"
              alt="Flawdits dashboard"
              fill
              className="object-contain object-top"
              priority
              draggable={false}
            />
          </div>
        </ContainerScroll>
      </section>

      {/* CONTENT BLOCKS & FEATURES - LIGHT/DARK TOGGLE */}
      {/* Consolidation - Light Mode, Soft & Clean */}
      <section id="consolidation" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <ConsolidationSection />
        </div>
      </section>

      {/* Feature Grid - Dark Mode Bento Grid */}
      <FeatureGrid />

      {/* USE CASES - LIGHT MODE PILL-TAB AESTHETIC */}
      <section className="py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm border border-slate-200 text-brandDeep">
                <Image src="/logo.png" alt="Flawdits" width={28} height={28} className="w-7 h-auto opacity-70" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-brandInk tracking-tight mb-6">
                Everything a Client-Facing <br /> Audit Needs
              </h2>
              <p className="text-lg text-brandInk/70 mb-6 leading-relaxed">
                Every module rolls up into a client-facing PDF audit report, a document you can hand to a prospect, attach to a proposal, or use internally to prioritize what to fix first.
              </p>
              <p className="text-base text-brandInk/60 leading-relaxed border-l-2 border-brandCyan pl-4">
                It covers the full stack: SEO, Instagram and LinkedIn audit in one report, plus a Google Business Profile audit tool and a visual brand consistency checker most competitors don't offer.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="flex flex-col gap-6">
              <div className="glass-light p-10 rounded-3xl group hover:shadow-xl hover:border-brandDeep/20 transition-all">
                <h3 className="text-xl font-bold text-brandDeep mb-3 tracking-tight">Built for Agencies, Freelancers and Small Businesses</h3>
                <p className="text-sm text-brandInk/70 leading-relaxed">
                  Agencies use Flawdits as a white label audit report tool for agencies generating branded findings that open sales conversations. Solo operators start with the free digital audit tool to test the format before committing to a plan.
                </p>
              </div>
              <div className="glass-light p-10 rounded-3xl group hover:shadow-xl hover:border-brandAmber/40 transition-all">
                <h3 className="text-xl font-bold text-brandDeep mb-3 tracking-tight">Priced for Founders Who Fund Themselves</h3>
                <p className="text-sm text-brandInk/70 leading-relaxed">
                  Most competitive-intelligence and audit tooling is priced like an enterprise line item. Flawdits is built for the founder funding their own growth: one platform, one price, instead of a stack of point tools.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - CLEAN HIGH CONTRAST */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brandInk tracking-tight mb-6">Trusted by Teams Who Audit for a Living</h2>
            <p className="text-lg text-brandInk/60">Flawdits has been running inside Renoweb's own client engagements since inception.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "We used to burn half a day pulling data from five different tools before a pitch. Now it's one export.", author: "Francis Brewer", role: "Agency Owner" },
              { q: "The graded format is what clients actually read; they skip straight to the score, then the fix list.", author: "Jeffrey Kranz", role: "Freelance SEO Consultant" },
              { q: "It caught a security header issue our own dev team had missed for months.", author: "Mohit Paul", role: "Marketing Manager" }
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="bg-slate-50 p-10 rounded-3xl border border-slate-200 hover:border-brandDeep/30 transition-all hover:-translate-y-1">
                <div className="flex gap-1.5 text-brandAmber mb-8">
                  {[...Array(5)].map((_, i) => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
                </div>
                <p className="text-base font-semibold text-brandInk/80 leading-relaxed mb-8 tracking-tight">"{t.q}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brandDeep to-brandCyan opacity-20" />
                  <div>
                    <div className="text-sm font-bold text-brandInk tracking-tight">{t.author}</div>
                    <div className="text-xs text-brandInk/50 font-medium">{t.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAND & CTA - SLEEK GLOW MINIMALISM */}
      <section className="relative py-32 bg-[#050914] text-white overflow-hidden border-t border-white/5">
        {/* Glow Orb Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-40 mix-blend-screen pointer-events-none">
          <Image src="/brand_glow_orb.png" alt="Glow" width={1000} height={1000} className="w-full h-auto object-cover blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto pb-16">
            <ScrollReveal>
              <div className="inline-block px-4 py-1 rounded-full bg-brandCyan/10 border border-brandCyan/20 text-brandCyan text-xs font-bold tracking-widest uppercase mb-8">
                Part of the Renoweb Plus
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tight mb-8">
                Built by Renoweb
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-10">
                Flawdits is part of Renoweb Plus, a suite of easy-to-use, DIY marketing tools built for solo founders and bootstrapped startup teams who need every marketing function but can only budget a fraction of what hiring separate specialists would cost. It ships alongside two sibling products in the suite: SimpLeads for lead generation and Snooptel for content research one connected system built by the same team, not three unrelated tools.
              </p>
              <a href="https://www.renowebhq.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brandCyan font-bold hover:text-white transition-colors bg-brandCyan/10 px-6 py-3 rounded-full border border-brandCyan/20">
                Visit renowebhq.com <ArrowRight size={16} />
              </a>
            </ScrollReveal>
          </div>

          <CtaBanner 
            title="Ready to see your brand the way clients and customers do?" 
            subtitle="Full Report, or any single module your choice" 
            buttonText="Generate My Free Report" 
          />
        </div>
      </section>

      {/* FAQ - LIGHT MODE */}
      <section id="faq" className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brandInk tracking-tight mb-4">Frequently Asked Questions</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <FaqAccordion />
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
