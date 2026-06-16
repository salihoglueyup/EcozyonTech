import { useReducedMotion } from '@/shared/ui/useReducedMotion';

// Horizontally scrolling strip (logos, ticker…). Pass ONE set of items as
// children; the component renders a `display:contents` aria-hidden duplicate so
// the `translateX(-50%)` loop (Tailwind `marquee` keyframe) is seamless without
// the screen reader hearing the items twice.
//
// Reduced-motion safe: under prefers-reduced-motion it renders the items once,
// static and wrapping — never the frozen mid-scroll state the global
// reduced-motion rule would otherwise leave an infinite animation in.
export function Marquee({
  children,
  durationSec = 42,
  gapClassName = 'gap-10 lg:gap-14',
  pauseOnHover = true,
  className = '',
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={`flex flex-wrap items-center ${gapClassName} ${className}`.trim()}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center ${gapClassName} whitespace-nowrap will-change-transform ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''} ${className}`.trim()}
      style={{ animation: `marquee ${durationSec}s linear infinite` }}
    >
      {children}
      <span className="contents" aria-hidden="true">
        {children}
      </span>
    </div>
  );
}
