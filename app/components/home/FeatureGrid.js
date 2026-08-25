'use client';
import { motion } from 'framer-motion';
import { Globe, MapPin, Camera, Briefcase, Palette, Sparkles, Users, TrendingUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const MODULES = [
  { icon: Globe, title: 'Website Anatomy', desc: 'Technical SEO, Core Web Vitals and backlink health.', color: '#308fef' },
  { icon: MapPin, title: 'GMB Audit', desc: 'Google Business Profile completeness and local visibility.', color: '#4460ef' },
  { icon: Camera, title: 'Instagram Audit', desc: 'Engagement, posting consistency and content funnel.', color: '#4ec8ef' },
  { icon: Briefcase, title: 'LinkedIn Audit', desc: 'Company page performance and thought leadership.', color: '#023dbb' },
  { icon: Palette, title: 'Visual Brand Match', desc: 'Cross-platform brand consistency scoring.', color: '#ffc857' },
  { icon: Sparkles, title: 'AI Visibility Audit', desc: 'Brand discoverability in ChatGPT and AI search.', color: '#9d4edd' },
];

const COMING_SOON = [
  { icon: Users, title: 'Audience Intelligence', desc: 'Understand who\'s actually engaging with a brand, not just how it scores.', color: '#10b981' },
  { icon: TrendingUp, title: 'Financial Intelligence', desc: 'See the financial signals behind a brand\'s digital presence.', color: '#f59e0b' },
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
    <div className="w-full">
      <ScrollReveal>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {MODULES.map((mod, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants} 
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(2, 61, 187, 0.15)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col relative bg-gradient-to-br from-white to-blue-50/50 border border-brandCyan/40 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300"
                style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                whileHover={{ scale: 1.15, rotate: idx % 2 === 0 ? 5 : -5 }}
              >
                <mod.icon size={24} />
              </motion.div>
              <h3 className="text-lg font-bold text-brandInk mb-3 group-hover:text-brandDeep transition-colors">{mod.title}</h3>
              <p className="text-sm text-brandInk/70 leading-relaxed">{mod.desc}</p>
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
                <p className="text-sm text-brandInk/60 leading-relaxed">{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
