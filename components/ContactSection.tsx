// components/ContactSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Timer state
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    setMounted(true);
    // Target Date for the countdown
    const targetDate = new Date('2026-10-23T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // GSAP Animation
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

      // Increased scale to ensure it fully covers large desktop monitors
      tl.to(
        circleRef.current,
        {
          scale: 40,
          ease: 'power2.inOut',
          duration: 1,
        },
        0
      );

      // Content gently rises + fades in as the mask finishes expanding
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 },
        0.5
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen bg-black overflow-hidden flex items-center justify-center rounded-b-[40px] md:rounded-b-[80px] z-10"
    >
      {/* Expanding Abstract Gradient Circle (Background Art) */}
      <div
        ref={circleRef}
        className="absolute w-24 h-24 rounded-full z-0 transform scale-1 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100 via-teal-50 to-violet-200"
      />

      {/* Contact Content revealed inside light background */}
      <div
        ref={contentRef}
        className="relative z-10 text-ink max-w-7xl w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Text & CTA Left Side */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-sans font-semibold tracking-tight uppercase leading-[1.1]">
            Shape the Future with Your Vision
          </h1>
          
          <p className="text-lg md:text-xl font-serif text-neutral-800 leading-relaxed max-w-lg italic">
            Join innovators worldwide to transform your groundbreaking ideas into reality. Seize this opportunity to showcase your talent.
          </p>
          
          <div className="pt-4">
            <a
              href="#register"
              className="inline-block bg-coral text-offwhite px-10 py-4 rounded-full font-sans font-semibold uppercase tracking-wider text-sm hover:bg-purple transition-all duration-300 hover:shadow-[0_10px_30px_rgba(251,87,95,0.3)] hover:-translate-y-1"
            >
              Apply Now
            </a>
          </div>
        </div>

        {/* Timer Blocks Right Side */}
        <div className="flex flex-col items-start lg:items-end w-full">
          <p className="text-xs uppercase tracking-widest text-neutral-600 mb-6 font-sans font-semibold">
            Time remaining to apply
          </p>
          
          <div className="flex gap-3 sm:gap-4 md:gap-6 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
            {/* Days */}
            <div className="flex flex-col items-center justify-center bg-white/30 backdrop-blur-xl border border-white/50 rounded-[24px] p-5 sm:p-6 md:p-8 shadow-xl min-w-[90px] sm:min-w-[110px] md:min-w-[130px]">
              <span className="text-4xl sm:text-5xl md:text-7xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-600 mt-2 md:mt-3">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center justify-center bg-white/30 backdrop-blur-xl border border-white/50 rounded-[24px] p-5 sm:p-6 md:p-8 shadow-xl min-w-[90px] sm:min-w-[110px] md:min-w-[130px]">
              <span className="text-4xl sm:text-5xl md:text-7xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-600 mt-2 md:mt-3">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center justify-center bg-white/30 backdrop-blur-xl border border-white/50 rounded-[24px] p-5 sm:p-6 md:p-8 shadow-xl min-w-[90px] sm:min-w-[110px] md:min-w-[130px]">
              <span className="text-4xl sm:text-5xl md:text-7xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-600 mt-2 md:mt-3">
                Minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
