// components/LenisProvider.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    __lenis?: Lenis | null;
    __unlockLenis?: () => void;
  }
}

/**
 * Global Lenis + GSAP ticker setup
 * - lerp: 0.06
 * - Starts STOPPED so Hero loader can finish first
 * - Hero calls window.__unlockLenis() after intro
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.06,
      smoothWheel: true,
    });

    // Start locked — Hero unlocks after loader
    lenis.stop();
    window.__lenis = lenis;

    window.__unlockLenis = () => {
      lenis.start();
    };

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerFn);
      window.__lenis = null;
      window.__unlockLenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
