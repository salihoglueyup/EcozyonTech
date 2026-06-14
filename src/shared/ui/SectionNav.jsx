import { useEffect, useMemo, useState } from 'react';
import { prefersReducedMotion } from '@/core/motion';

/**
 * useScrollSpy — tracks which of the given section ids is closest to the
 * viewport centre. Returns the active id (defaults to the first). SSR-safe:
 * the IntersectionObserver only runs on the client.
 */
export function useScrollSpy(ids, { rootMargin = '-45% 0px -45% 0px' } = {}) {
  const key = ids.join(',');
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        // The topmost section crossing the centre band wins.
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(top.target.id);
      },
      { rootMargin, threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rootMargin]);

  return active;
}

/**
 * SectionNav — fixed left-rail that tracks the active section and smooth-
 * scrolls to one on click. Desktop-only (xl+) so it never crowds content;
 * labels reveal on hover or when active. `sections`: [{ id, label }].
 * `alwaysLabels` keeps labels visible (used as a blog table-of-contents,
 * where the rail is a reading aid rather than a minimal dot strip).
 */
export function SectionNav({ sections, className = '', alwaysLabels = false }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useScrollSpy(ids);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Bölüm navigasyonu"
      className={`hidden xl:flex flex-col gap-3 fixed left-6 top-1/2 -translate-y-1/2 z-40 ${className}`}
    >
      {sections.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-2.5 text-left"
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'w-7 bg-cyan-500' : 'w-3 bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400'
              }`}
            />
            <span
              className={`text-[11px] font-medium tracking-tight transition-all duration-300 ${
                isActive
                  ? 'opacity-100 translate-x-0 text-slate-700 dark:text-slate-200'
                  : alwaysLabels
                    ? 'opacity-70 translate-x-0 text-slate-500 dark:text-slate-400 group-hover:opacity-100'
                    : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-slate-500 dark:text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
