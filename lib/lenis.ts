import Lenis from '@studio-freight/lenis';

let lenisInstance: Lenis | null = null;

export const getLenis = () => {
  // Only create the instance on the client
  if (typeof window === 'undefined') return null;
  
  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
  }
  return lenisInstance;
};
