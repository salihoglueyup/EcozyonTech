import { Link } from 'react-router-dom';
import { ArrowRight, SectionHeader } from '@/shared/ui/primitives';
import { Reveal, RevealGroup } from '@/shared/ui/useReveal';
import { Disclosure } from '@/shared/ui/Collapse';

/**
 * FAQ accordion — renders from a { title, items: [{ q, a }] } object,
 * defaulting to t.faq. Pass `faq`/`id`/`eyebrow` to reuse it elsewhere
 * (e.g. a pricing-specific FAQ) without touching the dictionary shape.
 * Pass `moreTo`/`moreLabel` to show a "see all" link under the list.
 */
export function FAQ({ t, faq = t.faq, id = 'faq', eyebrow = 'FAQ', moreTo, moreLabel }) {
  if (!faq) return null;

  return (
    <section id={id} className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader center color="cyan" eyebrow={eyebrow} title={faq.title} className="mb-12" />

        <div className="space-y-2">
          <RevealGroup step={60}>
            {faq.items.map((item) => (
              <Reveal key={item.q}>
                <Disclosure summary={item.q}>{item.a}</Disclosure>
              </Reveal>
            ))}
          </RevealGroup>
        </div>

        {moreTo && (
          <div className="mt-8 text-center">
            <Link
              to={moreTo}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {moreLabel}
              <ArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

