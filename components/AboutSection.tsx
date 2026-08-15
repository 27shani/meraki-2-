'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// IMPORTANT: Import your Lenis instance from wherever you initialize it.
// For this example, we assume you have a global `lenis` object.
// If not, you can pass it via a prop or Context.
import { lenis } from '@/lib/lenis'; // <-- CHANGE THIS PATH TO YOUR LENIS FILE

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const boxesWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  
  // Use a Map or stable array for refs to avoid null issues
  const boxRefs = useRef<HTMLDivElement[]>([]);

  const benefits = [
    { step: '/ BUILD_01', title: 'Sharpen Your Pitch', desc: 'Turn your idea into a clear, compelling business case with expert feedback and real-world perspective.' },
    { step: '/ CONNECT_02', title: 'Build Your Network', desc: 'Connect with mentors, investors, industry leaders and ambitious peers who can take your idea further.' },
    { step: '/ GROW_03', title: 'Earn Real Recognition', desc: 'Put your idea on a bigger stage, compete for prizes and gain visibility among the entrepreneurial ecosystem.' },
  ];

  const wrapLineWords = (element: HTMLElement) => {
    const text = element.textContent?.trim() || '';
    const words = text.split(/\s+/);
    element.innerHTML = words
      .map((word) => `<span class="word" style="display:inline-block; opacity:0; transform:translateY(10px);">${word}&nbsp;</span>`)
      .join('');
  };

  useEffect(() => {
    // 1. Register plugin
    gsap.registerPlugin(ScrollTrigger);

    // 2. CRITICAL: Sync Lenis with ScrollTrigger (Fixes the "not opening" on phone)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      // Add Lenis' raf to GSAP's ticker
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // 3. Use gsap.context() for proper React cleanup and re-render handling
    const ctx = gsap.context(() => {
      // --- Heading Word Animations ---
      const lineDivs = headingRef.current?.querySelectorAll('div') || [];
      lineDivs.forEach((div, index) => {
        wrapLineWords(div as HTMLElement);
        const words = div.querySelectorAll('.word');
        gsap.fromTo(
          words,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
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

      // --- Main Timeline Logic using matchMedia ---
      const mm = gsap.matchMedia();

      // Base container fade-in (for all screens)
      mm.add("all", () => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0.15 },
          {
            opacity: 1,
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

      // --- DESKTOP (≥ 768px) ---
      mm.add("(min-width: 768px)", () => {
        const wrapper = boxesWrapperRef.current;
        const container = containerRef.current;
        if (!wrapper || !container) return;

        // Cache widths to prevent layout thrashing
        const containerWidth = container.clientWidth;
        const wrapperWidth = wrapper.scrollWidth;
        const startOffset = containerWidth * 0.6;
        const finalX = -(wrapperWidth - containerWidth + 200);

        gsap.set(wrapper, { x: startOffset });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true, // Re-calculates on resize
          },
        });

        tl.fromTo(
          imageRef.current,
          { opacity: 0.3, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' },
          0
        )
        .fromTo(
          textContainerRef.current,
          { y: 30, opacity: 0.2 },
          { y: -20, opacity: 1, duration: 1.0, ease: 'power2.out' },
          0
        )
        .to(wrapper, {
          x: finalX,
          duration: 2.0,
          ease: 'none',
        }, 0.1)
        .fromTo(
          boxRefs.current,
          { y: 80, scale: 0.92 },
          {
            y: 0,
            scale: 1,
            stagger: 0.35,
            duration: 1.2,
            ease: 'power2.out',
          },
          0.2
        );
      });

      // --- MOBILE (< 768px) ---
      mm.add("(max-width: 767px)", () => {
        // Ensure boxes are visible initially
        gsap.set(boxRefs.current, { y: 0, scale: 1, opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          imageRef.current,
          { opacity: 0.3, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
          0
        )
        .fromTo(
          textContainerRef.current,
          { y: 20, opacity: 0.2 },
          { y: -10, opacity: 1, duration: 0.8, ease: 'power2.out' },
          0
        )
        .fromTo(
          boxRefs.current,
          { y: 40, scale: 0.92 },
          {
            y: 0,
            scale: 1,
            stagger: 0.2,
            duration: 0.9,
            ease: 'power2.out',
          },
          0.1
        )
        .to(
          boxesWrapperRef.current,
          {
            x: () => {
              if (!boxesWrapperRef.current) return 0;
              const wrapperWidth = boxesWrapperRef.current.scrollWidth || 0;
              const viewportWidth = window.innerWidth;
              const moveX = -(wrapperWidth - viewportWidth + 60);
              // Clamp to 0 if wrapper is smaller than viewport (prevents positive X pushing boxes right)
              return Math.min(moveX, 0);
            },
            duration: 1.8,
            ease: 'none',
          },
          0.1
        );
      });

      // Cleanup matchMedia
      return () => mm.revert();
    }, containerRef); // GSAP Context binds to this container

    // 4. Force a refresh after fonts/images load (crucial for mobile heights)
    const refreshOnLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', refreshOnLoad);
    // Also refresh on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(ScrollTrigger.refresh, 300);
    });

    // 5. Cleanup everything on unmount
    return () => {
      window.removeEventListener('load', refreshOnLoad);
      window.removeEventListener('orientationchange', refreshOnLoad);
      ctx.revert(); // Kills all GSAP animations and ScrollTriggers inside this component
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
        gsap.ticker.remove(lenis.raf);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] bg-black text-offwhite overflow-hidden flex flex-col justify-center px-6 md:px-16"
    >
      {/* Heading */}
      <div
        ref={textContainerRef}
        style={{ willChange: 'transform, opacity' }}
        className="relative z-10 w-full max-w-xl md:max-w-3xl ml-0 md:ml-20 flex flex-col"
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

      {/* Boxes Wrapper */}
      <div className="relative z-30 pointer-events-none px-6 md:px-16 mt-4 md:mt-8 w-full overflow-hidden">
        <div
          ref={boxesWrapperRef}
          className="flex flex-row justify-start items-end gap-4 sm:gap-6 lg:gap-8 pb-1 md:pb-0 w-max"
          style={{ width: 'max-content', willChange: 'transform' }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) boxRefs.current[index] = el;
              }}
              className="pointer-events-auto shrink-0 w-[280px] sm:w-[320px] md:w-[300px] lg:w-[320px] will-change-transform"
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
        style={{ willChange: 'transform, opacity' }}
        className="absolute right-0 top-0 h-full w-[65vw] md:w-[55vw] min-w-[320px] rounded-l-[120px] md:rounded-l-[220px] overflow-hidden bg-neutral-900 z-0 pointer-events-none"
      >
        <img src="/IMG_5164.JPG" alt="Hackathon Event" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black border-l-0" />
      </div>
    </section>
  );
}
