'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Globe,
  MapPin,
  Camera,
  Briefcase,
  Palette,
  LayoutGrid,
  PenLine,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { WaitlistHero } from './components/ui/waitlist-hero';

// ── Feature cards data ──
const FEATURES = [
  {
    icon: <BarChart3 size={24} />,
    title: 'Full Report',
    desc: 'Comprehensive all-in-one digital audit covering SEO, social media, and brand consistency in a single report.',
    color: '#023dbb',
    bg: 'rgba(2, 61, 187, 0.07)',
  },
  {
    icon: <Globe size={24} />,
    title: 'Website Anatomy',
    desc: 'Deep-dive into site performance, keyword rankings, Core Web Vitals, and page health checks.',
    color: '#308fef',
    bg: 'rgba(48, 143, 239, 0.07)',
  },
  {
    icon: <MapPin size={24} />,
    title: 'GMB Audit',
    desc: 'Analyze your Google Business Profile listing, review quality, and local search presence.',
    color: '#4460ef',
    bg: 'rgba(68, 96, 239, 0.07)',
  },
  {
    icon: <Camera size={24} />,
    title: 'Instagram Audit',
    desc: 'Evaluate content performance, engagement rates, and strategic post-by-post insights.',
    color: '#4ec8ef',
    bg: 'rgba(78, 200, 239, 0.1)',
  },
  {
    icon: <Briefcase size={24} />,
    title: 'LinkedIn Audit',
    desc: 'Review your company page content strategy, engagement metrics, and professional authority.',
    color: '#023dbb',
    bg: 'rgba(2, 61, 187, 0.07)',
  },
  {
    icon: <Palette size={24} />,
    title: 'Visual Brand Match',
    desc: 'Check color consistency and visual identity alignment across all your web and social channels.',
    color: '#ffc857',
    bg: 'rgba(255, 200, 87, 0.12)',
  },
];

// ── How it works steps ──
const STEPS = [
  {
    icon: <LayoutGrid size={28} />,
    title: 'Choose Your Module',
    desc: 'Select from six specialized audit modules tailored to different aspects of your digital presence.',
  },
  {
    icon: <PenLine size={28} />,
    title: 'Enter Your Details',
    desc: 'Fill in your website URL, social handles, and business keywords. It takes less than a minute.',
  },
  {
    icon: <Sparkles size={28} />,
    title: 'Get Your Report',
    desc: 'Receive a comprehensive, beautifully formatted audit report you can download as PDF instantly.',
  },
];

// ── Landing Page ──

export default function LandingPage() {
  // Scroll-triggered reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ════════════════════════════════════════════
          NAVIGATION
          ════════════════════════════════════════════ */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link href="/" className="landing-nav-logo">
            <Image
              src="/logo.png"
              alt="Renoweb"
              width={120}
              height={28}
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              priority
            />
          </Link>

          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
          </div>

          <Link href="/dashboard" className="landing-nav-cta">
            Get Started
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════ */}
      <WaitlistHero />

      {/* ════════════════════════════════════════════
          FEATURES
          ════════════════════════════════════════════ */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="landing-section-header reveal">
            <span className="landing-badge">Features</span>
            <h2 className="landing-section-title">Everything You Need to Audit</h2>
            <p className="landing-section-subtitle">
              Six specialized modules to analyze every aspect of your digital presence
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                className={`feature-card reveal reveal-delay-${i + 1}`}
                key={f.title}
              >
                <div
                  className="feature-icon-wrap"
                  style={{ backgroundColor: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-arrow">
                  <ChevronRight size={16} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════════ */}
      <section id="how-it-works" className="landing-how">
        <div className="landing-container">
          <div className="landing-section-header reveal">
            <span className="landing-badge">How it Works</span>
            <h2 className="landing-section-title">Three Simple Steps</h2>
            <p className="landing-section-subtitle">
              From module selection to downloadable PDF — in minutes, not hours
            </p>
          </div>

          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className={`step-card reveal reveal-delay-${i + 1}`} key={i}>
                <div className="step-number">{i + 1}</div>
                <div className="step-icon-wrap">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════ */}
      <section className="landing-final-cta reveal">
        <div className="landing-container">
          <h2>Ready to Audit Your Digital Presence?</h2>
          <p>
            Get comprehensive insights about your website, social media, and brand
            identity in minutes.
          </p>
          <Link href="/dashboard" className="final-cta-btn">
            Start Your Free Audit
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════ */}
      <footer className="landing-footer">
        <div className="landing-container">
          <Image
            src="/logo.png"
            alt="Renoweb"
            width={100}
            height={24}
            style={{ height: '24px', width: 'auto', objectFit: 'contain', opacity: 0.6 }}
          />
          <p className="landing-footer-brand">Digital Presence Report Suite</p>
          <p className="landing-footer-copy">© {new Date().getFullYear()} Renoweb. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
