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
  const cursorRef = useRef<HTMLDivElement>(null);

  // High-performance refs (avoid React state for hot paths)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h2Refs = useRef<(HTMLHeadingElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const stepLabelRef = useRef<HTMLSpanElement>(null);
  const coverTitleRef = useRef<HTMLSpanElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Mouse tilt state (pure JS, updated on ticker)
  const tilt = useRef({ targetRY: 0, targetRX: 0, ry: 0, rx: 0 });
  const isCardHovered = useRef(false);

  const ROW_HEIGHT = 130;

  // ---------- Mouse move (tilt + cursor) ----------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Normalized -1 → 1
    const ry = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    const rx = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));

    tilt.current.targetRY = ry * 7;   // max ~7°
    tilt.current.targetRX = -rx * 5;  // max ~5°

    // Cursor position relative to card (for the pill)
    if (cursorRef.current) {
      // We let gsap.quickTo handle the lag later
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preload images (like the original site)
    STEPS.forEach((step) => {
      const img = new Image();
      img.src = step.image;
      if (img.decode) img.decode().catch(() => {});
    });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions as {
          isMobile: boolean;
          isDesktop: boolean;
        };

        const total = STEPS.length;
        let lastIndex = 0;

        // ---------- 3D tilt ticker (cheap continuous lerp) ----------
        const tickerFn = () => {
          if (!cardRef.current || !isCardHovered.current) return;

          const t = tilt.current;
          t.ry += (t.targetRY - t.ry) * 0.12;
          t.rx += (t.targetRX - t.rx) * 0.12;

          cardRef.current.style.transform = `perspective(900px) rotateY(${t.ry.toFixed(2)}deg) rotateX(${t.rx.toFixed(2)}deg)`;
        };
        gsap.ticker.add(tickerFn);

        // ---------- Cursor with gsap.quickTo (smooth lag) ----------
        let qCursorX: gsap.QuickToFunc | null = null;
        let qCursorY: gsap.QuickToFunc | null = null;

        if (cursorRef.current && isDesktop) {
          qCursorX = gsap.quickTo(cursorRef.current, 'left', {
            duration: 0.35,
            ease: 'power3.out',
          });
          qCursorY = gsap.quickTo(cursorRef.current, 'top', {
            duration: 0.35,
            ease: 'power3.out',
          });
        }

        const onGlobalMove = (e: MouseEvent) => {
          if (!isCardHovered.current || !cardRef.current || !qCursorX || !qCursorY) return;
          const rect = cardRef.current.getBoundingClientRect();
          qCursorX(e.clientX - rect.left);
          qCursorY(e.clientY - rect.top);
        };
        window.addEventListener('mousemove', onGlobalMove);

        // ---------- Main timeline ----------
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
              end: isMobile ? '+=70%' : '+=180%',
              pin: true,
              scrub: isMobile ? 0.3 : 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          scrollTriggerRef.current = tl.scrollTrigger || null;

          // Entrance of titles
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

          // SVG path draw (desktop only)
          if (isDesktop) {
            tl.to(
              pathRef.current,
              { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.8 },
              0
            );
          }

          // Vertical list movement + high-performance active state
          tl.to(
            listRef.current,
            {
              y: endY,
              ease: 'none',
              duration: 1,
              onUpdate: function () {
                const rawIndex = this.progress() * (total - 1);
                const idx = Math.min(Math.round(rawIndex), total - 1);

                // Only touch the DOM when the active item actually changes
                if (idx !== lastIndex) {
                  lastIndex = idx;

                  // Counter + labels
                  if (counterRef.current) counterRef.current.innerText = `(${STEPS[idx].stepNum})`;
                  if (stepLabelRef.current) stepLabelRef.current.innerText = `STEP ${STEPS[idx].stepNum}`;
                  if (coverTitleRef.current) coverTitleRef.current.innerText = STEPS[idx].title;

                  // Headings – horizontal offset based on distance (like lukebaffait)
                  h2Refs.current.forEach((h2, i) => {
                    if (!h2) return;
                    const distance = i - idx;
                    let tx = '0px';
                    if (distance === 0) tx = '-18px';
                    else if (distance < 0) tx = `${Math.abs(distance) * 10}px`;
                    else tx = `${distance * 10}px`;

                    h2.style.transform = `translateX(${tx})`;

                    if (i === idx) {
                      h2.className =
                        'text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] leading-tight origin-center md:origin-left text-white opacity-100 scale-105 md:-translate-x-8 font-bold';
                    } else {
                      h2.className =
                        'text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] leading-tight origin-center md:origin-left text-neutral-600 opacity-30 scale-95 hover:opacity-50 font-medium';
                    }
                  });

                  // Images – crossfade + slight scale
                  imgRefs.current.forEach((imgDiv, i) => {
                    if (!imgDiv) return;
                    const img = imgDiv.querySelector('img');
                    if (i === idx) {
                      imgDiv.style.opacity = '1';
                      imgDiv.style.zIndex = '10';
                      if (img) img.style.transform = 'scale(1)';
                    } else {
                      imgDiv.style.opacity = '0';
                      imgDiv.style.zIndex = '0';
                      if (img) img.style.transform = 'scale(1.04)';
                    }
                  });

                  // Descriptions
                  descRefs.current.forEach((desc, i) => {
                    if (!desc) return;
                    if (i === idx) {
                      desc.style.opacity = '1';
                      desc.style.transform = 'translateY(0)';
                      desc.style.pointerEvents = 'auto';
                    } else {
                      desc.style.opacity = '0';
                      desc.style.transform = 'translateY(16px)';
                      desc.style.pointerEvents = 'none';
                    }
                  });
                }
              },
            },
            0
          );

          // Small hold at the end
          tl.to({}, { duration: 0.12 }, 0.9);
        }

        // Cover fade on hover
        if (coverRef.current && !prefersReduced) {
          gsap.set(coverRef.current, { y: 0, opacity: 0 });
        }

        // Cleanup
        return () => {
          gsap.ticker.remove(tickerFn);
          window.removeEventListener('mousemove', onGlobalMove);
        };
      }
    );

    return () => mm.revert();
  }, []);

  // Cover opacity / y on hover
  useEffect(() => {
    if (!coverRef.current) return;
    gsap.to(coverRef.current, {
      opacity: isCardHovered.current ? 1 : 0,
      y: isCardHovered.current ? -8 : 0,
      duration: 0.45,
      ease: 'power3.out',
    });
  });

  // Click → scroll to corresponding progress
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
      {/* Fluid ribbon path */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block opacity-100"
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
        <div ref={listRef} className="w-full flex flex-col items-center md:items-start">
          {STEPS.map((step, idx) => {
            const isInitialActive = idx === 0;
            return (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                onClick={() => handleStepClick(idx)}
                style={{ height: `${ROW_HEIGHT}px` }}
                className="w-full flex items-center justify-center md:justify-start border-b border-neutral-800/60 cursor-pointer pr-0 md:pr-8"
              >
                <h2
                  ref={(el) => {
                    h2Refs.current[idx] = el;
                  }}
                  style={{
                    transform: isInitialActive ? 'translateX(-18px)' : `translateX(${idx * 8}px)`,
                  }}
                  className={`text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] leading-tight origin-center md:origin-left ${
                    isInitialActive
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

      {/* Right column – preview card */}
      <div className="relative z-20 hidden md:flex w-[40vw] max-w-[500px] flex-col items-end mr-2 sm:mr-4 md:mr-16">
        <div className="w-full flex justify-between text-xs font-sans font-medium tracking-widest uppercase text-coral-light mb-4 px-1">
          <span ref={stepLabelRef}>STEP {STEPS[0].stepNum}</span>
          <span />
        </div>

        <div
          ref={cardRef}
          onMouseEnter={() => {
            isCardHovered.current = true;
            if (cursorRef.current) {
              gsap.to(cursorRef.current, { opacity: 1, duration: 0.25 });
            }
          }}
          onMouseLeave={() => {
            isCardHovered.current = false;
            // Reset tilt smoothly
            tilt.current.targetRY = 0;
            tilt.current.targetRX = 0;
            if (cursorRef.current) {
              gsap.to(cursorRef.current, { opacity: 0, duration: 0.25 });
            }
          }}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl cursor-none group will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              ref={(el) => {
                imgRefs.current[idx] = el;
              }}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{
                opacity: idx === 0 ? 1 : 0,
                zIndex: idx === 0 ? 10 : 0,
              }}
            >
              <img
                src={step.image}
                alt={step.title}
                style={{ transform: idx === 0 ? 'scale(1)' : 'scale(1.04)' }}
                className="w-full h-full object-cover filter grayscale opacity-70 contrast-125 transition-transform duration-[1.5s] ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          ))}

          {/* Cover overlay */}
          <div
            ref={coverRef}
            className="absolute inset-4 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center pointer-events-none z-20 opacity-0"
          >
            <span
              ref={coverTitleRef}
              className="text-offwhite text-sm font-sans font-medium tracking-widest uppercase"
            >
              {STEPS[0].title}
            </span>
          </div>

          {/* Custom cursor (pill) – driven by gsap.quickTo */}
          <div
            ref={cursorRef}
            className="absolute pointer-events-none z-30 opacity-0 hidden md:block"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
          >
            <span className="bg-offwhite text-black px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider shadow-2xl whitespace-nowrap">
              Next Stage
            </span>
          </div>
        </div>

        {/* Descriptions */}
        <div className="w-full h-[100px] mt-6 relative overflow-hidden">
          {STEPS.map((step, idx) => (
            <p
              key={step.id}
              ref={(el) => {
                descRefs.current[idx] = el;
              }}
              style={{
                opacity: idx === 0 ? 1 : 0,
                transform: idx === 0 ? 'translateY(0)' : 'translateY(16px)',
                pointerEvents: idx === 0 ? 'auto' : 'none',
              }}
              className="absolute top-0 left-0 w-full text-lg text-neutral-300 font-sans font-light leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
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
