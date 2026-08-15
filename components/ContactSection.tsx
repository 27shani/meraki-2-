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
      {/* Expanding Abstract Art Background */}
      <div
        ref={circleRef}
        className="absolute w-24 h-24 rounded-full z-0 transform scale-1"
        style={{
          // Pure CSS radial gradients guarantee the abstract art renders correctly on all browsers
          background: `
            radial-gradient(circle at 20% 30%, rgba(244,114,182,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(45,212,191,0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(129,140,248,0.15) 0%, transparent 50%),
            #f8fafc
          `
        }}
      />

      {/* Contact Content revealed inside light background */}
      <div
        ref={contentRef}
        className="relative z-10 text-ink max-w-7xl w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Text & CTA Left Side */}
        <div className="space-y-8 mt-8 md:mt-0">
          
          {/* Complex Font-Mixed Heading */}
          <div className="relative inline-block w-full">
            {/* Floating decorative words */}
            <span className="absolute -top-6 left-[45%] text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
              Leadership
            </span>
            <span className="absolute top-[20%] -left-4 md:-left-8 text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Ideas
            </span>
            <span className="absolute top-[10%] -right-2 md:-right-8 text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Startups
            </span>
            <span className="absolute -bottom-4 md:-bottom-6 left-[15%] text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
              Startups
            </span>
            <span className="absolute -bottom-8 right-[25%] text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Innovation
            </span>
            <span className="absolute bottom-[20%] right-[35%] text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              Leadership
            </span>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-sans font-normal tracking-tight leading-[1.15] text-ink relative z-10 text-center md:text-left">
              Early-stage <span className="font-serif italic font-light text-neutral-800">ideas</span> to<br />
              young ventures seeking<br />
              <span className="font-serif italic font-light text-neutral-800">validation or growth</span>
            </h1>
          </div>
          
          {/* Subtext */}
          <p className="text-base md:text-lg font-serif text-neutral-600 leading-relaxed max-w-lg italic text-center md:text-left mx-auto md:mx-0">
            Join innovators worldwide to transform your groundbreaking ideas into reality. Seize this opportunity to showcase your talent.
          </p>
          
          {/* CTA Button */}
          <div className="pt-2 text-center md:text-left">
            <a
              href="#register"
              className="inline-block bg-[#ff4d4d] text-offwhite px-10 py-4 rounded-full font-sans font-semibold uppercase tracking-wider text-sm hover:bg-purple transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,77,77,0.3)] hover:-translate-y-1"
            >
              Apply Now
            </a>
          </div>
        </div>

        {/* Timer Blocks Right Side */}
        <div className="flex flex-col items-center lg:items-end w-full pt-8 lg:pt-0">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6 font-sans font-semibold">
            Time remaining to apply
          </p>
          
          <div className="flex gap-3 sm:gap-4 md:gap-6 w-full justify-center lg:justify-end overflow-visible pb-4">
            {/* Days */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[24px] p-5 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[90px] sm:min-w-[110px] md:min-w-[120px]">
              <span className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-500 mt-2 md:mt-3">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[24px] p-5 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[90px] sm:min-w-[110px] md:min-w-[120px]">
              <span className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-500 mt-2 md:mt-3">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[24px] p-5 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[90px] sm:min-w-[110px] md:min-w-[120px]">
              <span className="text-4xl sm:text-5xl md:text-6xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-500 mt-2 md:mt-3">
                Minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
