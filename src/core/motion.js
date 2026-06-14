// Motion design tokens — the single source for durations and easings,
// mirroring tokens.js for color. JS animation code (Reveal, Parallax, …)
// imports these; the same literal values are exposed as CSS custom properties
// in index.css (:root --dur-* / --ease-*) for view-transitions and utilities.
// Keep the two in sync, the same way .eco-gradient-text mirrors tokens.js.

export const EASING = {
  out: 'cubic-bezier(.16, 1, .3, 1)', // decelerate — reveals / enters
  inOut: 'cubic-bezier(.65, 0, .35, 1)', // symmetric — moves / toggles
};

// Milliseconds. `reveal` is the long scroll-in; the rest are UI transitions.
export const DURATION = { fast: 180, base: 280, slow: 480, reveal: 700 };

// One-shot reduced-motion check (SSR-safe). For a value that reacts to OS
// changes during the session, use the useReducedMotion() hook instead.
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  // Optional-chain the result too: some test setups stub matchMedia to return
  // undefined for unmatched queries.
  return window.matchMedia('(prefers-reduced-motion: reduce)')?.matches ?? false;
}
