import { useRef, useState, useEffect } from 'react';
import { prefersReducedMotion } from '@/core/motion';

// One-shot "is it in view" gate. Flips `inView` true when the ref scrolls into
// view (and disconnects when `once`); pass `once: false` to track visibility
// both ways. Under reduced motion — or without IntersectionObserver — it
// resolves true immediately (deferred via queueMicrotask, cancel-on-unmount) so
// gated content (count-ups, chart draw-ins) still shows its final state.
//
// The shared detector behind useReveal and the page count-up/chart triggers.
export function useInView(threshold = 0.3, { once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) setInView(true);
      });
      return () => {
        cancelled = true;
      };
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        } else {
          setInView(entry.isIntersecting);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
