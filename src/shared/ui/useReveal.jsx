import { useRef, useState, useEffect, Children, cloneElement, isValidElement } from 'react';

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
  scale = null,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const [ref, revealed] = useReveal(threshold);

  const axis = from === 'left' || from === 'right' ? 'X' : 'Y';
  const sign =
    from === 'top' || from === 'left' ? `-${distance}px` : `${distance}px`;
  const hidden = `translate${axis}(${sign})${scale != null ? ` scale(${scale})` : ''}`;

  const style = {
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'none' : hidden,
    transition: `opacity ${duration}ms cubic-bezier(.16,1,.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
    willChange: revealed ? 'auto' : 'opacity, transform',
  };

  return (
    <Tag ref={ref} data-reveal="" style={style} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * <RevealGroup> — staggers its <Reveal> children by injecting an incremental
 * delay, so lists cascade in without hand-writing `delay={i * step}`. Renders
 * no wrapper element (children stay direct siblings, so grid/flex layouts are
 * untouched); non-Reveal children pass through unchanged.
 *
 *   <RevealGroup step={80}>
 *     {items.map((it) => <Reveal key={it.id}>…</Reveal>)}
 *   </RevealGroup>
 */
export function RevealGroup({ children, step = 80, baseDelay = 0 }) {
  return Children.map(children, (child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          delay: (child.props.delay ?? 0) + baseDelay + i * step,
        })
      : child,
  );
}

/**
 * <Parallax> — translates its content vertically as it scrolls through the
 * viewport. SSR-safe (effect-only), disabled under prefers-reduced-motion,
 * only recomputes while on-screen (IntersectionObserver-gated) and throttled
 * to one rAF per frame.
 *
 *   <Parallax speed={0.3}>…</Parallax>   // positive = moves up on scroll
 */
export function Parallax({ children, speed = 0.2, className = '', style, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    let raf = 0;
    let visible = false;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      const center = rect.top + rect.height / 2;
      // -1 (entering from below) … 0 (centered) … 1 (leaving past top)
      const progress = (center - vh / 2) / (vh / 2 + rect.height / 2);
      el.style.transform = `translate3d(0, ${(-progress * speed * 100).toFixed(2)}px, 0)`;
    };
    const tick = () => {
      if (!raf && visible) raf = requestAnimationFrame(update);
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([e]) => {
              visible = e.isIntersecting;
              if (visible) tick();
            },
            { threshold: 0 },
          )
        : null;

    if (io) io.observe(el);
    else {
      visible = true;
      tick();
    }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <Tag ref={ref} className={className} style={{ willChange: 'transform', ...style }} {...rest}>
      {children}
    </Tag>
  );
}
