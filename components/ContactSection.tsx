// components/ContactSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  // Countdown timer
  useEffect(() => {
    setMounted(true);
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

  // GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ---------- DESKTOP ----------
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=90%',
            scrub: 0.7,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          circleRef.current,
          {
            scale: 35,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.45 },
          0.45
        );
      });

      // ---------- MOBILE ----------
      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=55%',          // shorter pin
            scrub: 0.35,           // more responsive
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Smaller scale on mobile is enough to cover the screen
        tl.to(
          circleRef.current,
          {
            scale: 22,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 },
          0.4
        );
      });

      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="register"
      className="relative h-screen bg-black overflow-hidden flex items-center justify-center rounded-b-[32px] md:rounded-b-[80px] z-10"
    >
      {/* Expanding circle */}
      <div
        ref={circleRef}
        className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(244,114,182,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(45,212,191,0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(129,140,248,0.15) 0%, transparent 50%),
            #f8fafc
          `,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-ink max-w-7xl w-full px-5 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center opacity-0"
      >
        {/* Left */}
        <div className="space-y-6 md:space-y-8 mt-6 md:mt-0">
          <div className="relative inline-block w-full">
            {/* Decorative floating words – hide a few on very small screens */}
            <span className="absolute -top-5 left-[40%] text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 hidden sm:block">
              Leadership
            </span>
            <span className="absolute top-[18%] -left-2 md:-left-6 text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Ideas
            </span>
            <span className="absolute top-[8%] -right-1 md:-right-6 text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 hidden sm:block">
              Startups
            </span>
            <span className="absolute -bottom-3 left-[12%] text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
              Startups
            </span>
            <span className="absolute -bottom-6 right-[20%] text-[10px] md:text-xs font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 hidden sm:block">
              Innovation
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4.2rem] font-sans font-normal tracking-tight leading-[1.15] text-ink relative z-10 text-center md:text-left">
              Early-stage{' '}
              <span className="font-serif italic font-light text-neutral-800">ideas</span> to
              <br />
              young ventures seeking
              <br />
              <span className="font-serif italic font-light text-neutral-800">
                validation or growth
              </span>
            </h1>
          </div>

          <p className="text-sm sm:text-base md:text-lg font-serif text-neutral-600 leading-relaxed max-w-lg italic text-center md:text-left mx-auto md:mx-0">
            Join innovators worldwide to transform your groundbreaking ideas into reality. Seize
            this opportunity to showcase your talent.
          </p>

          <div className="pt-1 text-center md:text-left">
            <a
              href="#register"
              className="inline-block bg-[#ff4d4d] text-offwhite px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-sans font-semibold uppercase tracking-wider text-sm hover:bg-purple transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,77,77,0.3)] hover:-translate-y-1"
            >
              Apply Now
            </a>
          </div>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center lg:items-end w-full pt-4 lg:pt-0">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-5 font-sans font-semibold">
            Time remaining to apply
          </p>

          <div className="flex gap-2.5 sm:gap-4 md:gap-5 w-full justify-center lg:justify-end">
            {/* Days */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
              <span className="text-3xl sm:text-5xl md:text-6xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-500 mt-1.5 md:mt-3">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
              <span className="text-3xl sm:text-5xl md:text-6xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-500 mt-1.5 md:mt-3">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
              <span className="text-3xl sm:text-5xl md:text-6xl font-serif italic font-medium text-ink">
                {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans uppercase tracking-widest text-neutral-500 mt-1.5 md:mt-3">
                Minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
