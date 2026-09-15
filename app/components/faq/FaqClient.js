'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, Search, Layers, ShieldCheck, Play, Hexagon, Triangle, Circle, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

import AuthModal from '../AuthModal';
import { ScrollReveal } from '../home/ScrollReveal';
import { Navbar } from '../layout/Navbar';
import { FAQ_CATEGORIES } from '../../data/faqs';
import { Footer } from '../layout/Footer';

export default function FaqClient() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].category);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting entry
        const intersecting = entries.find(entry => entry.isIntersecting);
        if (intersecting) {
          setActiveCategory(intersecting.target.id);
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    FAQ_CATEGORIES.forEach((cat) => {
      const el = document.getElementById(cat.category);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // Offset for sticky navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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
    <div className="min-h-screen bg-white text-brandInk font-sans overflow-x-hidden selection:bg-brandCyan/20">
      {showAuthModal && <AuthModal onSuccess={() => router.push('/dashboard')} onClose={() => setShowAuthModal(false)} />}
      <Script id="faq-page-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 relative overflow-hidden bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-20"
          >
            <div className="text-[11px] font-bold text-brandDeep tracking-[0.2em] uppercase mb-4">
              Frequently Asked Questions
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-extrabold text-brandInk tracking-tight mb-6 leading-[1.1] whitespace-nowrap">
              Flawdits <br></br> <span className="text-brandInk/40">FAQs</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-lg mb-8">
              Get answers to common questions about Flawdits's digital audit reports, accuracy, platform advantages, pricing, and white-labeling features.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full h-[400px] lg:h-[550px] z-10"
          >
            {/* Soft Purple/Blue Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-400/40 via-indigo-400/40 to-purple-400/40 blur-[120px] rounded-full pointer-events-none" />

            {/* Dashboard Mockup - Soft Blurred Mask */}
            <div
              className="absolute left-0 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 w-[140%] h-[100%] hidden sm:block pointer-events-none"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at 20% 50%, black 40%, transparent 80%)',
                maskImage: 'radial-gradient(ellipse at 20% 50%, black 40%, transparent 80%)'
              }}
            >
              <Image
                src="/dashboard.png"
                alt="Dashboard Preview"
                fill
                className="object-cover object-left-top opacity-100"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* RETAINED "HOW IT WORKS" BLOCKS - STYLED CLEAN & MINIMAL */}
      <section className="py-20 bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 text-brandDeep flex items-center justify-center mb-6">
                <Layers size={22} />
              </div>
              <h2 className="text-2xl font-bold text-brandInk mb-4 tracking-tight">How Does Flawdits Work?</h2>
              <p className="text-base text-gray-500 leading-relaxed">
                You choose a module — Full Report, Website Anatomy, GMB, Instagram, LinkedIn, Visual Brand Match or AI Visibility — enter the relevant website or handle, and generate a graded PDF report in minutes. See the How It Works page for the full walkthrough.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 text-brandDeep flex items-center justify-center mb-6">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-2xl font-bold text-brandInk mb-4 tracking-tight">Is Flawdits Free to Use?</h2>
              <p className="text-base text-gray-500 leading-relaxed">
                Yes, on a limited basis. The free tier covers a set number of reports per month with no credit card required; paid plans raise those limits and unlock white label branding.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TWO-COLUMN MAIN FAQ SECTION */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">

            {/* LEFT SIDEBAR (STICKY) */}
            <aside className="sticky top-28 hidden lg:block">
              {/* Search */}
              <div className="relative mb-10">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent text-sm text-brandInk focus:outline-none focus:bg-white focus:border-brandDeep/20 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1 border-l-2 border-gray-100 pl-4">
                {FAQ_CATEGORIES.map((cat, idx) => {
                  const isActive = activeCategory === cat.category;
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToCategory(cat.category)}
                      className={`text-left text-sm py-2.5 font-medium transition-colors ${isActive ? 'text-brandDeep' : 'text-gray-500 hover:text-brandInk'
                        }`}
                      style={{
                        marginLeft: '-18px',
                        paddingLeft: '16px',
                        borderLeft: isActive ? '2px solid var(--color-deep-blue)' : '2px solid transparent'
                      }}
                    >
                      {cat.category}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* RIGHT CONTENT (ACCORDIONS) */}
            <div className="space-y-24">
              {/* Mobile Search (visible only on small screens) */}
              <div className="relative lg:hidden mb-8">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brandDeep/20"
                />
              </div>

              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat, catIdx) => (
                  <div key={catIdx} id={cat.category} className="scroll-mt-28">
                    <h2 className="text-[2rem] font-bold text-brandInk mb-8 tracking-tight">{cat.category}</h2>
                    <div className="space-y-0">
                      {cat.faqs.map((faq, idx) => {
                        const absoluteIdx = `${catIdx}-${idx}`;
                        const isOpen = openFaqIndex === absoluteIdx;
                        return (
                          <div key={idx} className="border-b border-gray-200">
                            <button
                              onClick={() => setOpenFaqIndex(isOpen ? null : absoluteIdx)}
                              className="w-full text-left py-6 flex items-center justify-between group focus:outline-none"
                            >
                              <span className={`text-base pr-8 transition-colors ${isOpen ? 'font-bold text-brandDeep' : 'font-medium text-gray-700 group-hover:text-brandInk'}`}>
                                {faq.q}
                              </span>
                              <ChevronDown
                                size={18}
                                className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brandDeep' : ''}`}
                              />
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pb-6 text-gray-600 leading-relaxed text-sm pr-12">
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
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-brandInk mb-2">No results found</h3>
                  <p className="text-gray-500">We couldn't find any questions matching "{searchQuery}".</p>
                  <button onClick={() => setSearchQuery('')} className="mt-6 text-brandDeep font-medium text-sm hover:underline">
                    Clear search
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
