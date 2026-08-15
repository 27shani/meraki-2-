'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Investor {
  id: number;
  name: string;
  logo: string;
}

const LINE_ONE_INVESTORS: Investor[] = [
  { id: 1, name: 'Aricent', logo: '/logo/Aricent_Logo_2011.png' },
  { id: 2, name: 'Mayfield', logo: '/logo/Mayfield.webp' },
  { id: 3, name: 'Network18', logo: '/logo/NETWORK18.png' },
  { id: 4, name: 'Venture Catalyst', logo: '/logo/Venture-Catalyst-logo-startuptalky.png' },
  { id: 5, name: 'Chalo', logo: '/logo/chalo.png' },
  { id: 6, name: 'Dozee', logo: '/logo/dozee.png' },
  { id: 7, name: 'Fir Tree', logo: '/logo/firtree.gif' },
];

const LINE_TWO_INVESTORS: Investor[] = [
  { id: 8, name: 'Herculas', logo: '/logo/herculas.png' },
  { id: 9, name: 'iCreate', logo: '/logo/icreate.png' },
  { id: 10, name: 'MagicPin', logo: '/logo/magic-pin-logo.webp' },
  { id: 11, name: 'Motorola', logo: '/logo/motorola-logo.svg' },
  { id: 12, name: 'Social Business Creation', logo: '/logo/social business creation.webp' },
  { id: 13, name: 'SocialCops', logo: '/logo/socialcops.png' },
  { id: 14, name: 'WaterBridge Venture', logo: '/logo/waterbridge venture.png' },
];

export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trackOneRef = useRef<HTMLDivElement>(null);
  const trackTwoRef = useRef<HTMLDivElement>(null);
  const cardRefsOne = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefsTwo = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const text = textRef.current;
      const trackOne = trackOneRef.current;
      const trackTwo = trackTwoRef.current;
      const cardsOne = cardRefsOne.current;
      const cardsTwo = cardRefsTwo.current;

      if (!section || !text || !trackOne || !trackTwo) return;

      // --- Initial states ---
      gsap.set(text, {
        opacity: 0,
        scale: 0.92,
        filter: 'blur(14px)',
      });

      // Cards start invisible with slight offsets
      gsap.set(cardsOne, {
        y: 40,
        opacity: 0,
        scale: 0.88,
      });

      gsap.set(cardsTwo, {
        y: 40,
        opacity: 0,
        scale: 0.88,
      });

      // Track One starts shifted left (scrolls right to left -> moves x to 0)
      const getStartXOne = () => {
        return -(trackOne.scrollWidth - window.innerWidth + 48);
      };
      gsap.set(trackOne, { x: getStartXOne() });

      // Track Two starts at 0 (scrolls right -> moves positive x)
      gsap.set(trackTwo, { x: 0 });

      // --- Main timeline with pin ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=800%',
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
        [cardsOne, cardsTwo],
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.05,
          duration: 1.2,
          ease: 'power2.out',
        },
        0.1
      );

      // 3. Track One moves left (x: 0)
      tl.to(
        trackOne,
        {
          x: 0,
          duration: 7,
          ease: 'none',
        },
        0.45
      );

      // 4. Track Two moves right (opposite direction)
      const targetXTwo = -(trackTwo.scrollWidth - window.innerWidth + 48);
      tl.to(
        trackTwo,
        {
          x: targetXTwo,
          duration: 7,
          ease: 'none',
        },
        0.45
      );

      // 5. Text fades out (closing)
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

      // 6. Whole section scales down and fades (closing)
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
      {/* Center Text - Moved higher up via top positioning */}
      <div
        ref={textRef}
        className="
          absolute
          top-[26%]
          sm:top-[30%]
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

      {/* Dual Logo Tracks Container */}
      <div
        className="
          absolute
          left-0
          right-0
          top-[50%]
          -translate-y-1/2
          sm:top-auto
          sm:bottom-6
          md:bottom-10
          sm:translate-y-0
          z-[50]
          flex
          flex-col
          gap-4
          sm:gap-5
          overflow-visible
        "
      >
        {/* Track One: Moves Left */}
        <div
          ref={trackOneRef}
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
          {LINE_ONE_INVESTORS.map((investor, index) => (
            <div
              key={investor.id}
              ref={(el) => { cardRefsOne.current[index] = el; }}
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
                border-white/15
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

        {/* Track Two: Moves Right */}
        <div
          ref={trackTwoRef}
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
          {LINE_TWO_INVESTORS.map((investor, index) => (
            <div
              key={investor.id}
              ref={(el) => { cardRefsTwo.current[index] = el; }}
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
                border-white/15
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
