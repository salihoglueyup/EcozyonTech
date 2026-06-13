import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';
import { CURRENCIES, defaultCurrency, formatMoney } from '@/core/lib/currency';
import { FAQ } from '@/features/faq';
import { Donut } from '@/shared/ui/charts';

// Pricing-specific FAQ, rendered through the shared FAQ accordion.
const PRICING_FAQ = [
  {
    q: { tr: 'Pilot dönem gerçekten ücretsiz mi?', en: 'Is the pilot period really free?' },
    a: {
      tr: 'Evet. Bireysel kullanım pilot boyunca ücretsiz; kredi kartı istemiyoruz.',
      en: 'Yes. Individual use is free throughout the pilot — no credit card required.',
    },
  },
  {
    q: { tr: 'Yıllık faturalama ne kadar kazandırır?', en: 'How much does annual billing save?' },
    a: {
      tr: 'Yıllık planda 12 ay yerine 10 ay ödersin — yaklaşık %17 tasarruf.',
      en: 'Annual billing charges for 10 months instead of 12 — about 17% off.',
    },
  },
  {
    q: { tr: 'Planımı sonradan değiştirebilir miyim?', en: 'Can I change plans later?' },
    a: {
      tr: 'İstediğin zaman yükselt veya düşür; fark orantılı olarak hesaplanır.',
      en: 'Upgrade or downgrade anytime; the difference is prorated.',
    },
  },
  {
    q: { tr: 'Kurumsal fiyat neden özel?', en: 'Why is enterprise priced custom?' },
    a: {
      tr: 'Scope 1-2-3 raporlama, SSO/SCIM ve entegrasyon ihtiyaçları kuruma göre değişir; birlikte belirleriz.',
      en: 'Scope 1-2-3 reporting, SSO/SCIM and integration needs vary by org, so we scope it together.',
    },
  },
  {
    q: { tr: 'İade politikası nedir?', en: 'What is the refund policy?' },
    a: {
      tr: 'Tüm ücretli planlarda 14 gün koşulsuz iade hakkın var.',
      en: 'Every paid plan includes a 14-day no-questions-asked refund.',
    },
  },
];

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

// Annual billing charges for 10 months instead of 12 → ~17% off. Only the
// numeric (Team) tier is affected; Free/Custom tiers ignore it.
const ANNUAL_MONTHS = 10;
const SAVE_PCT = Math.round((1 - ANNUAL_MONTHS / 12) * 100);

// Feature comparison matrix — values align with TIERS order
// [Individual, Team, Enterprise]. A cell is true (✓), false (—) or a
// bilingual string. Kept in sync with each tier's feature list above.
const COMPARE = [
  { feature: { tr: 'Kişisel baseline', en: 'Personal baseline' }, values: [true, true, true] },
  { feature: { tr: 'Günlük AI önerileri', en: 'Daily AI nudges' }, values: [true, true, true] },
  { feature: { tr: 'Topluluk yarışmaları', en: 'Community challenges' }, values: [true, true, true] },
  { feature: { tr: 'Mobil uygulama', en: 'Mobile app' }, values: [true, true, true] },
  { feature: { tr: 'Takım liderlik tablosu', en: 'Team leaderboard' }, values: [false, true, true] },
  { feature: { tr: 'Yönetici paneli', en: 'Admin dashboard' }, values: [false, true, true] },
  { feature: { tr: 'Aylık ESG özeti', en: 'Monthly ESG digest' }, values: [false, true, true] },
  { feature: { tr: 'GHG / GRI raporları', en: 'GHG / GRI reports' }, values: [false, false, true] },
  { feature: { tr: 'SSO & SCIM', en: 'SSO & SCIM' }, values: [false, false, true] },
  { feature: { tr: 'Özel entegrasyonlar', en: 'Custom integrations' }, values: [false, false, true] },
  {
    feature: { tr: 'Destek', en: 'Support' },
    values: [
      { tr: 'Topluluk', en: 'Community' },
      { tr: 'Öncelikli', en: 'Priority' },
      { tr: 'SLA + yönetici', en: 'SLA + manager' },
    ],
  },
];

// Feature coverage per tier, derived from the comparison matrix (a cell counts
// as included unless it's explicitly false). Drives the coverage donuts.
const TOTAL_FEATURES = COMPARE.length;
const COVERAGE = TIERS.map((_, i) => COMPARE.filter((row) => row.values[i] !== false).length);

export default function PricingPage() {
  const { lang, t } = useApp();
  const tr = lang === 'tr';
  const [currency, setCurrency] = useState(defaultCurrency(lang));
  const [annual, setAnnual] = useState(false);
  // Monthly-equivalent price for a tier under the active billing period.
  const priceFor = (tier) => {
    const monthly = tier.amounts[currency];
    return annual ? Math.round((monthly * ANNUAL_MONTHS) / 12) : monthly;
  };
  useDocumentMeta(
    meta.title[lang],
    tr
      ? 'Bireysel, takım ve kurumsal planlar — pilot dönemde ücretsiz başla.'
      : 'Individual, team and enterprise plans — start free during the pilot.',
  );

  const pricingFaq = {
    title: tr ? 'Fiyatlandırma SSS' : 'Pricing FAQ',
    items: PRICING_FAQ.map((it) => ({ q: it.q[lang], a: it.a[lang] })),
  };

  return (
    <>
    <section className="relative py-20 lg:py-28 pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <Tag color="cyan">// {tr ? 'Fiyatlandırma' : 'Pricing'}</Tag>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            {tr ? 'Etkiye göre, ' : 'Priced for '}
            <span className="eco-gradient-text">
              {tr ? 'ölçeğe göre' : 'impact, then scale'}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {tr
              ? 'Pilot dönemde bireysel kullanım ücretsiz. Takım ve kurumsal planlar büyüdükçe açılır.'
              : 'Individual use is free during the pilot. Team and enterprise unlock as you grow.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center gap-1 rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] p-1"
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

            <div
              className="inline-flex items-center gap-1 rounded-full bg-white/70 dark:bg-white/[.06] ring-1 ring-slate-900/[.08] dark:ring-white/[.1] p-1"
              role="group"
              aria-label={tr ? 'Faturalama dönemi' : 'Billing period'}
            >
              {[
                { id: false, label: tr ? 'Aylık' : 'Monthly' },
                { id: true, label: tr ? 'Yıllık' : 'Annual' },
              ].map((opt) => {
                const on = annual === opt.id;
                return (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => setAnnual(opt.id)}
                    aria-pressed={on}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
                      on ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {opt.label}
                    {opt.id && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${on ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-700' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'}`}>
                        −%{SAVE_PCT}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
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
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-[40px] leading-none tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                  {tier.amounts ? formatMoney(priceFor(tier), currency) : tier.priceLabel[lang]}
                </span>
                {tier.amounts && annual && (
                  <span className="text-[14px] text-slate-400 line-through tabular-nums">
                    {formatMoney(tier.amounts[currency], currency)}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400">
                {tier.period[lang]}
                {tier.amounts && annual && (tr ? ' · yıllık faturalanır' : ' · billed annually')}
              </div>
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
                to={`/contact?plan=${tier.id}${annual ? '&billing=annual' : ''}`}
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

        {/* Feature comparison table */}
        <div className="mt-16">
          <h2 className="font-display text-[clamp(1.4rem,3vw,2rem)] tracking-tight text-slate-900 dark:text-slate-100">
            {tr ? 'Planları karşılaştır' : 'Compare plans'}
          </h2>

          {/* Feature-coverage donuts (derived from the matrix below) */}
          <div className="mt-5 grid max-w-md grid-cols-3 gap-3">
            {TIERS.map((tier, i) => (
              <div key={tier.id} className="flex flex-col items-center rounded-xl eco-card p-3">
                <Donut
                  value={(COVERAGE[i] / TOTAL_FEATURES) * 100}
                  size={50}
                  stroke={5}
                  color={tier.accent}
                  label={`${tier.name[lang]}: ${COVERAGE[i]}/${TOTAL_FEATURES}`}
                >
                  <span className="tabular-nums" style={{ color: tier.accent }}>{COVERAGE[i]}</span>
                </Donut>
                <div className="mt-2 text-center text-[11px] font-medium text-slate-600 dark:text-slate-300">{tier.name[lang]}</div>
                <div className="text-[10px] text-slate-400">{tr ? `${TOTAL_FEATURES} özellikten` : `of ${TOTAL_FEATURES}`}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <caption className="sr-only">{tr ? 'Plan özellik karşılaştırması' : 'Plan feature comparison'}</caption>
              <thead>
                <tr className="border-b border-slate-900/[.08] dark:border-white/[.1]">
                  <th scope="col" className="py-3 pr-4 text-[12px] font-medium text-slate-500 dark:text-slate-400">
                    {tr ? 'Özellik' : 'Feature'}
                  </th>
                  {TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className={`py-3 px-3 text-[13px] font-semibold text-center ${tier.featured ? 'bg-emerald-500/[.06] dark:bg-emerald-400/[.06] rounded-t-xl' : ''}`}
                      style={{ color: tier.accent }}
                    >
                      {tier.name[lang]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.feature.en} className="border-b border-slate-900/[.05] dark:border-white/[.06]">
                    <th scope="row" className="py-3 pr-4 text-[13px] font-normal text-slate-700 dark:text-slate-300">
                      {row.feature[lang]}
                    </th>
                    {row.values.map((v, i) => (
                      <td
                        key={TIERS[i].id}
                        className={`py-3 px-3 text-center text-[13px] ${TIERS[i].featured ? 'bg-emerald-500/[.06] dark:bg-emerald-400/[.06]' : ''}`}
                      >
                        {v === true ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md mx-auto" style={{ backgroundColor: `${TIERS[i].accent}1f` }}>
                            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke={TIERS[i].accent} strokeWidth="2"><path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>
                        ) : v === false ? (
                          <span className="text-slate-300 dark:text-slate-600" aria-label={tr ? 'Yok' : 'Not included'}>—</span>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{v[lang]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-8 text-[12.5px] text-slate-500 dark:text-slate-400">
          {tr
            ? 'Tüm planlar 14 gün koşulsuz iade. Eğitim kurumlarına %50 indirim.'
            : 'All plans include a 14-day no-questions refund. 50% off for education.'}
        </p>
      </div>
    </section>

    <FAQ t={t} faq={pricingFaq} id="pricing-faq" eyebrow={tr ? 'SSS' : 'FAQ'} />
    </>
  );
}
