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
  const loaderLogoRef = useRef<HTMLImageElement>(null);
  const loaderWipeRedRef = useRef<HTMLDivElement>(null);
  const loaderWipeBlackRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Safety unlock after 4 seconds
    const safetyUnlock = window.setTimeout(() => {
      (window as any).__unlockLenis?.();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, 4000);

    const mm = gsap.matchMedia();

    // ---------- LOADER (logo only) ----------
    mm.add('all', () => {
      const loader = loaderRef.current;
      const logo = loaderLogoRef.current;
      const wipeRed = loaderWipeRedRef.current;
      const wipeBlack = loaderWipeBlackRef.current;

      if (!loader || !logo || !wipeRed || !wipeBlack) return;

      gsap.set(loader, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
      gsap.set(logo, { scale: 0.75, opacity: 0 });
      gsap.set([wipeRed, wipeBlack], { yPercent: 100 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(loader, { visibility: 'hidden', pointerEvents: 'none' });
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          document.documentElement.classList.remove('lenis-stopped');

          (window as any).__unlockLenis?.();

          ScrollTrigger.refresh();
          setTimeout(() => ScrollTrigger.refresh(), 200);

          // Title reveal
          if (heroTitleRef.current) {
            const words = heroTitleRef.current.querySelectorAll('span');
            gsap.from(words, {
              opacity: 0,
              y: 40,
              duration: 0.55,
              stagger: 0.1,
              ease: 'power3.out',
            });
          }
        },
      });

      tl.to(logo, {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
      })
        .fromTo(wipeRed, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' }, '+=0.15')
        .fromTo(wipeBlack, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' }, '-=0.35')
        .set(logo, { opacity: 0 })
        .set(loader, { backgroundColor: 'transparent' })
        .to(wipeRed, { yPercent: 100, duration: 0.5, ease: 'power3.inOut' })
        .to(wipeBlack, { yPercent: 100, duration: 0.5, ease: 'power3.inOut' }, '-=0.35');
    });

    // ---------- DESKTOP (≥768px) ----------
    mm.add('(min-width: 768px)', () => {
      gsap.set(heroTextContainerRef.current, { y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=80%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(expandBoxRef.current, {
        width: '350px',
        height: '200px',
        opacity: 1,
        borderRadius: 0,
        ease: 'power3.out',
      })
        .to(
          expandBoxRef.current,
          {
            width: '100%',
            height: '100%',
            borderWidth: 0,
            ease: 'power3.inOut',
          },
          '+=0.1'
        )
        .fromTo(
          expandContentRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, ease: 'power3.out', duration: 1.4 },
          '<0.2'
        )
        .to(
          containerRef.current,
          {
            scale: 0.85,
            opacity: 0.15,
            yPercent: -20,
            ease: 'power2.inOut',
            duration: 1.1,
          },
          '+=0.25'
        );
    });

    // ---------- MOBILE (<768px) – lighter ----------
    mm.add('(max-width: 767px)', () => {
      // Much lighter animation – no heavy width/height changes
      gsap.set(heroTextContainerRef.current, { y: '6vh' });
      gsap.set(expandBoxRef.current, {
        scale: 0.3,
        opacity: 0,
        width: '100%',
        height: '100%',
        borderRadius: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=55%',          // shorter pin
          scrub: 0.35,           // more responsive
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(heroTextContainerRef.current, {
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
      })
        .to(
          expandBoxRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power3.inOut',
          },
          '+=0.1'
        )
        .fromTo(
          expandContentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: 'power3.out', duration: 1 },
          '<0.2'
        )
        .to(
          containerRef.current,
          {
            scale: 0.92,
            opacity: 0.2,
            yPercent: -10,
            ease: 'power2.inOut',
            duration: 0.9,
          },
          '+=0.15'
        );
    });

    return () => {
      window.clearTimeout(safetyUnlock);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-[100dvh] bg-black text-offwhite overflow-hidden flex flex-col justify-between"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(143,83,252,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(251,87,95,0.12),transparent_55%)] pointer-events-none z-0" />

      {/* Top Header */}
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

      {/* Centered Hero Title */}
      <div
        ref={heroTextContainerRef}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-12 pointer-events-none gap-6"
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
          23rd <span className="text-coral-light/70">—</span> 25th October 2026
        </p>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-6 text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase border-t border-white/10 pt-4 md:pt-6 px-6 md:px-10 pb-8 md:pb-10 font-sans">
        <div className="flex gap-4 md:gap-6 mt-1 md:mt-0">
          <span>FOR UNDERGRADUATE FOUNDERS</span>
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

      {/* Expanding Overlay */}
      <div
        ref={expandBoxRef}
        className="absolute inset-0 m-auto w-0 h-0 opacity-0 z-30 overflow-hidden bg-ink shadow-2xl flex items-center justify-center text-center pointer-events-none origin-center"
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
              <strong className="font-medium text-offwhite">Meraki</strong> is FIIB&apos;s flagship international business plan competition for the next generation of entrepreneurs.
            </p>
            <p>
              Since 2012, it has brought together ambitious students, mentors, investors and industry leaders to turn promising ideas into stronger, more viable ventures.
            </p>
            <p>
              It&apos;s not just about having a great idea. It&apos;s about solving a real problem, building a strong business case and pitching it with conviction.
            </p>
          </div>
        </div>
      </div>

      {/* LOADER – only big logo */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
      >
        <img
          ref={loaderLogoRef}
          src="/Meraki full logo png-02.png"
          alt="Meraki"
          className="h-20 sm:h-28 md:h-36 lg:h-44 w-auto object-contain"
        />
        <div ref={loaderWipeRedRef} className="absolute inset-0 bg-coral z-20 pointer-events-none" />
        <div ref={loaderWipeBlackRef} className="absolute inset-0 bg-black z-30 pointer-events-none" />
      </div>
    </section>
  );
}
