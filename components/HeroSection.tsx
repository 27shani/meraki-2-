// components/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const expandBoxRef = useRef<HTMLDivElement>(null);
  const expandContentRef = useRef<HTMLDivElement>(null);

  // Opening loading animation refs
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderTitleRef = useRef<HTMLDivElement>(null);
  const loaderRedFlashRef = useRef<HTMLDivElement>(null);
  
  // NEW: Refs for the color wipe transition
  const loaderWipeRedRef = useRef<HTMLDivElement>(null);
  const loaderWipeBlackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /*
       * =========================================================
       * OPENING LOADING ANIMATION
       * =========================================================
       */

      const loader = loaderRef.current;
      const loaderTitle = loaderTitleRef.current;
      const redFlash = loaderRedFlashRef.current;
      
      const wipeRed = loaderWipeRedRef.current;
      const wipeBlack = loaderWipeBlackRef.current;

      if (loader && loaderTitle && redFlash && wipeRed && wipeBlack) {
        const loaderTl = gsap.timeline();

        // Initial state
        gsap.set(loader, { opacity: 1, visibility: 'visible' });
        gsap.set(loaderTitle, { scale: 1, opacity: 1 });
        gsap.set(redFlash, { opacity: 0, scale: 0.85 });

        loaderTl
          .to({}, { duration: 0.5 }) // Initial breath
          
          // Compress with an 'expo' ease for a very smooth, drawn-out curve
          .to(loaderTitle, {
            scale: 0.35,
            opacity: 0.95,
            duration: 1.2,
            ease: 'expo.inOut',
          })
          
          .to({}, { duration: 0.15 }) // Micro-pause
          
          // Brand Flash
          .to(redFlash, {
            opacity: 1,
            scale: 1,
            duration: 0.15,
            ease: 'power3.in',
          })
          
          .to({}, { duration: 0.05 }) // Hold flash
          
          // Fade flash out
          .to(redFlash, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
          
          // Expand title back out smoothly, overlapping slightly with the flash fade
          .to(loaderTitle, {
            scale: 1.05, // Slight over-scale for a breathing effect
            opacity: 1,
            duration: 1.2,
            ease: 'expo.inOut',
          }, '-=0.2')
          
          // 1. NEW: Color Wipe Transition to reveal the page
          .fromTo(wipeRed, 
            { yPercent: -100 }, 
            { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 
            '-=0.2'
          )
          .fromTo(wipeBlack, 
            { yPercent: -100 }, 
            { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 
            "-=0.4"
          )
          // Hide loader background and text while screen is covered in black
          .set(loaderTitle, { opacity: 0 })
          .set(loader, { backgroundColor: 'transparent' })
          .set(redFlash, { display: 'none' })
          // Wipes slide down out of view, revealing the site beautifully
          .to(wipeRed, { yPercent: 100, duration: 0.6, ease: "power3.inOut" })
          .to(wipeBlack, { 
            yPercent: 100, 
            duration: 0.6, 
            ease: "power3.inOut",
            onComplete: () => {
              gsap.set(loader, { visibility: 'hidden', pointerEvents: 'none' });
            }
          }, "-=0.4");
      }

      /*
       * =========================================================
       * EXISTING HERO SCROLL ANIMATION (smooth pinned intro/outro)
       * =========================================================
       */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%', // Increased scroll distance to make the animation feel less rushed
          scrub: 1.5, // Increased scrub smoothing
          pin: true,
        },
      });

      // 1. Reveal initial compact card in center
      tl.to(expandBoxRef.current, {
        width: '350px',
        height: '200px',
        opacity: 1,
        borderRadius: '24px',
        ease: 'power3.out',
      })

        // 2. Expand to 100% full screen overlay
        .to(
          expandBoxRef.current,
          {
            width: '100%',
            height: '100%',
            borderRadius: '0px',
            borderWidth: '0px',
            ease: 'power3.inOut',
          },
          '+=0.1'
        )

        // 2.5 Fade and slide in the new text content simultaneously with the expansion
        .fromTo(
          expandContentRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          '<' // Syncs this animation to start at the exact same time as the expansion
        )

        // 3. NEW: Smooth exit transition — content dissolves and lifts up
        .to(
          containerRef.current,
          {
            yPercent: -15, // Lifts the entire container out of the way smoothly
            opacity: 0,
            filter: 'blur(16px)',
            ease: 'power2.inOut',
          },
          '+=0.3'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-between p-6 md:p-10"
    >
      {/* =====================================================
          ORIGINAL HERO
          ===================================================== */}

      {/* Background Glow — subtle brand-colored ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(143,83,252,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(251,87,95,0.12),transparent_55%)] pointer-events-none z-0" />

      {/* Top Header (Eyebrow) */}
      <div className="relative z-10 flex justify-between items-center text-[10px] md:text-xs tracking-widest text-neutral-400 uppercase font-sans">
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
        <h1 className="text-5xl md:text-[9vw] font-semibold tracking-tight text-offwhite leading-none uppercase text-center flex flex-wrap justify-center gap-x-4 md:gap-x-8 font-sans">
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

      {/* Bottom Footer */}
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

      {/* =====================================================
          FULL-SCREEN EXPANDING OVERLAY
          ===================================================== */}

      <div
        ref={expandBoxRef}
        className="absolute inset-0 m-auto w-0 h-0 opacity-0 z-30 overflow-hidden bg-ink border border-white/20 shadow-2xl flex items-center justify-center text-center pointer-events-none"
      >
        <img
          src="/C3675T01.JPG"
          alt="Meraki Hackathon Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-purple/20 mix-blend-color pointer-events-none" />

        {/* New Added Content Area */}
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

      {/* =====================================================
          OPENING LOADING ANIMATION
          ===================================================== */}

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
        {/* Brand Flash Layer */}
        <div
          ref={loaderRedFlashRef}
          className="
            absolute
            inset-0
            bg-coral
            opacity-0
            scale-[0.85]
          "
        />

        {/* Center Loading Title */}
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
        
        {/* NEW: Wipe Transition Layers (Z-index ensures they render over the background but below the final content) */}
        <div ref={loaderWipeRedRef} className="absolute inset-0 bg-coral transform -translate-y-full z-20" />
        <div ref={loaderWipeBlackRef} className="absolute inset-0 bg-black transform -translate-y-full z-30" />
      </div>
    </section>
  );
}
