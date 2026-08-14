// components/AboutSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoWords } from '@/lib/splitText';

/**
 * AboutSection
 * -------------------------------------------------
 * - Main body / title text split into words
 * - Each word: opacity 0 → 1 + blur(12px) → blur(0), scrubbed
 * - Photo gets parallax (y: -50% → 50%) + opacity/blur entrance
 */
export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const benefits = [
    {
      step: '/ BUILD_01',
      title: 'Sharpen Your Pitch',
      desc: 'Turn your idea into a clear, compelling business case with expert feedback and real-world perspective.',
    },
    {
      step: '/ CONNECT_02',
      title: 'Build Your Network',
      desc: 'Connect with mentors, investors, industry leaders and ambitious peers who can take your idea further.',
    },
    {
      step: '/ GROW_03',
      title: 'Earn Real Recognition',
      desc: 'Put your idea on a bigger stage, compete for prizes and gain visibility among the entrepreneurial ecosystem.',
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const textEl = textContainerRef.current;
      const imageEl = imageRef.current;

      // -------------------------------------------------
      // Word-level blur + opacity scrub on title
      // -------------------------------------------------
      if (textEl && !prefersReduced) {
        const titleLines = textEl.querySelectorAll('[data-words]');
        titleLines.forEach((line) => {
          const words = splitIntoWords(line as HTMLElement);
          gsap.set(words, { opacity: 0, filter: 'blur(12px)' });

          gsap.to(words, {
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 75%',
              end: 'top 55%',
              scrub: 0.8,
            },
          });
        });
      }

      // -------------------------------------------------
      // Section entrance + pin timeline
      // -------------------------------------------------
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, filter: 'blur(14px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 1.4,
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 1.4,
        },
      });

      // Image parallax (y: -50% → 50%) + opacity/blur entrance, fully scrubbed
      if (imageEl) {
        gsap.set(imageEl, {
          filter: 'blur(14px)',
          opacity: 0.25,
          yPercent: -50,
        });

        tl.to(
          imageEl,
          {
            filter: 'blur(4px) brightness(1)',
            opacity: 1,
            yPercent: 50,
            duration: 1.4,
            ease: 'none',
          },
          0
        );
      }

      // Text block slight lift
      tl.to(
        textContainerRef.current,
        {
          y: -40,
          opacity: 0.9,
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      );

      // Benefit cards rise
      tl.to(
        boxRefs.current,
        {
          y: 0,
          stagger: 0.14,
          duration: 1.7,
          ease: 'power3.out',
        },
        0.25
      );

      // Outro
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          filter: 'blur(16px)',
          duration: 1,
          ease: 'power2.inOut',
        },
        '+=0.35'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-center px-6 md:px-16 will-change-transform"
    >
      {/* Main Text Content Wrapper */}
      <div
        ref={textContainerRef}
        className="relative z-10 w-full max-w-xl md:max-w-3xl ml-0 md:ml-20 flex flex-col pt-6 md:pt-12"
      >
        <div className="space-y-0.5 sm:space-y-1 text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] tracking-tight font-sans">
          <div data-words>
            <span className="font-serif italic font-normal text-gradient-brand">
              3 key benefits
            </span>{' '}
            &
          </div>
          <div data-words>outcomes for</div>
          <div data-words>
            <span className="font-serif italic font-normal text-offwhite">
              applicants.
            </span>
          </div>
        </div>
      </div>

      {/* Liquid Glass Boxes */}
      <div className="absolute bottom-4 sm:bottom-8 md:bottom-20 left-0 right-0 w-full z-30 px-6 md:px-16 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-row overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none justify-start md:justify-end items-end gap-3 sm:gap-4 md:gap-6 lg:gap-8 pl-0 md:pl-32 pb-1 md:pb-0 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => {
                boxRefs.current[index] = el;
              }}
              style={{ transform: 'translateY(100vh)' }}
              className="pointer-events-auto shrink-0 snap-start w-[210px] sm:w-[240px] md:w-full md:flex-1 md:max-w-[300px] will-change-transform"
            >
              <div
                className="h-[190px] sm:h-[230px] md:h-[300px] flex flex-col justify-between p-4 sm:p-6 md:p-8 rounded-[18px] sm:rounded-[24px] md:rounded-[32px]
                              bg-white/[0.08]
                              backdrop-blur-2xl
                              border border-white/20
                              shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
                              transition-transform duration-500 hover:-translate-y-2
                              relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-purple/10 pointer-events-none rounded-[18px] sm:rounded-[24px] md:rounded-[32px]" />

                <div className="relative z-10">
                  <span className="font-sans text-[9px] sm:text-[10px] md:text-xs font-medium tracking-widest text-coral-light uppercase">
                    {benefit.step}
                  </span>
                  <h3 className="text-base sm:text-xl md:text-3xl font-serif italic font-normal text-offwhite mt-2 sm:mt-3 leading-[1.2]">
                    {benefit.title}
                  </h3>
                </div>
                <p className="relative z-10 text-[11px] sm:text-xs md:text-sm text-neutral-300 font-light leading-relaxed font-sans line-clamp-3 md:line-clamp-none">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arch Portrait Card – parallax target */}
      <div
        ref={imageRef}
        className="absolute right-0 top-0 h-full w-[65vw] md:w-[55vw] min-w-[320px] rounded-l-[120px] md:rounded-l-[220px] overflow-hidden bg-neutral-900 z-0 pointer-events-none"
      >
        <img
          src="/IMG_5164.JPG"
          alt="Hackathon Event"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black border-l-0" />
      </div>
    </section>
  );
}
