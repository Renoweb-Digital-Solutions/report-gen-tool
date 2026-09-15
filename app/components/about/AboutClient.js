'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, TrendingUp, Sparkles, Layers, ShieldCheck, Target, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { ScrollReveal } from '../home/ScrollReveal';
import { CtaBanner } from '../ui/CtaBanner';
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
      items: ['ICP Audit', 'Sentiment Analysis'],
      color: '#10b981'
    },
    {
      id: 'financial',
      icon: TrendingUp,
      title: 'Financial Intelligence',
      items: ['Brand Financial Audit'],
      color: '#f59e0b'
    },
    {
      id: 'digital',
      icon: Globe,
      title: 'Digital Intelligence',
      items: ['Ads Audit', 'YouTube Audit'],
      color: '#4460ef'
    },
    {
      id: 'security',
      icon: Sparkles,
      title: 'Security Intelligence',
      items: ['Cybersecurity Audit'],
      color: '#ef4444'
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

      {/* CONTENT BLOCKS (Z-PATTERN) */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-32 mb-20">
            
            {/* The Renoweb+ Suite (Text Left, Image Right) */}
            <ScrollReveal className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2">
                <div className="w-12 h-12 rounded-2xl bg-brandDeep/10 text-brandDeep flex items-center justify-center mb-6">
                  <Layers size={24} />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brandDeep mb-6 leading-tight">The Renoweb Plus</h2>
                <p className="text-base sm:text-lg text-brandInk/70 leading-relaxed mb-6">
                  Flawdits is part of Renoweb Plus, a suite of easy-to-use, do-it-yourself marketing tools built for solo founders and small, bootstrapped startup teams- the wave of founders who need every marketing function at once (SEO, social, AI visibility and more) but can only budget a fraction of what hiring separate specialists would cost. Every tool in Renoweb Plus is built to have an easy learning curve, not a steep one.
                </p>
                <p className="text-sm sm:text-base text-brandInk/60 leading-relaxed">
                  It currently hosts three products, each already past MVP with real users: SimpLeads for lead generation, qualification, and scoring; Flawdits for multi-platform digital presence analysis; and Snooptel for content research. Over time, these may combine into one connected product ecosystem, or continue to run as standalone tools; each already works on its own today.
                </p>
                
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-sm font-bold text-brandDeep/80">
                  <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-brandCyan" /> SimpLeads</span>
                  <span className="flex items-center gap-2"><Target size={18} className="text-brandCyan" /> Snooptel</span>
                  <span className="flex items-center gap-2"><Sparkles size={18} className="text-brandCyan" /> Flawdits</span>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50 transform lg:translate-x-4">
                  <Image src="/renoweb_plus_16x9.png" alt="Renoweb Plus Suite" fill className="object-cover object-left-top" />
                </div>
              </div>
            </ScrollReveal>

            {/* Our Mission (Image Left, Text Right) */}
            <ScrollReveal delay={0.1} className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2 lg:pl-10">
                <div className="w-12 h-12 rounded-2xl bg-brandIndigo/10 text-brandIndigo flex items-center justify-center mb-6">
                  <Target size={24} />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brandDeep mb-6 leading-tight">Our Mission for Digital Presence Audits</h2>
                <p className="text-lg font-medium text-brandInk/80 leading-relaxed mb-6">
                  Our mission for digital presence audits is simple: replace a stack of disconnected tools and a manual report-building process with one platform.
                </p>
                <p className="text-base text-brandInk/60 leading-relaxed">
                  Produces a client-ready deliverable on the first export — priced for founders who fund their own growth, not enterprise budgets.
                </p>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-brandDeep/80 font-bold">
                  <span className="flex items-center gap-2.5"><ArrowRight size={16} className="text-brandCyan" /> Client-Ready Exports</span>
                  <span className="flex items-center gap-2.5"><ArrowRight size={16} className="text-brandCyan" /> Self-Funded Pricing</span>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50 transform lg:-translate-x-4">
                  <Image src="/mission_audit_16x9.png" alt="Streamlined Audit Mission" fill className="object-cover object-left-top" />
                </div>
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
                      {item.items && (
                        <ul className="space-y-2 mt-2">
                          {item.items.map((listItem, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-brandInk/70 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      )}
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

          {/* WHY WE BUILT FLAWDITS & BUILT BY OPERATORS (CLICKUP GRID) */}
          <div className="mt-32">
            <div className="relative rounded-[2rem] p-[1px] shadow-sm overflow-hidden group">
              {/* Static border background */}
              <div className="absolute inset-0 bg-slate-200" />
              
              {/* Animated wave border (spins under the gaps) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] sm:w-[200%] aspect-square bg-[conic-gradient(from_0deg,transparent_0_60%,#0ea5e9_80%,#06b6d4_100%)] animate-[spin_4s_linear_infinite] opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-[1px]">
                
                {/* Quadrant 1: Image for Why we built */}
                <ScrollReveal className="bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16 h-full">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50">
                    <Image src="/why_built_16x9.png" alt="Why We Built Flawdits" fill className="object-cover object-left-top" />
                  </div>
                </ScrollReveal>

                {/* Quadrant 2: Text for Why we built */}
                <ScrollReveal delay={0.1} className="bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center h-full">
                  <div className="w-12 h-12 rounded-2xl bg-brandCyan/20 text-brandDeep flex items-center justify-center mb-6">
                    <Award size={24} />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brandDeep mb-6 leading-tight">Why We Built Flawdits</h2>
                  <p className="text-base sm:text-lg text-brandInk/70 leading-relaxed mb-4">
                    Why we built Flawdits comes down to a gap we kept hearing on client calls, not just seeing internally: across 200+ sales conversations, we kept meeting solo founders and bootstrapped startup teams who needed every marketing service at once but could only budget a fraction of what separate SEO, social, and audit tools cost individually.
                  </p>
                  <p className="text-sm sm:text-base text-brandInk/60 leading-relaxed">
                    Flawdits is Renoweb Plus's answer to the visibility-and-analysis piece of that gap: one affordable tool covering website, social, local, and AI-search presence audit together, built to be usable without buying separate tools.
                  </p>
                </ScrollReveal>

                {/* Quadrant 3: Text for Built by Operators */}
                <ScrollReveal delay={0.2} className="bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center h-full">
                  <div className="w-12 h-12 rounded-2xl bg-brandAmber/20 text-brandDark flex items-center justify-center mb-6">
                    <Users size={24} />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brandDeep mb-6 leading-tight">Built by Operators, Not Just Developers</h2>
                  <p className="text-base sm:text-lg text-brandInk/70 leading-relaxed mb-4">
                    Flawdits is built by an 18-person team spanning SEO, performance marketing, creative, design, video, web and software development, DevOps, business development, and compliance, the same team that has run hands-on growth engagements for 300+ businesses across 120+ industries. That operator experience feeds directly into what Flawdits audits and how it grades what it finds.
                  </p>
                  <p className="text-sm sm:text-base text-brandInk/60 leading-relaxed mb-8">
                    The team ships through its own CI/CD pipeline, so the tool itself is constantly being updated; new checks, fixes, and improvements roll out on an ongoing basis rather than in occasional big releases.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-center sm:text-left">
                    <div>
                      <div className="text-2xl font-extrabold text-brandDeep">18</div>
                      <div className="text-xs text-brandInk/60 font-semibold uppercase tracking-wider mt-1">Team Members</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-brandDeep">300+</div>
                      <div className="text-xs text-brandInk/60 font-semibold uppercase tracking-wider mt-1">Businesses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-brandDeep">120+</div>
                      <div className="text-xs text-brandInk/60 font-semibold uppercase tracking-wider mt-1">Industries</div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Quadrant 4: Image for Built by Operators */}
                <ScrollReveal delay={0.3} className="bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16 h-full">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50">
                    <Image src="/operators_16x9.png" alt="Built by Operators" fill className="object-cover object-left-top" />
                  </div>
                </ScrollReveal>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA BAND */}
      <CtaBanner 
        title="See the platform Renoweb Plus built for budget-capped founders" 
        subtitle="Run a complete digital presence report covering SEO, social, local, and visual brand consistency in minutes." 
        buttonText="Try Flawdits Free" 
      />

      <Footer />
    </div>
  );
}
