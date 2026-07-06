'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Globe, MapPin, Briefcase, Palette, Search, CheckCircle2 } from 'lucide-react';

const LOG_MESSAGES = {
  instagram: [
    "Breaching the Instagram mainframe...",
    "Decoding your grid's visual aesthetic...",
    "Measuring the true weight of your followers...",
    "Quantifying vibe metrics per post...",
    "Judging your posting consistency (no offense)...",
    "Sniffing out ghost followers...",
    "Summoning the algorithm spirits..."
  ],
  website: [
    "Initiating deep-sea crawl of your homepage...",
    "Poking your server to see how fast it wakes up...",
    "Interrogating meta tags for SEO secrets...",
    "Stretching layouts for mobile responsiveness...",
    "Hunting down rogue 404 error pages...",
    "Weighing your Core Web Vitals...",
    "Brewing your final technical score..."
  ],
  gmb: [
    "Triangulating your local search coordinates...",
    "Spying on the neighborhood competitors...",
    "Reading reviews (the good, the bad, the ugly)...",
    "Cross-referencing category relevance...",
    "Checking if your photos actually look good...",
    "Calculating local pack dominance..."
  ],
  linkedin: [
    "Adjusting our virtual tie for LinkedIn...",
    "Scanning thought-leadership density...",
    "Measuring corporate engagement synergy...",
    "Evaluating posting cadence and pulse...",
    "Assembling B2B dominance report..."
  ],
  visual: [
    "Extracting exact hex codes from the ether...",
    "Comparing website vibes to Instagram mood...",
    "Detecting rogue fonts and typography crimes...",
    "Scanning for logo placement consistency...",
    "Calculating total aesthetic harmony..."
  ],
  full: [
    "Initiating omni-channel master scan...",
    "Unleashing the SEO hounds...",
    "Scraping social metrics across the board...",
    "Cross-examining brand visual alignment...",
    "Crunching terabytes of aesthetic data...",
    "Polishing your golden report..."
  ]
};

const MODULE_TITLES = {
  instagram: "ANALYZING INSTAGRAM PROFILE",
  website: "ANALYZING WEBSITE ANATOMY",
  gmb: "ANALYZING GOOGLE BUSINESS PROFILE",
  linkedin: "ANALYZING LINKEDIN COMPANY PAGE",
  visual: "ANALYZING VISUAL BRAND MATCH",
  full: "RUNNING FULL AUDIT"
};

// ── Micro Visuals ──

const InstagramVisual = () => (
  <div className="micro-visual-grid">
    {[0, 1, 2, 3].map(i => (
      <motion.div 
        key={i} 
        className="micro-grid-item"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

const WebsiteVisual = () => (
  <div className="micro-visual-bars">
    {[1, 2, 3, 4, 5].map(i => (
      <motion.div 
        key={i} 
        className="micro-bar-item"
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const GMBVisual = () => (
  <div className="micro-visual-stars">
    {[1, 2, 3, 4, 5].map(i => (
      <motion.div 
        key={i} 
        className="micro-star"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
      >
        ★
      </motion.div>
    ))}
  </div>
);

const LinkedInVisual = () => (
  <div className="micro-visual-progress">
    <motion.div 
      className="micro-progress-fill"
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const VisualBrandVisual = () => (
  <div className="micro-visual-swatches">
    {['#023dbb', '#4460ef', '#308fef', '#4ec8ef', '#ffc857'].map((color, i) => (
      <motion.div 
        key={color} 
        className="micro-swatch"
        style={{ backgroundColor: color }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const FullAuditVisual = () => (
  <div className="micro-visual-search">
    <motion.div 
      className="micro-search-dot"
      animate={{ x: [0, 20, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const getMicroVisual = (type) => {
  switch (type) {
    case 'instagram': return <InstagramVisual />;
    case 'website': return <WebsiteVisual />;
    case 'gmb': return <GMBVisual />;
    case 'linkedin': return <LinkedInVisual />;
    case 'visual': return <VisualBrandVisual />;
    default: return <FullAuditVisual />;
  }
};

const getIcon = (type) => {
  switch (type) {
    case 'instagram': return <Camera size={18} />;
    case 'website': return <Globe size={18} />;
    case 'gmb': return <MapPin size={18} />;
    case 'linkedin': return <Briefcase size={18} />;
    case 'visual': return <Palette size={18} />;
    default: return <Search size={18} />;
  }
}

// ── Main Component ──

export default function ScanCardLoader({ type = 'full' }) {
  const messages = LOG_MESSAGES[type] || LOG_MESSAGES.full;
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return 0; // loop
      });
    }, 2200);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="scan-loader-container">
      {/* Background Depth Blurs */}
      <div className="scan-bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      {/* Scan Line Overlay */}
      <div className="scan-line-overlay" />

      {/* Stacking Cards Area */}
      <div className="scan-stack-area">
        <AnimatePresence>
          {messages.map((msg, index) => {
            // Calculate stacking metrics
            const diff = activeMessageIndex - index;
            
            // Loop logic for diff if we rotated back to 0
            let adjustedDiff = diff;
            if (diff < 0 && activeMessageIndex === 0) {
                // When we wrap around to 0, older items have higher index.
                // We just let them unmount or slide down.
                // For simplicity, we just use standard diffing and hide future items.
            }

            // If it's a future card (hasn't been reached yet), don't render it
            if (index > activeMessageIndex && activeMessageIndex !== 0) return null;
            if (index > 0 && activeMessageIndex === 0) return null; // First load

            // Only show up to 3 cards behind
            if (adjustedDiff > 3) return null;

            // Is it the active card?
            const isActive = adjustedDiff === 0;

            return (
              <motion.div
                key={`${msg}-${index}`}
                className={`scan-card ${isActive ? 'active' : 'inactive'}`}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ 
                  opacity: isActive ? 1 : 1 - (adjustedDiff * 0.25), 
                  y: -adjustedDiff * 12, 
                  scale: 1 - (adjustedDiff * 0.05),
                  zIndex: 10 - adjustedDiff
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="scan-card-left">
                  <div className={`scan-card-icon ${isActive ? 'active-icon' : ''}`}>
                    {isActive ? getIcon(type) : <CheckCircle2 size={16} className="text-cyan" />}
                  </div>
                  <div className="scan-card-text">{msg}</div>
                </div>

                <div className="scan-card-right">
                  {isActive ? getMicroVisual(type) : <div className="micro-visual-done" />}
                </div>
                
                {/* Cyan flash on completion */}
                {!isActive && adjustedDiff === 1 && (
                  <motion.div 
                    className="scan-card-flash" 
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progress Footer */}
      <div className="scan-footer">
        <div className="scan-module-title">
          {MODULE_TITLES[type]}
        </div>
        <div className="scan-progress-track">
          <motion.div 
            className="scan-progress-fill"
            animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
