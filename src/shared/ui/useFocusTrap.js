import { useEffect } from 'react';

// Focus-traps a dialog: focuses the first interactive element on mount,
// cycles Tab/Shift+Tab inside the container, and restores focus to the
// element that opened it on unmount. Pass an enabled flag so the same
// hook can live in a component that toggles open/closed.
const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef, enabled = true) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    const node = containerRef.current;
    const previouslyFocused = typeof document !== 'undefined' ? document.activeElement : null;

    const focusables = () => Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => !el.hasAttribute('aria-hidden'));
    const first = focusables()[0];
    if (first) first.focus();

    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const f = list[0];
      const l = list[list.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === f || !node.contains(active))) {
        e.preventDefault();
        l.focus();
      } else if (!e.shiftKey && active === l) {
        e.preventDefault();
        f.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, enabled]);
}
