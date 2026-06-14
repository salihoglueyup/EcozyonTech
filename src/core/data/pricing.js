// Pricing tiers + pricing FAQ — the single source for the /pricing page and
// the Product/Offer + FAQPage JSON-LD emitted by the prerender step. Prices are
// per-market (not FX-converted), switched by the currency toggle.

export const TIERS = [
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
export const ANNUAL_MONTHS = 10;
export const SAVE_PCT = Math.round((1 - ANNUAL_MONTHS / 12) * 100);

// Monthly-equivalent price for a numeric tier under the active billing period.
// Returns null for tiers without a price (Free / Enterprise custom).
export function tierMonthly(tier, currency, annual = false) {
  if (!tier.amounts) return null;
  const monthly = tier.amounts[currency];
  if (monthly == null) return null;
  return annual ? Math.round((monthly * ANNUAL_MONTHS) / 12) : monthly;
}

export const PRICING_FAQ = [
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
