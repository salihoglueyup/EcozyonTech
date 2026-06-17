import { useRef } from 'react';
import { BRAND } from '@/core/tokens';
import { prefersReducedMotion } from '@/core/motion';

// SpotlightCard — wraps content with a soft radial glow that follows the cursor.
// Pointer position is written straight to CSS custom props (--spot-x/--spot-y)
// on pointermove — no rAF, no React state, so it stays cheap. The glow lives in
// an aria-hidden overlay that fades in on hover.
//
// Safe by default: on coarse pointers (touch) and under prefers-reduced-motion
// it renders a plain wrapper (children only, no listeners/overlay), so those
// users get the unchanged static card. Pair it around an existing eco-card.
export function SpotlightCard({
  as: Tag = 'div',
  radius = 180,
  color = BRAND.cyan,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);

  // SSR-safe feature check: enable only for fine pointers with motion allowed.
  const enabled =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    !window.matchMedia('(pointer: coarse)').matches &&
    !prefersReducedMotion();

  if (!enabled) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      className={`group/spot relative ${className}`.trim()}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}1f, transparent 70%)`,
        }}
      />
      {children}
    </Tag>
  );
}
