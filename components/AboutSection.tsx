// components/AboutSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const boxesWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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

  // Helper to wrap text nodes into spans for word‑by‑word animation
  const wrapWords = (element: HTMLElement) => {
    const words = element.textContent?.split(/\s+/) || [];
    element.innerHTML = words
      .map((word) => `<span class="word" style="display:inline-block; opacity:0; filter:blur(8px);">${word}&nbsp;</span>`)
      .join('');
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Word‑by‑word reveal on the heading
    if (headingRef.current) {
      wrapWords(headingRef.current);
      const words = headingRef.current.querySelectorAll('.word');
      gsap.fromTo(
        words,
        { opacity: 0, filter: 'blur(8px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    const mm = gsap.matchMedia();

    // ============================================================
    // 1. GLOBAL INTRO (all devices) – unchanged
    // ============================================================
    mm.add("all", () => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.15, filter: 'blur(8px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        }
      );
    });

    // ============================================================
    // 2. DESKTOP (>= 768px) – smoother cards + outro timed with boxes
    // ============================================================
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.8, // slightly smoother scrub
        },
      });

      // Image sharpens
      tl.to(imageRef.current, {
        filter: 'blur(4px) brightness(1)',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0);

      // Text moves up
      tl.to(
        textContainerRef.current,
        { y: '-50px', opacity: 0.8, duration: 1, ease: 'power2.inOut' },
        0
      );

      // Boxes come in from bottom – slower & smoother
      tl.to(
        boxRefs.current,
        {
          y: 0,
          stagger: 0.2,        // slightly more delay between each
          duration: 2.5,       // slower – from 1.8s to 2.5s
          ease: 'power2.out',  // softer ease
        },
        0.2
      );

      // SECTION OUTRO: starts as the last box is still animating in
      // We start the fade about halfway through the boxes animation
      tl.to(
        containerRef.current,
        { opacity: 0.15, filter: 'blur(8px)', duration: 1.5, ease: 'power2.inOut' },
        '+=0.6'  // begins while boxes are still moving
      );
    });

    // ============================================================
    // 3. MOBILE (< 768px) – preserved, with slight smoother horizontal scroll
    // ============================================================
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.to(imageRef.current, {
        filter: 'blur(4px) brightness(1)',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0);

      tl.to(
        textContainerRef.current,
        { y: '-15vh', opacity: 0.6, duration: 1.5, ease: 'power2.inOut' },
        0
      );

      const getScrollAmount = () => {
        let wrapperWidth = boxesWrapperRef.current?.scrollWidth || 0;
        let viewportWidth = window.innerWidth;
        return -(wrapperWidth - viewportWidth + 48);
      };

      // Horizontal scroll – slower for smoother feel
      tl.to(
        boxesWrapperRef.current,
        {
          x: getScrollAmount,
          duration: 4,   // longer scroll time – smoother
          ease: 'power2.inOut', // eased, not linear
        },
        0.5
      );

      // Outro starts as the boxes finish scrolling
      tl.to(
        containerRef.current,
        { opacity: 0.15, filter: 'blur(8px)', duration: 1, ease: 'power2.inOut' },
        '+=0.2'
      );
    });

    return () => mm.revert();
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
        <div
          ref={headingRef}
          className="space-y-0.5 sm:space-y-1 text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] tracking-tight font-sans"
        >
          <div>
            <span className="font-serif italic font-normal text-gradient-brand">3 key benefits</span> &amp;
          </div>
          <div>outcomes for</div>
          <div>
            <span className="font-serif italic font-normal text-offwhite">applicants.</span>
          </div>
        </div>
      </div>

      {/* Liquid Glass Boxes Container */}
      <div className="absolute bottom-6 sm:bottom-10 md:bottom-20 left-0 right-0 w-full z-30 pointer-events-none px-6 md:px-16 overflow-hidden md:overflow-visible">
        <div
          ref={boxesWrapperRef}
          className="flex flex-row justify-start md:justify-end items-end gap-4 sm:gap-6 lg:gap-8 pb-1 md:pb-0 w-max md:w-full max-w-7xl mx-auto md:pl-32"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => { boxRefs.current[index] = el; }}
              className="pointer-events-auto shrink-0 md:translate-y-[100vh] w-[280px] sm:w-[320px] md:w-full md:flex-1 md:max-w-[300px] will-change-transform"
            >
              <div className="h-[260px] sm:h-[280px] md:h-[300px] flex flex-col justify-between p-5 sm:p-6 md:p-8 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-purple/10 pointer-events-none rounded-[20px] sm:rounded-[24px] md:rounded-[32px]" />
                <div className="relative z-10">
                  <span className="font-sans text-[10px] sm:text-xs md:text-xs font-medium tracking-widest text-coral-light uppercase">
                    {benefit.step}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-offwhite mt-3 sm:mt-4 leading-[1.2]">
                    {benefit.title}
                  </h3>
                </div>
                <p className="relative z-10 text-[13px] sm:text-sm md:text-sm text-neutral-300 font-light leading-relaxed font-sans">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arch Portrait Card on Right Edge */}
      <div
        ref={imageRef}
        className="absolute right-0 top-0 h-full w-[65vw] md:w-[55vw] min-w-[320px] rounded-l-[120px] md:rounded-l-[220px] overflow-hidden bg-neutral-900 z-0 pointer-events-none filter blur-[12px] opacity-40"
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
