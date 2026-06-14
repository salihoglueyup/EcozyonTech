import { useEffect, useState } from 'react';

// Reactive prefers-reduced-motion. SSR-safe: starts false (matching the
// server-prerendered HTML and the client's first render), syncs on mount and
// updates live if the OS setting changes mid-session.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}
