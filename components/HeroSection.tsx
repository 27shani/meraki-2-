// components/AboutSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const benefits = [
    { step: '/ BUILD_01', title: 'Sharpen Your Pitch', desc: 'Turn your idea into a clear, compelling business case with expert feedback and real-world perspective.' },
    { step: '/ CONNECT_02', title: 'Build Your Network', desc: 'Connect with mentors, investors, industry leaders and ambitious peers who can take your idea further.' },
    { step: '/ GROW_03', title: 'Earn Real Recognition', desc: 'Put your idea on a bigger stage, compete for prizes and gain visibility among the entrepreneurial ecosystem.' },
  ];

  const wrapWords = (element: HTMLElement) => {
    const words = element.textContent?.split(/\s+/) || [];
    element.innerHTML = words.map((word) => `<span class="word">${word}</span>`).join(' ');
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Word-by-word reveal on heading
    if (headingRef.current) {
      wrapWords(headingRef.current);
      const words = headingRef.current.querySelectorAll('.word');
      gsap.fromTo(
        words,
        { opacity: 0, filter: 'blur(8px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    const mm = gsap.matchMedia();

    // GLOBAL intro blur fade (all devices)
    mm.add("all", () => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.15, filter: 'blur(8px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        }
      );
    });

    // DESKTOP (>= 768px) – with OPENING + CLOSING + PIN
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',      // Enough scroll for both open and close
          pin: true,
          scrub: 0.8,
        },
      });

      // --- OPENING PHASE: elements start scaled down ---
      tl.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        0
      )
      .fromTo(
        textContainerRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: -50, duration: 1.2, ease: 'power2.out' },
        0.1
      )
      .fromTo(
        boxRefs.current,
        { scale: 0.9, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, stagger: 0.2, duration: 2.5, ease: 'power2.out' },
        0.2
      );

      // --- CLOSING PHASE: elements scale down and fade out ---
      tl.to(
        imageRef.current,
        { scale: 0.7, opacity: 0.2, y: -60, duration: 1, ease: 'power2.inOut' },
        '+=1.5'
      )
      .to(
        textContainerRef.current,
        { scale: 0.8, opacity: 0.15, y: -40, duration: 1, ease: 'power2.inOut' },
        '-=0.8'
      )
      .to(
        boxRefs.current,
        { scale: 0.8, opacity: 0.1, y: -30, stagger: 0.1, duration: 1, ease: 'power2.inOut' },
        '-=0.6'
      );
    });

    // MOBILE (< 768px) – similar but with a shorter pin and slightly adjusted values
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.8,
        },
      });

      tl.fromTo(
        imageRef.current,
        { scale: 0.85, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        0
      )
      .fromTo(
        textContainerRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        0.1
      )
      .fromTo(
        boxRefs.current,
        { scale: 0.95, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, stagger: 0.15, duration: 1.5, ease: 'power2.out' },
        0.2
      )
      .to(
        imageRef.current,
        { scale: 0.75, opacity: 0.2, y: -40, duration: 0.8, ease: 'power2.inOut' },
        '+=1.2'
      )
      .to(
        textContainerRef.current,
        { scale: 0.85, opacity: 0.15, y: -30, duration: 0.8, ease: 'power2.inOut' },
        '-=0.6'
      )
      .to(
        boxRefs.current,
        { scale: 0.85, opacity: 0.1, y: -20, stagger: 0.08, duration: 0.8, ease: 'power2.inOut' },
        '-=0.4'
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#f5f5f0] px-4 md:px-8 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 ref={headingRef} className="text-3xl md:text-5xl font-light text-[#191818] mb-8 md:mb-16">
          Build something worth building.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Left: Image */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              ref={imageRef}
              src="/about-image.jpg"
              alt="About Meraki"
              className="w-full h-auto object-cover"
              style={{ filter: 'blur(8px) brightness(0.8)', opacity: 0 }}
            />
          </div>

          {/* Right: Text + Boxes */}
          <div ref={textContainerRef} className="space-y-6">
            <p className="text-lg text-[#191818]/80 leading-relaxed">
              Meraki is more than a competition. It's a launchpad for founders who want to build,
              connect, and grow.
            </p>

            <div className="space-y-4 mt-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  ref={(el) => { boxRefs.current[index] = el; }}
                  className="border border-[#191818]/10 rounded-xl p-5 bg-white/50 backdrop-blur-sm"
                  style={{ transform: 'translateY(50px)', opacity: 0 }}
                >
                  <div className="text-sm text-[#8B0000] font-mono tracking-wider">{benefit.step}</div>
                  <h3 className="text-xl font-medium text-[#191818] mt-1">{benefit.title}</h3>
                  <p className="text-[#191818]/70 text-sm mt-1">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
