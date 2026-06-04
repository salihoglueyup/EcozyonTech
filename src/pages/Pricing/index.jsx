import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { CURRENCIES, defaultCurrency, formatMoney } from '@/core/lib/currency';

const meta = routeByKey('pricing');

const TIERS = [
  {
    id: 'individual',
    priceLabel: { tr: 'Ücretsiz', en: 'Free' },
    period: { tr: 'pilot dönemi', en: 'pilot period' },
    name: { tr: 'Bireysel', en: 'Individual' },
    tagline: { tr: 'Kişisel karbon koçun', en: 'Your personal carbon coach' },
    accent: '#0EA5E9',
    features: {
      tr: ['Kişisel baseline', 'Günlük AI önerileri', 'Topluluk yarışmaları', 'Mobil uygulama'],
      en: ['Personal baseline', 'Daily AI nudges', 'Community challenges', 'Mobile app'],
    },
  },
  {
    id: 'team',
    featured: true,
    // Per-market prices, switched by the currency toggle (not FX-converted).
    amounts: { TRY: 149, USD: 5, EUR: 5 },
    period: { tr: 'kişi / ay', en: 'user / mo' },
    name: { tr: 'Takım', en: 'Team' },
    tagline: { tr: 'Ekipler için ölçülebilir etki', en: 'Measurable impact for teams' },
    accent: '#10B981',
    features: {
      tr: ['Bireysel her şey', 'Takım liderlik tablosu', 'Yönetici paneli', 'Aylık ESG özeti', 'Öncelikli destek'],
      en: ['Everything in Individual', 'Team leaderboard', 'Admin dashboard', 'Monthly ESG digest', 'Priority support'],
    },
  },
  {
    id: 'enterprise',
    priceLabel: { tr: 'Görüşelim', en: "Let's talk" },
    period: { tr: 'özel teklif', en: 'custom quote' },
    name: { tr: 'Kurumsal', en: 'Enterprise' },
    tagline: { tr: 'Scope 1-2-3 raporlama', en: 'Scope 1-2-3 reporting' },
    accent: '#7C3AED',
    features: {
      tr: ['Takım her şey', 'GHG / GRI raporları', 'SSO & SCIM', 'Özel entegrasyonlar', 'SLA & hesap yöneticisi'],
      en: ['Everything in Team', 'GHG / GRI reports', 'SSO & SCIM', 'Custom integrations', 'SLA & account manager'],
    },
  },
];

export default function PricingPage() {
  const { lang } = useApp();
  const tr = lang === 'tr';
  const [currency, setCurrency] = useState(defaultCurrency(lang));
  useDocumentMeta(
    meta.title[lang],
    tr
      ? 'Bireysel, takım ve kurumsal planlar — pilot dönemde ücretsiz başla.'
      : 'Individual, team and enterprise plans — start free during the pilot.',
  );

  return (
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="cyan">// {tr ? 'Fiyatlandırma' : 'Pricing'}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {tr ? 'Etkiye göre, ' : 'Priced for '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {tr ? 'ölçeğe göre' : 'impact, then scale'}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {tr
              ? 'Pilot dönemde bireysel kullanım ücretsiz. Takım ve kurumsal planlar büyüdükçe açılır.'
              : 'Individual use is free during the pilot. Team and enterprise unlock as you grow.'}
          </p>

          <div
            className="mt-6 inline-flex items-center gap-1 rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] p-1"
            role="group"
            aria-label={tr ? 'Para birimi' : 'Currency'}
          >
            {CURRENCIES.map((c) => {
              const on = currency === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCurrency(c.id)}
                  aria-pressed={on}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium tabular-nums transition ${
                    on ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {c.symbol} {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl border bg-white/70 dark:bg-white/[.04] backdrop-blur-xl p-7 lg:p-8 flex flex-col ${
                tier.featured
                  ? 'border-emerald-500/30 dark:border-emerald-400/30 ring-2 ring-emerald-500/20 dark:ring-emerald-400/20 shadow-[0_24px_70px_-40px_rgba(16,185,129,.5)]'
                  : 'border-white/70 dark:border-white/[.08] ring-1 ring-slate-900/[.05] dark:ring-white/[.06]'
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-7 inline-flex items-center rounded-full bg-emerald-500 text-white text-[10.5px] font-semibold px-3 py-1">
                  {tr ? 'En popüler' : 'Most popular'}
                </span>
              )}
              <div className="text-[10.5px] uppercase tracking-[.14em] font-semibold" style={{ color: tier.accent }}>
                {tier.name[lang]}
              </div>
              <div className="mt-2 font-display text-[40px] leading-none tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                {tier.amounts ? formatMoney(tier.amounts[currency], currency) : tier.priceLabel[lang]}
              </div>
              <div className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400">{tier.period[lang]}</div>
              <p className="mt-3 text-[14px] text-slate-600 dark:text-slate-400">{tier.tagline[lang]}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {tier.features[lang].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-slate-700 dark:text-slate-300">
                    <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-md flex-none" style={{ backgroundColor: `${tier.accent}1f` }}>
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke={tier.accent} strokeWidth="2"><path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-medium transition ${
                  tier.featured ? 'text-white' : 'text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-white/[.06] border border-slate-900/[.08] dark:border-white/[.1] hover:bg-white dark:hover:bg-white/[.1]'
                }`}
                style={tier.featured ? { backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' } : undefined}
              >
                {tr ? 'Başla' : 'Get started'}
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[12.5px] text-slate-500 dark:text-slate-400">
          {tr
            ? 'Tüm planlar 14 gün koşulsuz iade. Eğitim kurumlarına %50 indirim.'
            : 'All plans include a 14-day no-questions refund. 50% off for education.'}
        </p>
      </div>
    </section>
  );
}
