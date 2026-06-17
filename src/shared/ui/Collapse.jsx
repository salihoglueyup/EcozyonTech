import { useState } from 'react';

// Collapse — animates a region to/from its natural height with no fixed cap, so
// long content never clips. Uses the grid-rows 0fr→1fr trick (+ opacity); the
// global reduced-motion rule already makes it instant. Reusable for accordions,
// "read more", filter drawers, etc.
export function Collapse({ open, className = '', children }) {
  return (
    <div
      className={`grid transition-all duration-300 ease-out ${className}`.trim()}
      style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

// Disclosure — a single accordion row: a button (aria-expanded) with the summary
// + a rotating-plus chip, over a Collapse-animated body. `aside` renders in the
// header row before the button (e.g. a permalink anchor). Owns its open state;
// pass `defaultOpen` to start expanded. Shared by the FAQ and Help accordions.
export function Disclosure({ summary, children, defaultOpen = false, aside, id, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      id={id}
      className={`rounded-2xl eco-card overflow-hidden transition hover:ring-cyan-500/20 ${className}`.trim()}
    >
      <div className={`flex items-center gap-3 ${aside ? 'px-6' : ''}`.trim()}>
        {aside}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`flex items-center gap-4 text-left ${aside ? 'flex-1 py-5' : 'w-full px-6 py-5'}`}
        >
          <span className="flex-1 font-display text-[15px] lg:text-[16px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
            {summary}
          </span>
          <span
            className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/[.05] dark:bg-white/[.08] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 3v8M3 7h8" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>
      <Collapse open={open}>
        <div className="px-6 pb-5 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {children}
        </div>
      </Collapse>
    </div>
  );
}
