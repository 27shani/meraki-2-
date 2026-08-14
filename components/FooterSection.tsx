// components/FooterSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoChars, applyCharHover, initCharHover } from '@/lib/splitText';

/**
 * FooterSection
 * -------------------------------------------------
 * - Footer name/letters reassemble with staggered yPercent reveal
 * - Character hover effects remain active
 * - Social links and email use clip-path wipe reveals
 */
export default function FooterSection() {
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
      gsap.set(navRef.current, { opacity: 0, y: 30 });

      // Split big title into characters for yPercent reassemble + hover
      let titleChars: HTMLElement[] = [];
      if (titleRef.current && !prefersReduced) {
        const spans = titleRef.current.querySelectorAll('[data-split]');
        spans.forEach((span) => {
          const chars = splitIntoChars(span as HTMLElement);
          applyCharHover(chars); // character hover remains active in footer
          titleChars = titleChars.concat(chars.map((c) => c.wrapper));
        });
        gsap.set(titleChars, { yPercent: 110, opacity: 0 });
      } else if (titleRef.current) {
        gsap.set(titleRef.current, { yPercent: 100 });
      }

      // Char hover on links marked data-char-hover
      initCharHover(footerRef.current || document);

      // Links initial – clip-path hidden
      gsap.set(linkRefs.current, {
        opacity: 0,
        clipPath: 'inset(100% 0 0 0)',
        y: 12,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          end: 'top 30%',
          scrub: 0.9,
        },
      });

      // Nav block fade up
      tl.to(
        navRef.current,
        { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
        0
      );

      // Link clip-path wipes
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

      // Title characters reassemble from below
      if (titleChars.length) {
        tl.to(
          titleChars,
          {
            yPercent: 0,
            opacity: 1,
            stagger: {
              each: 0.022,
              from: 'start',
            },
            ease: 'power3.out',
            duration: 1.1,
          },
          0.2
        );
      } else if (titleRef.current) {
        tl.to(
          titleRef.current,
          { yPercent: 0, ease: 'power3.out', duration: 1 },
          0.2
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-black text-offwhite px-8 py-20 min-h-[60vh] md:min-h-[70vh] flex flex-col justify-between overflow-hidden"
    >
      {/* Ambient brand glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,87,95,0.10),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(143,83,252,0.12),transparent_55%)] pointer-events-none z-0" />

      {/* Top Footer Navigation */}
      <div
        ref={navRef}
        className="relative max-w-6xl w-full mx-auto flex flex-col md:flex-row justify-between items-start gap-8 z-10"
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

      {/* Massive Bottom Closing Title – character reassemble */}
      <div className="relative max-w-6xl w-full mx-auto mt-16 z-10">
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
    </footer>
  );
}
