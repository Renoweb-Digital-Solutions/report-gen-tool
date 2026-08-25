'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ConvergenceSequence() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  
  const iconsRef = useRef([]);
  iconsRef.current = [];
  const addToRefs = (el) => {
    if (el && !iconsRef.current.includes(el)) {
      iconsRef.current.push(el);
    }
  };

  const centerIconRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 20%",
          end: "+=1500",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Initially fade in the scattered icons
      tl.fromTo(iconsRef.current, 
        { scale: 0, opacity: 0, rotation: () => Math.random() * 90 - 45 },
        { scale: 1, opacity: 1, rotation: 0, stagger: 0.1, duration: 1, ease: "back.out(1.5)" }
      );

      // Move them all to center
      tl.to(iconsRef.current, {
        x: 0, y: 0, 
        scale: 0.5,
        opacity: 0,
        duration: 2,
        ease: "power2.inOut"
      }, "+=0.5");

      // Fade in the final report icon
      tl.fromTo(centerIconRef.current,
        { scale: 0.5, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" },
        "-=1"
      );
      
      // Scale up the final text
      tl.fromTo(".convergence-text",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  // Pre-calculate positions to spread them out
  const positions = [
    { x: -200, y: -150, color: '#308fef' },
    { x: 200, y: -100, color: '#4460ef' },
    { x: -150, y: 150, color: '#4ec8ef' },
    { x: 180, y: 120, color: '#ffc857' },
    { x: 0, y: -200, color: '#9d4edd' }
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', backgroundColor: 'white', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={triggerRef} style={{ width: '100%', maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '600px' }}>
        
        {/* Scattered Icons */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {positions.map((pos, i) => (
            <div 
              key={i}
              ref={addToRefs}
              style={{ 
                position: 'absolute',
                width: '64px', height: '64px',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: `${pos.color}15`, 
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                border: `1px solid ${pos.color}30`
              }}
            >
              <div style={{ width: '24px', height: '24px', backgroundColor: pos.color, borderRadius: '50%' }} />
            </div>
          ))}
        </div>

        {/* Center Report Icon */}
        <div 
          ref={centerIconRef}
          style={{ 
            position: 'relative', zIndex: 10,
            width: '96px', height: '128px',
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(2,61,187,0.15)',
            border: '1px solid rgba(2,61,187,0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
            padding: '16px', opacity: 0
          }}
        >
          <div style={{ width: '48px', height: '4px', background: 'linear-gradient(to right, #023dbb, #4ec8ef)', borderRadius: '9999px' }} />
          <div style={{ width: '48px', height: '4px', backgroundColor: 'rgba(9,17,36,0.1)', borderRadius: '9999px' }} />
          <div style={{ width: '32px', height: '4px', backgroundColor: 'rgba(9,17,36,0.1)', borderRadius: '9999px' }} />
          <div style={{ marginTop: '8px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 'bold' }}>A+</div>
        </div>

        {/* Text */}
        <div className="convergence-text" style={{ marginTop: '48px', textAlign: 'center', opacity: 0 }}>
          <h2 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.02em', color: '#091124', marginBottom: '16px' }}>5 Tools Becoming 1</h2>
          <p style={{ fontSize: '18px', color: 'rgba(9,17,36,0.6)', maxWidth: '576px', margin: '0 auto', lineHeight: '1.6' }}>
            Stop stitching together screenshots and spreadsheets. Get the complete picture of your digital presence in a single, client-ready report.
          </p>
        </div>

      </div>
    </div>
  );
}
