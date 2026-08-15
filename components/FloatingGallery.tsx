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

      const mm = gsap.matchMedia();

      // ---------- DESKTOP ----------
      mm.add('(min-width: 768px)', () => {
        gsap.set(text, { opacity: 0, scale: 0.92, filter: 'blur(12px)' });
        gsap.set(cardsOne, { y: 40, opacity: 0, scale: 0.9 });
        gsap.set(cardsTwo, { y: 40, opacity: 0, scale: 0.9 });

        const getStartXOne = () => -(trackOne.scrollWidth - window.innerWidth + 48);
        gsap.set(trackOne, { x: getStartXOne() });
        gsap.set(trackTwo, { x: 0 });

        const targetXTwo = () => -(trackTwo.scrollWidth - window.innerWidth + 48);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=500%',          // reduced from 800%
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(text, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
        }, 0)
          .to([cardsOne, cardsTwo], {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.04,
            duration: 1,
            ease: 'power2.out',
          }, 0.08)
          .to(trackOne, { x: 0, duration: 5.5, ease: 'none' }, 0.35)
          .to(trackTwo, { x: targetXTwo, duration: 5.5, ease: 'none' }, 0.35)
          .to(text, {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)',
            duration: 0.7,
            ease: 'power3.in',
          }, 5.2)
          .to(section, {
            scale: 0.9,
            opacity: 0.2,
            filter: 'blur(6px)',
            duration: 1,
            ease: 'power2.inOut',
          }, '+=0.3');
      });

      // ---------- MOBILE (much lighter) ----------
      mm.add('(max-width: 767px)', () => {
        gsap.set(text, { opacity: 0, y: 20 });
        gsap.set(cardsOne, { y: 25, opacity: 0 });
        gsap.set(cardsTwo, { y: 25, opacity: 0 });

        const getStartXOne = () => -(trackOne.scrollWidth - window.innerWidth + 32);
        gsap.set(trackOne, { x: getStartXOne() });
        gsap.set(trackTwo, { x: 0 });

        const targetXTwo = () => -(trackTwo.scrollWidth - window.innerWidth + 32);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=180%',          // dramatically reduced
            pin: true,
            scrub: 0.45,            // more responsive
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(text, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
        }, 0)
          .to([cardsOne, cardsTwo], {
            y: 0,
            opacity: 1,
            stagger: 0.03,
            duration: 0.7,
            ease: 'power2.out',
          }, 0.05)
          .to(trackOne, { x: 0, duration: 2.2, ease: 'none' }, 0.25)
          .to(trackTwo, { x: targetXTwo, duration: 2.2, ease: 'none' }, 0.25)
          .to(text, {
            opacity: 0,
            y: -10,
            duration: 0.5,
            ease: 'power2.in',
          }, 2.0)
          .to(section, {
            opacity: 0.25,
            duration: 0.6,
            ease: 'power2.inOut',
          }, '+=0.15');
      });

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', () => setTimeout(handleResize, 250));

      return () => {
        window.removeEventListener('resize', handleResize);
        mm.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#070707] text-offwhite overflow-hidden flex items-center justify-center select-none"
    >
      {/* Title */}
      <div
        ref={textRef}
        className="absolute top-[24%] sm:top-[28%] -translate-y-1/2 left-1/2 -translate-x-1/2 z-[150] w-full max-w-5xl px-6 text-center pointer-events-none"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-medium tracking-tight leading-[1.05]">
          PAST{' '}
          <span className="font-serif italic font-normal text-gradient-brand">
            INVESTORS
          </span>
        </h2>
      </div>

      {/* Dual tracks */}
      <div className="absolute left-0 right-0 top-[52%] -translate-y-1/2 sm:top-auto sm:bottom-6 md:bottom-10 sm:translate-y-0 z-[50] flex flex-col gap-3 sm:gap-5 overflow-visible">
        {/* Track One */}
        <div
          ref={trackOneRef}
          className="flex w-max items-center gap-3 sm:gap-5 md:gap-6 pl-5 md:pl-12 pr-5 md:pr-12"
        >
          {LINE_ONE_INVESTORS.map((investor, index) => (
            <div
              key={investor.id}
              ref={(el) => {
                cardRefsOne.current[index] = el;
              }}
              className="relative shrink-0 w-[160px] h-[100px] sm:w-[200px] sm:h-[120px] md:w-[260px] md:h-[150px] lg:w-[300px] lg:h-[170px] rounded-xl overflow-hidden border border-white/15 bg-offwhite flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
            >
              <img
                src={investor.logo}
                alt={investor.name}
                className="max-w-[75%] max-h-[65%] w-auto h-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Track Two */}
        <div
          ref={trackTwoRef}
          className="flex w-max items-center gap-3 sm:gap-5 md:gap-6 pl-5 md:pl-12 pr-5 md:pr-12"
        >
          {LINE_TWO_INVESTORS.map((investor, index) => (
            <div
              key={investor.id}
              ref={(el) => {
                cardRefsTwo.current[index] = el;
              }}
              className="relative shrink-0 w-[160px] h-[100px] sm:w-[200px] sm:h-[120px] md:w-[260px] md:h-[150px] lg:w-[300px] lg:h-[170px] rounded-xl overflow-hidden border border-white/15 bg-offwhite flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
            >
              <img
                src={investor.logo}
                alt={investor.name}
                className="max-w-[75%] max-h-[65%] w-auto h-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
