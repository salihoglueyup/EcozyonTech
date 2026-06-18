import { Link } from 'react-router-dom';
import { ArrowRight } from '@/shared/ui/primitives';
import { Reveal } from '@/shared/ui/useReveal';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey, SITE } from '@/core/config/site';
import { CITIES } from '@/core/data/cities';
import { Contact } from '@/features/contact';

const meta = routeByKey('contact');

// Live network reach derived from the city dataset (deterministic → prerender-
// safe). Powers the "the network you'd join" trust band on the contact page.
const STATS = {
  cities: CITIES.length,
  countries: new Set(CITIES.map((c) => c.country)).size,
  users: CITIES.reduce((s, c) => s + c.users, 0),
  co2: CITIES.reduce((s, c) => s + c.co2, 0),
};

// Self-service channels: route non-sales intent (a quick question, an outage
// check, a job, a press request) to the right page instead of the sales form.
const CHANNELS = [
  { key: 'help', icon: <path d="M6.2 6.2a2 2 0 1 1 2.9 2.4c-.7.5-1.1.9-1.1 1.7M8 13h.01" strokeLinecap="round" strokeLinejoin="round" /> },
  { key: 'status', icon: <path d="M1.5 8h3l1.5-4 3 8 1.5-4h3" strokeLinecap="round" strokeLinejoin="round" /> },
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

// Placeholder social destinations — same handles the footer links to.
const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { label: 'X', href: 'https://x.com' },
  { label: 'GitHub', href: 'https://github.com' },
];

export default function ContactPage() {
  const { t, lang } = useApp();
  const c = t.contact.channels;
  const p = t.contact.presence;
  const d = t.contact.details;
  const f = t.contact.faq;
  const nf = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US');
  useDocumentMeta(
    meta.title[lang],
    lang === 'tr'
      ? "Ecozyon Tech ile iletişime geçin — pilot, demo ve iş birliği için."
      : 'Get in touch with Ecozyon Tech — for pilots, demos and partnerships.',
  );

  const presenceTiles = [
    { value: nf.format(STATS.cities), label: p.cities },
    { value: nf.format(STATS.countries), label: p.countries },
    { value: nf.format(STATS.users), label: p.members },
    { value: nf.format(STATS.co2), label: p.co2 },
  ];

  return (
    <div className="pt-10">
      <Contact t={t} lang={lang} />

      <div className="mx-auto max-w-6xl px-6 pb-20 lg:pb-28 space-y-14">
        {/* Network reach — trust band derived from the live dataset */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <h2 className="text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400">{p.title}</h2>
            <Link to={routeByKey('impact').path} className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              {p.viewMap}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {presenceTiles.map((tile, i) => (
              <Reveal key={tile.label} delay={i * 50}>
                <div className="rounded-2xl eco-card p-5">
                  <div className="font-display text-[26px] leading-none tracking-tight tabular-nums text-slate-900 dark:text-slate-100">{tile.value}</div>
                  <div className="mt-1.5 text-[12px] text-slate-500 dark:text-slate-400">{tile.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Self-service channels — route non-sales intent off the form */}
        <section>
          <h2 className="text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-4">{c.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((ch, i) => {
              const route = routeByKey(ch.key);
              const copy = c[ch.key];
              return (
                <Reveal key={ch.key} delay={i * 50}>
                  <Link to={route.path} className="group flex h-full flex-col rounded-2xl eco-card p-5 hover:ring-cyan-500/30 transition">
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
        </section>

        {/* Details + pre-contact FAQ */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Contact details + social */}
          <section className="rounded-2xl eco-card p-6 lg:p-7">
            <h2 className="text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-4">{d.title}</h2>
            <dl className="space-y-3.5 text-[13.5px]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">{d.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${SITE.email}`} className="font-medium text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-emerald-500 decoration-2 hover:decoration-cyan-500">{SITE.email}</a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">{d.pressLabel}</dt>
                <dd>
                  <Link to={routeByKey('press').path} className="group inline-flex items-center gap-1 font-medium text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400">
                    {d.pressCta}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">{d.locationLabel}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{d.locationValue}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">{d.hoursLabel}</dt>
                <dd className="text-right font-medium text-slate-900 dark:text-slate-100">{d.hoursValue}</dd>
              </div>
            </dl>

            <div className="mt-5 pt-4 border-t border-slate-900/[.06] dark:border-white/[.06]">
              <div className="text-[11px] uppercase tracking-[.12em] font-semibold text-slate-400 mb-2.5">{t.contact.social.title}</div>
              <div className="flex flex-wrap gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[.06] border border-slate-900/[.08] dark:border-white/[.1] px-3 py-1.5 text-[12px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:ring-1 hover:ring-cyan-500/30 transition"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Pre-contact FAQ — native disclosure, accessible by default */}
          <section className="rounded-2xl eco-card p-6 lg:p-7">
            <h2 className="text-[12px] uppercase tracking-[.14em] font-semibold text-slate-400 mb-4">{f.title}</h2>
            <div className="divide-y divide-slate-900/[.06] dark:divide-white/[.06]">
              {f.items.map((item) => (
                <details key={item.q} className="group py-3 first:pt-0 last:pb-0">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 list-none text-[13.5px] font-medium text-slate-900 dark:text-slate-100 marker:hidden">
                    {item.q}
                    <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 5l3 3 3-3" /></svg>
                  </summary>
                  <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px]">
              <Link to={routeByKey('help').path} className="group inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400">
                {f.helpCta}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to={routeByKey('legal').path} className="group inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400">
                {f.legalCta}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
