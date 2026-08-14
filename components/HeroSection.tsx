// components/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextContainerRef = useRef<HTMLDivElement>(null);

  // New hero elements (matching Luke Baffait)
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // Loader refs
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTitleRef = useRef<HTMLDivElement>(null);
  const loaderWipeRedRef = useRef<HTMLDivElement>(null);
  const loaderWipeBlackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Safety unlock for Lenis (if used globally)
    const safetyUnlock = window.setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).__unlockLenis) {
        (window as any).__unlockLenis();
      }
    }, 5000);

    const mm = gsap.matchMedia();

    /*
     * =========================================================
     * 1. LOADING ANIMATION (same as Luke Baffait)
     * =========================================================
     */
    mm.add("all", () => {
      const loader = loaderRef.current;
      const loaderTitle = loaderTitleRef.current;
      const wipeRed = loaderWipeRedRef.current;
      const wipeBlack = loaderWipeBlackRef.current;

      if (loader && loaderTitle && wipeRed && wipeBlack) {
        const loaderTl = gsap.timeline();

        // Get all character spans for stagger
        const titleChars = loaderTitle.querySelectorAll('span');

        // Initial setup
        gsap.set(loader, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
        gsap.set(titleChars, { scale: 0.5, opacity: 0 });
        gsap.set([wipeRed, wipeBlack], { yPercent: 100 }); // start off-screen BOTTOM

        loaderTl
          // 1) Stagger in characters
          .to(titleChars, {
            scale: 1.05,
            opacity: 1,
            duration: 0.8,
            stagger: 0.04,
            ease: 'expo.out',
          })
          // 2) Settle to normal scale
          .to(titleChars, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.inOut',
          })
          // 3) Red panel slides UP from bottom to cover
          .fromTo(wipeRed,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.6, ease: 'power3.inOut' },
            '+=0.2'
          )
          // 4) Black panel slides UP (slightly overlapping)
          .fromTo(wipeBlack,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.6, ease: 'power3.inOut' },
            '-=0.4'
          )
          // 5) Fade out title text
          .set(titleChars, { opacity: 0 })
          .set(loader, { backgroundColor: 'transparent' })
          // 6) Panels slide DOWN to reveal page
          .to(wipeRed, {
            yPercent: 100,
            duration: 0.6,
            ease: 'power3.inOut',
          })
          .to(wipeBlack, {
            yPercent: 100,
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete: () => {
              gsap.set(loader, { visibility: 'hidden', pointerEvents: 'none' });
              document.body.style.overflow = '';

              if (typeof window !== 'undefined' && (window as any).__unlockLenis) {
                (window as any).__unlockLenis();
              }
              ScrollTrigger.refresh();
            },
          }, '-=0.4');
      }
    });

    /*
     * =========================================================
     * 2. HERO SCROLL ANIMATION (Luke Baffait style)
     * =========================================================
     */
    mm.add("all", () => {
      const tagline = taglineRef.current;
      const line = lineRef.current;
      const bottomBar = bottomBarRef.current;
      const container = containerRef.current;

      if (!tagline || !line || !bottomBar || !container) return;

      // Set initial states
      gsap.set(tagline, { clipPath: 'inset(0 0 100% 0)', opacity: 0 });
      gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(bottomBar, { clipPath: 'inset(0 0 100% 0)', opacity: 0 });

      // Pinned scroll timeline
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=150%', // shorter scroll duration (like Luke Baffait)
          scrub: 0.6,
          pin: true,
        },
      });

      heroTl
        // Reveal tagline (clip-path from top to bottom)
        .to(tagline, {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        })
        // Reveal horizontal line (scale from 0 to 1)
        .to(line, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.4')
        // Reveal bottom bar (clip-path from top to bottom)
        .to(bottomBar, {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.4');
    });

    return () => {
      window.clearTimeout(safetyUnlock);
      mm.revert();
    };
  }, []);

  /*
   * =========================================================
   * JSX – Minimal layout matching Luke Baffait
   * =========================================================
   */
  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-between p-6 md:p-10"
    >
      {/* Background Glow (keeps your brand vibe) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(143,83,252,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(251,87,95,0.12),transparent_55%)] pointer-events-none z-0" />

      {/* ===== TOP HEADER (minimal) ===== */}
      <div className="relative z-10 flex justify-between items-center text-xs tracking-widest text-neutral-400 uppercase font-sans">
        <span className="font-serif text-offwhite font-normal">Meraki</span>
        <span className="cursor-pointer hover:text-offwhite transition">Menu</span>
      </div>

      {/* ===== CENTER HERO CONTENT ===== */}
      <div
        ref={heroTextContainerRef}
        className="relative z-10 flex flex-col items-center justify-center pointer-events-none"
      >
        <h1 className="text-5xl md:text-[9vw] font-semibold tracking-tight text-offwhite leading-none uppercase text-center flex flex-wrap justify-center gap-x-4 md:gap-x-8 font-sans">
          <span>Pitch.</span>
          <span className="font-serif italic font-normal text-gradient-brand">Connect.</span>
          <span>Scale.</span>
        </h1>

        {/* Tagline – animated with clip-path */}
        <p
          ref={taglineRef}
          className="text-sm md:text-base tracking-widest text-neutral-400 mt-4 md:mt-6 font-light"
          style={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
        >
          Quiet creator, bringing ideas to life.
        </p>

        {/* Decorative line – animated with scaleX */}
        <div
          ref={lineRef}
          className="w-12 md:w-16 h-px bg-neutral-500 my-4 md:my-6 scale-x-0 origin-left"
        />
      </div>

      {/* ===== BOTTOM BAR (animated with clip-path) ===== */}
      <div
        ref={bottomBarRef}
        className="relative z-10 flex justify-between items-center text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase border-t border-white/10 pt-4 md:pt-6 font-sans"
        style={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      >
        <div className="flex gap-4 md:gap-6">
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </div>
        <div className="flex gap-4">
          <span>LinkedIn</span>
          <span>Instagram</span>
        </div>
      </div>

      {/* ===== LOADING OVERLAY ===== */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
      >
        {/* Title with individual character spans for stagger */}
        <div
          ref={loaderTitleRef}
          className="relative z-10 flex items-baseline justify-center gap-1 md:gap-2 whitespace-nowrap origin-center"
        >
          {/* Pitch. */}
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">P</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">i</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">t</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">c</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">h</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">.</span>

          <span className="w-3 md:w-6" /> {/* spacer */}

          {/* Connect. (italic) */}
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">C</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">o</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">n</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">n</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">e</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">c</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">t</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">.</span>
        </div>

        {/* Wipe panels – red then black */}
        <div
          ref={loaderWipeRedRef}
          className="absolute inset-0 bg-coral z-20 pointer-events-none"
        />
        <div
          ref={loaderWipeBlackRef}
          className="absolute inset-0 bg-black z-30 pointer-events-none"
        />
      </div>
    </section>
  );
}
