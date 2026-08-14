// components/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoChars, initCharHover } from '@/lib/splitText';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const expandBoxRef = useRef<HTMLDivElement>(null);
  const expandContentRef = useRef<HTMLDivElement>(null);
  const topHeaderRef = useRef<HTMLDivElement>(null);

  // Loader refs
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTitleRef = useRef<HTMLDivElement>(null);
  const loaderWipeRedRef = useRef<HTMLDivElement>(null);
  const loaderWipeBlackRef = useRef<HTMLDivElement>(null);

  // Main title + bottom bar refs for scroll exit
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skip long intro on return visits if desired
    const skipIntro =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('meraki-intro-seen') === '1';

    const ctx = gsap.context(() => {
      /*
       * =========================================================
       * OPENING LOADING ANIMATION: TEXT SCRAMBLE + WIPE REVEAL
       * =========================================================
       */
      const loader = loaderRef.current;
      const loaderTitle = loaderTitleRef.current;
      const wipeRed = loaderWipeRedRef.current;
      const wipeBlack = loaderWipeBlackRef.current;

      if (loader && loaderTitle && wipeRed && wipeBlack && !prefersReduced && !skipIntro) {
        const pitchSpan = loaderTitle.querySelector('[data-word="pitch"]') as HTMLElement;
        const connectSpan = loaderTitle.querySelector('[data-word="connect"]') as HTMLElement;

        // Custom text scramble function
        const scrambleWord = (element: HTMLElement, finalStr: string) => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*';
          let iterations = 0;
          const interval = setInterval(() => {
            element.innerText = finalStr
              .split('')
              .map((letter, index) => {
                if (letter === ' ') return ' ';
                if (index < iterations) return finalStr[index];
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join('');

            if (iterations >= finalStr.length) {
              clearInterval(interval);
              element.innerText = finalStr;
            }
            iterations += 1 / 3;
          }, 35);
        };

        // Trigger scramble
        if (pitchSpan) scrambleWord(pitchSpan, "Pitch.");
        if (connectSpan) scrambleWord(connectSpan, "Connect.");

        const loaderTl = gsap.timeline();

        loaderTl
          // Wait for the scramble effect to finish
          .to({}, { duration: 1.4 }) 
          // Wipes slide down from top to cover the screen
          .fromTo(wipeRed, 
            { yPercent: -100 }, 
            { yPercent: 0, duration: 0.6, ease: "power3.inOut" }
          )
          .fromTo(wipeBlack, 
            { yPercent: -100 }, 
            { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 
            "-=0.4"
          )
          // Hide loader background and text while screen is covered in black
          .set(loaderTitle, { opacity: 0 })
          .set(loader, { backgroundColor: 'transparent' })
          // Wipes slide down out of view, revealing the site
          .to(wipeRed, { yPercent: 100, duration: 0.6, ease: "power3.inOut" })
          .to(wipeBlack, { 
            yPercent: 100, 
            duration: 0.6, 
            ease: "power3.inOut",
            onComplete: () => {
              sessionStorage.setItem('meraki-intro-seen', '1');
              gsap.set(loader, { visibility: 'hidden', pointerEvents: 'none' });
              if (typeof window !== 'undefined' && (window as any).__unlockLenis) {
                (window as any).__unlockLenis();
              }
            }
          }, "-=0.4");

      } else if (loader) {
        // Skip intro — unlock scroll immediately
        gsap.set(loader, { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });
        if (typeof window !== 'undefined' && (window as any).__unlockLenis) {
          (window as any).__unlockLenis();
        }
      }

      // Char hover on CTA / key interactive text
      initCharHover(containerRef.current || document);

      /*
       * =========================================================
       * MAIN TITLE CHARACTER SPLIT (visible hero)
       * =========================================================
       */
      const mainTitle = mainTitleRef.current;
      const titleChars: { left: HTMLElement[]; right: HTMLElement[] } = {
        left: [],
        right: [],
      };

      if (mainTitle && !prefersReduced) {
        const spans = mainTitle.querySelectorAll('[data-split]');
        spans.forEach((span, idx) => {
          const chars = splitIntoChars(span as HTMLElement);
          const wrappers = chars.map((c) => c.wrapper);
          // First half of words go left, second half go right on exit
          if (idx < spans.length / 2) {
            titleChars.left.push(...wrappers);
          } else {
            titleChars.right.push(...wrappers);
          }
        });
      }

      /*
       * =========================================================
       * HERO SCROLL TIMELINE (Pinned Text Split & Reveal)
       * =========================================================
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=260%',
          scrub: 1.4,
          pin: true,
        },
      });

      // 1. UI elements fade out & Text splits open
      tl.to(
        [topHeaderRef.current, taglineRef.current, bottomBarRef.current],
        { opacity: 0, y: -20, filter: 'blur(10px)', duration: 0.8, ease: 'power2.inOut' },
        0
      )
      .to(
        titleChars.left,
        { xPercent: -200, opacity: 0, ease: 'power3.inOut', stagger: 0.02, duration: 1.2 },
        0
      )
      .to(
        titleChars.right,
        { xPercent: 200, opacity: 0, ease: 'power3.inOut', stagger: 0.02, duration: 1.2 },
        0
      )
      // 2. Image emerges from middle and expands to full screen
      .fromTo(
        expandBoxRef.current,
        { width: '15vw', height: '15vh', opacity: 0, borderRadius: '24px', scale: 0.8 },
        { width: '100%', height: '100%', opacity: 1, borderRadius: '0px', scale: 1, duration: 1.6, ease: 'power3.inOut' },
        0.2 // Starts slightly after the text begins splitting
      )
      // 3. Text inside image smoothly fades in
      .fromTo(
        expandContentRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
        "-=0.6" // overlaps with the end of the image expansion
      )
      // 4. Final transition to next section (scrolls up and dissolves)
      .to(
        containerRef.current,
        { opacity: 0, filter: 'blur(15px)', yPercent: -15, duration: 1.2, ease: 'power2.inOut' },
        "+=0.4"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-between p-6 md:p-10"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(143,83,252,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(251,87,95,0.12),transparent_55%)] pointer-events-none z-0" />

      {/* Top Header */}
      <div ref={topHeaderRef} className="relative z-10 flex justify-between items-center text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase font-sans">
        <p className="max-w-sm leading-relaxed">
          Your idea deserves more than a{' '}
          <span className="italic font-serif font-normal text-offwhite">
            classroom pitch.
          </span>
        </p>

        <span className="hidden md:flex items-center gap-2">
          <img
            src="/meraki-logo.png"
            alt="Meraki"
            className="h-4 w-auto invert opacity-90"
          />
          <span className="font-serif">2026</span>
        </span>
      </div>

      {/* Background Hero Typography */}
      <div className="relative z-10 my-auto w-full flex flex-col items-center justify-center px-4 md:px-12 pointer-events-none gap-6">
        <h1
          ref={mainTitleRef}
          className="text-5xl md:text-[9vw] font-semibold tracking-tight text-offwhite leading-none uppercase text-center flex flex-wrap justify-center gap-x-4 md:gap-x-8 font-sans"
        >
          <span data-split>Pitch.</span>
          <span
            data-split
            className="font-serif italic font-normal text-gradient-brand"
          >
            Connect.
          </span>
          <span data-split>Scale.</span>
        </h1>

        <p
          ref={taglineRef}
          className="text-lg md:text-2xl text-neutral-300 font-light tracking-widest uppercase font-sans"
        >
          23rd{' '}
          <span className="text-coral-light/70">—</span>{' '}
          25th October 2026
        </p>
      </div>

      {/* Bottom Footer */}
      <div
        ref={bottomBarRef}
        className="relative z-10 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase border-t border-white/10 pt-4 md:pt-6 font-sans"
      >
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
            <span data-char-hover>Register for Meraki</span>
          </a>
        </div>
      </div>

      {/* FULL-SCREEN EXPANDING OVERLAY */}
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
            Your idea. Your stage.{' '}
            <span className="text-gradient-brand">Your shot.</span>
          </h3>

          <div className="space-y-4 text-sm md:text-lg lg:text-xl text-neutral-300 font-sans font-light leading-relaxed max-w-3xl">
            <p>
              <strong className="font-medium text-offwhite">Meraki</strong> is
              FIIB&apos;s flagship international business plan competition for the
              next generation of entrepreneurs.
            </p>
            <p>
              Since 2012, it has brought together ambitious students, mentors,
              investors and industry leaders to turn promising ideas into
              stronger, more viable ventures.
            </p>
            <p>
              It&apos;s not just about having a great idea. It&apos;s about
              solving a real problem, building a strong business case and
              pitching it with conviction.
            </p>
          </div>
        </div>
      </div>

      {/* OPENING LOADING ANIMATION */}
      <div
        ref={loaderRef}
        className="
          fixed
          inset-0
          z-[999]
          bg-black
          flex
          items-center
          justify-center
          overflow-hidden
          pointer-events-none
        "
      >
        <div
          ref={loaderTitleRef}
          className="
            relative
            z-10
            flex
            items-baseline
            justify-center
            gap-3
            md:gap-6
            whitespace-nowrap
            origin-center
          "
        >
          <span
            data-word="pitch"
            className="
              text-5xl
              sm:text-6xl
              md:text-8xl
              lg:text-[9vw]
              font-semibold
              tracking-tight
              leading-none
              text-offwhite
              font-sans
            "
          >
            Pitch.
          </span>

          <span
            data-word="connect"
            className="
              text-5xl
              sm:text-6xl
              md:text-8xl
              lg:text-[9vw]
              font-serif
              italic
              font-normal
              tracking-tight
              leading-none
              text-gradient-brand
            "
          >
            Connect.
          </span>
        </div>

        {/* Wipe Transition Layers */}
        <div ref={loaderWipeRedRef} className="absolute inset-0 bg-coral transform -translate-y-full z-20" />
        <div ref={loaderWipeBlackRef} className="absolute inset-0 bg-black transform -translate-y-full z-30" />
      </div>
    </section>
  );
}
