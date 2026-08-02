// Newsroom data — press releases, external coverage and a brand fact sheet.
// Static demo content, shaped like a real press kit. The pure helpers
// (pressBySlug / latestPress) are unit-tested.

// External coverage / mentions. `outlet` is the publication, `url` is left as
// a placeholder anchor for the demo.
export const COVERAGE = [
  { id: 'green-weekly', outlet: 'Green Weekly', date: '2026-05-21', quote: { tr: '“Kurumsal karbon yönetiminde yapay zeka ile çığır açıyorlar.”', en: '“Breaking new ground in enterprise carbon management with AI.”' } },
  { id: 'tech-nordic', outlet: 'Tech Nordic', date: '2026-04-05', quote: { tr: '“Bulut tabanlı API mimarisi sektöre örnek oluyor.”', en: '“Its cloud-based API architecture sets an example for the sector.”' } },
  { id: 'climate-desk', outlet: 'Climate Desk', date: '2026-02-13', quote: { tr: '“Büyük veri ve sürdürülebilirliği zarif biçimde birleştiriyor.”', en: '“Elegantly combines big data and sustainability.”' } },
];

// Brand fact sheet for the media kit. Static, bilingual where it helps.
export const BRAND_FACTS = [
  { id: 'name', label: { tr: 'Yasal ad', en: 'Legal name' }, value: { tr: 'Ecozyon Tech', en: 'Ecozyon Tech' } },
  { id: 'founded', label: { tr: 'Kuruluş', en: 'Founded' }, value: { tr: '2026', en: '2026' } },
  { id: 'hq', label: { tr: 'Merkez', en: 'Headquarters' }, value: { tr: 'İstanbul, Türkiye', en: 'İstanbul, Türkiye' } },
  { id: 'category', label: { tr: 'Kategori', en: 'Category' }, value: { tr: 'İklim teknolojisi · Bulut/API · AI', en: 'Climate tech · Cloud/API · AI' } },
];

// Brand color palette for the media kit.
export const BRAND_COLORS = [
  { name: 'Cyan', hex: '#0EA5E9' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Slate 900', hex: '#0F172A' },
];
