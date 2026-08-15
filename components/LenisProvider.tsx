useEffect(() => {
  const isMobile =
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  if (isMobile) {
    // Just register ScrollTrigger, use native scroll
    gsap.registerPlugin(ScrollTrigger);
    return;
  }

  // ... your existing Lenis + GSAP ticker code
}, []);
