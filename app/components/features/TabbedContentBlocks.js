'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Layers, Layout, Target, Compass, Sparkles, Workflow, Fingerprint } from 'lucide-react';

const ICONS = [Target, Layers, Layout, Compass, Sparkles, Workflow, Fingerprint];

export default function TabbedContentBlocks({ blocks }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!blocks || blocks.length === 0) return null;

  const activeBlock = blocks[activeIndex];
  const paragraphs = activeBlock.body.split('\n\n').filter(p => p.trim() !== '');

  return (
    <section className="py-24 bg-white border-y border-brandDeep/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Tabs Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {blocks.map((block, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive ? 'text-brandDeep' : 'text-brandInk/60 hover:text-brandDeep hover:bg-slate-50 border border-transparent hover:border-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeContentTab"
                    className="absolute inset-0 border-2 border-brandCyan rounded-full bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{block.h2}</span>
              </button>
            );
          })}
        </div>

        {/* Content Container (ClickUp Style) */}
        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10"
            >
              
              {/* Left Side */}
              <div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brandDeep mb-12 tracking-tight leading-tight">
                  {activeBlock.h2}
                </h3>

                <button className="px-6 py-3.5 bg-brandDeep text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
                  Explore solution <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right Side Stacked Cards */}
              <div className="flex flex-col gap-4">
                {paragraphs.map((p, idx) => {
                  const Icon = ICONS[idx % ICONS.length];
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.1) }}
                      key={idx}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md hover:border-brandCyan/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-brandCyan/10 transition-colors">
                        <Icon size={18} className="text-brandBlue" />
                      </div>
                      <p className="text-sm font-medium text-brandInk/80 leading-relaxed mt-1">
                        {p}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
