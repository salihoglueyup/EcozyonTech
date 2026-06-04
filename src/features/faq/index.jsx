import { useState } from 'react';
import { SectionHeader } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';

/**
 * FAQ accordion — renders from t.faq dictionary entries.
 *
 * Dictionary shape:
 *   faq: {
 *     eyebrow, title, items: [{ q, a }]
 *   }
 */
export function FAQ({ t }) {
  const faq = t.faq;
  if (!faq) return null;

  return (
    <section id="faq" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader center color="cyan" eyebrow="FAQ" title={faq.title} className="mb-12" />

        <div className="space-y-2">
          {faq.items.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <AccordionItem q={item.q} a={item.a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl eco-card overflow-hidden transition hover:ring-cyan-500/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-[15px] lg:text-[16px] tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
          {q}
        </span>
        <span
          className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/[.05] dark:bg-white/[.08] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M7 3v8M3 7h8" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* grid-rows 0fr→1fr animates to the content's natural height with no
          fixed cap, so long/wrapped answers never clip. */}
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}
