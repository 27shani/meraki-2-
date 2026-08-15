// lib/lenis.ts
import Lenis from '@studio-freight/lenis';

let lenisInstance: Lenis | null = null;

export const getLenis = () => {
  if (typeof window === 'undefined') return null;

  // 🔥 Critical: never create Lenis on real mobile
  const isMobile =
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  if (isMobile) return null;

  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      // touchMultiplier removed – we don't run on touch devices
    });

    // Start the RAF loop
    function raf(time: number) {
      lenisInstance?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Global helpers
    (window as any).__unlockLenis = () => {
      lenisInstance?.start();
      document.documentElement.classList.remove('lenis-stopped');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };

    (window as any).__lockLenis = () => {
      lenisInstance?.stop();
      document.documentElement.classList.add('lenis-stopped');
    };
  }

  return lenisInstance;
};
