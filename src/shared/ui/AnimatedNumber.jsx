import { useEffect, useRef, useState } from 'react';

// Tween a numeric value (or the numeric portion of a string like "8.4K" /
// "%92" / "164t") from 0 to target over `durationMs` once `play` flips
// truthy. Respects prefers-reduced-motion (jumps to the final value).
//
// Designed for one-shot reveal animations driven by IntersectionObserver
// at the call site.

const NUM_RE = /^(\D*?)(-?\d+(?:\.\d+)?)(.*)$/;

function parse(value) {
  if (typeof value === 'number') return { prefix: '', target: value, suffix: '', decimals: 0 };
  const s = String(value);
  const m = NUM_RE.exec(s);
  if (!m) return { prefix: s, target: 0, suffix: '', decimals: 0 };
  const [, prefix, num, suffix] = m;
  const dot = num.indexOf('.');
  return {
    prefix,
    target: parseFloat(num),
    suffix,
    decimals: dot === -1 ? 0 : num.length - dot - 1,
  };
}

// easeOutCubic — settles fast at the end, feels less mechanical than linear.
const ease = (k) => 1 - Math.pow(1 - k, 3);

export function AnimatedNumber({ value, play, durationMs = 1200, className, style }) {
  const { prefix, target, suffix, decimals } = parse(value);
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [n, setN] = useState(play && !reduceMotion ? 0 : target);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!play || reduceMotion) return;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / durationMs);
      setN(target * ease(k));
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [play, target, durationMs, reduceMotion]);

  return (
    <span className={className} style={style}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}
