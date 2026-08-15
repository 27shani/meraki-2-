// components/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextContainerRef = useRef<HTMLDivElement>(null);
  const expandBoxRef = useRef<HTMLDivElement>(null);
  const expandContentRef = useRef<HTMLDivElement>(null);

  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTitleRef = useRef<HTMLDivElement>(null);
  const loaderWipeRedRef = useRef<HTMLDivElement>(null);
  const loaderWipeBlackRef = useRef<HTMLDivElement>(null);

  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const safetyUnlock = window.setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).__unlockLenis) {
        (window as any).__unlockLenis();
      }
    }, 5000);

    const mm = gsap.matchMedia();

    mm.add("all", () => {
      const loader = loaderRef.current;
      const loaderTitle = loaderTitleRef.current;
      const wipeRed = loaderWipeRedRef.current;
      const wipeBlack = loaderWipeBlackRef.current;

      if (loader && loaderTitle && wipeRed && wipeBlack) {
        const loaderTl = gsap.timeline();
        const chars = loaderTitle.querySelectorAll('span');

        gsap.set(loader, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
        gsap.set(chars, { scale: 0.5, opacity: 0 });
        gsap.set([wipeRed, wipeBlack], { yPercent: 100 });

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

              if (heroTitleRef.current) {
                const words = heroTitleRef.current.querySelectorAll('span');
                gsap.from(words, {
                  opacity: 0,
                  y: 50,
                  duration: 0.6,
                  stagger: 0.12,
                  ease: 'power3.out',
                  delay: 0.2,
                });
              }
            },
          }, '-=0.4');
      }
    });

    // ===== DESKTOP SCROLL ANIMATION (unchanged) =====
    mm.add("(min-width: 768px)", () => {
      gsap.set(heroTextContainerRef.current, { y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: 0.6,
          pin: true,
        },
      });

      tl.to(expandBoxRef.current, {
        width: '350px',
        height: '200px',
        opacity: 1,
        borderRadius: '0px',
        ease: 'power3.out',
      })
        .to(expandBoxRef.current, {
          width: '100%',
          height: '100%',
          borderRadius: '0px',
          borderWidth: '0px',
          ease: 'power3.inOut',
        }, '+=0.1')
        .fromTo(expandContentRef.current,
          { opacity: 0, y: 60, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.5 },
          '<0.2'
        )
        .to(containerRef.current, {
          scale: 0.85,
          opacity: 0.15,
          filter: 'blur(6px)',
          yPercent: -20,
          ease: 'power2.inOut',
          duration: 1.2,
        }, '+=0.3');
    });

    // ===== MOBILE SCROLL ANIMATION (unchanged) =====
    mm.add("(max-width: 767px)", () => {
      gsap.set(heroTextContainerRef.current, { y: '22vh' });

      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          scrub: 0.6,
          pin: true,
        },
      });

      mobileTl.to(heroTextContainerRef.current, { y: 0, duration: 1.2, ease: 'power2.out' })
        .to(expandBoxRef.current, {
          width: '220px',
          height: '350px',
          opacity: 1,
          borderRadius: '0px',
          ease: 'power3.out',
          duration: 1
        }, "+=0.2")
        .to(expandBoxRef.current, {
          width: '100%',
          height: '100%',
          borderRadius: '0px',
          borderWidth: '0px',
          ease: 'power3.inOut',
          duration: 1.2
        }, '+=0.2')
        .fromTo(expandContentRef.current,
          { opacity: 0, y: 60, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.5 },
          '<0.2'
        )
        .to(containerRef.current, {
          scale: 0.85,
          opacity: 0.15,
          filter: 'blur(6px)',
          yPercent: -20,
          ease: 'power2.inOut',
          duration: 1.2,
        }, '+=0.3');
    });

    return () => {
      window.clearTimeout(safetyUnlock);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-black text-offwhite overflow-hidden flex flex-col md:justify-between justify-center"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(143,83,252,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(251,87,95,0.12),transparent_55%)] pointer-events-none z-0" />

      {/* Top Header – stays at top */}
      <div className="relative z-10 flex justify-between items-start md:items-center text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase font-sans w-full px-6 md:px-10 pt-6 md:pt-10">
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

      {/* Centered Hero Title – uses flex-1 to take remaining space and center content */}
      <div
        ref={heroTextContainerRef}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-12 pointer-events-none gap-6 -mt-16 md:mt-0"
      >
        <h1
          ref={heroTitleRef}
          className="text-5xl md:text-[9vw] font-semibold tracking-tight text-offwhite leading-none uppercase text-center flex flex-wrap justify-center gap-x-4 md:gap-x-8 font-sans"
        >
          <span>Pitch.</span>
          <span className="font-serif italic font-normal text-gradient-brand">
            Connect.
          </span>
          <span>Scale.</span>
        </h1>

        <p className="text-lg md:text-2xl text-neutral-300 font-light tracking-widest uppercase font-sans">
          23rd{' '}
          <span className="text-coral-light/70">
            —
          </span>{' '}
          25th October 2026
        </p>
      </div>

      {/* Bottom Footer – stays at bottom */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase border-t border-white/10 pt-4 md:pt-6 px-6 md:px-10 pb-6 md:pb-10 font-sans">
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

      {/* FULL-SCREEN EXPANDING OVERLAY (unchanged) */}
      <div
        ref={expandBoxRef}
        className="absolute inset-0 m-auto w-0 h-0 opacity-0 z-30 overflow-hidden bg-ink shadow-2xl flex items-center justify-center text-center pointer-events-none"
      >
        <img
          src="/C3675T01.JPG"
          alt="Meraki Hackathon Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-purple/20 mix-blend-color pointer-events-none" />

        <div
          ref={expandContentRef}
          className="relative z-40 flex flex-col items-center justify-center px-6 md:px-12 max-w-4xl space-y-6 md:space-y-8"
        >
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif italic font-normal text-offwhite leading-tight">
            Your idea. Your stage. <span className="text-gradient-brand">Your shot.</span>
          </h3>
          <div className="space-y-4 text-sm md:text-lg lg:text-xl text-neutral-300 font-sans font-light leading-relaxed max-w-3xl">
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
      </div>

      {/* LOADER – mobile‑friendly with word‑level wrapping */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
      >
        <div
          ref={loaderTitleRef}
          className="relative z-10 flex flex-wrap justify-center items-baseline gap-x-1 md:gap-x-2 gap-y-2 max-w-[90vw] md:max-w-none"
        >
          {/* Word: Pitch. */}
          <span className="inline-block whitespace-nowrap">
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">P</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">i</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">t</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">c</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">h</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">.</span>
          </span>

          {/* Word: Connect. */}
          <span className="inline-block whitespace-nowrap">
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">C</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">o</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">n</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">n</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">e</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">c</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">t</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-serif italic font-normal tracking-tight leading-none text-gradient-brand">.</span>
          </span>

          {/* Word: Scale. */}
          <span className="inline-block whitespace-nowrap">
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">S</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">c</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">a</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">l</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">e</span>
            <span className="text-3xl sm:text-4xl md:text-8xl lg:text-[9vw] font-semibold tracking-tight leading-none text-offwhite font-sans">.</span>
          </span>
        </div>

        {/* Wipe overlays */}
        <div ref={loaderWipeRedRef} className="absolute inset-0 bg-coral z-20 pointer-events-none" />
        <div ref={loaderWipeBlackRef} className="absolute inset-0 bg-black z-30 pointer-events-none" />
      </div>
    </section>
  );
}
