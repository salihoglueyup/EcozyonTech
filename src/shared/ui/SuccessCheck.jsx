// SuccessCheck — a checkmark whose stroke draws itself in on mount (normalized
// pathLength=1 dash, offset 1→0 via the `drawCheck` keyframe). Decorative
// (aria-hidden) — pair it with a visible "sent" message. Colour is currentColor;
// size/stroke via props. Reduced-motion is handled statelessly: the global rule
// collapses the finite animation to its end (fully drawn).
export function SuccessCheck({ className = 'h-4 w-4', strokeWidth = 2.4 }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1"
        className="animate-drawCheck"
      />
    </svg>
  );
}
