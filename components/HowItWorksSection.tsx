'use client';

import { useLayoutEffect, useRef, useState } from 'react';
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
  { id: 1, stepNum: '01', title: 'Apply', description: 'Share your idea, the problem it solves, and your vision.', image: '/Apply.jpg' },
  { id: 2, stepNum: '02', title: 'Get Evaluated', description: "Experts assess your idea's strength, market potential, and execution readiness.", image: '/Get Evalueted.jpg' },
  { id: 3, stepNum: '03', title: 'Make the Cut', description: 'Strongest submissions advance to the next stage of Meraki competition.', image: '/Make the cut.jpg' },
  { id: 4, stepNum: '04', title: 'Refine Your Pitch', description: 'Refine your idea through expert feedback and focused mentorship sessions.', image: '/refine your pitch.jpg' },
  { id: 5, stepNum: '05', title: 'Pitch at Meraki', description: 'Pitch your idea at FIIB before experts, investors, and innovators.', image: '/pitch at meraki.jpg' },
  { id: 6, stepNum: '06', title: 'Win', description: 'Compete for prizes, build connections, and take your idea forward.', image: '/win.jpg' },
];

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  
  // High-performance Refs
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h2Refs = useRef<(HTMLHeadingElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const stepLabelRef = useRef<HTMLSpanElement>(null);
  const coverTitleRef = useRef<HTMLSpanElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

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

  // useLayoutEffect prevents visual flickering before the initial paint
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wrap everything in a context for strict cleanup
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isMobile, isDesktop } = context.conditions as { isMobile: boolean, isDesktop: boolean };
        const total = STEPS.length;
        let lastIndex = 0;

        if (pathRef.current && listRef.current && containerRef.current) {
          const pathLength = pathRef.current.getTotalLength();
          gsap.set(pathRef.current, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });

          // Adjust starting positions dynamically to fix the mobile blank space
          const vh = window.innerHeight;
          const mobileOffset = isMobile ? ROW_HEIGHT : ROW_HEIGHT / 2;
          const startY = vh / 2 - mobileOffset;
          const endY = vh / 2 - ((total - 1) * ROW_HEIGHT + mobileOffset);

          gsap.set(listRef.current, { y: startY });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              // Drastically reduced mobile scrub end distance to kill empty space
              end: isMobile ? '+=30%' : '+=150%',
              pin: true,
              scrub: 1.5, // CPU smoothing rule applied
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          
          scrollTriggerRef.current = tl.scrollTrigger || null;

          tl.fromTo(
            stepRefs.current,
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 1.0,
              ease: 'power2.out',
            },
            0
          );

          if (isDesktop) {
            tl.to(
              pathRef.current,
              { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.8 },
              0
            );
          }

          // Optimized Scroll Updates - Using GSAP to update styles instead of raw DOM/Class manipulation
          tl.to(
            listRef.current,
            {
              y: endY,
              ease: 'none',
              duration: 1,
              onUpdate: function () {
                const rawIndex = this.progress() * (total - 1);
                const idx = Math.min(Math.round(rawIndex), total - 1);

                if (idx !== lastIndex) {
                  lastIndex = idx;

                  // Fast text updates
                  if (counterRef.current) counterRef.current.innerText = `(${STEPS[idx].stepNum})`;
                  if (stepLabelRef.current) stepLabelRef.current.innerText = `STEP ${STEPS[idx].stepNum}`;
                  if (coverTitleRef.current) coverTitleRef.current.innerText = STEPS[idx].title;

                  // Hardware Accelerated Heading Transitions
                  h2Refs.current.forEach((h2, i) => {
                    if (!h2) return;
                    const distance = i - idx;
                    let tx = distance === 0 ? -18 : Math.abs(distance) * 8;
                    if (distance > 0) tx = distance * 8;

                    gsap.to(h2, {
                      x: tx,
                      opacity: i === idx ? 1 : 0.3,
                      scale: i === idx ? 1.05 : 0.95,
                      color: i === idx ? '#ffffff' : '#525252',
                      duration: 0.4,
                      ease: 'power2.out',
                      overwrite: 'auto'
                    });
                  });

                  // Hardware Accelerated Image Fades
                  imgRefs.current.forEach((img, i) => {
                    if (!img) return;
                    gsap.to(img, {
                      opacity: i === idx ? 1 : 0,
                      scale: i === idx ? 1 : 1.04,
                      duration: 0.6,
                      ease: 'power2.out',
                      overwrite: 'auto'
                    });
                    img.style.zIndex = i === idx ? '10' : '0';
                  });

                  // Hardware Accelerated Description Updates
                  descRefs.current.forEach((desc, i) => {
                    if (!desc) return;
                    gsap.to(desc, {
                      y: i === idx ? 0 : 16,
                      opacity: i === idx ? 1 : 0,
                      duration: 0.4,
                      ease: 'power2.out',
                      overwrite: 'auto'
                    });
                    desc.style.pointerEvents = i === idx ? 'auto' : 'none';
                  });
                }
              },
            },
            0
          );

          tl.to({}, { duration: 0.1 }, 0.9);
        }

        if (coverRef.current && !prefersReduced) {
          gsap.set(coverRef.current, { y: 0, opacity: 0 });
        }
      });
    }, containerRef); // Scope GSAP context to the container

    // Strict Cleanup Rule applied
    return () => {
      ctx.revert(); // Reverts all GSAP animations in context
      ScrollTrigger.getAll().forEach(t => t.kill()); // Nuke all triggers just in case
    };
  }, []);

  // Hover effect using standard GSAP
  useLayoutEffect(() => {
    if (!coverRef.current) return;
    gsap.to(coverRef.current, {
      opacity: isHovered ? 1 : 0,
      y: isHovered ? -8 : 0,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }, [isHovered]);

  const handleStepClick = (idx: number) => {
    if (scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const progress = idx / (STEPS.length - 1);
      const scrollPos = st.start + (st.end - st.start) * progress;
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex items-center justify-between px-5 sm:px-8 md:px-16 select-none"
    >
      {/* Background SVG Path */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block opacity-100 will-change-transform"
        viewBox="0 0 1000 1000"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
      <div 
        ref={counterRef} 
        className="absolute left-4 sm:left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 font-sans text-sm md:text-base text-neutral-300 tabular-nums transition-all duration-300"
      >
        ({STEPS[0].stepNum})
      </div>

      {/* Vertical title list */}
      <div className="relative z-20 w-full md:w-[55%] h-full overflow-hidden flex items-start justify-center md:justify-start px-4 md:pl-8 pt-8">
        <div ref={listRef} className="w-full flex flex-col items-center md:items-start will-change-transform">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              ref={(el) => { stepRefs.current[idx] = el; }}
              onClick={() => handleStepClick(idx)}
              style={{ height: `${ROW_HEIGHT}px` }}
              className="w-full flex items-center justify-center md:justify-start border-b border-neutral-800/60 cursor-pointer pr-0 md:pr-8"
            >
              <h2
                ref={(el) => { h2Refs.current[idx] = el; }}
                style={{ 
                  transform: idx === 0 ? 'translateX(-18px) scale(1.05)' : `translateX(${idx * 8}px) scale(0.95)`,
                  opacity: idx === 0 ? 1 : 0.3,
                  color: idx === 0 ? '#ffffff' : '#525252',
                  fontWeight: idx === 0 ? 700 : 500,
                }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap leading-tight origin-center md:origin-left will-change-transform"
              >
                {step.title}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="relative z-20 hidden md:flex w-[40vw] max-w-[500px] flex-col items-end mr-2 sm:mr-4 md:mr-16">
        <div className="w-full flex justify-between text-xs font-sans font-medium tracking-widest uppercase text-coral-light mb-4 px-1">
          <span ref={stepLabelRef}>STEP {STEPS[0].stepNum}</span>
          <span />
        </div>

        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl cursor-none group will-change-transform"
        >
          {STEPS.map((step, idx) => (
            <img
              key={step.id}
              ref={(el) => { imgRefs.current[idx] = el; }}
              src={step.image}
              alt={step.title}
              width="800"
              height="500"
              style={{ 
                opacity: idx === 0 ? 1 : 0, 
                zIndex: idx === 0 ? 10 : 0,
                transform: idx === 0 ? 'scale(1)' : 'scale(1.04)'
              }}
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 will-change-transform transition-all duration-[1.5s]"
            />
          ))}

          <div
            ref={coverRef}
            className="absolute inset-4 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center pointer-events-none z-20 opacity-0 will-change-transform"
          >
            <span ref={coverTitleRef} className="text-offwhite text-sm font-sans font-medium tracking-widest uppercase">
              {STEPS[0].title}
            </span>
          </div>

          {isHovered && (
            <div
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-none z-30 hidden md:block will-change-transform"
            >
              <span className="bg-offwhite text-black px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider shadow-2xl whitespace-nowrap">
                Next Stage
              </span>
            </div>
          )}
        </div>

        <div className="w-full h-[100px] mt-6 relative overflow-hidden">
          {STEPS.map((step, idx) => (
            <p
              key={step.id}
              ref={(el) => { descRefs.current[idx] = el; }}
              style={{ 
                opacity: idx === 0 ? 1 : 0, 
                transform: idx === 0 ? 'translateY(0)' : 'translateY(16px)',
                pointerEvents: idx === 0 ? 'auto' : 'none' 
              }}
              className="absolute top-0 left-0 w-full text-lg text-neutral-300 font-sans font-light leading-relaxed will-change-transform"
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
