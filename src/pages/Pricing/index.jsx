import { Link } from 'react-router-dom';
import { Tag } from '@/shared/ui/primitives';
import { useApp } from '@/app/providers/AppProvider';
import { useDocumentMeta } from '@/core/hooks/useDocumentMeta';
import { routeByKey } from '@/core/config/site';

const meta = routeByKey('pricing');

const TIERS = [
  {
    id: 'individual',
    price: { tr: 'Ücretsiz', en: 'Free' },
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
    price: { tr: '₺149', en: '$5' },
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
    price: { tr: 'Görüşelim', en: "Let's talk" },
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
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.02em] text-slate-900">
            {tr ? 'Etkiye göre, ' : 'Priced for '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg,#0EA5E9 0%,#10B981 100%)' }}>
              {tr ? 'ölçeğe göre' : 'impact, then scale'}
            </span>
          </h1>
          <p className="mt-3 text-[15px] text-slate-600 max-w-2xl leading-relaxed">
            {tr
              ? 'Pilot dönemde bireysel kullanım ücretsiz. Takım ve kurumsal planlar büyüdükçe açılır.'
              : 'Individual use is free during the pilot. Team and enterprise unlock as you grow.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl border bg-white/70 backdrop-blur-xl p-7 lg:p-8 flex flex-col ${
                tier.featured
                  ? 'border-emerald-500/30 ring-2 ring-emerald-500/20 shadow-[0_24px_70px_-40px_rgba(16,185,129,.5)]'
                  : 'border-white/70 ring-1 ring-slate-900/[.05]'
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
              <div className="mt-2 font-display text-[40px] leading-none tracking-tight text-slate-900">
                {tier.price[lang]}
              </div>
              <div className="mt-1 text-[12.5px] text-slate-500">{tier.period[lang]}</div>
              <p className="mt-3 text-[14px] text-slate-600">{tier.tagline[lang]}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {tier.features[lang].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
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
                  tier.featured ? 'text-white' : 'text-slate-800 bg-white/70 border border-slate-900/[.08] hover:bg-white'
                }`}
                style={tier.featured ? { backgroundImage: 'linear-gradient(120deg,#0EA5E9 0%,#10B981 100%)' } : undefined}
              >
                {tr ? 'Başla' : 'Get started'}
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h8m-3-3 3 3-3 3" /></svg>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[12.5px] text-slate-500">
          {tr
            ? 'Tüm planlar 14 gün koşulsuz iade. Eğitim kurumlarına %50 indirim.'
            : 'All plans include a 14-day no-questions refund. 50% off for education.'}
        </p>
      </div>
    </section>
  );
}
