// components/AboutSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const boxesWrapperRef = useRef<HTMLDivElement>(null); // Added ref for horizontal scrolling

  // Refs for the boxes to animate their Y position
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

    const mm = gsap.matchMedia();

    // =========================================================================
    // GLOBAL: Smooth fade + rise intro as the section arrives (All devices)
    // =========================================================================
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

    // =========================================================================
    // DESKTOP ANIMATION: >= 768px (Remains exactly identical to original)
    // =========================================================================
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.6,
        },
      });

      tl.to(imageRef.current, {
        filter: 'blur(4px) brightness(1)',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '0');

      tl.to(
        textContainerRef.current,
        { y: '-50px', opacity: 0.8, duration: 1, ease: 'power2.inOut' },
        '0'
      );

      tl.to(
        boxRefs.current,
        { y: 0, stagger: 0.15, duration: 1.8, ease: 'power3.out' },
        '0.2'
      );

      tl.to(
        containerRef.current,
        { opacity: 0.15, filter: 'blur(8px)', duration: 1, ease: 'power2.inOut' },
        '+=0.4'
      );
    });

    // =========================================================================
    // MOBILE ANIMATION: < 768px
    // =========================================================================
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=350%', // Extra scroll distance for horizontal sequence
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true, // Recalculates horizontal scroll distance on resize
        },
      });

      // 1. Initial background image reveal
      tl.to(imageRef.current, {
        filter: 'blur(4px) brightness(1)',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '0');

      // 2. Smoothly scroll text upward 
      tl.to(
        textContainerRef.current,
        { y: '-15vh', opacity: 0.6, duration: 1.5, ease: 'power2.inOut' },
        '0'
      );

      // 3. Horizontally scroll the 3 boxes
      const getScrollAmount = () => {
        let wrapperWidth = boxesWrapperRef.current?.scrollWidth || 0;
        let viewportWidth = window.innerWidth;
        // Scroll total width minus viewport + padding to show the last box perfectly
        return -(wrapperWidth - viewportWidth + 48); 
      };

      tl.to(
        boxesWrapperRef.current,
        {
          x: getScrollAmount,
          duration: 3, 
          ease: 'none', // Linear ease creates the most natural horizontal scroll feel
        },
        '0.5' // Starts smoothly after text begins rising
      );

      // 4. Smooth Outro
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
        <div className="space-y-0.5 sm:space-y-1 text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] tracking-tight font-sans">
          <div>
            <span className="font-serif italic font-normal text-gradient-brand">3 key benefits</span> &
          </div>
          <div>outcomes for</div>
          <div>
            <span className="font-serif italic font-normal text-offwhite">applicants.</span>
          </div>
        </div>
      </div>

      {/* Liquid Glass Boxes Container */}
      {/* Added mobile overflow-hidden wrapper so GSAP can move the inner container smoothly */}
      <div className="absolute bottom-6 sm:bottom-10 md:bottom-20 left-0 right-0 w-full z-30 pointer-events-none px-6 md:px-16 overflow-hidden md:overflow-visible">
        
        {/* Changed to w-max on mobile to allow items to span horizontally off-screen */}
        <div 
          ref={boxesWrapperRef}
          className="flex flex-row justify-start md:justify-end items-end gap-4 sm:gap-6 lg:gap-8 pb-1 md:pb-0 w-max md:w-full max-w-7xl mx-auto md:pl-32"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => { boxRefs.current[index] = el; }}
              // Prevent FOUC: Hidden downward initially ONLY on desktop. 
              // On mobile, they sit properly at y-0 to be horizontally scrolled.
              className="pointer-events-auto shrink-0 md:translate-y-[100vh] w-[280px] sm:w-[320px] md:w-full md:flex-1 md:max-w-[300px] will-change-transform"
            >
              {/* INNER DIV: Increased heights and paddings for mobile readability */}
              <div className="h-[260px] sm:h-[280px] md:h-[300px] flex flex-col justify-between p-5 sm:p-6 md:p-8 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] 
                              bg-white/[0.08]
                              backdrop-blur-2xl 
                              border border-white/20 
                              shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
                              transition-transform duration-500 hover:-translate-y-2
                              relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-purple/10 pointer-events-none rounded-[20px] sm:rounded-[24px] md:rounded-[32px]" />

                <div className="relative z-10">
                  <span className="font-sans text-[10px] sm:text-xs md:text-xs font-medium tracking-widest text-coral-light uppercase">
                    {benefit.step}
                  </span>
                  {/* Increased title sizes */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-offwhite mt-3 sm:mt-4 leading-[1.2]">
                    {benefit.title}
                  </h3>
                </div>
                {/* Increased text sizes & removed line-clamp so text is fully readable */}
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
