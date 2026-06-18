import { Link } from 'react-router-dom';
import { ArrowRight } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { Contact } from '@/features/contact';

const meta = routeByKey('contact');

// Self-service channels: route non-sales intent (a quick question, an outage
// check, a job, a press request) to the right page instead of the sales form.
// `key` resolves to a real route via routeByKey; copy comes from t.contact.channels.
const CHANNELS = [
  {
    key: 'help',
    icon: (
      <path d="M6.2 6.2a2 2 0 1 1 2.9 2.4c-.7.5-1.1.9-1.1 1.7M8 13h.01" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    key: 'status',
    icon: <path d="M1.5 8h3l1.5-4 3 8 1.5-4h3" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    key: 'careers',
    icon: (
      <>
        <rect x="2" y="5" width="12" height="8" rx="1.5" />
        <path d="M6 5V3.8A1.3 1.3 0 0 1 7.3 2.5h1.4A1.3 1.3 0 0 1 10 3.8V5" strokeLinecap="round" />
      </>
    ),
  },
  {
    key: 'press',
    icon: (
      <>
        <path d="M2.5 6.5v3l7 3V3.5l-7 3Z" strokeLinejoin="round" />
        <path d="M9.5 5.5 13 4.5m-3.5 6 3.5 1" strokeLinecap="round" />
      </>
    ),
  },
];

export default function ContactPage() {
  const { t, lang } = useApp();
  const c = t.contact.channels;
  useDocumentMeta(
    meta.title[lang],
    lang === 'tr'
      ? "Ecozyon Tech ile iletişime geçin — pilot, demo ve iş birliği için."
      : 'Get in touch with Ecozyon Tech — for pilots, demos and partnerships.',
  );
  return (
    <div className="pt-10">
      <Contact t={t} lang={lang} />

      {/* Self-service channels — route non-sales intent off the form */}
      <section className="relative pb-20 lg:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-4">{c.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((ch, i) => {
              const route = routeByKey(ch.key);
              const copy = c[ch.key];
              return (
                <Reveal key={ch.key} delay={i * 50}>
                  <Link
                    to={route.path}
                    className="group flex h-full flex-col rounded-2xl eco-card p-5 hover:ring-cyan-500/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{ch.icon}</svg>
                      </span>
                      <span className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                    <span className="mt-3 font-display text-[15.5px] tracking-tight text-slate-900 dark:text-slate-100">{copy.t}</span>
                    <p className="mt-1 flex-1 text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{copy.d}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
