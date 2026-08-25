'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Script from 'next/script';

const FAQS = [
  {
    q: "Is Flawdits a free digital audit tool?",
    a: "Yes you can generate a free digital audit tool report with no credit card required, and upgrade when you need higher usage limits or white label branding."
  },
  {
    q: "Can agencies white label the reports?",
    a: "Yes. Flawdits is built as digital marketing audit software for agencies, so branded, white-labeled PDF exports are a core part of the product, not an add-on."
  },
  {
    q: "What's included in the digital presence audit tool?",
    a: "Website SEO, Google Business Profile, Instagram, LinkedIn, visual brand consistency and AI search visibility either individually or combined into one Full Report."
  },
  {
    q: "Does Flawdits check AI search visibility too?",
    a: "Yes. Alongside traditional SEO, Flawdits includes an AI visibility audit tool that scores how discoverable a brand is in ChatGPT and other AI-powered search experiences."
  },
  {
    q: "Why not just ask a general AI assistant to analyze my competitors?",
    a: "A general AI assistant answers whatever you ask, but it doesn't know what a healthy engagement rate or content mix looks like for your specific competitors unless it's told and it has no built-in access to Instagram, LinkedIn or Google Business Profile data. Flawdits runs a structured audit framework across those surfaces automatically, so you get a directed report instead of a blank chat box."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      {FAQS.map((faq, idx) => (
        <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brandBlue/20 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">
          <button 
            className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-brandInk text-base md:text-lg focus:outline-none"
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
          >
            <span className="pr-8">{faq.q}</span>
            <motion.div
              animate={{ rotate: openIndex === idx ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "anticipate" }}
              className="text-brandBlue shrink-0"
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="px-6 pb-6 text-brandInk/70 text-sm md:text-base leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
