// components/HowItWorksSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Step {
  id: number;
  stepNum: string;
  title: string;
  description: string;
  image: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    stepNum: '01',
    title: 'Apply',
    description: 'Share your idea, the problem it solves, and your vision.',
    image: '/Apply.jpg',
  },
  {
    id: 2,
    stepNum: '02',
    title: 'Get Evaluated',
    description:
      "Experts assess your idea's strength, market potential, and execution readiness.",
    image: '/Get Evalueted.jpg',
  },
  {
    id: 3,
    stepNum: '03',
    title: 'Make the Cut',
    description:
      'Strongest submissions advance to the next stage of Meraki competition.',
    image: '/Make the cut.jpg',
  },
  {
    id: 4,
    stepNum: '04',
    title: 'Refine Your Pitch',
    description:
      'Refine your idea through expert feedback and focused mentorship sessions.',
    image: '/refine your pitch.jpg',
  },
  {
    id: 5,
    stepNum: '05',
    title: 'Pitch at Meraki',
    description:
      'Pitch your idea at FIIB before experts, investors, and innovators.',
    image: '/pitch at meraki.jpg',
  },
  {
    id: 6,
    stepNum: '06',
    title: 'Win',
    description:
      'Compete for prizes, build connections, and take your idea forward.',
    image: '/win.jpg',
  },
];

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const ROW_HEIGHT = 130;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const total = STEPS.length;

      // Intro blur fade
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.15, filter: 'blur(8px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        }
      );

      if (pathRef.current && listRef.current && containerRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        const vh = window.innerHeight;
        const startY = vh / 2 - ROW_HEIGHT / 2;
        const endY = vh / 2 - ((total - 1) * ROW_HEIGHT + ROW_HEIGHT / 2);

        gsap.set(listRef.current, { y: startY });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${total * 160}%`,
            pin: true,
            scrub: 1.2, // ← CHANGED: increased from 0.8 for smoother scrolling
            anticipatePin: 1,
            invalidateOnRefresh: true, // ← ADDED: prevents layout shift issues
          },
        });

        // Titles scroll through center smoothly
        tl.to(
          listRef.current,
          {
            y: endY,
            ease: 'power1.inOut',
            duration: 1,
            onUpdate: function () {
              const rawIndex = this.progress() * (total - 1);
              const idx = Math.min(Math.round(rawIndex), total - 1);
              setActiveIndex(idx);
            },
          },
          0
        );

        // Ribbon path draw in lockstep
        tl.to(
          pathRef.current,
          {
            strokeDashoffset: 0,
            ease: 'power1.inOut',
            duration: 1,
          },
          0
        );

        // Brief hold on last step
        tl.to({}, { duration: 0.15 }, 1);

        // Outro
        tl.to(
          containerRef.current,
          {
            opacity: 0.2,
            filter: 'blur(8px)',
            duration: 0.25,
            ease: 'power2.inOut',
          },
          1.15
        );
      }

      if (coverRef.current && !prefersReduced) {
        gsap.set(coverRef.current, { y: 0, opacity: 0 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth active-step opacity/stagger via GSAP when index changes
  useEffect(() => {
    if (!cardRef.current) return;
    const images = cardRef.current.querySelectorAll('[data-step-img]');
    images.forEach((img, i) => {
      gsap.to(img, {
        opacity: i === activeIndex ? 1 : 0,
        scale: i === activeIndex ? 1 : 1.04,
        duration: 0.7,
        ease: 'power3.out',
      });
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!coverRef.current) return;
    gsap.to(coverRef.current, {
      opacity: isHovered ? 1 : 0,
      y: isHovered ? -8 : 0,
      duration: 0.45,
      ease: 'power3.out',
    });
  }, [isHovered]);

  const currentStep = STEPS[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex items-center justify-between px-5 sm:px-8 md:px-16 select-none"
    >
      {/* Background Ribbon Path */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-30 md:opacity-100"
        viewBox="0 0 1000 1000"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="ribbonGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FB575F" />
            <stop offset="100%" stopColor="#8F53FC" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d="M -150 250 C 150 -50, 350 150, 220 500 C 100 800, -20 680, 180 900 C 300 1020, 800 950, 1200 850"
          stroke="url(#ribbonGradient)"
          strokeWidth="85"
          strokeLinecap="round"
          className="opacity-90"
        />
      </svg>

      {/* Left counter */}
      <div className="absolute left-4 sm:left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 font-sans text-sm md:text-base text-neutral-300 tabular-nums">
        ({currentStep.stepNum})
      </div>

      {/* Vertical title list with curved layout offsets on mobile */}
      <div className="relative z-20 w-full md:w-[55%] h-full overflow-hidden flex items-start justify-center md:justify-start px-4 md:pl-8 pt-8">
        <div ref={listRef} className="w-full flex flex-col items-center md:items-start">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            const distance = idx - activeIndex;

            // Curved positional offset mapping matching the reference video style
            let mobileTranslateX = '0px';
            if (distance === 0) {
              mobileTranslateX = '-18px'; // Highlighted item shifts cleanly to the left
            } else if (distance < 0) {
              mobileTranslateX = `${Math.abs(distance) * 8}px`; // Previous items drift to the right
            } else {
              mobileTranslateX = `${distance * 8}px`; // Next items drift to the right
            }

            return (
              <div
                key={step.id}
                onClick={() => setActiveIndex(idx)}
                style={{ height: `${ROW_HEIGHT}px` }}
                className="w-full flex items-center justify-center md:justify-start border-b border-neutral-800/60 cursor-pointer pr-0 md:pr-8"
              >
                <h2
                  style={{
                    transform: `translateX(${mobileTranslateX})`,
                  }}
                  className={`text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] leading-tight origin-center md:origin-left ${
                    isActive
                      ? 'text-white opacity-100 scale-105 md:-translate-x-8 font-bold'
                      : 'text-neutral-600 opacity-30 scale-95 hover:opacity-50 font-medium'
                  }`}
                >
                  {step.title}
                </h2>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right column – image card + desc (Hidden on mobile) */}
      <div className="relative z-20 hidden md:flex w-[40vw] max-w-[500px] flex-col items-end mr-2 sm:mr-4 md:mr-16">
        <div className="w-full flex justify-between text-xs font-sans font-medium tracking-widest uppercase text-coral-light mb-4 px-1">
          <span>STEP {currentStep.stepNum}</span>
          <span />
        </div>

        {/* Image card with floating cover */}
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl cursor-none group"
        >
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              data-step-img
              className="absolute inset-0 opacity-0"
              style={{ zIndex: idx === activeIndex ? 10 : 0 }}
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover filter grayscale opacity-70 contrast-125 transition-transform duration-[1.5s] group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          ))}

          {/* Floating cover card on hover */}
          <div
            ref={coverRef}
            className="absolute inset-4 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center pointer-events-none z-20 opacity-0"
          >
            <span className="text-offwhite text-sm font-sans font-medium tracking-widest uppercase">
              {currentStep.title}
            </span>
          </div>

          {/* Cursor badge */}
          {isHovered && (
            <div
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-none z-30 transition-transform duration-75 ease-out hidden md:block"
            >
              <span className="bg-offwhite text-black px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider shadow-2xl whitespace-nowrap">
                Next Stage
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="w-full h-[100px] mt-6 relative overflow-hidden">
          {STEPS.map((step, idx) => (
            <p
              key={step.id}
              className={`absolute top-0 left-0 w-full text-lg text-neutral-300 font-sans font-light leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                idx === activeIndex
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              {step.description}
            </p>
          ))}
        </div>

        <div className="absolute -right-12 top-0 text-[11px] font-sans font-medium uppercase tracking-widest text-neutral-400 origin-right">
          Process
        </div>
      </div>
    </section>
  );
}
