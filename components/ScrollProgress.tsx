// components/ScrollProgress.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Custom vertical scroll progress indicator
 * Appears while scrolling through main content sections.
 */
export default function ScrollProgress() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const bar = barRef.current;
    const pct = pctRef.current;
    if (!root || !bar || !pct) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(bar, { scaleY: p });
        pct.textContent = `${Math.round(p * 100)}%`;

        if (p > 0.02 && p < 0.98) {
          root.classList.add('visible');
        } else {
          root.classList.remove('visible');
        }
      },
    });

    return () => st.kill();
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
