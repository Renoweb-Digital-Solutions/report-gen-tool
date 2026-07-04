'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Globe, Camera, Briefcase, MapPin, Palette, BarChart3 } from 'lucide-react';

export function WaitlistHero() {
  return (
    <section className="hero-section">
      {/* ── Rotating orbital background with perspective ── */}
      <div className="hero-perspective-layer" aria-hidden="true">
        {/* Outer ring - clockwise, slow */}
        <div className="hero-orbit hero-orbit--outer">
          <div className="hero-shape hero-shape--outer" />
        </div>
        {/* Middle ring - counter-clockwise */}
        <div className="hero-orbit hero-orbit--middle">
          <div className="hero-shape hero-shape--middle" />
        </div>
        {/* Inner ring - clockwise, faster */}
        <div className="hero-orbit hero-orbit--inner">
          <div className="hero-shape hero-shape--inner" />
        </div>
      </div>

      {/* ── Floating service icon badges ── */}
      <div className="hero-badges" aria-hidden="true">
        <div className="hero-badge hero-badge--1"><Globe size={22} strokeWidth={1.8} /></div>
        <div className="hero-badge hero-badge--2"><Camera size={22} strokeWidth={1.8} /></div>
        <div className="hero-badge hero-badge--3"><Briefcase size={22} strokeWidth={1.8} /></div>
        <div className="hero-badge hero-badge--4"><MapPin size={22} strokeWidth={1.8} /></div>
        <div className="hero-badge hero-badge--5"><Palette size={22} strokeWidth={1.8} /></div>
        <div className="hero-badge hero-badge--6"><BarChart3 size={22} strokeWidth={1.8} /></div>
      </div>

      {/* ── Gradient overlay to blend background into content area ── */}
      <div className="hero-gradient-overlay" />

      {/* ── Content ── */}
      <div className="hero-content">
        <div className="hero-logo-pill">
          <Image
            src="/logo.png"
            alt="Renoweb"
            width={120}
            height={28}
            style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
            priority
          />
        </div>

        <h1 className="hero-heading">
          Audit Your Complete<br />Digital Presence
        </h1>

        <p className="hero-description">
          SEO performance, social media engagement, Google Business Profile,
          and visual brand consistency — all in one comprehensive report.
        </p>

        <div className="hero-actions">
          <Link href="/dashboard" className="hero-cta">
            Start Your Audit
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <p className="hero-trust-line">Free to use · No credit card required</p>
        </div>
      </div>
    </section>
  );
}
