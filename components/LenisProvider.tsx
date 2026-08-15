'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');

      // Force override any hidden overflow
      const styleId = 'mobile-scroll-fix';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          html, body, #__next, #root {
            overflow: auto !important;
            height: auto !important;
            min-height: 100vh !important;
          }
        `;
        document.head.appendChild(style);
      }

      ScrollTrigger.config({ ignoreMobileResize: true });
      return;
    }

    // ... desktop Lenis setup (unchanged) ...
  }, []);

  return <>{children}</>;
}
