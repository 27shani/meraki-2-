// components/AwardsSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const faqs = [
  {
    question: 'Who can participate in Meraki 2026?',
    answer:
      'Meraki is open to participants worldwide. Teams can have 1–5 members, with at least one currently enrolled student or degree-seeking member. The competition welcomes early-stage ideas and young ventures with clear revenue potential, scalability and credible, defensible business models that can attract investors.',
  },
  {
    question: 'Do I need to have an existing startup?',
    answer:
      'No. Meraki welcomes both early-stage ideas and young ventures seeking validation, growth or a platform to take their concept forward.',
  },
  {
    question: 'Can students from outside India apply?',
    answer:
      'Yes. Meraki is designed as an international platform and welcomes eligible undergraduate students from across the world.',
  },
  {
    question: 'What will the judges look for?',
    answer:
      'Your idea matters, but so does your thinking. Evaluation focuses on factors such as business clarity, market understanding, execution readiness, scalability and real-world impact.',
  },
];

export default function AwardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect mobile
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Intro blur
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, filter: 'blur(14px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        }
      );

      // On mobile, skip the scroll-pinned white strip animation entirely
      if (isMobile) {
        gsap.set(bgRefs.current, { scaleX: 0, transformOrigin: 'left center' });
        textRefs.current.forEach((row, i) => {
          if (!row) return;
          gsap.set(row, { opacity: 1, y: 0, filter: 'blur(0px)' });
          gsap.set(bgRefs.current[i], { scaleX: i === 0 ? 1 : 0 });
          gsap.set(row, { color: i === 0 ? '#191818' : '#737373' });
        });
        return;
      }

      // ---- DESKTOP ONLY LOGIC ----
      gsap.set(bgRefs.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(textRefs.current, { color: '#737373' });

      // Staggered row reveal
      if (!prefersReduced) {
        textRefs.current.forEach((row, i) => {
          if (!row) return;
          gsap.fromTo(
            row,
            { opacity: 0, y: 20, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 0.8,
              },
              delay: i * 0.03,
            }
          );
        });
      }

      // ---- MAIN PIN TIMELINE (white strip highlight) ----
      const pinDuration = faqs.length * 150;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${pinDuration}%`,
          pin: true,
          scrub: 1.0,
        },
      });

      let time = 0;
      const activeCount = 2;
      const enterDuration = 1.0;
      const staggerDelay = 0.6;

      // First two rows highlight
      for (let i = 0; i < activeCount; i++) {
        if (bgRefs.current[i] && textRefs.current[i]) {
          tl.to(
            bgRefs.current[i],
            { scaleX: 1, duration: enterDuration, ease: 'none' },
            time
          );
          tl.to(
            textRefs.current[i],
            { color: '#191818', duration: enterDuration, ease: 'none' },
            time
          );
          time += staggerDelay;
        }
      }

      time += 0.3;

      // Slide highlight: one row leaves, next row enters
      for (let i = 0; i < faqs.length - activeCount; i++) {
        const rowOut = i;
        const rowIn = i + activeCount;
        if (
          bgRefs.current[rowOut] &&
          textRefs.current[rowOut] &&
          bgRefs.current[rowIn] &&
          textRefs.current[rowIn]
        ) {
          tl.to(
            bgRefs.current[rowOut],
            {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: enterDuration,
              ease: 'none',
            },
            time
          );
          tl.to(
            textRefs.current[rowOut],
            { color: '#737373', duration: enterDuration, ease: 'none' },
            time
          );
          tl.to(
            bgRefs.current[rowIn],
            {
              scaleX: 1,
              transformOrigin: 'left center',
              duration: enterDuration,
              ease: 'none',
            },
            time
          );
          tl.to(
            textRefs.current[rowIn],
            { color: '#191818', duration: enterDuration, ease: 'none' },
            time
          );
          time += enterDuration;
        }
      }

      time += 0.3;

      // Last rows fade out
      for (let i = faqs.length - activeCount; i < faqs.length; i++) {
        if (bgRefs.current[i] && textRefs.current[i]) {
          tl.to(
            bgRefs.current[i],
            {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: enterDuration,
              ease: 'none',
            },
            time
          );
          tl.to(
            textRefs.current[i],
            { color: '#737373', duration: enterDuration, ease: 'none' },
            time
          );
          time += staggerDelay;
        }
      }

      tl.to({}, { duration: 0.5 }, time);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Custom cursor setup
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleRowEnter = () => {
    setCursorVisible(true);
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
      });
    }
  };

  const handleRowLeave = () => {
    setCursorVisible(false);
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 0.4,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  };

  // Mobile Click Handler to toggle white strip highlight safely
  const handleMobileClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const isMobile = window.innerWidth < 768;
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);

    if (isMobile) {
      faqs.forEach((_, i) => {
        const bgEl = bgRefs.current[i];
        const textEl = textRefs.current[i];
        if (bgEl && textEl) {
          if (i === newIndex) {
            gsap.to(bgEl, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
            gsap.to(textEl, { color: '#191818', duration: 0.3 });
          } else {
            gsap.to(bgEl, { scaleX: 0, duration: 0.3, ease: 'power2.out' });
            gsap.to(textEl, { color: '#737373', duration: 0.3 });
          }
        }
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#070707] text-offwhite px-8 py-24 min-h-screen flex flex-col justify-center select-none overflow-hidden relative"
    >
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-coral pointer-events-none z-[9998] mix-blend-difference opacity-0 scale-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ willChange: 'transform, opacity' }}
      />

      <div className="max-w-[90rem] mx-auto w-full space-y-12">
        <h2 className="text-4xl md:text-6xl font-sans font-medium tracking-tight px-8 md:px-0">
          <span className="font-serif italic font-normal text-gradient-brand">
            FAQs
          </span>
        </h2>

        <div className="flex flex-col border-t border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                className="relative flex flex-col px-8 py-8 border-b border-white/10 overflow-hidden will-change-transform transition-colors duration-300"
                onMouseEnter={handleRowEnter}
                onMouseLeave={handleRowLeave}
              >
                <div
                  ref={(el) => {
                    bgRefs.current[index] = el;
                  }}
                  className="absolute inset-0 bg-offwhite z-0"
                  style={{ transformOrigin: 'left center' }}
                />

                <button
                  type="button"
                  onClick={(e) => handleMobileClick(e, index)}
                  className="relative z-10 w-full flex justify-between items-center text-left group cursor-pointer md:cursor-none"
                >
                  <span className="text-lg md:text-2xl font-sans font-medium pr-6">
                    {faq.question}
                  </span>
                  <span className="text-xl md:text-2xl font-light transition-transform duration-300 shrink-0">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                <div
                  className={`relative z-10 overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen
                      ? 'max-h-[300px] pt-4 opacity-100'
                      : 'max-h-0 pt-0 opacity-0'
                  }`}
                >
                  <p className="font-sans text-sm md:text-base leading-relaxed max-w-4xl opacity-90">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
