// components/FloatingGallery.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
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

const STRIP_COUNT = 9;

export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [radius, setRadius] = useState(480);
  const [isDesktop, setIsDesktop] = useState(true);

  // Safely initialize dimensions on mount
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
    // Wait until React has fully mounted the DOM
    if (!mounted) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !isDesktop) return;

    const section = sectionRef.current;
    if (!section) return;

    // Create GSAP context scoped strictly to the HTML element (fixes 'Invalid scope' error)
    const ctx = gsap.context(() => {
      // Because we scoped the context to `section`, we don't need to pass it into toArray
      const items = gsap.utils.toArray('.cylinder-item');
      const words = gsap.utils.toArray('.word-span');
      
      if (!items.length) return;

      // 1. Initial State for words
      gsap.set(words, { opacity: 0, filter: 'blur(12px)' });

      // 2. Initial State for items: Hiding them deep in the bottom-left corner
      gsap.set(items, {
        xPercent: -50,
        yPercent: -50,
        x: () => -window.innerWidth / 2 - 300,
        y: () => window.innerHeight / 2 + 300,
        z: -200,
        rotateY: -90,
        opacity: 0,
        transformOrigin: `50% 50% ${-radius}px`,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=800%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3. Reveal text word-by-word
      if (words.length) {
        tl.to(
          words,
          { opacity: 1, filter: 'blur(0px)', duration: 2, stagger: 0.1, ease: 'power2.out' },
          0
        );
      }

      // 4. The "Follow the Leader" Sequence
      const staggerTime = 1.2;
      const orbitDuration = 9.6;

      tl.to(items, {
        keyframes: [
          // A: Enter from bottom left
          { x: 0, y: 0, z: 0, rotateY: 0, opacity: 1, ease: 'power2.out', duration: 2.5 },
          // B: Orbit
          { rotateY: -360, ease: 'none', duration: orbitDuration },
          // C: Exit bottom right
          { x: () => window.innerWidth / 2 + 300, y: () => window.innerHeight / 2 + 300, z: -200, rotateY: -450, opacity: 0, ease: 'power2.in', duration: 2.5 }
        ],
        stagger: staggerTime,
      }, 1);

      // 5. Soft exit of center text
      if (words.length) {
        tl.to(
          words,
          { opacity: 0, filter: 'blur(10px)', duration: 2, stagger: 0.05, ease: 'power2.in' },
          22 
        );
      }

    }, section); // <- Passes the element directly as the scope

    return () => ctx.revert();
  }, [mounted, radius, isDesktop]);

  // Removed `if (!mounted) return null;` to fix the `insertBefore` crash.
  // Rendering the structure immediately ensures Next.js and React stay in sync.

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
      <div
        className={`
          cylinder-gallery-desktop absolute inset-0 flex items-center justify-center pointer-events-none
          ${!mounted || !isDesktop ? 'opacity-0' : 'opacity-100'} 
        `}
        style={{ perspective: '1200px', transformStyle: 'preserve-3d', transition: 'opacity 0.3s ease' }}
      >
        <div
          className="absolute text-center w-full max-w-5xl px-8 flex justify-center gap-x-4"
          style={{ transform: `translateZ(${-radius}px)` }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-medium tracking-tight leading-[1.05] flex gap-x-4">
            <span className="word-span inline-block">PAST</span>
            <span className="word-span inline-block font-serif italic font-normal text-gradient-brand">
              INVESTORS
            </span>
          </h2>
        </div>

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

      <div className={`cylinder-gallery-mobile absolute left-0 right-0 bottom-10 z-[50] overflow-x-auto px-6 md:hidden ${mounted && !isDesktop ? 'opacity-100' : 'opacity-0'}`}>
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
