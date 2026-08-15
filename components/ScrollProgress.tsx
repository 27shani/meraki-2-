// components/ScrollProgress.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Vertical scroll progress indicator (desktop only).
 */
export default function ScrollProgress() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only run on desktop
    if (window.matchMedia('(max-width: 767px)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const bar = barRef.current;
    const pct = pctRef.current;
    if (!root || !bar || !pct) return;

    gsap.set(bar, { scaleY: 0, transformOrigin: 'top center' });

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(bar, { scaleY: p });
        pct.textContent = `${Math.round(p * 100)}%`;

        if (p > 0.03 && p < 0.97) {
          root.classList.add('visible');
        } else {
          root.classList.remove('visible');
        }
      },
    });

    // Keep progress correct after layout changes
    const onRefresh = () => st.refresh();
    window.addEventListener('resize', onRefresh);

    return () => {
      window.removeEventListener('resize', onRefresh);
      st.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="scroll-progress hidden md:flex">
      <div className="scroll-progress-track">
        <div ref={barRef} className="scroll-progress-bar" />
      </div>
      <span ref={pctRef} className="scroll-progress-pct">
        0%
      </span>
    </div>
  );
}
