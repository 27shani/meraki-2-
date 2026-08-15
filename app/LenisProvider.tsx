// app/LenisProvider.tsx
'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Expose unlock method
    (window as any).__unlockLenis = () => {
      lenis.start();
      document.body.style.overflow = '';
    };

    // Initially stop Lenis (loader takes over)
    lenis.stop();
    document.body.style.overflow = 'hidden';

    // --- SAFETY FALLBACK: Force start Lenis after 5 seconds ---
    const safetyTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).__unlockLenis) {
        (window as any).__unlockLenis();
        console.log('Lenis started via safety fallback');
      }
    }, 5000);

    // RAF loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).__unlockLenis;
      clearTimeout(safetyTimer);
    };
  }, []);

  return <>{children}</>;
}
