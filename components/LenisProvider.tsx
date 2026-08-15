// components/LenisProvider.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 🔥 REAL FIX: do not run Lenis on mobile / touch devices
    const isMobile =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
      // Ensure scroll is never locked on mobile
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      return;
    }

    const html = document.documentElement;
    html.classList.add('lenis', 'lenis-smooth');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    (window as any).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Lock only during loader (desktop only)
    lenis.stop();
    html.classList.add('lenis-stopped');
    html.style.overflow = 'hidden';

    const unlock = () => {
      html.style.overflow = '';
      document.body.style.overflow = '';
      html.classList.remove('lenis-stopped');
      lenis.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    (window as any).__unlockLenis = unlock;

    const safety = window.setTimeout(() => {
      if (html.classList.contains('lenis-stopped')) unlock();
    }, 4000);

    return () => {
      window.clearTimeout(safety);
      lenis.destroy();
      html.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      html.style.overflow = '';
      document.body.style.overflow = '';
      (window as any).__lenis = null;
      (window as any).__unlockLenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
