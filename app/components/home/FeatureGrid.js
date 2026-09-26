'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, MapPin, Camera, Briefcase, Palette, Sparkles, Users, TrendingUp, ArrowUpRight, MonitorSmartphone } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const MODULES = [
  { icon: Globe, title: 'Website Anatomy', desc: 'Technical SEO, Core Web Vitals, and backlink health.', color: '#308fef', url: '/website-anatomy', span: 'md:col-span-2 lg:col-span-2' },
  { icon: MapPin, title: 'GMB Audit', desc: 'Google Business Profile completeness and local visibility.', color: '#4460ef', url: '/gmb-audit', span: 'col-span-1' },
  { icon: Camera, title: 'Instagram Audit', desc: 'Engagement, posting consistency, and content funnel.', color: '#4ec8ef', url: '/instagram-audit', span: 'col-span-1' },
  { icon: Briefcase, title: 'LinkedIn Company', desc: 'Company page performance and thought leadership.', color: '#023dbb', url: '/linkedin-company-audit', span: 'md:col-span-2 lg:col-span-1' },
  { icon: Users, title: 'LinkedIn Personal', desc: 'Personal profile posts, engagement, and TOFU/MOFU/BOFU funnel mix.', color: '#10b981', url: '/linkedin-personal-audit', span: 'col-span-1' },
  { icon: Palette, title: 'Visual Brand Match', desc: 'Cross-platform brand consistency scoring.', color: '#ffc857', url: '/visual-brand-match', span: 'col-span-1' },
  { icon: Sparkles, title: 'AI Visibility Audit', desc: 'Brand discoverability in ChatGPT and AI search.', color: '#9d4edd', url: '/ai-visibility-audit', span: 'md:col-span-2 lg:col-span-1' },
  { icon: MonitorSmartphone, title: 'UI/UX Audit', desc: 'Design, UX & Core Metrics scoring.', color: '#f59e0b', url: '/ui-ux-audit', span: 'col-span-1' },
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
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "start 20%"]
  });

  // Animate width from 90% (compact pill) to 100% (full width)
  const width = useTransform(scrollYProgress, [0, 1], ["90%", "100%"]);
  // Animate border radius from rounded to square
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["40px", "0px"]);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center bg-white py-12 md:py-20">
      <motion.section 
        style={{ width, borderRadius }}
        className="bg-[#050914] relative border-t border-white/5 py-32 overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brandCyan/50 to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-6">
          <div id="features" className="w-full scroll-mt-24">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Nothing comes close to Flawdits</h2>
              <p className="text-lg text-white/50 font-medium max-w-2xl mx-auto">One platform. Every audit module you need.</p>
            </ScrollReveal>

            <ScrollReveal>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-10%" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {MODULES.map((mod, idx) => (
                  <motion.div key={idx} variants={itemVariants} className={mod.span}>
                    <Link href={mod.url} className="block h-full outline-none">
                      <div className="glass-dark bento-box rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
                        {/* Subtle inner hover glow */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                          style={{ background: `radial-gradient(circle at 80% 20%, ${mod.color} 0%, transparent 60%)` }}
                        />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10"
                              style={{ color: mod.color }}
                            >
                              <mod.icon size={20} />
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                              Module
                            </div>
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-[#050914] transition-all">
                            <ArrowUpRight size={16} />
                          </div>
                        </div>

                        <div className="mt-auto relative z-10">
                          <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                            {mod.title}
                          </h3>
                          <p className="text-sm text-white/50 leading-relaxed font-medium">
                            {mod.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="mt-32">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-extrabold text-white tracking-tight mb-4">More Intelligence, Coming Soon</h3>
                <p className="text-base text-white/50 font-medium max-w-2xl mx-auto">Flawdits is expanding beyond competitive intelligence. Here's what's next on the roadmap.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {COMING_SOON.map((mod, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="glass-dark rounded-[2rem] p-6 relative group overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10"
                          style={{ color: mod.color }}
                        >
                          <mod.icon size={20} />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider">
                          Building
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight mb-3">{mod.title}</h4>
                      {mod.items && (
                        <ul className="space-y-2">
                          {mod.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-white/40 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: mod.color }} />
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
        </div>
      </motion.section>
    </div>
  );
}
