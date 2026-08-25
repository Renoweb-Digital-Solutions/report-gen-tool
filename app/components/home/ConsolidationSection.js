'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TextReveal } from './TextReveal';

export function ConsolidationSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  const tools = [
    { color: '#308fef', x: -80, y: -80, delay: 0.1 },
    { color: '#4460ef', x: 80, y: -60, delay: 0.2 },
    { color: '#4ec8ef', x: -60, y: 80, delay: 0.3 },
    { color: '#ffc857', x: 60, y: 70, delay: 0.4 },
    { color: '#9d4edd', x: 0, y: -100, delay: 0.5 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
      {/* Left Column: Typography Hierarchy */}
      <div className="text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-block text-xs font-bold uppercase tracking-widest text-brandCyan mb-4">
            A Website & Social Media Audit Tool in One Dashboard
          </div>
        </motion.div>
        
        <TextReveal 
          as="h2" 
          text="One Digital Audit Report Generator, Every Channel" 
          className="text-3xl md:text-4xl font-extrabold text-brandDeep mb-6 leading-tight"
          style={{ justifyContent: 'flex-start' }} 
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-lg text-brandInk/70 leading-relaxed mb-6">
            At its core, Flawdits is a digital audit report generator that pulls website, social and brand data into a single document instead of five separate tools. 
          </p>
          <p className="text-base text-brandInk/60 leading-relaxed">
            Run the Full Report for an all-in-one digital presence report covering every module at once, or launch any of the six audit modules on their own. You're not toggling between separate platforms to answer one simple question: is this brand's digital presence actually working?
          </p>
        </motion.div>
      </div>

      {/* Right Column: Visual Anchor */}
      <div ref={containerRef} className="relative h-96 flex items-center justify-center">
        
        {/* Radial glow */}
        <div className="absolute w-72 h-72 bg-radial from-brandCyan/20 to-transparent rounded-full pointer-events-none" />

        {/* Central Report Document */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="relative z-10 w-32 h-44 bg-white rounded-2xl shadow-card-hover border border-brandDeep/10 flex flex-col p-5 gap-3"
        >
          <div className="w-14 h-1.5 bg-gradient-to-r from-brandDeep to-brandCyan rounded-full" />
          <div className="w-20 h-1 bg-brandInk/10 rounded-full" />
          <div className="w-12 h-1 bg-brandInk/10 rounded-full" />
          
          <div className="mt-auto self-center w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-lg">
            A+
          </div>
        </motion.div>

        {/* Flying Tool Icons */}
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ x: tool.x, y: tool.y, scale: 0, opacity: 0 }}
            animate={isInView ? { x: 0, y: 0, scale: 0.5, opacity: 0 } : { x: tool.x, y: tool.y, scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: tool.delay, ease: "easeInOut" }}
            className="absolute w-16 h-16 rounded-2xl flex items-center justify-center shadow-md z-0"
            style={{
              backgroundColor: `${tool.color}15`,
              border: `1px solid ${tool.color}30`,
            }}
          >
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: tool.color }} />
          </motion.div>
        ))}

      </div>
    </div>
  );
}
