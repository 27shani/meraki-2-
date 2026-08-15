// components/FooterSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoChars, applyCharHover, initCharHover } from '@/lib/splitText';

export default function FooterSection() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const instaRef = useRef<HTMLAnchorElement>(null);
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
      gsap.set(footerRef.current, { opacity: 0, y: 60 });
      gsap.set(navRef.current, { opacity: 0, y: 30 });
      if (instaRef.current) gsap.set(instaRef.current, { opacity: 0, scale: 0.5 });
      if (logoImgRef.current) gsap.set(logoImgRef.current, { yPercent: 100, opacity: 0 });

      let titleChars: HTMLElement[] = [];
      if (titleRef.current && !prefersReduced) {
        const spans = titleRef.current.querySelectorAll('[data-split]');
        spans.forEach((span) => {
          const chars = splitIntoChars(span as HTMLElement);
          applyCharHover(chars);
          titleChars = titleChars.concat(chars.map((c) => c.wrapper));
        });
        gsap.set(titleChars, { yPercent: 110, opacity: 0 });
      } else if (titleRef.current) {
        gsap.set(titleRef.current, { yPercent: 100 });
      }

      initCharHover(footerRef.current || document);

      gsap.set(linkRefs.current, {
        opacity: 0,
        clipPath: 'inset(100% 0 0 0)',
        y: 12,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacerRef.current,
          start: 'top bottom',
          end: 'top center',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        footerRef.current,
        { opacity: 1, y: 0, ease: 'power2.out', duration: 1.2 },
        0
      );

      tl.to(
        navRef.current,
        { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
        0.1
      );

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

      // Logo slide up
      if (logoImgRef.current) {
        tl.to(
          logoImgRef.current,
          {
            yPercent: 0,
            opacity: 1,
            ease: 'power3.out',
            duration: 1.2,
          },
          0.25
        );
      }

      // 2026 Text slide up
      if (titleChars.length) {
        tl.to(
          titleChars,
          {
            yPercent: 0,
            opacity: 1,
            stagger: { each: 0.025, from: 'start' },
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

      // Instagram icon pop-in
      if (instaRef.current) {
        tl.to(
          instaRef.current,
          { opacity: 1, scale: 1, ease: 'back.out(1.5)', duration: 0.8 },
          0.4
        );
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={spacerRef}
        className="h-[60vh] md:h-[80vh] w-full bg-transparent pointer-events-none"
        aria-hidden="true"
      />

      <footer
        ref={footerRef}
        className="fixed inset-0 z-[999] bg-black text-offwhite px-6 md:px-16 py-12 md:py-16 flex flex-col justify-between overflow-hidden"
        style={{ opacity: 0, y: 60 }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,87,95,0.10),transparent_55%),radial-gradient(ellipse_at_top_right,rgba(143,83,252,0.12),transparent_55%)] pointer-events-none z-0" />

        {/* ---- TOP NAVIGATION ---- */}
        <div
          ref={navRef}
          className="relative max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-start gap-12 z-10"
          style={{ opacity: 0, y: 30 }}
        >
          {/* Left column – Contact Info */}
          <div className="w-full md:w-auto flex flex-col">
            <p className="text-xs uppercase tracking-widest text-coral-light mb-2 font-sans">
              <span ref={addLinkRef}>Get in Touch</span>
            </p>
            <a
              href="mailto:meraki2026@fiib.edu.in"
              className="text-lg hover:underline text-neutral-300 font-sans break-all mb-4"
            >
              <span ref={addLinkRef} data-char-hover>
                meraki2026@fiib.edu.in
              </span>
            </a>
            
            <div className="flex flex-col space-y-1 mt-1">
              <a href="tel:+917060366392" className="hover:text-offwhite transition-colors text-neutral-400">
                <span ref={addLinkRef}>+91 7060366392</span>
              </a>
              <a href="tel:+919958617024" className="hover:text-offwhite transition-colors text-neutral-400">
                <span ref={addLinkRef}>+91 9958617024</span>
              </a>
              <a href="tel:+919910470427" className="hover:text-offwhite transition-colors text-neutral-400">
                <span ref={addLinkRef}>+91 9910470427</span>
              </a>
            </div>
          </div>

          {/* Right column – Address Details */}
          <div className="w-full md:w-auto flex flex-col md:items-end md:text-right">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2 font-sans">
              <span ref={addLinkRef}>Powered by FIIB</span>
            </p>
            <span className="text-neutral-400 normal-case tracking-normal text-sm md:text-base leading-relaxed max-w-sm">
              <span ref={addLinkRef} className="block mb-1">
                Fortune Institute of International Business
              </span>
              <span ref={addLinkRef}>
                Plot No. 5, Rao Tula Ram Marg, Opp. Army R&R Hospital, Vasant Vihar, New Delhi 110057
              </span>
            </span>
          </div>
        </div>

        {/* ---- BOTTOM CLOSING SECTION ---- */}
        <div className="relative max-w-7xl w-full mx-auto z-10 flex flex-row justify-between items-end">
          
          {/* Logo & 2026 Wrapper */}
          <div ref={maskRef} className="overflow-hidden pb-2 flex items-center md:items-end gap-3 md:gap-6">
            <img
              ref={logoImgRef}
              src="/meraki-logo.png"
              alt="Meraki"
              className="h-10 sm:h-14 md:h-20 lg:h-[6.5rem] w-auto invert mb-1 md:mb-3"
            />
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-[9vw] font-sans font-semibold tracking-tighter leading-none select-none uppercase m-0 p-0"
            >
              <span
                data-split
                className="font-serif italic font-normal text-gradient-brand leading-none inline-block pb-1"
              >
                2026.
              </span>
            </h1>
          </div>

          {/* Instagram Icon */}
          <a
            ref={instaRef}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 md:mb-6 lg:mb-8 text-neutral-400 hover:text-coral transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 md:w-8 md:h-8"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

        </div>
      </footer>
    </>
  );
}
