// components/HowItWorksSection.tsx
'use client';

import { useEffect, useRef } from 'react';
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

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h2Refs = useRef<(HTMLHeadingElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const stepLabelRef = useRef<HTMLSpanElement>(null);
  const coverTitleRef = useRef<HTMLSpanElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const tilt = useRef({ targetRY: 0, targetRX: 0, ry: 0, rx: 0 });
  const isCardHovered = useRef(false);

  const ROW_HEIGHT = 120;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const ry = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    const rx = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    tilt.current.targetRY = ry * 6;
    tilt.current.targetRX = -rx * 4;
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Preload images
    STEPS.forEach((step) => {
      const img = new Image();
      img.src = step.image;
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

        // Tilt only on desktop
        let tickerFn: (() => void) | null = null;
        if (isDesktop) {
          tickerFn = () => {
            if (!cardRef.current || !isCardHovered.current) return;
            const t = tilt.current;
            t.ry += (t.targetRY - t.ry) * 0.12;
            t.rx += (t.targetRX - t.rx) * 0.12;
            cardRef.current.style.transform = `perspective(900px) rotateY(${t.ry.toFixed(2)}deg) rotateX(${t.rx.toFixed(2)}deg)`;
          };
          gsap.ticker.add(tickerFn);
        }

        // Cursor only on desktop
        let qCursorX: gsap.QuickToFunc | null = null;
        let qCursorY: gsap.QuickToFunc | null = null;
        let onGlobalMove: ((e: MouseEvent) => void) | null = null;

        if (isDesktop && cursorRef.current) {
          qCursorX = gsap.quickTo(cursorRef.current, 'left', { duration: 0.3, ease: 'power3.out' });
          qCursorY = gsap.quickTo(cursorRef.current, 'top', { duration: 0.3, ease: 'power3.out' });

          onGlobalMove = (e: MouseEvent) => {
            if (!isCardHovered.current || !cardRef.current || !qCursorX || !qCursorY) return;
            const rect = cardRef.current.getBoundingClientRect();
            qCursorX(e.clientX - rect.left);
            qCursorY(e.clientY - rect.top);
          };
          window.addEventListener('mousemove', onGlobalMove);
        }

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
              end: isMobile ? '+=55%' : '+=160%',   // shorter on mobile
              pin: true,
              scrub: isMobile ? 0.25 : 0.45,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          scrollTriggerRef.current = tl.scrollTrigger || null;

          // Entrance
          tl.fromTo(
            stepRefs.current,
            { y: isMobile ? 40 : 70, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: isMobile ? 0.05 : 0.07,
              duration: isMobile ? 0.7 : 0.9,
              ease: 'power2.out',
            },
            0
          );

          // SVG path (desktop only)
          if (isDesktop) {
            tl.to(pathRef.current, {
              strokeDashoffset: 0,
              ease: 'power1.inOut',
              duration: 0.7,
            }, 0);
          }

          // Vertical list movement
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

                  if (counterRef.current) counterRef.current.innerText = `(${STEPS[idx].stepNum})`;
                  if (stepLabelRef.current) stepLabelRef.current.innerText = `STEP ${STEPS[idx].stepNum}`;
                  if (coverTitleRef.current) coverTitleRef.current.innerText = STEPS[idx].title;

                  h2Refs.current.forEach((h2, i) => {
                    if (!h2) return;
                    const distance = i - idx;
                    let tx = '0px';
                    if (distance === 0) tx = isMobile ? '0px' : '-14px';
                    else if (distance < 0) tx = `${Math.abs(distance) * 8}px`;
                    else tx = `${distance * 8}px`;

                    h2.style.transform = `translateX(${tx})`;

                    if (i === idx) {
                      h2.className =
                        'text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap transition-all duration-500 ease-out leading-tight origin-center md:origin-left text-white opacity-100 scale-105 font-bold';
                    } else {
                      h2.className =
                        'text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap transition-all duration-500 ease-out leading-tight origin-center md:origin-left text-neutral-600 opacity-30 scale-95 font-medium';
                    }
                  });

                  // Images (desktop only)
                  if (isDesktop) {
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
                        if (img) img.style.transform = 'scale(1.03)';
                      }
                    });

                    descRefs.current.forEach((desc, i) => {
                      if (!desc) return;
                      if (i === idx) {
                        desc.style.opacity = '1';
                        desc.style.transform = 'translateY(0)';
                      } else {
                        desc.style.opacity = '0';
                        desc.style.transform = 'translateY(12px)';
                      }
                    });
                  }
                }
              },
            },
            0
          );

          tl.to({}, { duration: 0.08 }, 0.92);
        }

        return () => {
          if (tickerFn) gsap.ticker.remove(tickerFn);
          if (onGlobalMove) window.removeEventListener('mousemove', onGlobalMove);
        };
      }
    );

    return () => mm.revert();
  }, []);

  const handleStepClick = (idx: number) => {
    if (!scrollTriggerRef.current) return;
    const st = scrollTriggerRef.current;
    const progress = idx / (STEPS.length - 1);
    const scrollPos = st.start + (st.end - st.start) * progress;
    window.scrollTo({ top: scrollPos, behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-black text-offwhite overflow-hidden flex items-center justify-between px-4 sm:px-6 md:px-16 select-none"
    >
      {/* Ribbon path – desktop only */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block"
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

      {/* Counter */}
      <div
        ref={counterRef}
        className="absolute left-3 sm:left-5 md:left-10 top-1/2 -translate-y-1/2 z-30 font-sans text-sm text-neutral-400 tabular-nums"
      >
        ({STEPS[0].stepNum})
      </div>

      {/* Vertical titles */}
      <div className="relative z-20 w-full md:w-[55%] h-full overflow-hidden flex items-start justify-center md:justify-start px-2 md:pl-6 pt-6">
        <div ref={listRef} className="w-full flex flex-col items-center md:items-start">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              onClick={() => handleStepClick(idx)}
              style={{ height: `${ROW_HEIGHT}px` }}
              className="w-full flex items-center justify-center md:justify-start border-b border-neutral-800/50 cursor-pointer"
            >
              <h2
                ref={(el) => {
                  h2Refs.current[idx] = el;
                }}
                className={`text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-sans tracking-tight whitespace-nowrap leading-tight ${
                  idx === 0
                    ? 'text-white opacity-100 scale-105 font-bold'
                    : 'text-neutral-600 opacity-30 scale-95 font-medium'
                }`}
              >
                {step.title}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Right preview card – desktop only */}
      <div className="relative z-20 hidden md:flex w-[38vw] max-w-[480px] flex-col items-end mr-4 md:mr-12">
        <div className="w-full flex justify-between text-xs font-sans font-medium tracking-widest uppercase text-coral-light mb-3 px-1">
          <span ref={stepLabelRef}>STEP {STEPS[0].stepNum}</span>
        </div>

        <div
          ref={cardRef}
          onMouseEnter={() => {
            isCardHovered.current = true;
            if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 });
          }}
          onMouseLeave={() => {
            isCardHovered.current = false;
            tilt.current.targetRY = 0;
            tilt.current.targetRX = 0;
            if (cursorRef.current) gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 });
          }}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl cursor-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              ref={(el) => {
                imgRefs.current[idx] = el;
              }}
              className="absolute inset-0 transition-opacity duration-600"
              style={{ opacity: idx === 0 ? 1 : 0, zIndex: idx === 0 ? 10 : 0 }}
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover filter grayscale opacity-70 contrast-125"
              />
            </div>
          ))}

          <div
            ref={coverRef}
            className="absolute inset-4 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center pointer-events-none z-20 opacity-0"
          >
            <span ref={coverTitleRef} className="text-offwhite text-sm font-sans font-medium tracking-widest uppercase">
              {STEPS[0].title}
            </span>
          </div>

          <div
            ref={cursorRef}
            className="absolute pointer-events-none z-30 opacity-0"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
          >
            <span className="bg-offwhite text-black px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider shadow-xl whitespace-nowrap">
              Next Stage
            </span>
          </div>
        </div>

        <div className="w-full h-[90px] mt-5 relative overflow-hidden">
          {STEPS.map((step, idx) => (
            <p
              key={step.id}
              ref={(el) => {
                descRefs.current[idx] = el;
              }}
              style={{
                opacity: idx === 0 ? 1 : 0,
                transform: idx === 0 ? 'translateY(0)' : 'translateY(12px)',
              }}
              className="absolute top-0 left-0 w-full text-base text-neutral-300 font-sans font-light leading-relaxed transition-all duration-500"
            >
              {step.description}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
