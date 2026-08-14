// components/FloatingGallery.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoWords } from '@/lib/splitText';

interface Project {
  id: number;
  name: string;
  image: string;
}

/*
 * Placeholder images - replace with your actual portfolio screenshots
 */
const PROJECTS: Project[] = [
  { id: 1, name: 'Project 01', image: '/Screenshot-1.jpg' },
  { id: 2, name: 'Project 02', image: '/Screenshot-2.jpg' },
  { id: 3, name: 'Project 03', image: '/Screenshot-3.jpg' },
  { id: 4, name: 'Project 04', image: '/Screenshot-4.jpg' },
  { id: 5, name: 'Project 05', image: '/Screenshot-5.jpg' },
  { id: 6, name: 'Project 06', image: '/Screenshot-6.jpg' },
  { id: 7, name: 'Project 07', image: '/Screenshot-7.jpg' },
  { id: 8, name: 'Project 08', image: '/Screenshot-8.jpg' },
  { id: 9, name: 'Project 09', image: '/Screenshot-9.jpg' },
];

const STRIP_COUNT = 12; // Increased for a smoother curve

export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !isDesktop) {
      return;
    }

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const text = textRef.current;
      const cylinder = cylinderRef.current;
      if (!section || !text || !cylinder) return;

      // -------------------------------------------------
      // Text Reveal Setup
      // -------------------------------------------------
      const heading = text.querySelector('h2');
      let words: HTMLElement[] = [];
      if (heading) {
        words = splitIntoWords(heading);
        gsap.set(words, { opacity: 0.1, filter: 'blur(8px)' }); // Starts slightly visible
      }

      // -------------------------------------------------
      // Build Scattered Cylindrical Items
      // -------------------------------------------------
      const items = cylinder.querySelectorAll<HTMLElement>('.cylinder-item');
      // Wider radius to wrap around the central text
      const radius = Math.min(window.innerWidth * 0.45, 600); 
      const total = items.length;
      const angleStep = 360 / total;

      items.forEach((item, i) => {
        const angle = i * angleStep;
        
        // Stagger the vertical positions to match the scattered look
        // We alternate high/low and add a bit of randomness
        const yOffset = (i % 2 === 0 ? 1 : -1) * (Math.random() * 150 + 50);

        gsap.set(item, {
          rotateY: angle,
          y: yOffset + 300, // Start lower for the entry effect
          transformOrigin: `50% 50% ${-radius}px`,
          z: 0,
          opacity: 0,
          scale: 0.9,
        });

        const imgUrl = item.dataset.logo || '';
        const stripContainer = item.querySelector('.strip-container') as HTMLElement;
        if (!stripContainer) return;

        stripContainer.innerHTML = '';
        const stripWidth = 100 / STRIP_COUNT;

        for (let s = 0; s < STRIP_COUNT; s++) {
          const strip = document.createElement('div');
          strip.className = 'cylinder-strip absolute h-full';
          strip.style.width = `${stripWidth + 0.5}%`; // +0.5 to overlap and prevent seams
          strip.style.left = `${s * stripWidth}%`;
          strip.style.backgroundImage = `url(${imgUrl})`;
          strip.style.backgroundPosition = `${(s / (STRIP_COUNT - 1)) * 100}% 50%`;
          strip.style.backgroundSize = `${STRIP_COUNT * 100}% 100%`;
          
          // Curve calculation
          const stripAngle = (s - (STRIP_COUNT - 1) / 2) * 3; // Adjust angle multiplier for curve intensity
          strip.style.transformOrigin = `50% 50% ${-radius}px`;
          strip.style.transform = `rotateY(${stripAngle}deg) translateZ(0)`;
          stripContainer.appendChild(strip);
        }
      });

      // -------------------------------------------------
      // MAIN SCROLL TIMELINE
      // -------------------------------------------------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%', // Longer scroll for the full rotation
          pin: true,
          scrub: 1, // Smoother scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Text fades in sharply
      if (words.length) {
        tl.to(
          words,
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.05,
            ease: 'power2.out',
          },
          0
        );
      }

      // 2. Images float up and fade in
      tl.to(
        items,
        {
          opacity: 1,
          y: (i) => {
             const baseOffset = (i % 2 === 0 ? 1 : -1) * (Math.random() * 150 + 50);
             return baseOffset; // Rise to their resting vertical offset
          },
          scale: 1,
          duration: 2,
          ease: 'power2.out',
        },
        0.2
      );

      // 3. Continuous rotation and slight upward floating
      tl.to(
        cylinder,
        {
          rotateY: -angleStep * (total + 1.5), // Full 360+ rotation
          y: -200, // The whole cylinder floats up slightly during the scroll
          duration: 8,
          ease: 'none',
        },
        0 // Start rotation immediately
      );

      // 4. Fade out everything at the end of the pin
      tl.to(
        [words, cylinder],
        {
          opacity: 0,
          filter: 'blur(10px)',
          duration: 1,
          ease: 'power2.inOut',
        },
        7 // Trigger near the end of the timeline duration
      );

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        h-screen
        bg-black
        text-white
        overflow-hidden
        flex
        items-center
        justify-center
        select-none
      "
    >
      {/* =====================================================
          CENTER TEXT
          ===================================================== */}
      <div
        ref={textRef}
        className="
          relative
          z-[150]
          w-full
          max-w-4xl
          px-8
          text-center
          pointer-events-none
        "
      >
        <h2
          className="
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-[80px]
            font-sans
            font-semibold
            tracking-tight
            leading-[1.1]
            text-[#e0e0e0]
          "
        >
          Each project is a chance <br />
          to <span className="font-serif italic font-normal text-white">learn, experiment</span> and <br />
          push my limits.
        </h2>
      </div>

      {/* =====================================================
          DESKTOP – CYLINDRICAL 3D GALLERY
          ===================================================== */}
      <div
        className="
          cylinder-gallery-desktop
          absolute
          inset-0
          z-[40]
          flex
          items-center
          justify-center
          pointer-events-none
        "
        style={{ perspective: '1200px' }} // Added perspective to the wrapper for better 3D depth
      >
        <div
          ref={cylinderRef}
          className="
            cylinder-gallery
            relative
            w-full
            h-full
          "
          style={{ transformStyle: 'preserve-3d' }}
        >
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="cylinder-item absolute top-1/2 left-1/2"
              data-logo={project.image}
              style={{
                width: 'clamp(200px, 22vw, 320px)',
                height: 'clamp(140px, 16vw, 220px)',
                marginLeft: 'calc(clamp(200px, 22vw, 320px) / -2)',
                marginTop: 'calc(clamp(140px, 16vw, 220px) / -2)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div
                className="
                  strip-container
                  relative
                  w-full
                  h-full
                  overflow-hidden
                  shadow-[0_20px_60px_rgba(0,0,0,0.8)]
                "
                style={{ transformStyle: 'preserve-3d' }}
              />
              <img
                src={project.image}
                alt={project.name}
                className="sr-only"
              />
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          MOBILE FALLBACK
          ===================================================== */}
      <div
        className="
          cylinder-gallery-mobile
          absolute
          left-0
          right-0
          bottom-10
          z-[50]
          overflow-x-auto
          px-6
          md:hidden
        "
      >
        <div className="flex w-max items-center gap-4">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="
                relative
                shrink-0
                w-[200px]
                h-[140px]
                overflow-hidden
                bg-[#111]
                flex
                items-center
                justify-center
              "
            >
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
