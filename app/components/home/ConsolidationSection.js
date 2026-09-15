'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Camera, MapPin, Briefcase } from 'lucide-react';
import { TextReveal } from './TextReveal';

export function ConsolidationSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-16 lg:p-20 shadow-sm relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brandCyan/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brandDeep/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Column: Typography Hierarchy */}
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-brandDeep bg-brandDeep/5 px-4 py-1.5 rounded-full mb-8 border border-brandDeep/10">
              A Website & Social Media Audit Tool in One Dashboard
            </div>
          </motion.div>
          
          <TextReveal 
            as="h2" 
            text="One Digital Audit Report Generator, Every Channel" 
            className="text-4xl md:text-5xl font-extrabold text-brandInk mb-8 tracking-tight leading-tight"
            style={{ justifyContent: 'flex-start' }} 
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <p className="text-lg text-brandInk/70 font-medium leading-relaxed">
              At its core, Flawdits is a digital audit report generator that pulls website, social and brand data into a single document instead of five separate tools. 
            </p>
            <p className="text-base text-brandInk/60 leading-relaxed">
              Run the Full Report for an all-in-one digital presence report covering every module at once, or launch any of the six audit modules on their own. You're not toggling between separate platforms to answer one simple question: is this brand's digital presence actually working?
            </p>
          </motion.div>
        </div>

        {/* Right Column: ClickUp Style Feature Pills */}
        <div ref={containerRef} className="flex flex-col gap-4 relative">
          {[
            { icon: Globe, color: '#308fef', title: 'Website Anatomy', subtitle: 'Technical SEO & Performance' },
            { icon: MapPin, color: '#4460ef', title: 'Google Business', subtitle: 'Local search footprint' },
            { icon: Camera, color: '#4ec8ef', title: 'Instagram Audit', subtitle: 'Engagement & content mix' },
            { icon: Briefcase, color: '#023dbb', title: 'LinkedIn Audit', subtitle: 'Company & personal profiles' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1), ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-brandDeep/20 transition-all group"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                <item.icon size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-brandInk tracking-tight">{item.title}</h4>
                <p className="text-sm text-brandInk/50 font-medium">{item.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
