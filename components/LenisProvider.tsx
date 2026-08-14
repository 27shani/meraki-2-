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
 * Exact lukebaffait.fr Lenis + GSAP pattern:
 *   const lenis = new Lenis({ lerp: 0.06 });
 *   lenis.on('scroll', ScrollTrigger.update);
 *   gsap.ticker.add((time) => lenis.raf(time * 1000));
 *   gsap.ticker.lagSmoothing(0);
 *   lenis.stop() during intro → lenis.start() after
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const html = document.documentElement;
    html.classList.add('lenis', 'lenis-smooth');

    // Exact config from lukebaffait.fr
    const lenis = new Lenis({ lerp: 0.06 });

    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Lock during intro (same as reference)
    lenis.stop();
    lenis.scrollTo(0, { immediate: true });
    html.classList.add('lenis-stopped');
    html.style.overflow = 'hidden';

    const unlock = () => {
      html.style.overflow = '';
      html.classList.remove('lenis-stopped');
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    window.__unlockLenis = unlock;

    // Safety unlock if loader never fires
    const safety = window.setTimeout(() => {
      if (html.classList.contains('lenis-stopped')) unlock();
    }, 5000);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.clearTimeout(safety);
      window.removeEventListener('load', onLoad);
      lenis.destroy();
      html.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      html.style.overflow = '';
      window.__lenis = null;
      window.__unlockLenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
