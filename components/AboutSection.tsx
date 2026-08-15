// components/AboutSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const boxesWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const benefits = [
    { step: '/ BUILD_01', title: 'Sharpen Your Pitch', desc: 'Turn your idea into a clear, compelling business case with expert feedback and real-world perspective.' },
    { step: '/ CONNECT_02', title: 'Build Your Network', desc: 'Connect with mentors, investors, industry leaders and ambitious peers who can take your idea further.' },
    { step: '/ GROW_03', title: 'Earn Real Recognition', desc: 'Put your idea on a bigger stage, compete for prizes and gain visibility among the entrepreneurial ecosystem.' },
  ];

  // Wrap each line individually for line-by-line animation
  const wrapLineWords = (element: HTMLElement) => {
    const text = element.textContent?.trim() || '';
    const words = text.split(/\s+/);
    element.innerHTML = words
      .map((word) => `<span class="word" style="display:inline-block; opacity:0; filter:blur(8px);">${word}&nbsp;</span>`)
      .join('');
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Title line-by-line animation
    const lineDivs = headingRef.current?.querySelectorAll('div') || [];
    lineDivs.forEach((div, index) => {
      wrapLineWords(div as HTMLElement);
      const words = div.querySelectorAll('.word');
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
          delay: index * 0.2,
        }
      );
    });

    const mm = gsap.matchMedia();

    // Global intro blur (keep)
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

    // Desktop
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',          // Reduced from 300% because we removed outro
          pin: true,
          scrub: 0.8,
        },
      });

      tl.fromTo(
        imageRef.current,
        { filter: 'blur(12px) brightness(0.6)', opacity: 0.3 },
        { filter: 'blur(2px) brightness(1)', opacity: 1, duration: 1.2, ease: 'power2.out' },
        0
      )
      .fromTo(
        textContainerRef.current,
        { y: '30px', opacity: 0.2 },
        { y: '-30px', opacity: 1, duration: 1.2, ease: 'power2.out' }, // Less upward movement
        0
      )
      .fromTo(
        boxRefs.current,
        { y: '80px', opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.35,
          duration: 1.5,
          ease: 'power2.out',
        },
        0.2
      );
      // OUTRO REMOVED – no fade/scale at the end
    });

    // Mobile
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=350%',          // Reduced from 400% because no outro
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        imageRef.current,
        { filter: 'blur(12px) brightness(0.6)', opacity: 0.3 },
        { filter: 'blur(2px) brightness(1)', opacity: 1, duration: 1.0, ease: 'power2.out' },
        0
      )
      .fromTo(
        textContainerRef.current,
        { y: '20px', opacity: 0.2 },
        { y: '-5vh', opacity: 1, duration: 1.0, ease: 'power2.out' }, // Less movement up
        0
      )
      .fromTo(
        boxRefs.current,
        { y: '60px', opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.3,
          duration: 1.2,
          ease: 'power2.out',
        },
        0.15
      )
      .to(
        boxesWrapperRef.current,
        {
          x: () => {
            if (!boxesWrapperRef.current) return 0;
            const wrapperWidth = boxesWrapperRef.current.scrollWidth || 0;
            const viewportWidth = window.innerWidth;
            return -(wrapperWidth - viewportWidth + 48);
          },
          duration: 2.5,
          ease: 'power2.inOut',
        },
        0.15
      );
      // OUTRO REMOVED
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-start pt-16 md:pt-20 px-6 md:px-16 will-change-transform"
    >
      {/* Text Content – moved up with pt on section and reduced mt */}
      <div
        ref={textContainerRef}
        className="relative z-10 w-full max-w-xl md:max-w-3xl ml-0 md:ml-20 flex flex-col mt-2 md:mt-0"
      >
        <div
          ref={headingRef}
          className="space-y-0.5 sm:space-y-1 text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.05] tracking-tight font-sans"
        >
          <div><span className="font-serif italic font-normal text-gradient-brand">3 key benefits</span> &amp;</div>
          <div>outcomes for</div>
          <div><span className="font-serif italic font-normal text-offwhite">applicants.</span></div>
        </div>
      </div>

      {/* Cards Container – positioned higher on mobile and desktop */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 left-0 right-0 w-full z-30 pointer-events-none px-6 md:px-16 overflow-hidden md:overflow-visible">
        <div
          ref={boxesWrapperRef}
          className="flex flex-row justify-start md:justify-end items-end gap-4 sm:gap-6 lg:gap-8 pb-1 md:pb-0 w-max md:w-full max-w-7xl mx-auto md:pl-32"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => { boxRefs.current[index] = el; }}
              className="pointer-events-auto shrink-0 w-[280px] sm:w-[320px] md:w-full md:flex-1 md:max-w-[300px] will-change-transform"
              style={{ opacity: 0, transform: 'translateY(60px)' }}
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

      {/* Arch Image */}
      <div
        ref={imageRef}
        className="absolute right-0 top-0 h-full w-[65vw] md:w-[55vw] min-w-[320px] rounded-l-[120px] md:rounded-l-[220px] overflow-hidden bg-neutral-900 z-0 pointer-events-none"
      >
        <img src="/IMG_5164.JPG" alt="Hackathon Event" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black border-l-0" />
      </div>
    </section>
  );
}
