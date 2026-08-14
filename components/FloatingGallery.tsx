// components/FloatingGallery.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoWords } from '@/lib/splitText';

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

const STRIP_COUNT = 9;

export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [radius, setRadius] = useState(480);
  const [isDesktop, setIsDesktop] = useState(true);

  // Safely initialize dimensions on mount to prevent SSR hydration mismatches
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setRadius(Math.min(window.innerWidth * 0.38, 480));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !isDesktop) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const text = textRef.current;
      const items = gsap.utils.toArray('.cylinder-item');
      if (!section || !text || !items.length) return;

      const heading = text.querySelector('h2');
      let words: HTMLElement[] = [];
      if (heading) {
        words = splitIntoWords(heading);
        gsap.set(words, { opacity: 0, filter: 'blur(12px)' });
      }

      // 1. Initial State: Hiding items deep in the bottom-left corner
      gsap.set(items, {
        xPercent: -50,
        yPercent: -50,
        x: () => -window.innerWidth / 2 - 300, // Bottom-left off-screen
        y: () => window.innerHeight / 2 + 300,
        z: -200,
        rotateY: -90, // Tilted away
        opacity: 0,
        transformOrigin: `50% 50% ${-radius}px`,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=800%', // Increased scroll duration for a very smooth, unhurried animation
          pin: true,
          scrub: 1, // Smooth interpolation
          invalidateOnRefresh: true,
        },
      });

      // 2. Reveal text word-by-word
      if (words.length) {
        tl.to(
          words,
          { opacity: 1, filter: 'blur(0px)', duration: 2, stagger: 0.1, ease: 'power2.out' },
          0
        );
      }

      // 3. The "Follow the Leader" Sequence
      // By using keyframes and an exact stagger ratio, the items seamlessly form a rotating 3D circle
      const staggerTime = 1.2;
      const orbitDuration = 9.6; // Exactly 8 items * 1.2 stagger = 9.6 (Ensures perfect 360/8 degree spacing)

      tl.to(items, {
        keyframes: [
          // Step A: Fly in from bottom left to center
          {
            x: 0, y: 0, z: 0, rotateY: 0, opacity: 1,
            ease: 'power2.out', duration: 2.5
          },
          // Step B: Lock into orbit and rotate around the text
          {
            rotateY: -360,
            ease: 'none', duration: orbitDuration
          },
          // Step C: Break orbit and exit bottom right
          {
            x: () => window.innerWidth / 2 + 300, // Bottom-right off-screen
            y: () => window.innerHeight / 2 + 300,
            z: -200, rotateY: -450, opacity: 0,
            ease: 'power2.in', duration: 2.5
          }
        ],
        stagger: staggerTime, // Each item follows the exact same path, perfectly delayed
      }, 1);

      // 4. Soft exit of center text as the last items are leaving
      if (words.length) {
        tl.to(
          words,
          { opacity: 0, filter: 'blur(10px)', duration: 2, stagger: 0.05, ease: 'power2.in' },
          22 
        );
      }

      return () => {
        ScrollTrigger.refresh();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted, radius, isDesktop]);

  if (!mounted) return null;

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
      {/* =====================================================
          DESKTOP – TRUE 3D CONTAINER
          ===================================================== */}
      <div
        className="
          cylinder-gallery-desktop
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
        "
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* TEXT - Pushed back in Z-space so the items orbit accurately around it */}
        <div
          ref={textRef}
          className="absolute text-center w-full max-w-5xl px-8"
          style={{ transform: `translateZ(${-radius}px)` }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-medium tracking-tight leading-[1.05]">
            PAST{' '}
            <span className="font-serif italic font-normal text-gradient-brand">
              INVESTORS
            </span>
          </h2>
        </div>

        {/* CYLINDRICAL ITEMS */}
        <div ref={cylinderRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {PAST_INVESTORS.map((investor) => (
            <div
              key={investor.id}
              className="cylinder-item absolute top-1/2 left-1/2"
              data-logo={investor.logo}
              style={{
                width: 'clamp(160px, 18vw, 280px)',
                height: 'clamp(100px, 12vw, 170px)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className="
                  strip-container
                  relative
                  w-full
                  h-full
                  rounded-xl
                  overflow-hidden
                  border
                  border-white/10
                  bg-offwhite
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                "
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 
                  Rendered natively in React to eliminate freezing. 
                  This creates the physical curve of each card.
                */}
                {Array.from({ length: STRIP_COUNT }).map((_, s) => {
                  const stripWidth = 100 / STRIP_COUNT;
                  const stripAngle = (s - (STRIP_COUNT - 1) / 2) * 2.2;
                  return (
                    <div
                      key={s}
                      className="cylinder-strip absolute top-0 bottom-0"
                      style={{
                        width: `${stripWidth + 0.5}%`,
                        left: `${s * stripWidth}%`,
                        backgroundImage: `url(${investor.logo})`,
                        backgroundPosition: `${(s / (STRIP_COUNT - 1)) * 100}% 50%`,
                        backgroundSize: `${STRIP_COUNT * 100}% 100%`,
                        transformOrigin: `50% 50% ${-radius}px`,
                        transform: `rotateY(${stripAngle}deg) translateZ(0)`,
                      }}
                    />
                  );
                })}
              </div>
              <img
                src={investor.logo}
                alt={investor.name}
                className="sr-only"
              />
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          MOBILE FALLBACK – simple horizontal track
          ===================================================== */}
      <div className="cylinder-gallery-mobile absolute left-0 right-0 bottom-10 z-[50] overflow-x-auto px-6 md:hidden">
        <div className="flex w-max items-center gap-4">
          {PAST_INVESTORS.map((investor) => (
            <div
              key={investor.id}
              className="
                relative
                shrink-0
                w-[160px]
                h-[100px]
                rounded-xl
                overflow-hidden
                border
                border-white/10
                bg-offwhite
                flex
                items-center
                justify-center
              "
            >
              <img
                src={investor.logo}
                alt={investor.name}
                className="max-w-[75%] max-h-[65%] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
