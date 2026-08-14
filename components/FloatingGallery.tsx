// components/FloatingGallery.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Investor {
  id: number;
  name: string;
  logo: string;
}

const PAST_INVESTORS: Investor[] = [
  { id: 1, name: 'Partner 01', logo: '/Image-26.png' },
  { id: 2, name: 'Partner 02', logo: '/Image-29.png' },
  { id: 3, name: 'Partner 03', logo: '/Image-32.png' },
  { id: 4, name: 'Partner 04', logo: '/Image-33.png' },
  { id: 5, name: 'Partner 05', logo: '/Image-34.png' },
  { id: 6, name: 'Partner 06', logo: '/Image-35.png' },
  { id: 7, name: 'Partner 07', logo: '/Image-36.png' },
  { id: 8, name: 'Partner 08', logo: '/Image-38-1.png' },
];

export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const text = textRef.current;
      const track = trackRef.current;
      const cards = cardRefs.current;

      if (!section || !text || !track) return;

      // --- Initial states ---
      gsap.set(text, {
        opacity: 0,
        scale: 0.92,
        filter: 'blur(14px)',
      });

      // Cards start below and invisible
      gsap.set(cards, {
        y: 60,
        opacity: 0,
        scale: 0.85,
      });

      // Track starts to the right (so it scrolls left)
      const getStartX = () => {
        return -(track.scrollWidth - window.innerWidth + 48);
      };
      gsap.set(track, { x: getStartX() });

      // --- Main timeline with pin ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=800%',  // 🔽 Reduced from dynamic huge value to a fixed 8 screens – adjust as needed
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Text fades in (opening)
      tl.to(
        text,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
        },
        0
      );

      // 2. Cards stagger in from below (opening)
      tl.to(
        cards,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: 1.2,
          ease: 'power2.out',
        },
        0.1
      );

      // 3. Horizontal track movement (scrubbed)
      tl.to(
        track,
        {
          x: 0,
          duration: 7,
          ease: 'none',
        },
        0.45
      );

      // 4. Text fades out (closing)
      tl.to(
        text,
        {
          opacity: 0,
          scale: 0.94,
          filter: 'blur(12px)',
          duration: 0.8,
          ease: 'power3.in',
        },
        6.3
      );

      // 5. Whole section scales down and fades (closing)
      tl.to(
        section,
        {
          scale: 0.88,
          opacity: 0.15,
          filter: 'blur(8px)',
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '+=0.5'
      );

      // Handle resize to recalc track position
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        h-screen
        bg-[#070707]
        text-offwhite
        overflow-hidden
        flex
        items-center
        justify-center
        select-none
      "
    >
      {/* Center Text */}
      <div
        ref={textRef}
        className="
          absolute
          top-[38%]
          sm:top-1/2
          -translate-y-1/2
          left-1/2
          -translate-x-1/2
          z-[150]
          w-full
          max-w-5xl
          px-8
          text-center
          pointer-events-none
        "
      >
        <h2
          className="
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            font-sans
            font-medium
            tracking-tight
            leading-[1.05]
          "
        >
          PAST{' '}
          <span className="font-serif italic font-normal text-gradient-brand">
            INVESTORS
          </span>
        </h2>
      </div>

      {/* Investor Logo Track */}
      <div
        className="
          absolute
          left-0
          right-0
          top-[62%]
          sm:top-auto
          sm:bottom-10
          md:bottom-14
          -translate-y-1/2
          sm:translate-y-0
          z-[50]
          overflow-visible
        "
      >
        <div
          ref={trackRef}
          className="
            flex
            w-max
            items-center
            gap-4
            sm:gap-5
            md:gap-6
            pl-6
            md:pl-12
            pr-6
            md:pr-12
            will-change-transform
          "
        >
          {PAST_INVESTORS.map((investor, index) => (
            <div
              key={investor.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="
                relative
                shrink-0
                w-[180px]
                h-[110px]
                sm:w-[220px]
                sm:h-[130px]
                md:w-[280px]
                md:h-[160px]
                lg:w-[320px]
                lg:h-[180px]
                rounded-xl
                overflow-hidden
                border
                border-white/10
                bg-offwhite
                flex
                items-center
                justify-center
                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                will-change-transform
              "
            >
              <img
                src={investor.logo}
                alt={investor.name}
                className="
                  max-w-[75%]
                  max-h-[65%]
                  w-auto
                  h-auto
                  object-contain
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
