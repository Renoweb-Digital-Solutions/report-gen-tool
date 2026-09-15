'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScrollReveal } from '../home/ScrollReveal';
import { MagneticButton } from './MagneticButton';

export function CtaBanner({
  title,
  subtitle,
  buttonText = "Generate My Free Report",
  badge,
  secondaryButtonText,
  secondaryButtonHref
}) {
  const router = useRouter();

  const handleCtaClick = (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      // If there is an auth modal logic, typically it's handled at the page level.
      // But we can route to /login or append query param
      router.push('/?login=true');
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-transparent">
      <div className="max-w-[85rem] mx-auto px-6 relative z-10">
        <ScrollReveal className="relative mx-auto w-full bg-gradient-to-br from-sky-400 via-indigo-300 to-cyan-300 rounded-[3rem] overflow-hidden shadow-2xl pt-16 px-8 sm:px-16 border border-white/40">

          {/* Top Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16 relative z-20 text-white">
            <div className="lg:w-3/5 text-center lg:text-left">
              {badge && (
                <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  {badge}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight drop-shadow-sm">
                {title}
              </h2>
              {subtitle && (
                <p className="text-lg sm:text-xl text-white/90 font-medium drop-shadow-sm max-w-2xl mx-auto lg:mx-0">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="lg:w-2/5 flex flex-wrap justify-center lg:justify-end gap-4">
              <MagneticButton
                onClick={handleCtaClick}
                className="px-8 sm:px-10 py-4 bg-white text-brandDeep rounded-full text-base sm:text-lg font-extrabold shadow-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-3"
              >
                <span>{buttonText}</span>
                <ArrowRight size={20} />
              </MagneticButton>
              {secondaryButtonText && secondaryButtonHref && (
                <a
                  href={secondaryButtonHref}
                  className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-full text-base sm:text-lg font-extrabold backdrop-blur-md transition-all inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {secondaryButtonText}
                </a>
              )}
            </div>
          </div>

          {/* Dashboard Mockups Canvas */}
          <div className="relative w-full max-w-5xl mx-auto h-[250px] sm:h-[350px] md:h-[450px] mt-0">
            {/* Desktop View */}
            <div className="absolute top-0 left-0 right-0 aspect-[16/9] w-full rounded-t-3xl overflow-hidden border-t-8 border-l-8 border-r-8 border-white shadow-2xl bg-white z-10 hidden sm:block">
              <Image
                src="/dashboard.png"
                alt="Desktop Dashboard"
                fill
                className="object-contain object-top opacity-100"
              />
            </div>

            {/* Mobile View only (shown when screen is small) */}
            <div className="absolute top-0 left-0 right-0 aspect-[9/19] w-full max-w-[300px] mx-auto rounded-t-3xl overflow-hidden border-t-8 border-l-8 border-r-8 border-white shadow-2xl bg-white z-10 sm:hidden">
              <Image
                src="/dashboard_mob.png"
                alt="Mobile Dashboard"
                fill
                className="object-cover object-top opacity-100"
              />
            </div>

            {/* Mobile View Overlap (Shown on Desktop over the desktop view) */}
            <div className="absolute right-0 md:-right-4 lg:right-10 top-16 md:top-24 w-[200px] lg:w-[260px] h-[450px] lg:h-[550px] rounded-[2.5rem] border-[8px] border-white shadow-[0_0_50px_rgba(0,0,0,0.2)] z-20 overflow-hidden hidden sm:block bg-white">
              <Image
                src="/dashboard_mob.png"
                alt="Mobile Dashboard"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
