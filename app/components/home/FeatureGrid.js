'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, MapPin, Camera, Briefcase, Palette, Sparkles, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const MODULES = [
  { icon: Globe, title: 'Website Anatomy', desc: 'Technical SEO, Core Web Vitals, and backlink health.', color: '#308fef', url: '/website-anatomy' },
  { icon: MapPin, title: 'GMB Audit', desc: 'Google Business Profile completeness and local visibility.', color: '#4460ef', url: '/gmb-audit' },
  { icon: Camera, title: 'Instagram Audit', desc: 'Engagement, posting consistency, and content funnel.', color: '#4ec8ef', url: '/instagram-audit' },
  { icon: Briefcase, title: 'LinkedIn Company Page Audit', desc: 'Company page performance and thought leadership.', color: '#023dbb', url: '/linkedin-company-audit' },
  { icon: Users, title: 'LinkedIn Personal Profile Audit', desc: 'Personal profile posts, engagement, and TOFU/MOFU/BOFU funnel mix.', color: '#10b981', url: '/linkedin-personal-audit' },
  { icon: Palette, title: 'Visual Brand Match', desc: 'Cross-platform brand consistency scoring.', color: '#ffc857', url: '/visual-brand-match' },
  { icon: Sparkles, title: 'AI Visibility Audit', desc: 'Brand discoverability in ChatGPT and AI search.', color: '#9d4edd', url: '/ai-visibility-audit' },
];

const COMING_SOON = [
  { icon: Users, title: 'Audience Intelligence', items: ['ICP Audit', 'Sentiment Analysis'], color: '#10b981' },
  { icon: TrendingUp, title: 'Financial Intelligence', items: ['Brand Financial Audit'], color: '#f59e0b' },
  { icon: Globe, title: 'Digital Intelligence', items: ['Ads Audit', 'YouTube Audit'], color: '#4460ef' },
  { icon: Sparkles, title: 'Security Intelligence', items: ['Cybersecurity Audit'], color: '#ef4444' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export function FeatureGrid() {
  return (
    <div id="features" className="w-full scroll-mt-24">
      <ScrollReveal>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {MODULES.map((mod, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Link href={mod.url} className="block h-full">
                <motion.div 
                  whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(2, 61, 187, 0.18)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full flex flex-col relative bg-gradient-to-br from-white to-blue-50/50 border border-brandCyan/40 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-brandDeep/40 transition-all duration-300 group overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300"
                      style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                      whileHover={{ scale: 1.15, rotate: idx % 2 === 0 ? 5 : -5 }}
                    >
                      <mod.icon size={24} />
                    </motion.div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-brandDeep group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-brandInk mb-3 group-hover:text-brandDeep transition-colors flex items-center justify-between">
                    <span>{mod.title}</span>
                  </h3>
                  <p className="text-sm text-brandInk/70 leading-relaxed">{mod.desc}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </ScrollReveal>

      <ScrollReveal delay={0.2} className="mt-20">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-brandInk mb-4">More Intelligence, Coming Soon</h3>
          <p className="text-base text-brandInk/60 max-w-2xl mx-auto">Flawdits is expanding beyond competitive intelligence. Here's what's next on the roadmap.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {COMING_SOON.map((mod, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 overflow-hidden border border-brandAmber/30 shadow-sm group"
            >
              {/* Animated Dashed Border */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-0">
                <rect 
                  x="2" y="2" 
                  width="calc(100% - 4px)" height="calc(100% - 4px)" 
                  rx="14" ry="14"
                  fill="none" 
                  stroke={`${mod.color}40`} 
                  strokeWidth="2" 
                  strokeDasharray="8 8"
                  style={{ animation: 'dash 20s linear infinite' }}
                />
              </svg>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes dash {
                  to { stroke-dashoffset: 1000; }
                }
                .pulse-dot {
                  animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse-dot {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.5; transform: scale(0.8); }
                }
              `}} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                  >
                    <mod.icon size={24} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brandInk/5 text-brandInk/60 text-xs font-semibold">
                    <div className="pulse-dot w-2 h-2 rounded-full" style={{ backgroundColor: mod.color }} />
                    Building...
                  </div>
                </div>
                <h4 className="text-lg font-bold text-brandInk mb-2">{mod.title}</h4>
                {mod.desc && <p className="text-sm text-brandInk/60 leading-relaxed">{mod.desc}</p>}
                {mod.items && (
                  <ul className="space-y-1.5 mt-2">
                    {mod.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-brandInk/70 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mod.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
