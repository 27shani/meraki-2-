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
  
  // NOTE: Type is HTMLSpanElement to match the JSX span tags precisely (Fixes Vercel build)
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mm = gsap.matchMedia();

    /* ====================================================================
       GLOBAL INTRO (Runs on both Desktop & Mobile)
       ==================================================================== */
    mm.add("all", () => {
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
    });

    /* ====================================================================
       DESKTOP ANIMATION: >= 768px (Kept exactly identical to original)
       ==================================================================== */
    mm.add("(min-width: 768px)", () => {
      gsap.set(bgRefs.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(textRefs.current, { color: '#737373' });
      gsap.set(iconRefs.current, { color: '#737373' });

      if (!prefersReduced) {
        textRefs.current.forEach((row, i) => {
          if (!row) return;
          gsap.fromTo(
            row,
            { opacity: 0, y: 30, filter: 'blur(8px)' },
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
              delay: i * 0.05,
            }
          );
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${faqs.length * 150}%`,
          pin: true,
          scrub: 1,
        },
      });

      let time = 0;
      const enterDuration = 1;
      const staggerDelay = 0.6;
      const activeCount = 2;

      for (let i = 0; i < activeCount; i++) {
        if (bgRefs.current[i] && textRefs.current[i]) {
          tl.to(bgRefs.current[i], { scaleX: 1, duration: enterDuration, ease: 'none' }, time);
          tl.to([textRefs.current[i], iconRefs.current[i]], { color: '#191818', duration: enterDuration, ease: 'none' }, time);
          time += staggerDelay;
        }
      }

      time += 0.5;

      for (let i = 0; i < faqs.length - activeCount; i++) {
        const rowOut = i;
        const rowIn = i + activeCount;
        if (bgRefs.current[rowOut] && textRefs.current[rowOut] && bgRefs.current[rowIn] && textRefs.current[rowIn]) {
          tl.to(bgRefs.current[rowOut], { scaleX: 0, transformOrigin: 'left center', duration: enterDuration, ease: 'none' }, time);
          tl.to([textRefs.current[rowOut], iconRefs.current[rowOut]], { color: '#737373', duration: enterDuration, ease: 'none' }, time);
          tl.to(bgRefs.current[rowIn], { scaleX: 1, transformOrigin: 'left center', duration: enterDuration, ease: 'none' }, time);
          tl.to([textRefs.current[rowIn], iconRefs.current[rowIn]], { color: '#191818', duration: enterDuration, ease: 'none' }, time);
          time += enterDuration;
        }
      }

      time += 0.5;

      for (let i = faqs.length - activeCount; i < faqs.length; i++) {
        if (bgRefs.current[i] && textRefs.current[i]) {
          tl.to(bgRefs.current[i], { scaleX: 0, transformOrigin: 'left center', duration: enterDuration, ease: 'none' }, time);
          tl.to([textRefs.current[i], iconRefs.current[i]], { color: '#737373', duration: enterDuration, ease: 'none' }, time);
          time += staggerDelay;
        }
      }

      tl.to({}, { duration: 1 }, time);
    });

    /* ====================================================================
       MOBILE ANIMATION: < 768px (Smooth scroll, NO lag, middle highlight)
       ==================================================================== */
    mm.add("(max-width: 767px)", () => {
      // Set initial dark gray color (Un-highlighted state)
      const inactiveColor = '#333333';
      const activeColor = '#ffffff';

      gsap.set(textRefs.current, { color: inactiveColor });
      gsap.set(iconRefs.current, { color: inactiveColor });

      textRefs.current.forEach((text, i) => {
        if (!text) return;
        const icon = iconRefs.current[i];
        
        // Target the parent row to determine when it hits the center of the screen
        const row = text.closest('.faq-row'); 
        
        // Highlight the text white smoothly as it crosses the center of the screen
        ScrollTrigger.create({
          trigger: row,
          start: 'top 55%',    // When the top of the row hits 55% of the viewport height
          end: 'bottom 45%',   // When the bottom of the row leaves 45% of the viewport height
          onEnter: () => gsap.to([text, icon], { color: activeColor, duration: 0.3, ease: 'power2.out' }),
          onLeave: () => gsap.to([text, icon], { color: inactiveColor, duration: 0.3, ease: 'power2.out' }),
          onEnterBack: () => gsap.to([text, icon], { color: activeColor, duration: 0.3, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to([text, icon], { color: inactiveColor, duration: 0.3, ease: 'power2.out' }),
        });
      });

      // Mobile Outro: Smooth fade/blur into the next section
      gsap.to(sectionRef.current, {
        opacity: 0,
        filter: 'blur(12px)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom 70%',
          end: 'bottom 20%',
          scrub: true,
        }
      });
    });

    return () => mm.revert();
  }, []);

  // Custom cursor (Desktop only)
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out' });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleRowEnter = () => {
    setCursorVisible(true);
    if (cursorRef.current) gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' });
  };

  const handleRowLeave = () => {
    setCursorVisible(false);
    if (cursorRef.current) gsap.to(cursorRef.current, { scale: 0.4, opacity: 0, duration: 0.3, ease: 'power3.out' });
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#070707] text-offwhite px-0 md:px-8 py-24 min-h-screen flex flex-col justify-center select-none overflow-x-hidden relative"
    >
      {/* 
        Mobile Sticky Red Ribbon 
        - Matches reference images precisely.
        - Fixed purely via CSS (sticky) for zero JS lag.
        - `w-3` makes it show only partially on the left edge.
      */}
      <div className="absolute inset-y-0 left-0 w-8 md:hidden z-0 pointer-events-none">
        <div className="sticky top-[50vh] -translate-y-1/2 w-3 sm:w-4 h-24 sm:h-32 bg-[#ff0000] rounded-r-full" />
      </div>

      {/* Custom cursor (Desktop only) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-coral pointer-events-none z-[9998] mix-blend-difference opacity-0 scale-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ willChange: 'transform, opacity' }}
      />

      <div className="max-w-[90rem] mx-auto w-full space-y-12">
        <h2 className="text-4xl md:text-6xl font-sans font-medium tracking-tight px-8 md:px-0 relative z-10">
          <span className="font-serif italic font-normal text-gradient-brand">
            FAQs
          </span>
        </h2>

        <div className="flex flex-col border-t border-white/10 relative z-10 pl-6 pr-4 md:px-0">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                // Added 'faq-row' class for scroll triggering on mobile
                className="faq-row relative flex flex-col px-4 md:px-8 py-8 md:py-8 border-b border-white/10 overflow-hidden will-change-transform transition-colors duration-300"
                onMouseEnter={handleRowEnter}
                onMouseLeave={handleRowLeave}
              >
                {/* Desktop Wipe Background (Strictly hidden on Mobile) */}
                <div
                  ref={(el) => { bgRefs.current[index] = el; }}
                  className="hidden md:block absolute inset-0 bg-offwhite z-0"
                />

                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="relative z-10 w-full flex justify-between items-center text-left group cursor-none md:cursor-none"
                >
                  <span
                    ref={(el) => { textRefs.current[index] = el; }}
                    // Increased text size for mobile (text-3xl) to match full big texts
                    className="text-3xl sm:text-4xl md:text-2xl font-sans font-medium pr-6"
                  >
                    {faq.question}
                  </span>
                  <span 
                    ref={(el) => { iconRefs.current[index] = el; }}
                    className="text-xl md:text-2xl font-light transition-transform duration-300 shrink-0"
                  >
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {/* Accordion Answer (Ensuring no images, clean text only) */}
                <div
                  className={`relative z-10 overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[300px] pt-4 opacity-100' : 'max-h-0 pt-0 opacity-0'
                  }`}
                >
                  <p className="font-sans text-base md:text-base leading-relaxed max-w-4xl opacity-90 text-neutral-300 md:text-inherit">
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
