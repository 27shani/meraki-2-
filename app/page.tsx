// components/FloatingGallery.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Investor {
  id: number;
  name: string;
  logo: string;
}

/*
 * Investor / Partner logos
 *
 * These files are directly inside /public/
 *
 * Example:
 * /public/Image-26.png
 *
 * Therefore the browser path is:
 * /Image-26.png
 */
const PAST_INVESTORS: Investor[] = [
  {
    id: 1,
    name: 'Partner 01',
    logo: '/Image-26.png',
  },
  {
    id: 2,
    name: 'Partner 02',
    logo: '/Image-29.png',
  },
  {
    id: 3,
    name: 'Partner 03',
    logo: '/Image-32.png',
  },
  {
    id: 4,
    name: 'Partner 04',
    logo: '/Image-33.png',
  },
  {
    id: 5,
    name: 'Partner 05',
    logo: '/Image-34.png',
  },
  {
    id: 6,
    name: 'Partner 06',
    logo: '/Image-35.png',
  },
  {
    id: 7,
    name: 'Partner 07',
    logo: '/Image-36.png',
  },
  {
    id: 8,
    name: 'Partner 08',
    logo: '/Image-38-1.png',
  },
];

export default function FloatingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const text = textRef.current;
      const track = trackRef.current;

      if (!section || !text || !track) return;

      /*
       * ---------------------------------------------------------
       * INITIAL STATE
       * ---------------------------------------------------------
       */

      gsap.set(text, {
        opacity: 0,
        scale: 0.92,
        filter: 'blur(14px)',
      });

      /*
       * Start the complete logo track outside the left side.
       *
       * This means the first logo begins from the left and
       * gradually enters the screen as the user scrolls.
       */
      const getStartX = () => {
        return -(track.scrollWidth - window.innerWidth + 48);
      };

      gsap.set(track, {
        x: getStartX(),
      });

      /*
       * ---------------------------------------------------------
       * MAIN SCROLL TIMELINE
       * ---------------------------------------------------------
       *
       * Section pins to viewport.
       *
       * While scrolling:
       *
       * 1. PAST INVESTORS appears in center.
       * 2. Logo cards move from left → right.
       * 3. All cards stay exactly the same size.
       * 4. After the final logo reaches the right side,
       *    the section releases.
       */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',

          /*
           * Scroll distance is based on how far the logo track
           * actually has to travel.
           */
          end: () => {
            const travelDistance =
              track.scrollWidth - window.innerWidth;

            return `+=${Math.max(
              1400,
              travelDistance * 1.15
            )}`;
          },

          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /*
       * ---------------------------------------------------------
       * CENTER TEXT REVEAL
       * ---------------------------------------------------------
       */

      tl.to(
        text,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
        },
        0
      );

      /*
       * ---------------------------------------------------------
       * LOGO MOVEMENT
       * ---------------------------------------------------------
       *
       * The track starts from the left and travels all the way
       * to the right.
       */

      tl.to(
        track,
        {
          x: 0,
          duration: 7,
          ease: 'none',
        },
        0.45
      );

      /*
       * ---------------------------------------------------------
       * TEXT EXIT
       * ---------------------------------------------------------
       *
       * Near the end, the center heading subtly fades away while
       * the final cards complete their movement.
       */

      tl.to(
        text,
        {
          opacity: 0,
          scale: 0.94,
          filter: 'blur(12px)',
          duration: 0.8,
          ease: 'power3.in',
        },
        6.3
      );

      /*
       * ---------------------------------------------------------
       * RESIZE
       * ---------------------------------------------------------
       */

      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        h-screen
        bg-[#070707]
        text-offwhite
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
          max-w-5xl
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
            lg:text-7xl
            font-sans
            font-medium
            tracking-tight
            leading-[1.05]
          "
        >
          PAST{' '}
          <span className="font-serif italic font-normal text-gradient-brand">
            INVESTORS
          </span>
        </h2>
      </div>

      {/* =====================================================
          BOTTOM INVESTOR LOGO TRACK
          ===================================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          bottom-8
          sm:bottom-10
          md:bottom-14
          z-[50]
          overflow-visible
        "
      >
        <div
          ref={trackRef}
          className="
            flex
            w-max
            items-center
            gap-4
            sm:gap-5
            md:gap-6
            pl-6
            md:pl-12
            pr-6
            md:pr-12
            will-change-transform
          "
        >
          {PAST_INVESTORS.map((investor) => (
            <div
              key={investor.id}
              className="
                relative
                shrink-0

                /* SAME CARD SIZE FOR EVERY LOGO */
                w-[180px]
                h-[110px]

                sm:w-[220px]
                sm:h-[130px]

                md:w-[280px]
                md:h-[160px]

                lg:w-[320px]
                lg:h-[180px]

                rounded-xl
                overflow-hidden

                border
                border-white/10

                bg-offwhite

                flex
                items-center
                justify-center

                shadow-[0_20px_60px_rgba(0,0,0,0.35)]

                will-change-transform
              "
            >
              {/* =================================================
                  ACTUAL INVESTOR LOGO
                  ================================================= */}

              <img
                src={investor.logo}
                alt={investor.name}
                className="
                  max-w-[75%]
                  max-h-[65%]
                  w-auto
                  h-auto
                  object-contain
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
