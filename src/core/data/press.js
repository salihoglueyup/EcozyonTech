// Newsroom data — press releases, external coverage and a brand fact sheet.
// Static demo content, shaped like a real press kit. The pure helpers
// (pressBySlug / latestPress) are unit-tested.

// Press releases, newest first. Each has a slug, ISO date, bilingual title +
// body paragraphs.
export const PRESS_RELEASES = [
  {
    slug: 'series-a',
    date: '2026-05-20',
    title: { tr: 'Ecozyon Tech, sürdürülebilirlik teknolojisini ölçeklemek için A serisi yatırım aldı', en: 'Ecozyon Tech raises Series A to scale sustainability technology' },
    body: {
      tr: [
        'Ecozyon Tech, giyilebilir teknoloji ve yapay zekâ ile bireysel ve kurumsal karbon ayak izini ölçülebilir alışkanlıklara dönüştüren platformunu büyütmek için A serisi yatırım turunu tamamladı.',
        'Yatırım; AI öneri motorunun derinleştirilmesi, yeni şehirlerde saha ortaklıkları ve ölçüm altyapısının genişletilmesi için kullanılacak.',
      ],
      en: [
        'Ecozyon Tech has closed a Series A round to grow its platform that turns individual and corporate carbon footprints into measurable habits through wearable technology and AI.',
        'The funding will deepen the AI recommendation engine, expand field partnerships in new cities and scale the measurement infrastructure.',
      ],
    },
  },
  {
    slug: 'impact-2026',
    date: '2026-04-02',
    title: { tr: '2026 Etki Raporu: 59 şehirde ölçülen karbon tasarrufu', en: '2026 Impact Report: measured carbon savings across 59 cities' },
    body: {
      tr: [
        'Şirket, ağındaki 59 şehirde toplanan anonim verilere dayanan yıllık etki raporunu yayımladı. Rapor, giyilebilir cihaz verisiyle desteklenen davranış değişikliğinin somut karbon tasarrufu sağladığını gösteriyor.',
        'Tüm metodoloji ve şehir bazlı kırılımlar etki haritası üzerinden şeffaf biçimde paylaşılıyor.',
      ],
      en: [
        'The company published its annual impact report based on anonymized data from 59 cities in its network, showing that wearable-informed behavior change produces tangible carbon savings.',
        'The full methodology and per-city breakdowns are shared transparently through the impact map.',
      ],
    },
  },
  {
    slug: 'wearable-launch',
    date: '2026-02-11',
    title: { tr: 'Yeni nesil Ecozyon giyilebilir cihazı tanıtıldı', en: 'Next-generation Ecozyon wearable unveiled' },
    body: {
      tr: [
        'Daha düşük güç tüketimi ve gelişmiş sensör doğruluğuyla yeni nesil giyilebilir cihaz tanıtıldı. Cihaz, günlük aktiviteyi gerçek zamanlı karbon içgörülerine dönüştürüyor.',
        'Cihaz, mevcut panel ve mobil uygulamalarla tam uyumlu çalışıyor.',
      ],
      en: [
        'The next-generation wearable launched with lower power draw and improved sensor accuracy, turning daily activity into real-time carbon insights.',
        'The device works seamlessly with the existing dashboard and mobile apps.',
      ],
    },
  },
];

// External coverage / mentions. `outlet` is the publication, `url` is left as
// a placeholder anchor for the demo.
export const COVERAGE = [
  { id: 'green-weekly', outlet: 'Green Weekly', date: '2026-05-21', quote: { tr: '“Sürdürülebilirliği ölçülebilir kılan ender platformlardan.”', en: '“One of the rare platforms that makes sustainability measurable.”' } },
  { id: 'tech-nordic', outlet: 'Tech Nordic', date: '2026-04-05', quote: { tr: '“Veri şeffaflığı sektöre örnek oluyor.”', en: '“Its data transparency sets an example for the sector.”' } },
  { id: 'climate-desk', outlet: 'Climate Desk', date: '2026-02-13', quote: { tr: '“Giyilebilir donanım ve AI’ı zarif biçimde birleştiriyor.”', en: '“Elegantly combines wearable hardware and AI.”' } },
];

// Brand fact sheet for the media kit. Static, bilingual where it helps.
export const BRAND_FACTS = [
  { id: 'name', label: { tr: 'Yasal ad', en: 'Legal name' }, value: { tr: 'Ecozyon Tech', en: 'Ecozyon Tech' } },
  { id: 'founded', label: { tr: 'Kuruluş', en: 'Founded' }, value: { tr: '2026', en: '2026' } },
  { id: 'hq', label: { tr: 'Merkez', en: 'Headquarters' }, value: { tr: 'İstanbul, Türkiye', en: 'İstanbul, Türkiye' } },
  { id: 'category', label: { tr: 'Kategori', en: 'Category' }, value: { tr: 'İklim teknolojisi · Giyilebilir · AI', en: 'Climate tech · Wearable · AI' } },
];

// Brand color palette for the media kit.
export const BRAND_COLORS = [
  { name: 'Cyan', hex: '#0EA5E9' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Slate 900', hex: '#0F172A' },
];

// A press release by slug, or undefined.
export const pressBySlug = (slug, all = PRESS_RELEASES) => all.find((p) => p.slug === slug);

// Most recent press release (the list is authored newest-first).
export const latestPress = (all = PRESS_RELEASES) => all[0];
