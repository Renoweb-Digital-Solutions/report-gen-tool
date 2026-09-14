'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, HelpCircle, Search, Layers, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

import AuthModal from '../AuthModal';
import { MagneticButton } from '../ui/MagneticButton';
import { TextReveal } from '../home/TextReveal';
import { ScrollReveal } from '../home/ScrollReveal';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

export default function FaqClient() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCtaClick = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const FAQ_CATEGORIES = [
    {
      category: "General FAQ",
      faqs: [
        {
          q: "What data sources does Flawdits use?",
          a: "Flawdits cross-references authority and traffic data, technical site scans, Instagram and LinkedIn post data, Google Business Profile listings, and AI search citation signals."
        },
        {
          q: "Can agencies white label the report?",
          a: "Yes, white-label branding (your logo and colors in place of Flawdits') is available starting on the Agency plan."
        },
        {
          q: "How accurate is the AI visibility score?",
          a: "The AI Visibility Score is based on tracked mentions and citations across AI-powered search and chat platforms; like any visibility metric, it reflects a point-in-time snapshot rather than a guarantee."
        },
        {
          q: "Can I audit Instagram and LinkedIn together?",
          a: "Yes, run them individually, or include both automatically as part of the Full Report."
        },
        {
          q: "How Does Flawdits Work?",
          a: "You choose a module Full Report, Website Anatomy, GMB, Instagram, LinkedIn, Visual Brand Match or AI Visibility enter the relevant website or handle, and generate a graded PDF report in minutes. See the How It Works page for the full walkthrough."
        },
        {
          q: "Is Flawdits Free to Use?",
          a: "Yes, on a limited basis. The free tier covers a set number of reports per month with no credit card required; paid plans raise those limits and unlock white-label branding."
        }
      ]
    },
    {
      category: "Website Anatomy FAQ",
      faqs: [
        {
          q: "Does the Website Anatomy audit check Core Web Vitals?",
          a: "Yes, Core Web Vitals are scored as part of every Website Anatomy run, alongside technical SEO and backlink health checks."
        },
        {
          q: "Can I re-run a Website Anatomy audit after fixing issues?",
          a: "Yes, run it again any time; each run produces a fresh graded report so you can track improvement over time."
        }
      ]
    },
    {
      category: "GMB Audit FAQ",
      faqs: [
        {
          q: "What does the GMB Audit check besides listing completeness?",
          a: "It also reviews local visibility signals and returns a priority list ranking which fixes matter most for local search."
        },
        {
          q: "Does the GMB Audit work for multi-location businesses?",
          a: "Run it once per location, since the audit is scoped to a single Google Business Profile listing at a time."
        }
      ]
    },
    {
      category: "Instagram Audit FAQ",
      faqs: [
        {
          q: "What counts as \"engagement\" in the Instagram Audit?",
          a: "Likes, comments, and saves relative to follower count and posting frequency, benchmarked against consistent-posting norms."
        },
        {
          q: "Can the Instagram Audit run without follower count being public?",
          a: "Yes, engagement can still be assessed from reactions on individual posts even when follower data isn't visible."
        }
      ]
    },
    {
      category: "LinkedIn Audit FAQ",
      faqs: [
        {
          q: "Does the LinkedIn Audit work for pages with irregular posting?",
          a: "Yes, it specifically flags irregular or bursty posting patterns rather than requiring a steady cadence to run."
        },
        {
          q: "What's the ideal posting frequency the LinkedIn Audit benchmarks against?",
          a: "Roughly two posts per week, with a 3–4 day gap, is the consistency benchmark used in the report."
        }
      ]
    },
    {
      category: "LinkedIn Personal Audit FAQ",
      faqs: [
        {
          q: "Can I use the Personal Audit on my own founder profile?",
          a: "Yes, enter your own profile URL the same way you would a client's or a company page."
        },
        {
          q: "Does the Personal Audit compare me against company-page benchmarks?",
          a: "It uses the same funnel and consistency benchmarks as the company page audit, since the underlying content-quality signals are the same."
        }
      ]
    },
    {
      category: "Visual Brand Match FAQ",
      faqs: [
        {
          q: "What assets does Visual Brand Match compare?",
          a: "It compares a website's visual identity against Instagram (and other connected social) visuals for color palette and typography consistency."
        },
        {
          q: "Can Visual Brand Match be used mid-rebrand?",
          a: "Yes, it's commonly run before and after a rebrand to confirm the new identity is actually consistent across channels."
        }
      ]
    },
    {
      category: "AI Visibility Audit FAQ",
      faqs: [
        {
          q: "Which AI platforms does the AI Visibility Audit track?",
          a: "It tracks brand mentions and citations across ChatGPT and other AI-powered search and chat platforms."
        },
        {
          q: "How often should I re-run the AI Visibility Audit?",
          a: "Since AI search citations shift over time, a monthly or quarterly re-run gives the clearest trend rather than a single snapshot."
        }
      ]
    },
    {
      category: "Customer Support FAQs",
      faqs: [
        {
          q: "How do I contact support if a report fails to generate?",
          a: "Use the Contact Us link or the support button in the footer. Include all details with a screenshot and submit a ticket; the team will get in touch with you shortly."
        },
        {
          q: "Can I cancel or downgrade my plan at any time?",
          a: "Yes, plans can be changed or cancelled from account billing settings, and changes take effect at the next billing cycle."
        },
        {
          q: "Do you offer refunds?",
          a: "Reach out to support with your account details, and the team will review refund requests case by case."
        },
        {
          q: "Is my audited data shared with anyone else?",
          a: "No, audit inputs and generated reports are tied to your account and aren't shared with other users or third parties."
        },
        {
          q: "What happens to my reports if I downgrade to the free plan?",
          a: "Previously generated reports remain accessible; the free plan simply limits how many new reports you can generate per month."
        }
      ]
    }
  ];

  const filteredCategories = FAQ_CATEGORIES.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.faqs.length > 0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_CATEGORIES.flatMap(cat => cat.faqs).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-brandInk font-sans overflow-x-hidden">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}
      <Script id="faq-page-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-brandAmber/20 to-amber-300/30 text-brandDark border border-brandAmber/40 text-xs font-bold shadow-sm">
              Answers & Assistance
            </span>
          </motion.div>

          <TextReveal
            as="h1"
            text="Flawdits FAQ"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brandDeep tracking-tight mb-6"
          />

          <p className="text-lg sm:text-xl text-brandInk/70 leading-relaxed max-w-2xl mx-auto mb-8">
            This digital audit tool FAQ answers the questions that come up most before signup — how it works, what it costs, and how accurate the data is.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative mb-8">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brandInk/40" />
            <input
              type="text"
              placeholder="Search questions (e.g. data sources, white label, accuracy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-brandDeep/15 shadow-sm text-sm text-brandInk focus:outline-none focus:border-brandDeep focus:ring-2 focus:ring-brandDeep/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* CONTENT BLOCKS GRID */}
      <section className="py-16 bg-white border-y border-brandDeep/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">
            
            {/* Block 1 */}
            <ScrollReveal className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-8 sm:p-10 rounded-3xl border border-brandDeep/10 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brandDeep/10 text-brandDeep flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h2 className="text-2xl font-extrabold text-brandDeep mb-4">How Does Flawdits Work?</h2>
              <p className="text-sm text-brandInk/70 leading-relaxed">
                You choose a module — Full Report, Website Anatomy, GMB, Instagram, LinkedIn, Visual Brand Match or AI Visibility — enter the relevant website or handle, and generate a graded PDF report in minutes. See the How It Works page for the full walkthrough.
              </p>
            </ScrollReveal>

            {/* Block 2 */}
            <ScrollReveal delay={0.1} className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-8 sm:p-10 rounded-3xl border border-brandDeep/10 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brandIndigo/10 text-brandIndigo flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-extrabold text-brandDeep mb-4">Is Flawdits Free to Use?</h2>
              <p className="text-sm text-brandInk/70 leading-relaxed">
                Yes, on a limited basis. The free tier covers a set number of reports per month with no credit card required; paid plans raise those limits and unlock white label branding.
              </p>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-24 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brandDeep mb-4">Frequently Asked Questions</h2>
            <p className="text-base text-brandInk/60">Everything you need to know about Flawdits reports, data accuracy, and agency features.</p>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto space-y-12">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-brandDeep pb-2 border-b border-brandDeep/10">{cat.category}</h3>
                  <div className="space-y-4">
                    {cat.faqs.map((faq, idx) => {
                      const absoluteIdx = `${catIdx}-${idx}`;
                      return (
                        <div key={idx} className="bg-white rounded-2xl border border-brandBlue/20 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">
                          <button 
                            className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-brandInk text-base md:text-lg focus:outline-none"
                            onClick={() => setOpenFaqIndex(openFaqIndex === absoluteIdx ? null : absoluteIdx)}
                          >
                            <span className="pr-8">{faq.q}</span>
                            <motion.div
                              animate={{ rotate: openFaqIndex === absoluteIdx ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: "anticipate" }}
                              className="text-brandBlue shrink-0"
                            >
                              <ChevronDown size={20} />
                            </motion.div>
                          </button>
                          <AnimatePresence initial={false}>
                            {openFaqIndex === absoluteIdx && (
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
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-brandInk/10 text-brandInk/60">
                No matching questions found. Try a different search term!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-20 bg-gradient-to-br from-brandDark to-brandDeep text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Still have questions?
            </h2>
            
            <p className="text-base sm:text-lg text-white/70 mb-8 max-w-xl mx-auto">
              Our team is here to help you get the most out of Flawdits report suite.
            </p>

            <MagneticButton onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-brandAmber to-amber-400 text-brandDark rounded-full text-base font-bold shadow-glow-amber hover:shadow-2xl transition-all inline-flex items-center gap-3">
              <span>Contact Us</span>
              <ArrowRight size={18} />
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
