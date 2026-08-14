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

        {/* ASCII art – hidden on mobile */}
        <div className="ascii-left absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block opacity-0">
          <pre className="text-[5px] md:text-[7px] leading-[1.1] text-coral/20 font-mono whitespace-pre">
            {asciiArt}
          </pre>
        </div>
        <div className="ascii-right absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden lg:block opacity-0">
          <pre className="text-[5px] md:text-[7px] leading-[1.1] text-purple/20 font-mono whitespace-pre text-right">
            {asciiArt}
          </pre>
        </div>

        {/* ---- TOP NAVIGATION – mobile layout fixed ---- */}
        <div
          ref={navRef}
          className="relative max-w-6xl w-full mx-auto flex flex-col md:flex-row justify-between items-start gap-8 z-10"
          style={{ opacity: 0, y: 30 }}
        >
          {/* Left column – logo, email, powered by */}
          <div className="w-full md:w-auto">
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
              className="text-lg hover:underline text-neutral-300 font-sans break-all"
            >
              <span ref={addLinkRef} data-char-hover>
                meraki2026@fiib.edu.in
              </span>
            </a>
            <p className="text-xs text-neutral-500 mt-2 font-sans">
              <span ref={addLinkRef}>Powered by FIIB</span>
            </p>
          </div>

          {/* Right column – Meraki Team + contact (stacked on mobile) */}
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Meraki Team & Address */}
            <div className="space-y-2 flex flex-col">
              <span className="text-neutral-200 font-semibold">
                <span ref={addLinkRef}>Meraki Team</span>
              </span>
              <span className="text-neutral-500 max-w-xs normal-case tracking-normal text-sm leading-relaxed">
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

            {/* Phone numbers & Instagram */}
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

        {/* Bottom closing title */}
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

        {/* Decorative dot */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-10">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-coral to-purple opacity-60" />
        </div>
      </footer>
    </>
  );
}
