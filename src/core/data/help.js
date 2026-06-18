// Help-center FAQ entries — the single source for both the standalone /help
// page and the curated FAQ section on /services. Each entry has a stable id
// (the deep-link anchor), a category, a bilingual question/answer, a `featured`
// flag for the short Services list, and an optional `links` array of route keys
// (rendered as related-page chips under the answer; entries without it are
// unaffected).
//
// Pure helpers (helpCategories / searchHelp / featuredHelp / helpById) mirror
// the post/job/case helpers and are unit-tested.
export const HELP = [
  {
    id: 'what-is-ecozyon',
    category: { tr: 'Ürün', en: 'Product' },
    featured: true,
    links: ['services'],
    q: { tr: 'Ecozyon tam olarak nedir?', en: 'What exactly is Ecozyon?' },
    a: {
      tr: 'Ecozyon Tech, giyilebilir cihaz + AI tabanlı bir sürdürülebilirlik platformudur. Bireysel karbon ayak izini ölçer, azaltma önerileri sunar ve topluluk yarışmalarıyla alışkanlık değişimi sağlar.',
      en: 'Ecozyon Tech is a wearable + AI-powered sustainability platform. It measures your personal carbon footprint, suggests reductions and drives habit change through community challenges.',
    },
  },
  {
    id: 'how-it-works',
    category: { tr: 'Ürün', en: 'Product' },
    links: ['services'],
    q: { tr: 'Sistem nasıl çalışıyor?', en: 'How does the system work?' },
    a: {
      tr: 'Cihaz günlük aktiviteni ölçer, kişisel bir baseline oluşturur ve cihaz üstünde çalışan model günlük öneriler üretir. İlerlemeni mobil uygulamadan ve web panelinden takip edersin.',
      en: 'The device measures your daily activity, builds a personal baseline, and an on-device model produces daily nudges. You track progress in the mobile app and web dashboard.',
    },
  },
  {
    id: 'device-power',
    category: { tr: 'Cihaz', en: 'Device' },
    featured: true,
    q: { tr: 'Cihaz ne kadar enerji tüketiyor?', en: 'How much power does the device use?' },
    a: {
      tr: 'Referans tasarım 0.4W altında çalışır — bir akıllı saatin çeyreği kadar. Kablosuz şarjla haftada bir şarj yeterlidir.',
      en: 'The reference design operates below 0.4W — a quarter of a smartwatch. Wireless charging once a week is enough.',
    },
  },
  {
    id: 'device-charging',
    category: { tr: 'Cihaz', en: 'Device' },
    q: { tr: 'Pil ne kadar dayanıyor?', en: 'How long does the battery last?' },
    a: {
      tr: 'Tipik kullanımda yaklaşık 7 gün. Düşük güç modu pili daha da uzatır; şarj kablosuz ped üzerinde birkaç saatte tamamlanır.',
      en: 'About 7 days under typical use. Low-power mode extends it further; charging completes in a couple of hours on the wireless pad.',
    },
  },
  {
    id: 'data-safety',
    category: { tr: 'Gizlilik', en: 'Privacy' },
    featured: true,
    links: ['legal'],
    q: { tr: 'Verilerim güvende mi?', en: 'Is my data safe?' },
    a: {
      tr: 'Evet. Tüm veriler uçtan uca şifrelenir, KVKK ve GDPR uyumludur. Ham verileri üçüncü taraflarla paylaşmıyoruz.',
      en: 'Yes. All data is end-to-end encrypted and compliant with KVKK and GDPR. We never share raw data with third parties.',
    },
  },
  {
    id: 'on-device',
    category: { tr: 'Gizlilik', en: 'Privacy' },
    links: ['legal'],
    q: { tr: 'Veriler cihazda mı işleniyor?', en: 'Is data processed on-device?' },
    a: {
      tr: 'Öneri modelleri mümkün olduğunca cihaz üstünde çalışır; yalnızca toplulaştırılmış sinyaller paylaşılır. Bu, gizliliği bozmadan ölçüm yapmamızı sağlar.',
      en: 'Recommendation models run on-device where possible; only aggregated signals are shared. That lets us measure without compromising privacy.',
    },
  },
  {
    id: 'data-deletion',
    category: { tr: 'Gizlilik', en: 'Privacy' },
    links: ['legal'],
    q: { tr: 'Verilerimi sildirebilir miyim?', en: 'Can I have my data deleted?' },
    a: {
      tr: 'Dilediğin zaman silinmesini talep edebilirsin — hello@ecozyon.tech adresine yazman yeterli.',
      en: 'You can request deletion at any time — just email hello@ecozyon.tech.',
    },
  },
  {
    id: 'free-plan',
    category: { tr: 'Fiyatlandırma', en: 'Pricing' },
    featured: true,
    links: ['pricing'],
    q: { tr: 'Ücretsiz plan ne kadar süreyle geçerli?', en: 'How long is the free plan valid?' },
    a: {
      tr: 'Pilot dönem boyunca bireysel kullanım tamamen ücretsiz. Ek özellikler (takım analitiği, API erişimi) için ücretli planlar mevcuttur.',
      en: 'Individual use is completely free during the pilot period. Paid plans unlock team analytics, API access and more.',
    },
  },
  {
    id: 'annual-saving',
    category: { tr: 'Fiyatlandırma', en: 'Pricing' },
    links: ['pricing'],
    q: { tr: 'Yıllık faturalama ne kadar kazandırır?', en: 'How much does annual billing save?' },
    a: {
      tr: 'Yıllık planda 12 ay yerine 10 ay ödersin — yaklaşık %17 tasarruf.',
      en: 'Annual billing charges for 10 months instead of 12 — about 17% off.',
    },
  },
  {
    id: 'platforms',
    category: { tr: 'Entegrasyon', en: 'Integration' },
    featured: true,
    links: ['integrations'],
    q: { tr: 'Hangi platformları destekliyorsunuz?', en: 'Which platforms do you support?' },
    a: {
      tr: 'iOS, Android ve web dashboard. Ayrıca REST API ile mevcut kurumsal sistemlere entegrasyon sağlanır.',
      en: 'iOS, Android and a web dashboard. A REST API also enables integration with existing enterprise systems.',
    },
  },
  {
    id: 'api-access',
    category: { tr: 'Entegrasyon', en: 'Integration' },
    links: ['developers'],
    q: { tr: 'API erişimi nasıl alınır?', en: 'How do I get API access?' },
    a: {
      tr: 'API erişimi Takım ve Kurumsal planlarda açıktır. Anahtarını yönetici panelinden oluşturursun.',
      en: 'API access is available on the Team and Enterprise plans. You create your key from the admin dashboard.',
    },
  },
  {
    id: 'sso',
    category: { tr: 'Entegrasyon', en: 'Integration' },
    links: ['developers'],
    q: { tr: 'SSO / SCIM destekliyor musunuz?', en: 'Do you support SSO / SCIM?' },
    a: {
      tr: 'Evet, Kurumsal planda SSO ve SCIM ile kullanıcı yönetimi sağlanır.',
      en: 'Yes — the Enterprise plan provides SSO and SCIM-based user management.',
    },
  },
  {
    id: 'getting-started',
    category: { tr: 'Başlangıç', en: 'Getting started' },
    featured: true,
    q: { tr: 'Nasıl başlarım?', en: 'How do I get started?' },
    a: {
      tr: 'Cihazı kutudan çıkar, bileğine tak ve mobil uygulamayı indir. Eşleştirme tek dokunuşla tamamlanır; ilk gün veri toplamaya başlar.',
      en: 'Unbox the device, put it on your wrist and download the mobile app. Pairing takes one tap; it starts collecting data on day one.',
    },
  },
  {
    id: 'baseline-week',
    category: { tr: 'Başlangıç', en: 'Getting started' },
    q: { tr: 'İlk hafta neden önemli?', en: 'Why does the first week matter?' },
    a: {
      tr: 'İlk 7 gün kişisel baseline’ını oluşturur — öneriler bu referansa göre kişiselleşir. Bu sürede normal rutinini sürdürmen yeterli.',
      en: 'The first 7 days build your personal baseline — suggestions personalize against this reference. Just keep your normal routine during that time.',
    },
  },
  {
    id: 'lost-device',
    category: { tr: 'Sorun giderme', en: 'Troubleshooting' },
    q: { tr: 'Cihazımı kaybedersem ne olur?', en: 'What if I lose my device?' },
    a: {
      tr: 'Verilerin hesabında güvende kalır. Yönetici panelinden cihazı devre dışı bırakabilir, yeni cihazı baseline’ını koruyarak eşleştirebilirsin.',
      en: 'Your data stays safe in your account. You can deactivate the device from the dashboard and pair a new one while keeping your baseline.',
    },
  },
  {
    id: 'data-not-syncing',
    category: { tr: 'Sorun giderme', en: 'Troubleshooting' },
    featured: true,
    links: ['status'],
    q: { tr: 'Verilerim senkronize olmuyor, ne yapmalıyım?', en: 'My data isn’t syncing — what should I do?' },
    a: {
      tr: 'Önce Bluetooth’un açık ve uygulamanın güncel olduğundan emin ol. Cihaz çevrimdışıyken ölçümü yerelde tutar ve bağlantı gelince otomatik eşitler.',
      en: 'First make sure Bluetooth is on and the app is up to date. The device stores readings locally while offline and syncs automatically once reconnected.',
    },
  },
  {
    id: 'reset-device',
    category: { tr: 'Sorun giderme', en: 'Troubleshooting' },
    q: { tr: 'Cihazı nasıl sıfırlarım?', en: 'How do I reset the device?' },
    a: {
      tr: 'Uygulamadaki Cihaz ayarlarından “Fabrika ayarlarına dön”ü seç ya da düğmeyi 10 saniye basılı tut. Baseline’ını korumak istiyorsan önce yedeklemeyi aç.',
      en: 'Choose “Factory reset” under Device settings in the app, or hold the button for 10 seconds. Enable backup first if you want to keep your baseline.',
    },
  },
];

// Distinct categories with a stable id (category.en) + bilingual label, in
// first-appearance order — mirrors postTags/jobTeams/caseSectors.
export function helpCategories(entries = HELP) {
  const seen = new Map();
  for (const e of entries) {
    if (!seen.has(e.category.en)) seen.set(e.category.en, { id: e.category.en, label: e.category });
  }
  return [...seen.values()];
}

// Filter by the stable category id. A null/empty id means "all".
export function filterByCategory(entries, categoryId) {
  if (!categoryId) return entries;
  return entries.filter((e) => e.category.en === categoryId);
}

// Case-insensitive substring search over question + answer + category in the
// active language. Empty query returns the list unchanged so it composes with
// filterByCategory (AND semantics).
export function searchHelp(entries, query, lang = 'tr') {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((e) => {
    const hay = [e.q?.[lang], e.a?.[lang], e.category?.[lang]].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  });
}

// The short list shown on /services.
export const featuredHelp = (entries = HELP) => entries.filter((e) => e.featured);

// Resolve an entry by its id/anchor.
export const helpById = (id, entries = HELP) => entries.find((e) => e.id === id);
