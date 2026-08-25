'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

import AuthModal from './components/AuthModal';
import { ThreeHero } from './components/home/ThreeHero';
import { FeatureGrid } from './components/home/FeatureGrid';
import { FaqAccordion } from './components/home/FaqAccordion';
import { ScrollReveal } from './components/home/ScrollReveal';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { MagneticButton } from './components/ui/MagneticButton';
import { TextReveal } from './components/home/TextReveal';
import { ConsolidationSection } from './components/home/ConsolidationSection';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-brandInk font-sans overflow-x-hidden">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}
      
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative pt-20 pb-0 flex flex-col items-center overflow-hidden">
        <ThreeHero />
        
        <ContainerScroll
          titleComponent={
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto px-4"
            >
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-brandAmber/20 to-amber-300/30 text-brandDark border border-brandAmber/40 text-xs font-bold shadow-sm">
                No credit card required
              </span>
              <TextReveal 
                as="h1" 
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brandDeep tracking-tight mb-6" 
                text="The Digital Presence Audit Tool for SEO, Social & Brand" 
              />
              
              <p className="text-base sm:text-lg text-brandInk/70 max-w-2xl mx-auto mb-8 leading-relaxed">
                Flawdits is the digital presence audit tool built for anyone who needs a clear, client-ready picture of how a brand actually shows up online. Point Flawdits at a website, an Instagram handle, a LinkedIn company page or a Google Business Profile and get a graded report in minutes.
              </p>
              
              <MagneticButton onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-brandDeep to-brandIndigo text-white rounded-full text-base font-bold shadow-glow-blue hover:shadow-xl transition-all flex items-center gap-3">
                <span>Run a Free Audit</span>
                <ArrowRight size={18} />
              </MagneticButton>
              <p className="mt-4 text-xs font-medium text-brandInk/40">See your digital presence in one report</p>
            </motion.div>
          }
        >
          <Image 
            src="/dashboard.png" 
            alt="Flawdits dashboard" 
            fill
            className="object-contain object-center"
            priority
            draggable={false}
          />
        </ContainerScroll>
      </section>

      {/* CONTENT BLOCKS & FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ConsolidationSection />
          <FeatureGrid />
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 bg-gradient-to-br from-blue-50/40 via-indigo-50/20 to-slate-50 border-y border-brandDeep/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm border border-brandDeep/10">
                <Image src="/logo.png" alt="Flawdits" width={32} height={32} className="w-8 h-auto opacity-50" />
              </div>
              <TextReveal as="h2" className="text-3xl sm:text-4xl font-extrabold text-brandDeep mb-6" text="Everything a Client-Facing Audit Needs" />
              <p className="text-base sm:text-lg text-brandInk/70 mb-6 leading-relaxed">
                Every module rolls up into a client-facing PDF audit report, a document you can hand to a prospect, attach to a proposal, or use internally to prioritize what to fix first.
              </p>
              <p className="text-base text-brandInk/60 leading-relaxed">
                It covers the full stack: SEO, Instagram and LinkedIn audit in one report, plus a Google Business Profile audit tool and a visual brand consistency checker most competitors don't offer.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="flex flex-col gap-12">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-brandCyan/30 shadow-sm">
                <TextReveal as="h3" text="Built for Agencies, Freelancers and Small Businesses" className="text-xl font-bold text-brandDeep mb-3" />
                <p className="text-sm text-brandInk/70 leading-relaxed">
                  Agencies use Flawdits as a white label audit report tool for agencies generating branded findings that open sales conversations. Solo operators start with the free digital audit tool to test the format before committing to a plan.
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-brandCyan/30 shadow-sm">
                <h3 className="text-xl font-bold text-brandDeep mb-3">Priced for Founders Who Fund Themselves</h3>
                <p className="text-sm text-brandInk/70 leading-relaxed">
                  Most competitive-intelligence and audit tooling is priced like an enterprise line item. Flawdits is built for the founder funding their own growth: one platform, one price, instead of a stack of point tools.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brandDeep mb-4">Trusted by Teams Who Audit for a Living</h2>
            <p className="text-base sm:text-lg text-brandInk/60">Flawdits has been running inside Renoweb's own client engagements since inception.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "We used to burn half a day pulling data from five different tools before a pitch. Now it's one export.", author: "Agency Owner" },
              { q: "The graded format is what clients actually read; they skip straight to the score, then the fix list.", author: "Freelance SEO Consultant" },
              { q: "It caught a security header issue our own dev team had missed for months.", author: "Marketing Manager" }
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl border border-brandBlue/20 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-1 text-brandAmber mb-6">
                  {[...Array(5)].map((_, i) => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <p className="text-sm md:text-base font-medium text-brandInk/80 leading-relaxed mb-6">"{t.q}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brandDeep to-brandCyan opacity-30" />
                  <div>
                    <div className="text-xs font-bold text-brandInk">[Client Name]</div>
                    <div className="text-xs text-brandInk/50">{t.author}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAND & CTA */}
      <section className="py-24 bg-gradient-to-br from-brandDark to-brandDeep text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center pb-16 border-b border-white/10">
            <ScrollReveal>
              <div className="text-brandCyan text-xs font-bold uppercase tracking-widest mb-4">Part of the Renoweb+ Suite</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Built by Renoweb</h2>
              <p className="text-base text-white/70 leading-relaxed mb-6">
                Flawdits is built and maintained by Renoweb, a digital solutions agency, and ships alongside two sibling products in the Renoweb+ suite: SimpLeads and Snooptel.
              </p>
              <a href="https://www.renowebhq.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white font-semibold hover:text-brandCyan transition-colors">
                Visit renowebhq.com <ArrowRight size={16} />
              </a>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center shadow-2xl">
              <TextReveal as="h2" text="Ready to see your brand the way clients and customers do?" className="text-2xl sm:text-3xl font-bold mb-4 text-white" />
              <p className="text-sm text-white/70 mb-8">Full Report, or any single module your choice</p>
              <MagneticButton onClick={handleCtaClick} className="w-full py-4 bg-white text-brandDark rounded-full text-base font-bold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3">
                <span>Generate My Free Report</span>
                <ArrowRight size={18} />
              </MagneticButton>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <TextReveal as="h2" className="text-3xl sm:text-4xl font-extrabold text-brandDeep mb-4" text="Frequently Asked Questions" />
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
