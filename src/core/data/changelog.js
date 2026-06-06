// Product changelog — newest release first. Each release has a semantic
// version, an ISO date, a bilingual title and a list of changes; each change
// is typed (feature | improvement | fix) so the timeline can color-code it.
//
// TYPE_META carries the bilingual label + accent for each type. The pure
// helpers (typeMeta / latestRelease) are unit-tested.
export const TYPE_META = {
  feature: { label: { tr: 'Yeni', en: 'New' }, accent: '#10B981' },
  improvement: { label: { tr: 'İyileştirme', en: 'Improved' }, accent: '#0EA5E9' },
  fix: { label: { tr: 'Düzeltme', en: 'Fixed' }, accent: '#F59E0B' },
};

export const CHANGELOG = [
  {
    version: '1.4.0',
    date: '2026-06-01',
    title: { tr: 'Vaka çalışmaları & yardım merkezi', en: 'Case studies & help center' },
    changes: [
      { type: 'feature', text: { tr: 'Vaka çalışmaları sayfası ve etki haritası köprüsü', en: 'Case studies pages with an impact-map bridge' } },
      { type: 'feature', text: { tr: 'Aranabilir, kategorili yardım merkezi', en: 'Searchable, categorized help center' } },
      { type: 'improvement', text: { tr: 'Ana sayfa landing deneyimi olarak yeniden tasarlandı', en: 'Home redesigned as a full landing experience' } },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-05-15',
    title: { tr: 'Fiyatlandırma & kariyer', en: 'Pricing & careers' },
    changes: [
      { type: 'feature', text: { tr: 'Aylık/yıllık faturalama ve plan karşılaştırma tablosu', en: 'Monthly/annual billing and a plan comparison table' } },
      { type: 'feature', text: { tr: 'Kariyer filtreleme, arama ve paylaşılabilir ilanlar', en: 'Careers filtering, search and shareable roles' } },
      { type: 'improvement', text: { tr: 'Komut paletine (⌘K) açık pozisyonlar eklendi', en: 'Open roles added to the command palette (⌘K)' } },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-04-20',
    title: { tr: 'Blog & hesaplayıcı deneyimi', en: 'Blog & calculator experience' },
    changes: [
      { type: 'feature', text: { tr: 'Yazı kaydetme, okuma geçmişi ve içindekiler', en: 'Save posts, reading history and a table of contents' } },
      { type: 'feature', text: { tr: 'Karbon hesaplayıcı kalıcılığı ve paylaşılabilir linkler', en: 'Carbon calculator persistence and shareable links' } },
      { type: 'fix', text: { tr: 'Koyu modda yüzey ve kontrast hataları giderildi', en: 'Dark-mode surface and contrast bugs resolved' } },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-03-10',
    title: { tr: 'Etkileşim katmanı', en: 'Interaction layer' },
    changes: [
      { type: 'feature', text: { tr: 'Site geneli komut paleti (⌘K)', en: 'Site-wide command palette (⌘K)' } },
      { type: 'feature', text: { tr: 'Sekmeler, ipuçları ve scroll-spy bölüm navigasyonu', en: 'Tabs, tooltips and scroll-spy section navigation' } },
      { type: 'improvement', text: { tr: 'Kaydırma ile beliren animasyonlar', en: 'Scroll-reveal animations' } },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-02-01',
    title: { tr: 'İlk yayın', en: 'Initial release' },
    changes: [
      { type: 'feature', text: { tr: '3D etki haritası ve dünya globe', en: '3D impact map and world globe' } },
      { type: 'feature', text: { tr: 'Çok dilli (TR/EN) ve SEO prerender altyapısı', en: 'Bilingual (TR/EN) with SEO prerendering' } },
      { type: 'feature', text: { tr: 'Sunucusuz formlar (iletişim, başvuru, bülten)', en: 'Serverless forms (contact, apply, newsletter)' } },
    ],
  },
];

// Bilingual label + accent for a change type (falls back to a neutral entry).
export const typeMeta = (type) => TYPE_META[type] || { label: { tr: type, en: type }, accent: '#94A3B8' };

// Most recent release (the list is authored newest-first).
export const latestRelease = (all = CHANGELOG) => all[0];
