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
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const benefits = [
    { step: '/ BUILD_01', title: 'Sharpen Your Pitch', desc: 'Turn your idea into a clear, compelling business case with expert feedback and real-world perspective.' },
    { step: '/ CONNECT_02', title: 'Build Your Network', desc: 'Connect with mentors, investors, industry leaders and ambitious peers who can take your idea further.' },
    { step: '/ GROW_03', title: 'Earn Real Recognition', desc: 'Put your idea on a bigger stage, compete for prizes and gain visibility among the entrepreneurial ecosystem.' },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Smooth fade + rise intro
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, filter: 'blur(14px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 1.5,
          },
        }
      );

      const isMobile = window.innerWidth < 768;

      // Main timeline with pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%', // enough for sliding and content
          pin: true,
          scrub: 1.5,
        },
      });

      // ---- Horizontal slider (same for desktop & mobile) ----
      const wrapper = boxesWrapperRef.current;
      const container = containerRef.current;
      if (wrapper && container) {
        const containerWidth = container.clientWidth;
        const wrapperWidth = wrapper.scrollWidth;
        const startOffset = containerWidth * 0.6; // start off-screen right
        const finalX = -(wrapperWidth - containerWidth + 48); // end with last card fully visible

        // Set initial position
        gsap.set(wrapper, { x: startOffset });

        // Slide wrapper from right to left
        tl.to(wrapper, {
          x: finalX,
          duration: 2.0,
          ease: 'power2.inOut',
        }, 0.1);
      }

      // ---- Other animations ----
      tl.to(imageRef.current, {
        filter: 'blur(4px) brightness(1)',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0);

      tl.to(
        textContainerRef.current,
        {
          y: '-50px',
          opacity: 0.8,
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      );

      // Boxes stagger (slide up + fade)
      tl.fromTo(
        boxRefs.current,
        { y: 80, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out',
        },
        0.2
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
        '+=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-center px-6 md:px-16 will-change-transform"
    >
      {/* Text Content */}
      <div
        ref={textContainerRef}
        className="relative z-10 w-full max-w-xl md:max-w-3xl ml-0 md:ml-20 flex flex-col pt-6 md:pt-12"
      >
        <div className="space-y-0.5 sm:space-y-1 text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] tracking-tight font-sans">
          <div>
            <span className="font-serif italic font-normal text-gradient-brand">3 key benefits</span> &amp;
          </div>
          <div>outcomes for</div>
          <div>
            <span className="font-serif italic font-normal text-offwhite">applicants.</span>
          </div>
        </div>
      </div>

      {/* Liquid Glass Boxes – horizontal slider container */}
      <div className="absolute bottom-4 sm:bottom-8 md:bottom-20 left-0 right-0 w-full z-30 px-6 md:px-16 pointer-events-none overflow-hidden">
        <div
          ref={boxesWrapperRef}
          className="flex flex-row items-end gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-max"
          style={{ width: 'max-content' }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => { boxRefs.current[index] = el; }}
              className="pointer-events-auto shrink-0 w-[210px] sm:w-[240px] md:w-[280px] lg:w-[320px] will-change-transform"
              style={{ transform: 'translateY(80px) scale(0.92)', opacity: 0 }}
            >
              <div
                className="h-[190px] sm:h-[230px] md:h-[300px] flex flex-col justify-between p-4 sm:p-6 md:p-8 rounded-[18px] sm:rounded-[24px] md:rounded-[32px] 
                              bg-white/[0.08] backdrop-blur-2xl border border-white/20 
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

      {/* Arch Image */}
      <div
        ref={imageRef}
        className="absolute right-0 top-0 h-full w-[65vw] md:w-[55vw] min-w-[320px] rounded-l-[120px] md:rounded-l-[220px] overflow-hidden bg-neutral-900 z-0 pointer-events-none filter blur-[12px] opacity-40"
      >
        <img src="/IMG_5164.JPG" alt="Hackathon Event" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black border-l-0" />
      </div>
    </section>
  );
}
