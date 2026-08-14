// components/ContactSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCharHover } from '@/lib/splitText';

/**
 * ContactSection
 * -------------------------------------------------
 * - Large scale-in circle / blob
 * - Title slides in from the right
 * - CTA / social use clip-path wipe reveals
 * - Floating frames with vertical parallax + clip-path exits
 * - Availability-style text moves and clips out
 * - Morphs (border-radius + vertical movement) into Footer
 */
export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const availRef = useRef<HTMLParagraphElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (titleRef.current && !prefersReduced) {
        gsap.set(titleRef.current, {
          xPercent: 40,
          opacity: 0,
          clipPath: 'inset(0 100% 0 0)',
        });
      }

      gsap.set([ctaRef.current, taglineRef.current], {
        opacity: 0,
        y: 20,
        clipPath: 'inset(100% 0 0 0)',
      });

      if (availRef.current) {
        gsap.set(availRef.current, {
          opacity: 0,
          y: 30,
          clipPath: 'inset(100% 0 0 0)',
        });
      }

      frameRefs.current.forEach((frame, i) => {
        if (!frame) return;
        gsap.set(frame, {
          opacity: 0,
          yPercent: i % 2 === 0 ? -30 : 30,
          clipPath: 'inset(20% 20% 20% 20%)',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: 1.1,
          pin: true,
        },
      });

      tl.to(
        circleRef.current,
        {
          scale: 28,
          borderRadius: '0%',
          ease: 'power2.inOut',
          duration: 1.2,
        },
        0
      );

      frameRefs.current.forEach((frame, i) => {
        if (!frame) return;
        tl.to(
          frame,
          {
            opacity: 0.85,
            yPercent: i % 2 === 0 ? 20 : -25,
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.out',
            duration: 1,
          },
          0.15 + i * 0.08
        );
      });

      if (titleRef.current) {
        tl.to(
          titleRef.current,
          {
            xPercent: 0,
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            ease: 'power3.out',
            duration: 0.9,
          },
          0.35
        );
      }

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 },
        0.45
      );

      tl.to(
        [ctaRef.current, taglineRef.current],
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          stagger: 0.12,
          ease: 'power3.out',
          duration: 0.55,
        },
        0.65
      );

      if (availRef.current) {
        tl.to(
          availRef.current,
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            ease: 'power3.out',
            duration: 0.5,
          },
          0.75
        );
        tl.to(
          availRef.current,
          {
            y: -40,
            clipPath: 'inset(0 0 100% 0)',
            opacity: 0,
            ease: 'power2.in',
            duration: 0.45,
          },
          1.15
        );
      }

      frameRefs.current.forEach((frame, i) => {
        if (!frame) return;
        tl.to(
          frame,
          {
            yPercent: i % 2 === 0 ? 60 : -60,
            clipPath: 'inset(40% 10% 40% 10%)',
            opacity: 0,
            ease: 'power2.in',
            duration: 0.5,
          },
          1.2
        );
      });

      tl.to(
        containerRef.current,
        {
          borderRadius: '0 0 48px 48px',
          y: -40,
          ease: 'power2.inOut',
          duration: 0.5,
        },
        1.25
      );

      initCharHover(containerRef.current || document);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const frames = frameRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!frames.length) return;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      frames.forEach((frame, i) => {
        const depth = (i + 1) * 8;
        gsap.to(frame, {
          x: dx * depth,
          y: dy * depth * 0.6,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={containerRef}
      id="register"
      className="relative h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      <div
        ref={circleRef}
        className="absolute w-24 h-24 bg-offwhite rounded-full z-0 transform scale-1 will-change-transform"
      />

      <div
        ref={(el) => {
          frameRefs.current[0] = el;
        }}
        className="absolute left-[6%] top-[18%] w-[120px] md:w-[180px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-[5] pointer-events-none hidden md:block opacity-0"
      >
        <img
          src="/C3675T01.JPG"
          alt=""
          className="w-full h-full object-cover filter grayscale contrast-110"
        />
      </div>
      <div
        ref={(el) => {
          frameRefs.current[1] = el;
        }}
        className="absolute right-[8%] bottom-[16%] w-[100px] md:w-[150px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-[5] pointer-events-none hidden md:block opacity-0"
      >
        <img
          src="/IMG_5164.JPG"
          alt=""
          className="w-full h-full object-cover filter grayscale contrast-110"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 text-ink max-w-6xl w-full px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center opacity-0"
      >
        <div>
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-sans font-semibold tracking-tight mb-6 uppercase"
          >
            Meraki 2026
          </h1>
          <div className="space-y-4 text-lg font-sans font-medium">
            <span className="block font-sans text-xs uppercase tracking-widest text-neutral-600">
              23–25 October 2026 | FIIB, New Delhi
            </span>
            <a
              ref={ctaRef}
              href="mailto:meraki2026@fiib.edu.in"
              className="inline-block bg-coral text-offwhite px-8 py-3 rounded-full font-serif font-semibold normal-case tracking-normal text-sm hover:bg-purple transition-colors mt-2"
            >
              <span data-char-hover>Apply Now</span>
            </a>
            <p
              ref={taglineRef}
              className="pt-6 text-sm opacity-70 uppercase tracking-widest font-sans"
            >
              Pitch. Connect. Scale.
            </p>
            <p
              ref={availRef}
              className="pt-2 text-xs uppercase tracking-widest text-neutral-500 font-sans"
            >
              Applications open — secure your slot
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-2xl md:text-4xl font-serif italic font-normal leading-relaxed text-neutral-800">
            Your idea has entered the chat. Now give it a stage.
          </p>
        </div>
      </div>
    </section>
  );
}
