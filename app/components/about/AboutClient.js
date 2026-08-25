'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, TrendingUp, Sparkles, Layers, ShieldCheck, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { ScrollReveal } from '../home/ScrollReveal';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

export default function AboutClient() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCtaClick = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const ROADMAP = [
    {
      id: 'audience',
      icon: Users,
      title: 'Audience Intelligence',
      subheading: "Understand who's actually engaging with a brand, not just how it scores. Audience demographics and behavior insights, planned once usage data from current clients confirms demand.",
      color: '#10b981'
    },
    {
      id: 'financial',
      icon: TrendingUp,
      title: 'Financial Intelligence',
      subheading: "See the financial signals behind a brand's digital presence, not just the presence itself. Financial health and revenue-signal insights, under evaluation for a future release.",
      color: '#f59e0b'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-brandInk font-sans overflow-x-hidden">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}

      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brandCyan/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-brandAmber/20 to-amber-300/30 text-brandDark border border-brandAmber/40 text-xs font-bold shadow-sm">
                A Renoweb Digital Presence Report Suite
              </span>
            </motion.div>

            <TextReveal
              as="h1"
              text="About Flawdits"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brandDeep tracking-tight mb-6"
            />

            <p className="text-lg sm:text-xl text-brandInk/70 leading-relaxed max-w-2xl mx-auto">
              This is the short version of why Flawdits exists, who built it, and who it&apos;s built for.
            </p>
          </div>

          {/* Founder & Renoweb Storytelling Block */}
          <ScrollReveal className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 rounded-3xl p-8 md:p-12 border border-brandCyan/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
              
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-brandDeep to-brandCyan flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0 border-4 border-white">
                GM
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Image src="/logo.png" alt="Renoweb" width={110} height={26} className="h-6 w-auto object-contain opacity-80" />
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brandDeep/10 text-brandDeep">Agency Lockup</span>
                </div>

                <blockquote className="text-base sm:text-lg text-brandInk/90 font-medium leading-relaxed mb-4 italic">
                  &ldquo;Flawdits grew directly out of Renoweb&apos;s own internal agency workflow — replacing a stack of disconnected tools and manual report-building with one client-ready deliverable on the first export.&rdquo;
                </blockquote>

                <div>
                  <h4 className="text-base font-bold text-brandDeep">Gourab Majumder</h4>
                  <p className="text-xs text-brandInk/60 font-semibold">Founder & CEO, Renoweb</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CONTENT BLOCKS GRID */}
      <section className="py-20 bg-white border-y border-brandDeep/10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch mb-20">
            {/* The Renoweb+ Suite */}
            <ScrollReveal className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 sm:p-10 rounded-3xl border border-brandDeep/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brandDeep/10 text-brandDeep flex items-center justify-center mb-6">
                  <Layers size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brandDeep mb-4">The Renoweb+ Suite</h2>
                <p className="text-base text-brandInk/70 leading-relaxed mb-4">
                  Flawdits is part of the Renoweb+ suite, built by Renoweb — a digital solutions agency that runs SEO, social and brand audits for real clients every day.
                </p>
                <p className="text-sm text-brandInk/60 leading-relaxed">
                  Flawdits ships alongside two sibling products: <strong>SimpLeads</strong> for lead generation and <strong>Snooptel</strong> for content research — using one connected system, not a single-purpose tool. The product grew directly out of Renoweb&apos;s own internal need, not a generic market gap analysis.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-brandInk/10 flex items-center gap-4 text-xs font-bold text-brandDeep">
                <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> SimpLeads</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Target size={16} /> Snooptel</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Sparkles size={16} /> Flawdits</span>
              </div>
            </ScrollReveal>

            {/* Our Mission */}
            <ScrollReveal delay={0.1} className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 sm:p-10 rounded-3xl border border-brandDeep/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brandIndigo/10 text-brandIndigo flex items-center justify-center mb-6">
                  <Target size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brandDeep mb-4">Our Mission for Digital Presence Audits</h2>
                <p className="text-base sm:text-lg font-medium text-brandInk/80 leading-relaxed mb-4">
                  Our mission for digital presence audits is simple: replace a stack of disconnected tools and a manual report-building process with one platform.
                </p>
                <p className="text-sm text-brandInk/60 leading-relaxed">
                  Produces a client-ready deliverable on the first export — priced for founders who fund their own growth, not enterprise budgets.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-brandInk/10 flex items-center justify-between text-xs text-brandInk/60 font-semibold">
                <span>Client-Ready Exports</span>
                <span>Self-Funded Pricing</span>
              </div>
            </ScrollReveal>
          </div>

          {/* ROADMAP / MORE INTELLIGENCE COMING SOON */}
          <ScrollReveal className="mt-20">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brandDeep mb-4">More Intelligence, Coming Soon</h2>
              <p className="text-base text-brandInk/60">
                Flawdits is expanding beyond competitive intelligence. Here&apos;s what&apos;s next on the roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {ROADMAP.map((item) => {
                const Icon = item.icon;
                const isHovered = hoveredCard === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 border border-brandCyan/40 shadow-sm overflow-hidden group cursor-default"
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => setHoveredCard(hoveredCard === item.id ? null : item.id)}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Content (Visible underneath) */}
                    <div className={`transition-all duration-300 ${isHovered ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          <Icon size={24} />
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brandInk/5 text-brandInk/60 border border-brandInk/10">
                          Roadmap
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-brandInk mb-3">{item.title}</h3>
                      <p className="text-sm text-brandInk/70 leading-relaxed">{item.subheading}</p>
                    </div>

                    {/* Centered Coming Soon Overlay on Hover / Tap */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 bg-brandDark/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20"
                      >
                        <span className="px-4 py-2 rounded-full bg-brandAmber text-brandDark font-extrabold text-sm shadow-lg mb-2">
                          Coming Soon
                        </span>
                        <p className="text-xs text-white/70 font-medium max-w-xs">
                          Module currently in evaluation & development
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* WHY WE BUILT FLAWDITS & BUILT BY OPERATORS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch mt-24">
            {/* Why We Built Flawdits */}
            <ScrollReveal className="bg-gradient-to-br from-blue-50/40 to-indigo-50/30 p-8 sm:p-10 rounded-3xl border border-brandDeep/10 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brandCyan/20 text-brandDeep flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brandDeep mb-4">Why We Built Flawdits</h2>
              <p className="text-base text-brandInk/70 leading-relaxed mb-4">
                Why we built Flawdits comes down to a gap we kept hitting internally at Renoweb: no single affordable tool covered website, social and local visibility together.
              </p>
              <p className="text-sm text-brandInk/60 leading-relaxed">
                This is the Renoweb agency background behind the digital presence report suite story: a tool built to solve our own workflow first, then made available to everyone else running the same audits.
              </p>
            </ScrollReveal>

            {/* Built by Operators */}
            <ScrollReveal delay={0.1} className="bg-gradient-to-br from-indigo-50/40 to-slate-50 p-8 sm:p-10 rounded-3xl border border-brandDeep/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brandAmber/20 text-brandDark flex items-center justify-center mb-6">
                  <Users size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brandDeep mb-4">Built by Operators, Not Just Developers</h2>
                <p className="text-base text-brandInk/70 leading-relaxed">
                  Flawdits is built by an 18-person team spanning SEO, performance marketing, creative, design, video, web and software development, DevOps, business development and compliance — the same team that has run hands-on growth engagements for 300+ businesses across 120+ industries. That operator experience feeds directly into what Flawdits audits and how it grades what it finds.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-brandInk/10 text-center">
                <div>
                  <div className="text-xl font-extrabold text-brandDeep">18</div>
                  <div className="text-xs text-brandInk/60 font-medium">Team Members</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-brandDeep">300+</div>
                  <div className="text-xs text-brandInk/60 font-medium">Businesses</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-brandDeep">120+</div>
                  <div className="text-xs text-brandInk/60 font-medium">Industries</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-20 bg-gradient-to-br from-brandDark to-brandDeep text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              See the platform Renoweb built for its own client work
            </h2>
            
            <p className="text-base sm:text-lg text-white/70 mb-8 max-w-xl mx-auto">
              Run a complete digital presence report covering SEO, social, local, and visual brand consistency in minutes.
            </p>

            <MagneticButton onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-brandAmber to-amber-400 text-brandDark rounded-full text-base font-bold shadow-glow-amber hover:shadow-2xl transition-all inline-flex items-center gap-3">
              <span>Try Flawdits Free</span>
              <ArrowRight size={18} />
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
