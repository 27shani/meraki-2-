// components/FooterSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoChars, applyCharHover, initCharHover } from '@/lib/splitText';

/**
 * FooterSection
 * -------------------------------------------------
 * - Full‑screen fixed reveal with transition spacer
 * - Title characters reassemble with staggered yPercent reveal
 * - ASCII art decorations on both sides
 * - Character hover effects remain active
 * - Social links and email use clip‑path wipe reveals
 */
export default function FooterSection() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linkRefs = useRef<(HTMLElement | null)[]>([]);

  const addLinkRef = (el: HTMLElement | null) => {
    if (el && !linkRefs.current.includes(el)) {
      linkRefs.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // --- 1. Initial states ---
      gsap.set(footerRef.current, { opacity: 0, y: 60 });
      gsap.set(navRef.current, { opacity: 0, y: 30 });

      // --- 2. Split big title into characters for staggered reveal ---
      let titleChars: HTMLElement[] = [];
      if (titleRef.current && !prefersReduced) {
        const spans = titleRef.current.querySelectorAll('[data-split]');
        spans.forEach((span) => {
          const chars = splitIntoChars(span as HTMLElement);
          applyCharHover(chars); // character hover remains active
          titleChars = titleChars.concat(chars.map((c) => c.wrapper));
        });
        gsap.set(titleChars, { yPercent: 110, opacity: 0 });
      } else if (titleRef.current) {
        gsap.set(titleRef.current, { yPercent: 100 });
      }

      // --- 3. Character hover on links marked data-char-hover ---
      initCharHover(footerRef.current || document);

      // --- 4. Links initial – hidden with clip‑path ---
      gsap.set(linkRefs.current, {
        opacity: 0,
        clipPath: 'inset(100% 0 0 0)',
        y: 12,
      });

      // --- 5. Main scroll‑triggered timeline ---
      // The spacer triggers the footer reveal when it enters the viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacerRef.current,
          start: 'top bottom',    // spacer top hits viewport bottom
          end: 'top center',      // spacer top hits viewport center
          scrub: 1.2,             // smooth, lagged feel
          invalidateOnRefresh: true,
        },
      });

      // 5a. Footer fades in and slides up
      tl.to(
        footerRef.current,
        { opacity: 1, y: 0, ease: 'power2.out', duration: 1.2 },
        0
      );

      // 5b. Nav block fades up (slightly delayed)
      tl.to(
        navRef.current,
        { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
        0.1
      );

      // 5c. Link clip‑path wipes with stagger
      tl.to(
        linkRefs.current,
        {
          opacity: 1,
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          stagger: 0.04,
          ease: 'power3.out',
          duration: 0.7,
        },
        0.15
      );

      // 5d. Title characters reassemble from below – staggered
      if (titleChars.length) {
        tl.to(
          titleChars,
          {
            yPercent: 0,
            opacity: 1,
            stagger: {
              each: 0.025,
              from: 'start',
            },
            ease: 'power3.out',
            duration: 1.2,
          },
          0.25
        );
      } else if (titleRef.current) {
        tl.to(
          titleRef.current,
          { yPercent: 0, ease: 'power3.out', duration: 1 },
          0.25
        );
      }

      // --- 6. Optional: scale up ASCII art on reveal ---
      const asciiLeft = footerRef.current?.querySelector('.ascii-left');
      const asciiRight = footerRef.current?.querySelector('.ascii-right');
      if (asciiLeft) gsap.set(asciiLeft, { scale: 0.8, opacity: 0 });
      if (asciiRight) gsap.set(asciiRight, { scale: 0.8, opacity: 0 });

      tl.to(
        [asciiLeft, asciiRight],
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
        },
        0.3
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // --- ASCII Art (creative coding style, matches lukebaffait) ---
  const asciiArt = `
    ███╗   ███╗███████╗██████╗  █████╗ ██╗  ██╗██╗
    ████╗ ████║██╔════╝██╔══██╗██╔══██╗██║ ██╔╝██║
    ██╔████╔██║█████╗  ██████╔╝███████║█████╔╝ ██║
    ██║╚██╔╝██║██╔══╝  ██╔══██╗██╔══██║██╔═██╗ ██║
    ██║ ╚═╝ ██║███████╗██║  ██║██║  ██║██║  ██╗██║
    ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
  `;

  return (
    <>
      {/* ---- FOOTER TRANSITION SPACER ---- */}
      <div
        ref={spacerRef}
        className="h-[60vh] md:h-[80vh] w-full bg-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* ---- MAIN FOOTER (fixed, full‑screen reveal) ---- */}
      <footer
        ref={footerRef}
        className="fixed inset-0 z-[999] bg-black text-offwhite px-6 md:px-16 py-12 md:py-16 flex flex-col justify-between overflow-hidden"
        style={{ opacity: 0, y: 60 }}
      >
        {/* Ambient brand glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,87,95,0.10),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(143,83,252,0.12),transparent_55%)] pointer-events-none z-0" />

        {/* ---- ASCII ART – Left side ---- */}
        <div className="ascii-left absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block opacity-0">
          <pre className="text-[5px] md:text-[7px] leading-[1.1] text-coral/20 font-mono whitespace-pre">
            {asciiArt}
          </pre>
        </div>

        {/* ---- ASCII ART – Right side ---- */}
        <div className="ascii-right absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block opacity-0">
          <pre className="text-[5px] md:text-[7px] leading-[1.1] text-purple/20 font-mono whitespace-pre text-right">
            {asciiArt}
          </pre>
        </div>

        {/* ---- TOP NAVIGATION (unchanged content) ---- */}
        <div
          ref={navRef}
          className="relative max-w-6xl w-full mx-auto flex flex-col md:flex-row justify-between items-start gap-8 z-10"
          style={{ opacity: 0, y: 30 }}
        >
          <div>
            <img
              src="/meraki-logo.png"
              alt="Meraki"
              className="h-5 w-auto invert opacity-90 mb-6"
            />
            <p className="text-xs uppercase tracking-widest text-coral-light mb-2 font-sans">
              <span ref={addLinkRef}>Get in Touch</span>
            </p>
            <a
              href="mailto:meraki2026@fiib.edu.in"
              className="text-lg hover:underline text-neutral-300 font-sans"
            >
              <span ref={addLinkRef} data-char-hover>
                meraki2026@fiib.edu.in
              </span>
            </a>
            <p className="text-xs text-neutral-500 mt-2 font-sans">
              <span ref={addLinkRef}>Powered by FIIB</span>
            </p>
          </div>

          <div className="flex gap-12 text-xs uppercase tracking-widest text-neutral-400 font-sans">
            <div className="space-y-2 flex flex-col">
              <span className="text-neutral-200 font-semibold">
                <span ref={addLinkRef}>Meraki Team</span>
              </span>
              <span className="text-neutral-500 max-w-xs normal-case tracking-normal">
                <span ref={addLinkRef}>
                  Fortune Institute of International Business
                </span>
                <br />
                <span ref={addLinkRef}>
                  Plot No. 5, Rao Tula Ram Marg, Opp. Army R&R Hospital, Vasant
                  Vihar, New Delhi 110057
                </span>
              </span>
            </div>
            <div className="space-y-2 flex flex-col">
              <a
                href="tel:+917060366392"
                className="hover:text-offwhite transition-colors"
              >
                <span ref={addLinkRef}>+91 7060366392</span>
              </a>
              <a
                href="tel:+919958617024"
                className="hover:text-offwhite transition-colors"
              >
                <span ref={addLinkRef}>+91 9958617024</span>
              </a>
              <a
                href="tel:+919910470427"
                className="hover:text-offwhite transition-colors"
              >
                <span ref={addLinkRef}>+91 9910470427</span>
              </a>
              <a
                href="#"
                className="hover:text-offwhite transition-colors mt-4 block"
              >
                <span ref={addLinkRef} data-char-hover>
                  Instagram
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ---- BOTTOM CLOSING TITLE (unchanged content) ---- */}
        <div className="relative max-w-6xl w-full mx-auto z-10">
          <div ref={maskRef} className="overflow-hidden pb-4">
            <h1
              ref={titleRef}
              className="text-5xl md:text-[9vw] font-sans font-semibold tracking-tighter leading-none text-offwhite/90 select-none uppercase"
            >
              <span data-split>Meraki</span>{' '}
              <span
                data-split
                className="font-serif italic font-normal text-gradient-brand"
              >
                2026.
              </span>
            </h1>
          </div>
        </div>

        {/* ---- DECORATIVE DOT (like lukebaffait) ---- */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-10">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-coral to-purple opacity-60" />
        </div>
      </footer>
    </>
  );
}
