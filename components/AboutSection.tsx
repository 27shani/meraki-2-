// components/AboutSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '@/lib/lenis';

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const boxesWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<HTMLDivElement[]>([]);

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

  const wrapLineWords = (element: HTMLElement) => {
    const text = element.textContent?.trim() || '';
    const words = text.split(/\s+/);
    element.innerHTML = words
      .map(
        (word) =>
          `<span class="word" style="display:inline-block; opacity:0; transform:translateY(10px);">${word}&nbsp;</span>`
      )
      .join('');
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = getLenis(); // null on mobile – safe
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    const ctx = gsap.context(() => {
      // Heading word animations
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
            delay: index * 0.15,
          }
        );
      });

      const mm = gsap.matchMedia();

      // Base fade-in
      mm.add('all', () => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'top center',
              scrub: 0.5,
            },
          }
        );
      });

      // ---------- DESKTOP ----------
      mm.add('(min-width: 768px)', () => {
        const wrapper = boxesWrapperRef.current;
        const container = containerRef.current;
        if (!wrapper || !container) return;

        const containerWidth = container.clientWidth;
        const wrapperWidth = wrapper.scrollWidth;
        const startOffset = containerWidth * 0.55;
        const finalX = -(wrapperWidth - containerWidth + 160);

        gsap.set(wrapper, { x: startOffset });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          imageRef.current,
          { opacity: 0.35, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
          0
        )
          .fromTo(
            textContainerRef.current,
            { y: 25, opacity: 0.25 },
            { y: -15, opacity: 1, duration: 1, ease: 'power2.out' },
            0
          )
          .to(wrapper, { x: finalX, duration: 2, ease: 'none' }, 0.1)
          .fromTo(
            boxRefs.current,
            { y: 70, scale: 0.94 },
            {
              y: 0,
              scale: 1,
              stagger: 0.3,
              duration: 1.1,
              ease: 'power2.out',
            },
            0.15
          );
      });

      // ---------- MOBILE (lighter) ----------
      mm.add('(max-width: 767px)', () => {
        gsap.set(boxRefs.current, { y: 0, scale: 1, opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=120%',          // much shorter → less sticky
            pin: true,
            scrub: 0.4,             // more responsive
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          imageRef.current,
          { opacity: 0.35, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
          0
        )
          .fromTo(
            textContainerRef.current,
            { y: 15, opacity: 0.3 },
            { y: -8, opacity: 1, duration: 0.7, ease: 'power2.out' },
            0
          )
          .fromTo(
            boxRefs.current,
            { y: 30, scale: 0.95 },
            {
              y: 0,
              scale: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: 'power2.out',
            },
            0.08
          )
          .to(
            boxesWrapperRef.current,
            {
              x: () => {
                if (!boxesWrapperRef.current) return 0;
                const w = boxesWrapperRef.current.scrollWidth;
                return Math.min(-(w - window.innerWidth + 40), 0);
              },
              duration: 1.4,
              ease: 'none',
            },
            0.1
          );
      });

      return () => mm.revert();
    }, containerRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('orientationchange', () => setTimeout(onResize, 250));
    window.addEventListener('load', onResize);

    return () => {
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
      }
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('load', onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] bg-black text-offwhite overflow-hidden flex flex-col justify-center px-5 sm:px-6 md:px-16"
    >
      {/* Text */}
      <div
        ref={textContainerRef}
        className="relative z-10 w-full max-w-xl md:max-w-3xl ml-0 md:ml-16 lg:ml-20 flex flex-col"
      >
        <div
          ref={headingRef}
          className="space-y-0.5 sm:space-y-1 text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.05] tracking-tight font-sans"
        >
          <div>
            <span className="font-serif italic font-normal text-gradient-brand">
              3 key benefits
            </span>{' '}
            &amp;
          </div>
          <div>outcomes for</div>
          <div>
            <span className="font-serif italic font-normal text-offwhite">
              applicants.
            </span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-30 pointer-events-none px-1 sm:px-4 md:px-12 mt-5 md:mt-8 w-full overflow-hidden">
        <div
          ref={boxesWrapperRef}
          className="flex flex-row justify-start items-end gap-3 sm:gap-5 md:gap-6 lg:gap-8 pb-1 w-max"
          style={{ width: 'max-content' }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) boxRefs.current[index] = el;
              }}
              className="pointer-events-auto shrink-0 w-[260px] sm:w-[300px] md:w-[300px] lg:w-[320px]"
            >
              <div className="h-[240px] sm:h-[270px] md:h-[300px] flex flex-col justify-between p-5 sm:p-6 md:p-8 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-purple/10 pointer-events-none rounded-[20px] sm:rounded-[24px] md:rounded-[32px]" />
                <div className="relative z-10">
                  <span className="font-sans text-[10px] sm:text-xs font-medium tracking-widest text-coral-light uppercase">
                    {benefit.step}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-offwhite mt-3 leading-[1.2]">
                    {benefit.title}
                  </h3>
                </div>
                <p className="relative z-10 text-[13px] sm:text-sm text-neutral-300 font-light leading-relaxed font-sans">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background image */}
      <div
        ref={imageRef}
        className="absolute right-0 top-0 h-full w-[70vw] md:w-[55vw] min-w-[280px] rounded-l-[100px] md:rounded-l-[200px] overflow-hidden bg-neutral-900 z-0 pointer-events-none"
      >
        <img
          src="/IMG_5164.JPG"
          alt="Hackathon Event"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black" />
      </div>
    </section>
  );
}
