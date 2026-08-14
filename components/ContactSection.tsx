// components/ContactSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
        },
      });

      tl.to(circleRef.current, {
        scale: 25,
        ease: 'power2.inOut',
        duration: 1,
      }, 0);

      // Content gently rises + fades in as the mask finishes expanding
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 },
        0.5
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      // Added rounded-b-[40px] for mobile, rounded-b-[80px] for desktop, and z-10 to sit above the footer
      className="relative h-screen bg-black overflow-hidden flex items-center justify-center rounded-b-[40px] md:rounded-b-[80px] z-10"
    >
      {/* Expanding Off-White Mask Circle */}
      <div
        ref={circleRef}
        className="absolute w-24 h-24 bg-offwhite rounded-full z-0 transform scale-1"
      />

      {/* Contact Content revealed inside light background */}
      <div
        ref={contentRef}
        className="relative z-10 text-ink max-w-6xl w-full px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h1 className="text-5xl md:text-7xl font-sans font-semibold tracking-tight mb-6 uppercase">Meraki 2026</h1>
          <div className="space-y-4 text-lg font-sans font-medium">
            <span className="block font-sans text-xs uppercase tracking-widest text-neutral-600">23–25 October 2026 | FIIB, New Delhi</span>
            <a href="#register" className="inline-block bg-coral text-offwhite px-8 py-3 rounded-full font-serif font-semibold normal-case tracking-normal text-sm hover:bg-purple transition-colors mt-2">
              Apply Now
            </a>
            <p className="pt-6 text-sm opacity-70 uppercase tracking-widest font-sans">Pitch. Connect. Scale.</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-2xl md:text-4xl font-serif italic font-normal leading-relaxed text-neutral-800">
            Your idea has entered the chat. Now give it a stage.
          </p>
        </div>
      </div>
    </section>
  );
}
