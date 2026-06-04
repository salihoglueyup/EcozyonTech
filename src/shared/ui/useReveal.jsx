import { useRef, useState, useEffect } from 'react';

/**
 * useReveal — fires once when the element enters the viewport.
 * Returns [ref, isRevealed].
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reveal immediately (no animation) for reduced-motion users, or when
    // IntersectionObserver is unavailable — never leave content stuck at
    // opacity:0. Set synchronously so there's no post-unmount setState.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ) {
      // Deferred (not sync) to avoid cascading renders; the cancel flag
      // prevents a setState after a fast unmount.
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) setRevealed(true);
      });
      return () => {
        cancelled = true;
      };
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, revealed];
}

/**
 * <Reveal> — drop-in wrapper that fades+slides children into view.
 *
 *   <Reveal>        — default fade-up
 *   <Reveal from="left">
 *   <Reveal delay={200}>
 */
export function Reveal({
  children,
  from = 'bottom',
  delay = 0,
  duration = 700,
  distance = 24,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const [ref, revealed] = useReveal(threshold);

  const axis = from === 'left' || from === 'right' ? 'X' : 'Y';
  const sign =
    from === 'top' || from === 'left' ? `-${distance}px` : `${distance}px`;

  const style = {
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translate(0,0)' : `translate${axis}(${sign})`,
    transition: `opacity ${duration}ms cubic-bezier(.16,1,.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
    willChange: revealed ? 'auto' : 'opacity, transform',
  };

  return (
    <Tag ref={ref} data-reveal="" style={style} className={className} {...rest}>
      {children}
    </Tag>
  );
}
