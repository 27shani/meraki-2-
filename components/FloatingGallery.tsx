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

/**
 * FloatingGallery – Cylindrical 3D gallery
 * -------------------------------------------------
 * Pure CSS 3D + GSAP (no Three.js).
 * Each logo is sliced into vertical strips.
 * Strips receive individual rotateY + transform-origin
 * to form a cylindrical surface that rotates with scroll.
 * Desktop only; simplified horizontal track on mobile.
 */
export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !isDesktop) {
      // Simple fade-in for reduced motion / mobile handled by CSS fallback
      return;
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const text = textRef.current;
      const cylinder = cylinderRef.current;
      if (!section || !text || !cylinder) return;

      // -------------------------------------------------
      // Word-by-word reveal for center phrase
      // -------------------------------------------------
      const heading = text.querySelector('h2');
      let words: HTMLElement[] = [];
      if (heading) {
        words = splitIntoWords(heading);
        gsap.set(words, { opacity: 0, filter: 'blur(12px)' });
      }

      // -------------------------------------------------
      // Build cylindrical items
      // -------------------------------------------------
      const items = cylinder.querySelectorAll<HTMLElement>('.cylinder-item');
      const radius = Math.min(window.innerWidth * 0.38, 480);
      const total = items.length;
      const angleStep = 360 / total;

      items.forEach((item, i) => {
        const angle = i * angleStep;
        // Position around the cylinder
        gsap.set(item, {
          rotateY: angle,
          transformOrigin: `50% 50% ${-radius}px`,
          z: 0,
          opacity: 0,
          scale: 0.85,
        });

        // Slice each logo into vertical strips
        const imgUrl = item.dataset.logo || '';
        const stripContainer = item.querySelector('.strip-container') as HTMLElement;
        if (!stripContainer) return;

        stripContainer.innerHTML = '';
        const stripWidth = 100 / STRIP_COUNT;

        for (let s = 0; s < STRIP_COUNT; s++) {
          const strip = document.createElement('div');
          strip.className = 'cylinder-strip';
          strip.style.width = `${stripWidth}%`;
          strip.style.left = `${s * stripWidth}%`;
          strip.style.backgroundImage = `url(${imgUrl})`;
          strip.style.backgroundPosition = `${(s / (STRIP_COUNT - 1)) * 100}% 50%`;
          strip.style.backgroundSize = `${STRIP_COUNT * 100}% 100%`;
          // Each strip: transform-origin on the cylinder radius for true 3D curve
          const stripAngle = (s - (STRIP_COUNT - 1) / 2) * 2.2;
          strip.style.transformOrigin = `50% 50% ${-radius}px`;
          strip.style.transform = `rotateY(${stripAngle}deg) translateZ(0)`;
          stripContainer.appendChild(strip);
        }
      });

      // -------------------------------------------------
      // MAIN PINNED SCROLL TIMELINE
      // -------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Center phrase word-by-word opacity + blur reveal
      if (words.length) {
        tl.to(
          words,
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.4,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0
        );
      }

      // 2. Staggered appearance of logos while pinned
      tl.to(
        items,
        {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          stagger: {
            each: 0.12,
            from: 'center',
          },
          ease: 'power3.out',
        },
        0.3
      );

      // 3. Continuous cylindrical rotation driven by scroll progress
      tl.to(
        cylinder,
        {
          rotateY: -angleStep * (total + 0.5),
          duration: 6,
          ease: 'none',
        },
        0.6
      );

      // 4. Soft exit of center text near the end
      if (words.length) {
        tl.to(
          words,
          {
            opacity: 0,
            filter: 'blur(10px)',
            duration: 1,
            stagger: 0.04,
            ease: 'power2.in',
          },
          5.2
        );
      }

      // Resize handler
      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

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
          CENTER TEXT – word-by-word reveal driven by pin progress
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
              className="cylinder-item"
              data-logo={investor.logo}
              style={{
                width: 'clamp(160px, 18vw, 280px)',
                height: 'clamp(100px, 12vw, 170px)',
                marginLeft: 'calc(clamp(160px, 18vw, 280px) / -2)',
                marginTop: 'calc(clamp(100px, 12vw, 170px) / -2)',
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
              />
              {/* Fallback img for accessibility / loading */}
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
