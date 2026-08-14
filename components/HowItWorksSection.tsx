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
    description: "Experts assess your idea's strength, market potential, and execution readiness.",
    image: '/Get Evalueted.jpg',
  },
  {
    id: 3,
    stepNum: '03',
    title: 'Make the Cut',
    description: 'Strongest submissions advance to the next stage of Meraki competition.',
    image: '/Make the cut.jpg',
  },
  {
    id: 4,
    stepNum: '04',
    title: 'Refine Your Pitch',
    description: 'Refine your idea through expert feedback and focused mentorship sessions.',
    image: '/refine your pitch.jpg',
  },
  {
    id: 5,
    stepNum: '05',
    title: 'Pitch at Meraki',
    description: 'Pitch your idea at FIIB before experts, investors, and innovators.',
    image: '/pitch at meraki.jpg',
  },
  {
    id: 6,
    stepNum: '06',
    title: 'Win',
    description: 'Compete for prizes, build connections, and take your idea forward.',
    image: '/win.jpg',
  },
];

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const stepNumberRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const ITEM_HEIGHT = 80; // adjust based on your text size

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const list = listRef.current;
      const indicator = indicatorRef.current;
      const preview = previewRef.current;
      const images = imageContainerRef.current?.querySelectorAll('[data-step-img]');
      const descriptions = descriptionRef.current?.querySelectorAll('[data-step-desc]');
      const stepNumbers = stepNumberRef.current;

      if (!container || !list || !indicator || !preview) return;

      // ---- 1. Pin the section ----
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${STEPS.length * 120}%`, // adjust scroll length
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      });

      // ---- 2. Move the list vertically ----
      const totalHeight = (STEPS.length - 1) * ITEM_HEIGHT;
      gsap.to(list, {
        y: -totalHeight,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${STEPS.length * 120}%`,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const rawIndex = progress * (STEPS.length - 1);
            const idx = Math.min(Math.round(rawIndex), STEPS.length - 1);
            setActiveIndex(idx);
          },
        },
      });

      // ---- 3. Move the indicator line ----
      gsap.to(indicator, {
        y: activeIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2,
        duration: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${STEPS.length * 120}%`,
          scrub: 0.8,
        },
      });

      // ---- 4. Image cross‑fade ----
      if (images) {
        images.forEach((img, i) => {
          gsap.to(img, {
            opacity: i === activeIndex ? 1 : 0,
            scale: i === activeIndex ? 1 : 1.04,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: `+=${STEPS.length * 120}%`,
              scrub: 0.8,
            },
          });
        });
      }

      // ---- 5. Description text cross‑fade ----
      if (descriptions) {
        descriptions.forEach((desc, i) => {
          gsap.to(desc, {
            opacity: i === activeIndex ? 1 : 0,
            y: i === activeIndex ? 0 : 12,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: `+=${STEPS.length * 120}%`,
              scrub: 0.8,
            },
          });
        });
      }

      // ---- 6. Step number update ----
      if (stepNumbers) {
        gsap.to(stepNumbers, {
          textContent: STEPS[activeIndex]?.stepNum || '01',
          duration: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: `+=${STEPS.length * 120}%`,
            scrub: 0.8,
          },
        });
      }

      // ---- 7. Entrance animation: list items stagger in ----
      const listItems = list.querySelectorAll('.step-item');
      gsap.fromTo(
        listItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        }
      );

      // ---- 8. Preview card entrance ----
      gsap.fromTo(
        preview,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        }
      );

      // ---- 9. Outro fade ----
      gsap.to(container, {
        opacity: 0.15,
        filter: 'blur(6px)',
        duration: 0.3,
        scrollTrigger: {
          trigger: container,
          start: `+=${(STEPS.length - 1) * 120}%`,
          end: `+=${STEPS.length * 120}%`,
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeIndex]);

  // Manual hover effects on the preview card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-black text-offwhite overflow-hidden flex items-center justify-between px-5 sm:px-8 md:px-16 select-none"
    >
      {/* ---- Background glow (subtle) ---- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(143,83,252,0.08),transparent_70%)] pointer-events-none" />

      {/* ---- Left side: Sticky list ---- */}
      <div className="relative z-10 w-full md:w-[55%] h-full flex items-center justify-center md:justify-start">
        <div
          ref={listRef}
          className="relative w-full max-w-lg flex flex-col items-center md:items-start"
        >
          {/* Red indicator line */}
          <div
            ref={indicatorRef}
            className="absolute left-0 w-1 h-[30px] bg-coral rounded-full transform -translate-y-1/2 hidden md:block"
            style={{ top: 0 }}
          />

          {STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={step.id}
                className="step-item w-full flex items-center justify-center md:justify-start border-b border-white/5 py-3 md:py-4 cursor-pointer"
                style={{ height: `${ITEM_HEIGHT}px` }}
                onClick={() => setActiveIndex(idx)}
              >
                <span className="text-xs font-mono text-neutral-500 mr-6 hidden md:inline">
                  {step.stepNum}
                </span>
                <h3
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-[3.2rem] font-sans tracking-tight transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isActive
                      ? 'text-white scale-105 font-bold'
                      : 'text-neutral-600 scale-95 hover:text-neutral-400 font-medium'
                  }`}
                >
                  {step.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Right side: Preview card & description ---- */}
      <div className="relative z-10 hidden md:flex w-[40%] flex-col items-end">
        {/* Step number */}
        <span
          ref={stepNumberRef}
          className="text-sm font-mono text-coral-light tracking-widest mb-2"
        >
          {STEPS[activeIndex]?.stepNum}
        </span>

        {/* Preview card with image cross‑fade */}
        <div
          ref={previewRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl cursor-none group"
        >
          <div ref={imageContainerRef} className="absolute inset-0">
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
          </div>

          {/* Hover overlay */}
          <div
            className={`absolute inset-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-offwhite text-sm font-sans font-medium tracking-widest uppercase">
              {STEPS[activeIndex]?.title}
            </span>
          </div>

          {/* Custom cursor badge */}
          {isHovered && (
            <div
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-none z-30 transition-transform duration-75 ease-out"
            >
              <span className="bg-offwhite text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xl whitespace-nowrap">
                Next Step
              </span>
            </div>
          )}
        </div>

        {/* Description text */}
        <div
          ref={descriptionRef}
          className="w-full mt-6 relative overflow-hidden"
          style={{ height: '80px' }}
        >
          {STEPS.map((step, idx) => (
            <p
              key={step.id}
              data-step-desc
              className={`absolute top-0 left-0 w-full text-base text-neutral-300 font-sans font-light leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                idx === activeIndex
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              {step.description}
            </p>
          ))}
        </div>

        {/* "Process" label */}
        <div className="absolute -right-12 top-0 text-[11px] font-sans font-medium uppercase tracking-widest text-neutral-400 origin-right">
          Process
        </div>
      </div>
    </section>
  );
}
