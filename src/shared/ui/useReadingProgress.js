import { useEffect, useState } from 'react';

// Pure reading-progress math (0–100) for an element, given its viewport-
// relative top (getBoundingClientRect().top), its full height (offsetHeight)
// and the viewport height. 0 while the element's top is at/below the viewport
// top; 100 once its bottom has scrolled up to the viewport bottom. Elements
// shorter than the viewport read 0 until their top passes, then 100. Pure +
// unit-tested so the page, tests and any future reuse all agree.
export function progressFromRect(top, height, viewportH) {
  const scrollable = height - viewportH;
  if (scrollable <= 0) return top <= 0 ? 100 : 0;
  return Math.min(100, Math.max(0, (-top / scrollable) * 100));
}

// Tracks how far the reader has scrolled through `ref`'s element — unlike the
// global page ScrollProgress bar (which counts navbar/footer/related), this is
// scoped to the article so the figure means "how much of the post you've read".
// SSR-safe (touches window only after mount), rAF-throttled and resize-aware.
export function useReadingProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      setProgress(progressFromRect(rect.top, el.offsetHeight, window.innerHeight));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return progress;
}
