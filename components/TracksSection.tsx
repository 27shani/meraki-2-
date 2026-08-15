// components/TracksSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function TracksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tracksWrapperRef = useRef<HTMLDivElement>(null);
  const trackBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prizeRef = useRef<HTMLDivElement>(null);
  const prizeBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tracks = [
    {
      trackNum: 'TRACK 01',
      numLabel: '01',
      title: 'Inclusive Innovation',
      subtitle: 'Build for the people who are often left out.',
      description:
        "This track celebrates ideas that create opportunities, access and solutions for underrepresented communities. Whether you're solving for inclusion, accessibility, gender equity or social barriers, bring an idea that makes business more inclusive.",
      whoCanApply:
        'Ideas led by or designed for underrepresented communities, including women, persons with disabilities, LGBTQIA+ communities and other underserved groups.',
    },
    {
      trackNum: 'TRACK 02',
      numLabel: '02',
      title: 'Open Innovation',
      subtitle: 'Think bigger. Solve what matters.',
      description:
        'This track is for bold ideas tackling real-world challenges through innovative, scalable business models. From climate action and education to healthcare, technology and beyond, bring a solution with the potential to create meaningful impact.',
      whoCanApply:
        'Any undergraduate student or team with an innovative, scalable idea aligned with one or more Sustainable Development Goals.',
    },
  ];

  const prizes = [
    { title: 'Winner', prize: '₹150,000 | $1,800', note: '(Each Track)' },
    { title: '1st Runner up', prize: '₹100,000 | $1,200', note: '(Each Track)' },
    { title: '2nd Runner up', prize: '₹50,000 | $ 600', note: '(Each Track)' },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ---- Intro Fade (Blur removed for drastic performance boost) ----
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        }
      );

      const isMobile = window.innerWidth < 768;

      // ---- Main timeline ----
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: isMobile ? '+=500%' : '+=450%',
          pin: true,
          scrub: 1, // Reduced scrub delay for tighter sync
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalculates functions on resize
        },
      });

      // ---- TITLE ----
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 40,
        clipPath: 'inset(-10% 0 100% 0)',
      });
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(-10% 0 -25% 0)',
          duration: 0.8,
          ease: 'power3.out',
        },
        0
      );

      // ---- TRACK CARDS: slide from RIGHT to LEFT ----
      const wrapper = tracksWrapperRef.current;
      if (wrapper) {
        // Wrap coordinates in functions so they update on mobile resize/load
        tl.fromTo(
          wrapper,
          { x: () => window.innerWidth * 0.8 },
          {
            x: () => {
              const wrapperWidth = wrapper.scrollWidth;
              const viewportWidth = window.innerWidth;
              return wrapperWidth > viewportWidth
                ? -(wrapperWidth - viewportWidth + 32)
                : 0;
            },
            duration: 3.0,
            ease: 'none', // 'none' is much smoother for scrubbed translations
          },
          0.15
        );
      }

      // Fade in each track card
      trackBoxRefs.current.forEach((box, i) => {
        if (!box) return;
        gsap.set(box, { opacity: 0 });
        tl.to(
          box,
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          0.4 + i * 0.3
        );
      });

      // ---- PRIZE BOXES ----
      prizeBoxRefs.current.forEach((pBox, i) => {
        if (!pBox) return;
        // Blur removed here as well to fix scroll stuttering
        gsap.set(pBox, {
          y: 60,
          opacity: 0,
        });
        tl.to(
          pBox,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
          },
          3.2 + i * 0.25
        );
      });

      // ---- PRIZE label ----
      gsap.set(prizeRef.current, { opacity: 0, y: 20 });
      tl.to(
        prizeRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        3.0
      );

      // ---- CONTENT PAN ----
      tl.to(
        contentRef.current,
        {
          y: () => {
            if (!contentRef.current) return 0;
            const overflow =
              contentRef.current.scrollHeight - window.innerHeight;
            return overflow > 0 ? -(overflow + 100) : 0;
          },
          ease: 'none', // Linear ease matches user scroll speed perfectly
          duration: 2.5,
        },
        isMobile ? 4.2 : 4.0
      );

      // ---- OUTRO ----
      tl.to(
        containerRef.current,
        {
          opacity: 0.12,
          duration: 1.0,
          ease: 'power2.inOut',
        },
        '+=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-start pt-10 sm:pt-16 md:pt-20 px-4 sm:px-6 md:px-12"
    >
      {/* Removed static will-change-transform classes to let GSAP handle it natively */}
      <div ref={contentRef} className="w-full flex flex-col">
        {/* Title */}
        <div
          ref={titleRef}
          className="max-w-7xl mx-auto w-full mb-4 sm:mb-6 md:mb-8 overflow-visible py-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-[3.5rem] font-sans font-medium tracking-tight leading-normal whitespace-normal">
            Two tracks.{' '}
            <span className="font-serif italic font-normal text-[#FB575F]">
              One stage.
            </span>
          </h2>
        </div>

        {/* Track cards wrapper */}
        <div className="max-w-7xl mx-auto w-full overflow-visible z-20 mb-6 sm:mb-8 md:mb-12">
          <div
            ref={tracksWrapperRef}
            className="flex flex-row items-stretch gap-4 sm:gap-6"
            style={{ width: 'max-content' }}
          >
            {tracks.map((track, index) => (
              <div
                key={index}
                ref={(el) => {
                  trackBoxRefs.current[index] = el;
                }}
                className="w-[88vw] sm:w-[75vw] md:w-[42vw] lg:w-[40vw] flex-shrink-0 flex"
              >
                <div
                  className="
                    w-full
                    h-full
                    flex flex-col justify-between
                    p-5 sm:p-6 md:p-10
                    rounded-[16px] sm:rounded-[24px] md:rounded-[32px]
                    bg-white/[0.04] backdrop-blur-xl
                    border border-white/10
                    shadow-2xl
                    relative overflow-hidden
                    group
                    transition-all duration-500
                    hover:border-[#FB575F]/40
                    hover:shadow-[0_20px_60px_rgba(251,87,95,0.12)]
                    hover:-translate-y-2
                  "
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-coral/0 via-transparent to-purple/0 group-hover:from-coral/10 group-hover:to-purple/10 transition-all duration-500 pointer-events-none rounded-[16px] sm:rounded-[24px] md:rounded-[32px]" />

                  <div className="relative z-10 flex justify-between items-start mb-4 sm:mb-6">
                    <span className="font-sans text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-widest text-[#FB575F] uppercase">
                      {track.trackNum}
                    </span>
                    <span className="font-serif italic text-lg sm:text-xl md:text-2xl text-neutral-400 font-light group-hover:text-coral-light transition-colors duration-400">
                      {track.numLabel}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-2 sm:space-y-3 flex-grow">
                    <h3 className="text-xl sm:text-2xl md:text-4xl font-serif italic font-normal text-offwhite leading-tight">
                      {track.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-sans font-medium leading-relaxed">
                      {track.subtitle}
                    </p>
                    <p className="block text-xs sm:text-sm md:text-base text-neutral-400 font-sans font-light leading-relaxed pt-3 sm:pt-4 border-t border-white/10">
                      {track.description}
                    </p>
                  </div>

                  <div className="block relative z-10 pt-3 sm:pt-4 border-t border-white/10 text-[10px] sm:text-[11px] md:text-xs text-neutral-400 font-sans mt-4 sm:mt-6">
                    <span className="text-[#FB575F] font-semibold uppercase tracking-wider block mb-1">
                      Who can apply:
                    </span>
                    <p className="leading-relaxed">{track.whoCanApply}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prize Money */}
        <div
          ref={prizeRef}
          className="max-w-7xl mx-auto w-full opacity-0 pb-20 sm:pb-28 md:pb-40"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-normal text-center text-offwhite mb-6 sm:mb-8">
            Prize Money
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {prizes.map((p, index) => (
              <div
                key={index}
                ref={(el) => {
                  prizeBoxRefs.current[index] = el;
                }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xl group hover:border-[#FB575F]/30 hover:-translate-y-1 transition-all duration-400"
              >
                <h4 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-normal text-offwhite mb-1 sm:mb-2">
                  {p.title}
                </h4>
                <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-sans font-medium">
                  {p.prize}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light mt-1">
                  {p.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
