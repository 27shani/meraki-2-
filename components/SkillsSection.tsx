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

      const mm = gsap.matchMedia();

      // ---------- DESKTOP ----------
      mm.add('(min-width: 768px)', () => {
        const getMaxScroll = () => {
          if (!rightContentRef.current || !rightWrapRef.current) return 0;
          return Math.max(
            0,
            rightContentRef.current.scrollHeight - rightWrapRef.current.clientHeight + 80
          );
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${Math.max(getMaxScroll() * 1.3, window.innerHeight * 0.8)}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
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
          { x: '-15vw' },
          { x: '95vw', ease: 'none' },
          0
        );
      });

      // ---------- MOBILE (much lighter) ----------
      mm.add('(max-width: 767px)', () => {
        // On mobile we still pin, but keep the distance short
        const getMaxScroll = () => {
          if (!rightContentRef.current || !rightWrapRef.current) return 0;
          return Math.max(
            0,
            rightContentRef.current.scrollHeight - rightWrapRef.current.clientHeight + 40
          );
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${Math.max(getMaxScroll() * 1.1, window.innerHeight * 0.6)}`,
            pin: true,
            scrub: 0.35,          // responsive
            anticipatePin: 1,
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

        // Smaller arrow movement on mobile
        tl.fromTo(
          arrowRef.current,
          { x: '-30vw', opacity: 0.6 },
          { x: '70vw', opacity: 0.9, ease: 'none' },
          0
        );
      });

      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Accordion height animation
  useEffect(() => {
    detailRefs.current.forEach((el, idx) => {
      if (!el) return;
      const isOpen = openIndex === idx;
      gsap.to(el, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.4,
        ease: 'power3.inOut',
        overwrite: true,
      });
    });

    // Refresh after height change so pin stays correct
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
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
      <div className="h-full max-w-[90rem] mx-auto w-full px-5 sm:px-6 md:px-12 flex flex-col md:flex-row md:gap-x-16 relative z-10">
        {/* LEFT */}
        <div className="md:w-[41.6%] shrink-0 h-auto md:h-full flex flex-col justify-center pt-12 md:pt-0 pb-3 md:pb-0 z-20">
          <div className="pr-0 md:pr-10 flex flex-col gap-5 md:gap-8">
            <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-sans font-semibold tracking-tight leading-[1.15]">
              Save the dates.
            </h2>
            <a
              href="#register"
              className="text-[10px] md:text-xs font-sans font-semibold uppercase tracking-widest text-left text-offwhite hover:text-coral-light transition-colors inline-block w-max"
            >
              <span data-char-hover>REGISTER NOW +</span>
            </a>
          </div>
        </div>

        {/* RIGHT – accordion list */}
        <div
          ref={rightWrapRef}
          className="flex-1 min-h-0 md:w-[58.4%] h-full relative overflow-hidden z-20"
        >
          <div
            ref={rightContentRef}
            className="absolute top-0 left-0 w-full pt-16 md:pt-28 pb-20"
          >
            {timelineEvents.map((event, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border-b border-white/10 last:border-b-0">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex justify-between items-center py-4 md:py-7 text-left group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-5 pr-4">
                      <span className="text-xl sm:text-2xl md:text-4xl font-sans font-normal group-hover:text-coral-light transition-colors">
                        {event.title}
                      </span>
                      <span className="font-sans text-xs md:text-sm text-coral-light/80">
                        {event.date}
                      </span>
                    </div>
                    <span className="text-xl md:text-2xl font-light text-neutral-500 shrink-0">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>

                  <div
                    ref={(el) => {
                      detailRefs.current[idx] = el;
                    }}
                    className="overflow-hidden"
                    style={{
                      height: idx === 0 ? 'auto' : 0,
                      opacity: idx === 0 ? 1 : 0,
                    }}
                  >
                    <p className="font-sans text-sm md:text-base text-neutral-300 leading-relaxed max-w-xl pb-5 md:pb-7">
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
        className="absolute bottom-10 md:bottom-16 left-0 z-10 pointer-events-none"
      >
        <svg
          width="400"
          height="100"
          viewBox="0 0 400 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[100px] sm:w-[140px] md:w-[240px] lg:w-[320px] h-auto opacity-75"
        >
          <defs>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
