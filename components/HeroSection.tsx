// components/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextContainerRef = useRef<HTMLDivElement>(null);
  
  // ---- NEW: Split‑text + image reveal refs ----
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const textTopRef = useRef<HTMLDivElement>(null);
  const textBottomRef = useRef<HTMLDivElement>(null);
  const imageRevealRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const contentOverlayRef = useRef<HTMLDivElement>(null); // your existing content

  // ---- Loader refs (unchanged but modified in JSX) ----
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTitleRef = useRef<HTMLDivElement>(null);
  const loaderWipeRedRef = useRef<HTMLDivElement>(null);
  const loaderWipeBlackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const safetyUnlock = window.setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).__unlockLenis) {
        (window as any).__unlockLenis();
      }
    }, 5000);

    const mm = gsap.matchMedia();

    /*
     * ============================================================
     * 1. LOADING ANIMATION – character stagger + panels from BOTTOM
     * ============================================================
     */
    mm.add('all', () => {
      const loader = loaderRef.current;
      const loaderTitle = loaderTitleRef.current;
      const wipeRed = loaderWipeRedRef.current;
      const wipeBlack = loaderWipeBlackRef.current;

      if (loader && loaderTitle && wipeRed && wipeBlack) {
        const loaderTl = gsap.timeline();
        const chars = loaderTitle.querySelectorAll('span');

        // Initial states
        gsap.set(loader, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
        gsap.set(chars, { scale: 0.5, opacity: 0 });
        gsap.set([wipeRed, wipeBlack], { yPercent: 100 }); // start at BOTTOM

        loaderTl
          .to(chars, {
            scale: 1.05,
            opacity: 1,
            duration: 0.8,
            stagger: 0.04,
            ease: 'expo.out',
          })
          .to(chars, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.inOut',
          })
          .fromTo(wipeRed, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' }, '+=0.2')
          .fromTo(wipeBlack, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' }, '-=0.4')
          .set(chars, { opacity: 0 })
          .set(loader, { backgroundColor: 'transparent' })
          .to(wipeRed, { yPercent: 100, duration: 0.6, ease: 'power3.inOut' })
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
     * ============================================================
     * 2. HERO SCROLL – Text splits, image expands, then content appears
     * ============================================================
     */
    mm.add('all', () => {
      const container = containerRef.current;
      const textTop = textTopRef.current;
      const textBottom = textBottomRef.current;
      const imageReveal = imageRevealRef.current;
      const imageInner = imageInnerRef.current;
      const contentOverlay = contentOverlayRef.current;

      if (!container || !textTop || !textBottom || !imageReveal || !imageInner || !contentOverlay) return;

      // Initial states
      gsap.set(textTop, { y: 0, opacity: 1 });
      gsap.set(textBottom, { y: 0, opacity: 1 });
      gsap.set(imageReveal, {
        scale: 0.3,
        opacity: 0,
        borderRadius: '50%',
      });
      gsap.set(imageInner, {
        scale: 1.2,
        filter: 'blur(8px)',
      });
      gsap.set(contentOverlay, { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=200%',        // adjust scroll distance as needed
          scrub: 0.8,
          pin: true,
        },
      });

      tl
        // 1) Text splits: top half moves up, bottom half moves down
        .to(textTop, {
          y: '-50%',
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
        })
        .to(textBottom, {
          y: '50%',
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
        }, '<')

        // 2) Image expands from centre
        .to(imageReveal, {
          scale: 1,
          opacity: 1,
          borderRadius: '0%',
          duration: 1.8,
          ease: 'power3.inOut',
        }, '-=0.4')

        // 3) Image sharpens (zoom settles, blur goes away)
        .to(imageInner, {
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power2.out',
        }, '-=0.8')

        // 4) Content fades in on top of the image
        .to(contentOverlay, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        }, '+=0.2')

        // 5) Finally, fade out the whole hero (optional)
        .to(container, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        }, '+=0.5');
    });

    return () => {
      window.clearTimeout(safetyUnlock);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-between p-6 md:p-10"
    >
      {/* ===== BACKGROUND GLOW (unchanged) ===== */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(143,83,252,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(251,87,95,0.12),transparent_55%)] pointer-events-none z-0" />

      {/* ===== TOP HEADER (unchanged) ===== */}
      <div className="relative z-10 flex justify-between items-start md:items-center text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase font-sans w-full">
        <p className="max-w-[65%] md:max-w-sm leading-relaxed">
          Your idea deserves more than a{' '}
          <span className="italic font-serif font-normal text-offwhite">
            classroom pitch.
          </span>
        </p>
        <span className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-0 text-right">
          <img
            src="/meraki-logo.png"
            alt="Meraki"
            className="h-3 md:h-4 w-auto invert opacity-90"
          />
          <span className="font-serif">2026</span>
        </span>
      </div>

      {/* ===== CENTER AREA (now contains split text + image + content) ===== */}
      <div
        ref={heroTextContainerRef}
        className="relative z-10 my-auto w-full flex flex-col items-center justify-center px-4 md:px-12 pointer-events-none"
      >
        {/* --- Split text (overlaid on top) --- */}
        <div ref={splitContainerRef} className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Top half of the text */}
          <div
            ref={textTopRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center overflow-hidden"
            style={{ clipPath: 'inset(0 0 50% 0)' }}
          >
            <h1 className="text-5xl md:text-[9vw] font-semibold tracking-tight text-offwhite leading-none uppercase font-sans">
              Pitch. Connect. Scale.
            </h1>
          </div>
          {/* Bottom half of the text */}
          <div
            ref={textBottomRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center overflow-hidden"
            style={{ clipPath: 'inset(50% 0 0 0)' }}
          >
            <h1 className="text-5xl md:text-[9vw] font-semibold tracking-tight text-offwhite leading-none uppercase font-sans">
              Pitch. Connect. Scale.
            </h1>
          </div>
        </div>

        {/* --- Image that expands --- */}
        <div
          ref={imageRevealRef}
          className="absolute inset-0 m-auto w-[80%] md:w-[60%] aspect-[4/3] overflow-hidden shadow-2xl pointer-events-none"
          style={{ scale: 0.3, opacity: 0, borderRadius: '50%' }}
        >
          <div
            ref={imageInnerRef}
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url(/C3675T01.JPG)', // change to your image path
              scale: 1.2,
              filter: 'blur(8px)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* --- Content overlay (your existing "Your idea. Your stage..." text) --- */}
        <div
          ref={contentOverlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 max-w-4xl mx-auto text-center pointer-events-none"
          style={{ opacity: 0, y: 30 }}
        >
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif italic font-normal text-offwhite leading-tight">
            Your idea. Your stage. <span className="text-gradient-brand">Your shot.</span>
          </h3>
          <div className="space-y-4 text-sm md:text-lg lg:text-xl text-neutral-300 font-sans font-light leading-relaxed max-w-3xl mt-6">
            <p>
              <strong className="font-medium text-offwhite">Meraki</strong> is FIIB's flagship international business plan competition for the next generation of entrepreneurs.
            </p>
            <p>
              Since 2012, it has brought together ambitious students, mentors, investors and industry leaders to turn promising ideas into stronger, more viable ventures.
            </p>
            <p>
              It’s not just about having a great idea. It’s about solving a real problem, building a strong business case and pitching it with conviction.
            </p>
          </div>
        </div>

        {/* --- Original date (keep it visible on top of everything) --- */}
        <p className="relative z-20 text-lg md:text-2xl text-neutral-300 font-light tracking-widest uppercase font-sans mt-8">
          23rd{' '}
          <span className="text-coral-light/70">—</span>{' '}
          25th October 2026
        </p>
      </div>

      {/* ===== BOTTOM FOOTER (unchanged) ===== */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase border-t border-white/10 pt-4 md:pt-6 font-sans">
        <div className="flex gap-4 md:gap-6">
          <span>Ideate</span>
          <span>/</span>
          <span>Build</span>
          <span>/</span>
          <span>Launch</span>
        </div>
        <div className="pointer-events-auto">
          <a
            href="#register"
            className="inline-block bg-coral text-offwhite px-8 py-3 rounded-full font-serif font-semibold normal-case tracking-normal text-sm hover:bg-purple transition-colors duration-300"
          >
            Register for Meraki
          </a>
        </div>
      </div>

      {/* ===== LOADER OVERLAY (updated with character spans & bottom panels) ===== */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
      >
        <div
          ref={loaderTitleRef}
          className="relative z-10 flex items-baseline justify-center gap-1 md:gap-2 whitespace-nowrap origin-center"
        >
          {/* Each character as a separate span for stagger */}
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">P</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">i</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">t</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">c</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">h</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">.</span>
          <span className="w-3 md:w-6" />
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">C</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">o</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">n</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">n</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">e</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">c</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">t</span>
          <span className="text-5xl sm:text-6xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">.</span>
        </div>

        {/* Panels start from the BOTTOM (yPercent: 100) – see animation */}
        <div ref={loaderWipeRedRef} className="absolute inset-0 bg-coral z-20 pointer-events-none" />
        <div ref={loaderWipeBlackRef} className="absolute inset-0 bg-black z-30 pointer-events-none" />
      </div>
    </section>
  );
}
