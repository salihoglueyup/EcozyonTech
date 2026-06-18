// Service status — component health + recent incidents. Static demo data, but
// shaped like a real status page (component list, 90-day uptime, incident
// history) so the UI is realistic. The pure helpers (statusMeta /
// overallStatus / uptimeAverage) are unit-tested.

// Each state carries a bilingual label, an accent and a severity rank. The
// rank drives overallStatus: the worst component wins.
export const STATUS_META = {
  operational: { label: { tr: 'Çalışıyor', en: 'Operational' }, accent: '#10B981', rank: 0 },
  maintenance: { label: { tr: 'Bakımda', en: 'Maintenance' }, accent: '#0EA5E9', rank: 1 },
  degraded: { label: { tr: 'Yavaşlama', en: 'Degraded' }, accent: '#F59E0B', rank: 2 },
  outage: { label: { tr: 'Kesinti', en: 'Outage' }, accent: '#EF4444', rank: 3 },
};

// Bilingual summary headline keyed by the overall (worst) status.
export const OVERALL_HEADLINE = {
  operational: { tr: 'Tüm sistemler çalışıyor', en: 'All systems operational' },
  maintenance: { tr: 'Planlı bakım sürüyor', en: 'Planned maintenance in progress' },
  degraded: { tr: 'Bazı sistemlerde yavaşlama', en: 'Some systems are degraded' },
  outage: { tr: 'Bir kesinti yaşanıyor', en: 'We are experiencing an outage' },
};

// Monitored components and their current state + 90-day uptime. `series` is an
// authored 14-day daily-uptime history (deterministic, for the sparkline).
export const COMPONENTS = [
  { id: 'api', name: { tr: 'API', en: 'API' }, desc: { tr: 'Genel REST & GraphQL uçları', en: 'Public REST & GraphQL endpoints' }, status: 'operational', uptime: 99.98, series: [100, 99.9, 100, 99.95, 100, 100, 99.98, 100, 99.92, 100, 100, 99.96, 100, 99.98] },
  { id: 'dashboard', name: { tr: 'Panel', en: 'Dashboard' }, desc: { tr: 'Web uygulaması ve grafikler', en: 'Web app and analytics' }, status: 'operational', uptime: 99.95, series: [99.9, 100, 99.8, 100, 99.95, 100, 99.7, 100, 100, 99.9, 100, 99.95, 100, 99.95] },
  { id: 'mobile', name: { tr: 'Mobil & Giyilebilir', en: 'Mobile & Wearable' }, desc: { tr: 'iOS/Android ve cihaz senkronu', en: 'iOS/Android and device sync' }, status: 'operational', uptime: 99.92, series: [99.8, 99.95, 100, 99.7, 100, 99.9, 100, 99.85, 100, 99.95, 99.8, 100, 99.9, 99.92] },
  { id: 'ai', name: { tr: 'AI Motoru', en: 'AI Engine' }, desc: { tr: 'Tahmin ve öneri servisleri', en: 'Prediction and recommendation services' }, status: 'operational', uptime: 99.89, series: [99.9, 99.7, 100, 99.6, 99.4, 100, 99.8, 100, 99.9, 99.95, 100, 99.85, 100, 99.89] },
  { id: 'integrations', name: { tr: 'Entegrasyonlar', en: 'Integrations' }, desc: { tr: 'Webhook ve üçüncü taraf bağlantılar', en: 'Webhooks and third-party connectors' }, status: 'operational', uptime: 99.97, series: [100, 100, 99.95, 100, 99.9, 100, 100, 99.98, 100, 99.95, 100, 100, 99.97, 99.97] },
  { id: 'site', name: { tr: 'Web Sitesi', en: 'Website' }, desc: { tr: 'Pazarlama sitesi ve dokümanlar', en: 'Marketing site and docs' }, status: 'operational', uptime: 100, series: [100, 100, 100, 100, 99.98, 100, 100, 100, 100, 100, 100, 99.99, 100, 100] },
];

// Incident history — newest first. Each incident has a severity (a status
// key), a resolved flag and a timeline of bilingual updates.
export const INCIDENTS = [
  {
    id: 'inc-2026-05',
    date: '2026-05-28',
    title: { tr: 'AI önerilerinde gecikme', en: 'Latency in AI recommendations' },
    severity: 'degraded',
    resolved: true,
    updates: [
      { at: '2026-05-28T09:12:00Z', text: { tr: 'Öneri servisinde artan yanıt süreleri tespit edildi.', en: 'Elevated response times detected on the recommendation service.' } },
      { at: '2026-05-28T09:40:00Z', text: { tr: 'Model çıkarım kuyruğu ölçeklendirildi, gecikme normale döndü.', en: 'Inference queue scaled up; latency back to normal.' } },
      { at: '2026-05-28T10:05:00Z', text: { tr: 'Olay çözüldü, izleme sürüyor.', en: 'Incident resolved, monitoring continues.' } },
    ],
  },
  {
    id: 'inc-2026-04',
    date: '2026-04-09',
    title: { tr: 'Planlı veritabanı bakımı', en: 'Scheduled database maintenance' },
    severity: 'maintenance',
    resolved: true,
    updates: [
      { at: '2026-04-09T01:00:00Z', text: { tr: 'Panelde ~20 dakikalık salt-okunur pencere uygulandı.', en: 'A ~20-minute read-only window applied to the dashboard.' } },
      { at: '2026-04-09T01:24:00Z', text: { tr: 'Bakım tamamlandı, tüm yazma işlemleri açıldı.', en: 'Maintenance complete, all writes re-enabled.' } },
    ],
  },
  {
    id: 'inc-2026-03',
    date: '2026-03-02',
    title: { tr: 'Webhook teslimatında kısa kesinti', en: 'Brief webhook delivery outage' },
    severity: 'outage',
    resolved: true,
    updates: [
      { at: '2026-03-02T14:31:00Z', text: { tr: 'Bir entegrasyon sağlayıcısında webhook teslimatları durdu.', en: 'Webhook deliveries stalled at one integration provider.' } },
      { at: '2026-03-02T14:58:00Z', text: { tr: 'Yedek kuyruğa geçildi, biriken olaylar yeniden gönderildi.', en: 'Failed over to a backup queue; queued events re-sent.' } },
    ],
  },
];

// Bilingual label + accent for a status key (falls back to a neutral entry).
export const statusMeta = (status) =>
  STATUS_META[status] || { label: { tr: status, en: status }, accent: '#94A3B8', rank: 0 };

// The overall status is the worst (highest-rank) component status.
export const overallStatus = (components = COMPONENTS) =>
  components.reduce((worst, c) => (statusMeta(c.status).rank > statusMeta(worst).rank ? c.status : worst), 'operational');

// Average 90-day uptime across components, rounded to two decimals.
export const uptimeAverage = (components = COMPONENTS) =>
  components.length === 0
    ? 0
    : Math.round((components.reduce((s, c) => s + c.uptime, 0) / components.length) * 100) / 100;

// Whole days since the most recent incident (null when there are none). `now`
// is injectable so tests stay deterministic; never returns negative.
export function daysSinceLastIncident(incidents = INCIDENTS, now = new Date()) {
  if (!incidents || incidents.length === 0) return null;
  const latest = incidents.reduce((max, i) => {
    const t = new Date(i.date).getTime();
    return Number.isFinite(t) && t > max ? t : max;
  }, -Infinity);
  if (!Number.isFinite(latest)) return null;
  return Math.max(0, Math.floor((now.getTime() - latest) / 86400000));
}
