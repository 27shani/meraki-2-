// components/SkillsSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCharHover } from '@/lib/splitText';

const timelineEvents = [
  {
    title: 'Applications Open',
    date: '[ DATE TO BE CONFIRMED ]',
    description: 'Submit your idea and put your venture in the running.',
  },
  {
    title: 'Applications Close',
    date: '[ APPLICATION DEADLINE ]',
    description: 'Last call to get your pitch in.',
  },
  {
    title: 'Shortlist Announcement',
    date: '[ DATE TO BE CONFIRMED ]',
    description: 'The strongest ideas move to the next stage.',
  },
  {
    title: 'Meraki 2026',
    date: '23–25 October 2026',
    description: 'Three days. Big ideas. Serious pitches. New connections.',
  },
  {
    title: 'Venue',
    date: 'New Delhi',
    description: 'Fortune Institute of International Business',
  },
];

/**
 * SkillsSection (timeline / dates)
 * -------------------------------------------------
 * - Accordion-style groups, only one open at a time
 * - Height animation with power3.inOut (~0.45s)
 */
export default function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightWrapRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      initCharHover(containerRef.current || document);

      const getMaxScroll = () => {
        if (!rightContentRef.current || !rightWrapRef.current) return 0;
        return Math.max(
          0,
          rightContentRef.current.scrollHeight -
            rightWrapRef.current.clientHeight +
            100
        );
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${getMaxScroll() * 1.5}`,
          pin: true,
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        rightContentRef.current,
        {
          y: () => -getMaxScroll(),
          ease: 'none',
        },
        0
      );

      tl.fromTo(
        arrowRef.current,
        { x: '-20vw' },
        { x: '100vw', ease: 'none' },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP height animation for accordion (power3.inOut ~0.45s)
  useEffect(() => {
    detailRefs.current.forEach((el, idx) => {
      if (!el) return;
      const isOpen = openIndex === idx;
      gsap.to(el, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.45,
        ease: 'power3.inOut',
        overwrite: true,
      });
    });

    // Refresh ScrollTrigger after height change
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [openIndex]);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#070707] text-offwhite overflow-hidden select-none"
    >
      <div className="h-full max-w-[90rem] mx-auto w-full px-6 md:px-12 flex flex-col md:flex-row md:gap-x-16 relative z-10">
        {/* LEFT */}
        <div className="md:w-[41.6%] shrink-0 h-auto md:h-full flex flex-col justify-center pt-14 md:pt-0 pb-4 md:pb-0 z-20">
          <div className="pr-0 md:pr-12 flex flex-col gap-6 md:gap-8 lg:gap-10">
            <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-sans font-semibold tracking-tight leading-[1.15]">
              Save the dates.
            </h2>
            <a
              href="#register"
              className="text-[10px] md:text-xs font-sans font-semibold uppercase tracking-widest text-left mt-2 text-offwhite hover:text-coral-light transition-colors inline-block w-max"
            >
              <span data-char-hover>REGISTER NOW +</span>
            </a>
          </div>
        </div>

        {/* RIGHT – accordion */}
        <div
          ref={rightWrapRef}
          className="flex-1 min-h-0 md:w-[58.4%] h-full relative overflow-hidden z-20"
        >
          <div
            ref={rightContentRef}
            className="absolute top-0 left-0 w-full pt-20 md:pt-32 pb-24 will-change-transform"
          >
            {timelineEvents.map((event, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex justify-between items-center py-5 md:py-8 text-left group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
                      <span className="text-xl sm:text-3xl md:text-4xl font-sans font-normal group-hover:text-coral-light transition-colors">
                        {event.title}
                      </span>
                      <span className="font-sans text-xs md:text-sm text-coral-light/80">
                        {event.date}
                      </span>
                    </div>
                    <span className="text-xl md:text-2xl font-light text-neutral-500 transition-transform duration-300">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>

                  <div
                    ref={(el) => {
                      detailRefs.current[idx] = el;
                    }}
                    className="overflow-hidden"
                    style={{ height: idx === 0 ? 'auto' : 0, opacity: idx === 0 ? 1 : 0 }}
                  >
                    <p className="font-sans text-sm md:text-base text-neutral-300 leading-relaxed max-w-xl pb-6 md:pb-8">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div
        ref={arrowRef}
        className="absolute bottom-12 md:bottom-20 left-0 z-10 will-change-transform pointer-events-none"
      >
        <svg
          width="400"
          height="100"
          viewBox="0 0 400 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[120px] md:w-[250px] lg:w-[350px] h-auto opacity-80"
        >
          <defs>
            <linearGradient
              id="arrowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#FB575F" />
              <stop offset="100%" stopColor="#8F53FC" />
            </linearGradient>
          </defs>
          <path
            d="M0 38H280V0L400 50L280 100V62H0V38Z"
            fill="url(#arrowGradient)"
          />
        </svg>
      </div>
    </section>
  );
}
