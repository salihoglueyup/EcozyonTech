// Integrations catalog — the wearables/services Ecozyon connects to. Shaped
// like the cases data (slug + bilingual fields) so /integrations and
// /integrations/:slug share one source and the prerender can emit per-slug
// pages + OG cards. Pure helpers are unit-tested.

// Connection state → bilingual label + accent. `connected` is live, `beta` is
// limited, `soon` is roadmap.
export const STATUS_META = {
  connected: { label: { tr: 'Bağlı', en: 'Connected' }, accent: '#10B981' },
  beta: { label: { tr: 'Beta', en: 'Beta' }, accent: '#0EA5E9' },
  soon: { label: { tr: 'Yakında', en: 'Soon' }, accent: '#94A3B8' },
};

export const INTEGRATIONS = [
  {
    slug: 'apple-health',
    name: 'Apple Health',
    category: { tr: 'Sağlık', en: 'Health' },
    status: 'connected',
    accent: '#EF4444',
    tagline: { tr: 'Aktivite ve hareket verisi senkronu', en: 'Activity and movement data sync' },
    description: {
      tr: ['Apple Health üzerinden adım, egzersiz ve hareket verisini güvenli biçimde içe aktararak günlük karbon içgörülerini zenginleştirir.', 'Veriler cihazda işlenir; yalnızca toplulaştırılmış metrikler paylaşılır.'],
      en: ['Securely imports steps, workouts and movement from Apple Health to enrich daily carbon insights.', 'Data is processed on-device; only aggregated metrics are shared.'],
    },
    features: {
      tr: ['Otomatik aktivite senkronu', 'Cihaz-içi işleme', 'Granüler izin kontrolü'],
      en: ['Automatic activity sync', 'On-device processing', 'Granular permission control'],
    },
  },
  {
    slug: 'google-fit',
    name: 'Google Fit',
    category: { tr: 'Sağlık', en: 'Health' },
    status: 'connected',
    accent: '#4285F4',
    tagline: { tr: 'Android ekosistemi için aktivite senkronu', en: 'Activity sync for the Android ecosystem' },
    description: {
      tr: ['Google Fit ile Android cihazlardan aktivite ve kalp atışı verisini bağlar, ulaşım modlarını otomatik sınıflandırır.', 'Bağlantı OAuth ile yetkilendirilir.'],
      en: ['Connects activity and heart-rate data from Android devices via Google Fit and auto-classifies transport modes.', 'The connection is authorized via OAuth.'],
    },
    features: {
      tr: ['OAuth yetkilendirme', 'Ulaşım modu sınıflandırma', 'Geçmiş veri içe aktarma'],
      en: ['OAuth authorization', 'Transport-mode classification', 'Historical import'],
    },
  },
  {
    slug: 'strava',
    name: 'Strava',
    category: { tr: 'Veri', en: 'Data' },
    status: 'connected',
    accent: '#FC4C02',
    tagline: { tr: 'Bisiklet ve koşu aktivitelerinden tasarruf', en: 'Savings from cycling and running activities' },
    description: {
      tr: ['Strava aktivitelerini bağlayarak araç yerine tercih edilen bisiklet/koşu kilometrelerini karbon tasarrufuna çevirir.', 'Webhook ile yeni aktiviteler anında işlenir.'],
      en: ['Connects Strava activities to turn cycling/running kilometers chosen over driving into carbon savings.', 'New activities are processed instantly via webhook.'],
    },
    features: {
      tr: ['Webhook ile anlık işleme', 'Aktivite bazlı tasarruf', 'Rozet senkronu'],
      en: ['Instant webhook processing', 'Per-activity savings', 'Badge sync'],
    },
  },
  {
    slug: 'garmin',
    name: 'Garmin Connect',
    category: { tr: 'Sağlık', en: 'Health' },
    status: 'beta',
    accent: '#007CC3',
    tagline: { tr: 'Garmin giyilebilir cihaz desteği', en: 'Garmin wearable support' },
    description: {
      tr: ['Garmin Connect ile çok günlük aktivite ve uyku verisini bağlar; beta aşamasında sınırlı cihaz desteği sunar.', 'Geri bildirimle kapsam genişletiliyor.'],
      en: ['Connects multi-day activity and sleep data via Garmin Connect; limited device support during beta.', 'Coverage expands with feedback.'],
    },
    features: {
      tr: ['Çok günlük senkron', 'Uyku & aktivite', 'Genişleyen cihaz listesi'],
      en: ['Multi-day sync', 'Sleep & activity', 'Growing device list'],
    },
  },
  {
    slug: 'withings',
    name: 'Withings',
    category: { tr: 'Veri', en: 'Data' },
    status: 'beta',
    accent: '#00C4B3',
    tagline: { tr: 'Sağlık cihazlarından bağlamsal veri', en: 'Contextual data from health devices' },
    description: {
      tr: ['Withings cihazlarından bağlamsal sağlık metriklerini ekleyerek öneri motorunun isabetini artırır.', 'Beta sürümünde temel metrikler desteklenir.'],
      en: ['Adds contextual health metrics from Withings devices to sharpen the recommendation engine.', 'Core metrics supported in beta.'],
    },
    features: {
      tr: ['Bağlamsal metrikler', 'Güvenli token saklama', 'Seçmeli paylaşım'],
      en: ['Contextual metrics', 'Secure token storage', 'Selective sharing'],
    },
  },
  {
    slug: 'slack',
    name: 'Slack',
    category: { tr: 'İletişim', en: 'Communication' },
    status: 'connected',
    accent: '#4A154B',
    tagline: { tr: 'Takım liderlik tablosu ve özetler', en: 'Team leaderboards and digests' },
    description: {
      tr: ['Slack ile haftalık takım özetlerini ve liderlik tablosunu doğrudan kanala taşır; kurumsal katılımı artırır.', 'Yönetici, hangi kanala ne gönderileceğini belirler.'],
      en: ['Brings weekly team digests and the leaderboard straight into a Slack channel to boost workplace engagement.', 'Admins choose what posts to which channel.'],
    },
    features: {
      tr: ['Haftalık özet mesajları', 'Liderlik tablosu', 'Kanal bazlı kontrol'],
      en: ['Weekly digest messages', 'Leaderboard', 'Per-channel control'],
    },
  },
  {
    slug: 'microsoft-teams',
    name: 'Microsoft Teams',
    category: { tr: 'İletişim', en: 'Communication' },
    status: 'soon',
    accent: '#6264A7',
    tagline: { tr: 'Kurumsal Teams entegrasyonu', en: 'Enterprise Teams integration' },
    description: {
      tr: ['Microsoft Teams için kurumsal özet ve bildirim entegrasyonu yol haritasında; kurumsal müşteriler için planlanıyor.', 'İlgileniyorsan bekleme listesine yazılabilirsin.'],
      en: ['An enterprise digest and notification integration for Microsoft Teams is on the roadmap for enterprise customers.', 'You can join the waitlist if interested.'],
    },
    features: {
      tr: ['Kurumsal özetler', 'SSO uyumu', 'Yönetici kontrolleri'],
      en: ['Enterprise digests', 'SSO compatibility', 'Admin controls'],
    },
  },
  {
    slug: 'webhooks',
    name: 'Webhooks',
    category: { tr: 'Geliştirici', en: 'Developer' },
    status: 'connected',
    accent: '#0EA5E9',
    tagline: { tr: 'Olayları kendi sistemlerine gönder', en: 'Push events to your own systems' },
    description: {
      tr: ['Karbon eşikleri, rozetler ve haftalık özetler için kendi uç noktana imzalı webhook olayları gönderir.', 'Yeniden deneme ve imza doğrulama dahildir.'],
      en: ['Sends signed webhook events to your endpoint for carbon thresholds, badges and weekly digests.', 'Retries and signature verification included.'],
    },
    features: {
      tr: ['İmzalı olaylar', 'Otomatik yeniden deneme', 'Olay filtreleme'],
      en: ['Signed events', 'Automatic retries', 'Event filtering'],
    },
  },
  {
    slug: 'rest-api',
    name: 'REST API',
    category: { tr: 'Geliştirici', en: 'Developer' },
    status: 'connected',
    accent: '#10B981',
    tagline: { tr: 'Programatik erişim için açık API', en: 'Open API for programmatic access' },
    description: {
      tr: ['Token tabanlı REST API ile metriklere, ekip verisine ve raporlara programatik erişim sağlar.', 'Geliştirici dokümanı uçları örneklerle anlatır.'],
      en: ['A token-based REST API for programmatic access to metrics, team data and reports.', 'The developer docs walk through the endpoints with examples.'],
    },
    features: {
      tr: ['Token kimlik doğrulama', 'Oran sınırlama', 'Sayfalama'],
      en: ['Token authentication', 'Rate limiting', 'Pagination'],
    },
  },
];

// Bilingual label + accent for a status key (neutral fallback).
export const statusMeta = (status) =>
  STATUS_META[status] || { label: { tr: status, en: status }, accent: '#94A3B8' };

// An integration by slug, or undefined.
export const integrationBySlug = (slug, all = INTEGRATIONS) => all.find((i) => i.slug === slug);

// Categories present, each with a stable id (category.en) + bilingual label, in
// first-appearance order — mirrors caseSectors for the catalog filter.
export function integrationCategories(all = INTEGRATIONS) {
  const seen = new Map();
  for (const i of all) {
    if (!seen.has(i.category.en)) seen.set(i.category.en, { id: i.category.en, label: i.category });
  }
  return [...seen.values()];
}

// Filter by category id (category.en); null/undefined returns all.
export const filterByCategory = (all, categoryId) =>
  categoryId ? all.filter((i) => i.category.en === categoryId) : all;
