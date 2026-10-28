'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Display estimates use dashboard-loaded rules only; this component never quotes
// or supplies prices to billing. Form validation/disabled behavior stays intact.
import { useCreditEstimate } from '@/app/features/credits/pricing/PricingProvider';
import priceStyles from '@/app/features/credits/pricing/PriceLabel.module.css';

const LOADING_PHRASES = [
  "Analyzing...",
  "Almost there...",
  "Finishing up..."
];

/** Render the existing audit action with an optional locally computed credit hint. */
export default function AnimatedSubmitButton({ loading, disabled, defaultText = "Generate Report", pricingModule, pricingInput }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const price = useCreditEstimate(pricingModule, pricingInput);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
      }, 3000);
    } else {
      setPhraseIndex(0);
    }
    // Stable action metadata lets AnalyticsProvider observe clicks without labels or values.
  return () => clearInterval(interval);
  }, [loading]);

  return (
    <button
      data-analytics-control="generate"
      type="submit"
      className={`animated-submit-btn ${loading ? 'loading' : ''}`}
      disabled={disabled || loading}
      style={{
        cursor: loading ? 'wait' : disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {/* Background gradient shimmer effect */}
      {loading && (
        <div className="btn-shimmer-bg"></div>
      )}

      <span className="btn-content-wrapper">
        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`btn-inner-content ${priceStyles.content}`}
            >
              <span className={priceStyles.action}>
                <Sparkles size={18} strokeWidth={2.5} />
                {defaultText}
              </span>
              {/* The title explains display-only estimates without introducing
                  internal billing steps into the product's normal action flow. */}
              {price && <span className={priceStyles.price} title={price.title}>{price.label}</span>}
            </motion.div>
          ) : (
            <motion.div
              key={phraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="btn-inner-content"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Sparkles size={18} strokeWidth={2.5} />
              </motion.div>
              {LOADING_PHRASES[phraseIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
