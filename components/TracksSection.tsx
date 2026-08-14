// components/TracksSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * TracksSection
 * -------------------------------------------------
 * - Strong entrance via clip-path + y + opacity + blur
 * - Improved hover states on the two track cards
 */
export default function TracksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
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

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Intro blur
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

      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: isMobile ? '+=380%' : '+=250%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Title – clip-path wipe + rise
      if (titleRef.current && !prefersReduced) {
        gsap.set(titleRef.current, {
          opacity: 0,
          y: 50,
          clipPath: 'inset(100% 0 0 0)',
          filter: 'blur(10px)',
        });
        tl.to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
          },
          0
        );
      } else {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0
        );
      }

      // Track cards animation
      if (isMobile) {
        boxRefs.current.forEach((box, i) => {
          if (!box) return;
          gsap.set(box, {
            x: 120,
            opacity: 0,
            filter: 'blur(10px)',
          });
          tl.to(
            box,
            {
              x: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.2,
              ease: 'power3.out',
            },
            0.3 + i * 0.9
          );
        });

        gsap.set(prizeRef.current, { opacity: 0, y: 40 });
        tl.to(
          prizeRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          2.1
        );

        prizeBoxRefs.current.forEach((pBox, i) => {
          if (!pBox) return;
          gsap.set(pBox, { y: 60, opacity: 0, filter: 'blur(8px)' });
          tl.to(
            pBox,
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power3.out',
            },
            2.3 + i * 0.6
          );
        });
      } else {
        boxRefs.current.forEach((box, i) => {
          if (!box) return;
          gsap.set(box, {
            y: 80,
            opacity: 0,
            clipPath: 'inset(100% 0 0 0)',
            filter: 'blur(12px)',
          });
          tl.to(
            box,
            {
              y: 0,
              opacity: 1,
              clipPath: 'inset(0% 0 0 0)',
              filter: 'blur(0px)',
              duration: 1.15,
              ease: 'power3.out',
            },
            0.25 + i * 0.18
          );
        });

        tl.to(
          prizeRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
          },
          0.7
        );
      }

      // Pan content if overflowing
      tl.to(
        contentRef.current,
        {
          y: () => {
            if (!contentRef.current) return 0;
            const overflow =
              contentRef.current.scrollHeight - window.innerHeight;
            return overflow > 0 ? -(overflow + 100) : 0;
          },
          ease: 'none',
          duration: 2,
        },
        isMobile ? 3.5 : 1.1
      );

      // Outro
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          filter: 'blur(12px)',
          duration: 0.8,
          ease: 'power2.inOut',
        },
        '+=0.15'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex flex-col justify-start pt-16 md:pt-24 px-6 md:px-16"
    >
      <div ref={contentRef} className="w-full flex flex-col will-change-transform">
        {/* Title */}
        <div
          ref={titleRef}
          className="max-w-7xl mx-auto w-full mb-6 sm:mb-8 md:mb-10 opacity-0"
        >
          <h2 className="text-3xl sm:text-4xl md:text-[3.5rem] font-sans font-medium tracking-tight">
            Two tracks.{' '}
            <span className="font-serif italic font-normal text-[#FB575F]">
              One stage.
            </span>
          </h2>
        </div>

        {/* Track cards */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 z-20 mb-10 md:mb-16">
          {tracks.map((track, index) => (
            <div
              key={index}
              ref={(el) => {
                boxRefs.current[index] = el;
              }}
              className="opacity-0 will-change-transform"
            >
              <div
                className="
                  h-auto min-h-[300px] md:min-h-[380px]
                  flex flex-col justify-between
                  p-6 sm:p-8 md:p-10
                  rounded-[20px] sm:rounded-[28px] md:rounded-[32px]
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
                {/* Hover gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-coral/0 via-transparent to-purple/0 group-hover:from-coral/10 group-hover:to-purple/10 transition-all duration-500 pointer-events-none rounded-[20px] sm:rounded-[28px] md:rounded-[32px]" />

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <span className="font-sans text-[10px] sm:text-xs font-semibold tracking-widest text-[#FB575F] uppercase">
                    {track.trackNum}
                  </span>
                  <span className="font-serif italic text-xl sm:text-2xl text-neutral-400 font-light group-hover:text-coral-light transition-colors duration-400">
                    {track.numLabel}
                  </span>
                </div>

                <div className="relative z-10 space-y-3 flex-grow">
                  <h3 className="text-2xl md:text-4xl font-serif italic font-normal text-offwhite leading-tight">
                    {track.title}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-300 font-sans font-medium leading-relaxed">
                    {track.subtitle}
                  </p>
                  <p className="block text-xs md:text-sm text-neutral-400 font-sans font-light leading-relaxed pt-4 border-t border-white/10">
                    {track.description}
                  </p>
                </div>

                <div className="block relative z-10 pt-4 border-t border-white/10 text-[11px] text-neutral-400 font-sans mt-6">
                  <span className="text-[#FB575F] font-semibold uppercase tracking-wider block mb-1">
                    Who can apply:
                  </span>
                  <p>{track.whoCanApply}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prize Money */}
        <div
          ref={prizeRef}
          className="max-w-7xl mx-auto w-full opacity-0 will-change-transform pb-32 md:pb-40"
          style={{ transform: 'translateY(60px)' }}
        >
          <h3 className="text-3xl md:text-4xl font-serif italic font-normal text-center text-offwhite mb-8">
            Prize Money
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {prizes.map((p, index) => (
              <div
                key={index}
                ref={(el) => {
                  prizeBoxRefs.current[index] = el;
                }}
                className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xl group hover:border-[#FB575F]/30 hover:-translate-y-1 transition-all duration-400 will-change-transform"
              >
                <h4 className="text-2xl md:text-3xl font-serif italic font-normal text-offwhite mb-2">
                  {p.title}
                </h4>
                <p className="text-base md:text-lg text-neutral-300 font-sans font-medium">
                  {p.prize}
                </p>
                <p className="text-xs md:text-sm text-neutral-400 font-sans font-light mt-1">
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
