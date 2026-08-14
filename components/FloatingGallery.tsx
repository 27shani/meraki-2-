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

/*
 * Investor / Partner logos
 * These files live directly in /public/
 */
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

const STRIP_COUNT = 9; // vertical slices per logo (8–10 range)

export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  
  const [isDesktop, setIsDesktop] = useState(true);
  const [radius, setRadius] = useState(480);

  // Manage responsive state and radius calculation safely in React
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setRadius(Math.min(window.innerWidth * 0.38, 480));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !isDesktop) {
      return;
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const text = textRef.current;
      const cylinder = cylinderRef.current;
      if (!section || !text || !cylinder) return;

      const heading = text.querySelector('h2');
      let words: HTMLElement[] = [];
      if (heading) {
        words = splitIntoWords(heading);
        gsap.set(words, { opacity: 0, filter: 'blur(12px)' });
      }

      const items = cylinder.querySelectorAll<HTMLElement>('.cylinder-item');
      const total = items.length;
      const angleStep = 360 / total;

      // 1. Initial 3D placement around the cylinder
      gsap.set(items, {
        rotateY: (i) => i * angleStep,
        transformOrigin: `50% 50% ${-radius}px`,
        z: 0,
      });

      // -------------------------------------------------
      // MAIN PINNED SCROLL TIMELINE
      // -------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%', // Lengthened slightly for full sequence
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Reveal center text
      if (words.length) {
        tl.to(
          words,
          { opacity: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.08, ease: 'power3.out' },
          0
        );
      }

      // 2. Images fly in ONE BY ONE (staggered) from Bottom-Left
      tl.fromTo(
        items,
        {
          x: () => -window.innerWidth / 2 - 300, // Bottom-left off-screen
          y: () => window.innerHeight / 2 + 300,
          z: 250,
          opacity: 0,
          rotationZ: -45, // Tilt effect while flying in
          scale: 0.3,
        },
        {
          x: 0,
          y: 0,
          z: 0,
          opacity: 1,
          rotationZ: 0,
          scale: 1,
          duration: 2.5,
          stagger: 0.18, // Makes them follow the 1st image sequentially
          ease: 'power2.out',
        },
        0.5 // Start after text begins revealing
      );

      // 3. Entire Cylinder Rotates 360 degrees
      tl.to(
        cylinder,
        {
          rotateY: -360,
          duration: 6,
          ease: 'power1.inOut',
        },
        2 // Overlaps with the end of the fly-in animation
      );

      // 4. Images fly out ONE BY ONE (staggered) to Bottom-Right
      tl.to(
        items,
        {
          x: () => window.innerWidth / 2 + 300, // Bottom-right off-screen
          y: () => window.innerHeight / 2 + 300,
          z: 250,
          opacity: 0,
          rotationZ: 45,
          scale: 0.3,
          duration: 2.5,
          stagger: 0.18, // Sequentially follow each other out
          ease: 'power2.in',
        },
        6 // Starts near the end of the cylinder rotation
      );

      // 5. Soft exit of center text
      if (words.length) {
        tl.to(
          words,
          { opacity: 0, filter: 'blur(10px)', duration: 1, stagger: 0.04, ease: 'power2.in' },
          7
        );
      }

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop, radius]);

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
          CENTER TEXT
          ===================================================== */}
      <div
        ref={textRef}
        className="
          relative
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

      {/* =====================================================
          DESKTOP – CYLINDRICAL 3D GALLERY
          ===================================================== */}
      <div
        className="
          cylinder-gallery-desktop
          absolute
          inset-0
          z-[40]
          flex
          items-center
          justify-center
          pointer-events-none
        "
        style={{ perspective: '1500px' }}
      >
        <div
          ref={cylinderRef}
          className="
            cylinder-gallery
            relative
            w-full
            h-[280px]
            md:h-[340px]
            lg:h-[400px]
          "
          style={{ transformStyle: 'preserve-3d' }}
        >
          {PAST_INVESTORS.map((investor) => (
            <div
              key={investor.id}
              className="cylinder-item absolute top-1/2 left-1/2" // Ensures correct pivot
              data-logo={investor.logo}
              style={{
                width: 'clamp(160px, 18vw, 280px)',
                height: 'clamp(100px, 12vw, 170px)',
                marginLeft: 'calc(clamp(160px, 18vw, 280px) / -2)',
                marginTop: 'calc(clamp(100px, 12vw, 170px) / -2)',
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
                {/* Dynamically rendering the 3D strips in React prevents DOM freezing */}
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
      <div
        className="
          cylinder-gallery-mobile
          absolute
          left-0
          right-0
          bottom-10
          z-[50]
          overflow-x-auto
          px-6
        "
      >
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
