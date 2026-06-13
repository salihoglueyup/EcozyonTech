// "Why Ecozyon" comparison matrix — Ecozyon vs the common alternatives. Shaped
// like the pricing COMPARE table: each row's `values` align to COLUMNS order,
// and a cell is true (✓), false (—) or a bilingual string. Some rows link to a
// glossary term via `term`. Pure helper is unit-tested.

// Columns, in display order. The last one (ecozyon) is the highlighted column.
export const COLUMNS = [
  { id: 'spreadsheet', label: { tr: 'Excel / tablo', en: 'Spreadsheet' } },
  { id: 'generic', label: { tr: 'Genel uygulama', en: 'Generic app' } },
  { id: 'ecozyon', label: { tr: 'Ecozyon', en: 'Ecozyon' }, featured: true },
];

const P = (tr, en) => ({ tr, en }); // partial-support cell helper

export const ROWS = [
  { feature: { tr: 'Otomatik takip', en: 'Automatic tracking' }, values: [false, true, true] },
  { feature: { tr: 'Giyilebilir cihaz senkronu', en: 'Wearable sync' }, values: [false, P('Sınırlı', 'Limited'), true] },
  { feature: { tr: 'Kişisel baseline', en: 'Personal baseline' }, values: [false, false, true], term: 'baseline' },
  { feature: { tr: 'AI önerileri', en: 'AI recommendations' }, values: [false, false, true] },
  { feature: { tr: 'Gerçek zamanlı CO₂', en: 'Real-time CO₂' }, values: [false, false, true], term: 'co2e' },
  { feature: { tr: 'Scope 1-2-3 raporlama', en: 'Scope 1-2-3 reporting' }, values: [false, false, true], term: 'scope-3' },
  { feature: { tr: 'Takım liderlik tablosu', en: 'Team leaderboard' }, values: [false, P('Bazı', 'Some'), true] },
  { feature: { tr: 'Veri şeffaflığı', en: 'Data transparency' }, values: [P('Manuel', 'Manual'), false, true] },
  { feature: { tr: 'Cihaz-içi gizlilik', en: 'On-device privacy' }, values: [true, false, true], term: 'on-device' },
  { feature: { tr: 'Entegrasyonlar', en: 'Integrations' }, values: [false, P('Az', 'Few'), true] },
  { feature: { tr: 'Kurumsal destek & SLA', en: 'Enterprise support & SLA' }, values: [false, false, true] },
];

// Count of "supported" cells (true or a partial string, i.e. not false) per
// column — drives the at-a-glance coverage summary. Returns one number per
// COLUMNS entry, in order.
export function coverageByColumn(rows = ROWS, columns = COLUMNS) {
  return columns.map((_, col) => rows.filter((r) => r.values[col] !== false).length);
}
