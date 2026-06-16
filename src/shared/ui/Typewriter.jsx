import { useState, useEffect } from 'react';
import { prefersReducedMotion } from '@/core/motion';

// Types `text` out character-by-character via rAF. Mount with a fresh `key` per
// message so each instance types its own text once (matches a caller's key
// rotation). Reduced-motion: shows the full text immediately.
//
// A11y: the wrapper exposes the full sentence via `aria-label` while the
// animated text + blinking cursor are aria-hidden — screen readers hear the
// message once, not the partial, janky typing.
export function Typewriter({ text, charMs = 26 }) {
  const reduceMotion = prefersReducedMotion();
  const [shown, setShown] = useState(reduceMotion ? text.length : 0);

  useEffect(() => {
    if (reduceMotion) return;
    let i = 0;
    let last = performance.now();
    let raf;
    const step = (now) => {
      if (now - last >= charMs) {
        i = Math.min(text.length, i + 1);
        setShown(i);
        last = now;
      }
      if (i < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [text, charMs, reduceMotion]);

  return (
    <span aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {shown < text.length && (
          <span className="inline-block w-[5px] h-[1em] bg-emerald-500/80 ml-[1px] align-text-bottom animate-pulse" />
        )}
      </span>
    </span>
  );
}
