// lib/lenis.ts
import Lenis from '@studio-freight/lenis';

let lenisInstance: Lenis | null = null;

/**
 * Returns the Lenis instance (desktop only).
 * Returns null on mobile / touch devices.
 */
export const getLenis = (): Lenis | null => {
  if (typeof window === 'undefined') return null;

  // Never create Lenis on mobile
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
    });

    // Expose helpers globally
    (window as any).__lenis = lenisInstance;

    (window as any).__unlockLenis = () => {
      lenisInstance?.start();
      document.documentElement.classList.remove('lenis-stopped');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };

    (window as any).__lockLenis = () => {
      lenisInstance?.stop();
      document.documentElement.classList.add('lenis-stopped');
    };
  }

  return lenisInstance;
};

/**
 * Optional helper – call this if you ever need to destroy Lenis
 */
export const destroyLenis = () => {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
    (window as any).__lenis = null;
    (window as any).__unlockLenis = undefined;
    (window as any).__lockLenis = undefined;
  }
};
