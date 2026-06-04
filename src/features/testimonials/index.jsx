import { useState, useEffect, useCallback } from 'react';
import { Tag } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';

/**
 * Testimonials — auto-rotating social proof carousel.
 * Reads from t.testimonials dictionary.
 */
export function Testimonials({ t }) {
  const data = t.testimonials;
  const items = data?.items || [];
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((i) => (i + 1) % (items.length || 1)), [items.length]);

  // setTimeout keyed on `active` so the 5s countdown restarts after every
  // change — including manual dot clicks, which otherwise got yanked forward
  // by a still-running interval.
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setTimeout(next, 5000);
    return () => clearTimeout(timer);
  }, [active, next, items.length]);

  if (!data || !items.length) return null;

  // Clamp: guards against `active` pointing past a shorter list (e.g. a
  // dictionary edit) which would make item undefined and crash on item.quote.
  const idx = active % items.length;
  const item = items[idx];

  return (
    <section id="testimonials" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <div className="text-center mb-12">
            <Tag color="emerald">// {data.eyebrow}</Tag>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
              {data.title}
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative rounded-3xl border border-white/70 dark:border-white/[.08] bg-white/70 dark:bg-white/[.04] backdrop-blur-xl ring-1 ring-slate-900/[.05] dark:ring-white/[.06] p-8 lg:p-12 text-center">
            {/* Quote icon */}
            <svg viewBox="0 0 32 32" className="mx-auto h-7 w-7 text-cyan-500/40">
              <path fill="currentColor" d="M12 8c-4 1-7 4-7 9v7h8v-8H8c0-3 1.5-5 4-6V8Zm14 0c-4 1-7 4-7 9v7h8v-8h-5c0-3 1.5-5 4-6V8Z" />
            </svg>

            <blockquote className="mt-5 font-display text-[clamp(1.2rem,2.2vw,1.7rem)] leading-snug tracking-tight text-slate-900 dark:text-slate-100 max-w-2xl mx-auto transition-opacity duration-500">
              "{item.quote}"
            </blockquote>

            <div className="mt-6 flex items-center justify-center gap-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-display text-[13px] shadow-md"
                style={{ background: 'linear-gradient(135deg,#0EA5E9,#10B981)' }}
              >
                {item.initials}
              </div>
              <div className="text-left">
                <div className="text-[14px] font-medium text-slate-900 dark:text-slate-100">{item.name}</div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400">{item.title}</div>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === idx ? 'w-6 bg-cyan-500' : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
