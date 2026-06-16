// Glossary / knowledge base — bilingual sustainability + wearable-tech terms.
// Shaped like the help data (id + category + bilingual fields) so it can be
// searched, filtered, deep-linked and indexed by the global search engine.
// Pure helpers are unit-tested.

export const GLOSSARY = [
  { id: 'co2e', term: { tr: 'CO₂e (CO₂ eşdeğeri)', en: 'CO₂e (CO₂ equivalent)' }, category: { tr: 'Karbon', en: 'Carbon' }, definition: { tr: 'Farklı sera gazlarının iklim etkisini tek bir ortak birimde — karbondioksit eşdeğeri olarak — ifade eden ölçü.', en: 'A unit expressing the climate impact of different greenhouse gases in one common measure: carbon-dioxide equivalent.' } },
  { id: 'carbon-footprint', term: { tr: 'Karbon ayak izi', en: 'Carbon footprint' }, category: { tr: 'Karbon', en: 'Carbon' }, definition: { tr: 'Bir birey, ürün veya kurumun faaliyetlerinden kaynaklanan toplam sera gazı salımı.', en: 'The total greenhouse-gas emissions caused by the activities of a person, product or organization.' } },
  { id: 'baseline', term: { tr: 'Baseline (Temel çizgi)', en: 'Baseline' }, category: { tr: 'Ölçüm', en: 'Measurement' }, definition: { tr: 'Değişimi ölçmek için referans alınan başlangıç durumu. Ecozyon, ilk hafta verisinden kişisel bir baseline çıkarır.', en: 'The starting point used as a reference to measure change. Ecozyon derives a personal baseline from your first week of data.' } },
  { id: 'carbon-budget', term: { tr: 'Karbon bütçesi', en: 'Carbon budget' }, category: { tr: 'Karbon', en: 'Carbon' }, definition: { tr: 'Belirli bir sıcaklık hedefi içinde kalmak için salınabilecek toplam karbon miktarı; kişisel ölçekte bir hedef olarak da kullanılır.', en: 'The total carbon that can be emitted while staying within a given temperature target; also used as a personal-scale goal.' } },
  { id: 'net-zero', term: { tr: 'Net sıfır', en: 'Net zero' }, category: { tr: 'Politika', en: 'Policy' }, definition: { tr: 'Atmosfere salınan sera gazlarının, uzaklaştırılan miktarla dengelenerek net etkinin sıfıra indirilmesi.', en: 'Balancing the greenhouse gases released into the atmosphere with an equivalent amount removed, bringing the net effect to zero.' } },
  { id: 'offset', term: { tr: 'Karbon dengeleme (offset)', en: 'Carbon offset' }, category: { tr: 'Politika', en: 'Policy' }, definition: { tr: 'Başka bir yerdeki salım azaltımı veya uzaklaştırma yoluyla kendi salımını telafi etme. Önce azalt, kalanı dengele ilkesi esastır.', en: 'Compensating for your emissions by funding reductions or removals elsewhere. The principle is reduce first, offset the remainder.' } },
  { id: 'scope-1', term: { tr: 'Scope 1', en: 'Scope 1' }, category: { tr: 'Ölçüm', en: 'Measurement' }, definition: { tr: 'Bir kurumun doğrudan kontrol ettiği kaynaklardan (ör. şirket araçları, kazanlar) çıkan salımlar.', en: 'Direct emissions from sources an organization owns or controls (e.g. company vehicles, boilers).' } },
  { id: 'scope-2', term: { tr: 'Scope 2', en: 'Scope 2' }, category: { tr: 'Ölçüm', en: 'Measurement' }, definition: { tr: 'Satın alınan elektrik, ısıtma veya soğutmanın üretiminden kaynaklanan dolaylı salımlar.', en: 'Indirect emissions from the generation of purchased electricity, heating or cooling.' } },
  { id: 'scope-3', term: { tr: 'Scope 3', en: 'Scope 3' }, category: { tr: 'Ölçüm', en: 'Measurement' }, definition: { tr: 'Değer zincirindeki diğer tüm dolaylı salımlar (tedarik, çalışan ulaşımı, ürün kullanımı). Genelde en büyük paydır.', en: 'All other indirect emissions across the value chain (supply, employee commuting, product use). Usually the largest share.' } },
  { id: 'ghg-protocol', term: { tr: 'GHG Protocol', en: 'GHG Protocol' }, category: { tr: 'Politika', en: 'Policy' }, definition: { tr: 'Sera gazı salımlarını ölçmek ve raporlamak için en yaygın kullanılan uluslararası standart.', en: 'The most widely used international standard for measuring and reporting greenhouse-gas emissions.' } },
  { id: 'carbon-intensity', term: { tr: 'Karbon yoğunluğu', en: 'Carbon intensity' }, category: { tr: 'Ölçüm', en: 'Measurement' }, definition: { tr: 'Birim çıktı veya enerji başına salınan karbon miktarı; ör. kWh elektrik başına gram CO₂.', en: 'The amount of carbon emitted per unit of output or energy; e.g. grams of CO₂ per kWh of electricity.' } },
  { id: 'renewable', term: { tr: 'Yenilenebilir enerji', en: 'Renewable energy' }, category: { tr: 'Teknoloji', en: 'Technology' }, definition: { tr: 'Güneş, rüzgâr, su gibi doğal olarak yenilenen kaynaklardan üretilen, düşük karbonlu enerji.', en: 'Low-carbon energy produced from naturally replenished sources such as sun, wind and water.' } },
  { id: 'embodied-carbon', term: { tr: 'Gömülü karbon', en: 'Embodied carbon' }, category: { tr: 'Karbon', en: 'Carbon' }, definition: { tr: 'Bir ürün veya cihazın üretim, taşıma ve bertaraf süreçlerinde ortaya çıkan, kullanım dışı salımlar.', en: 'The non-use-phase emissions from manufacturing, transporting and disposing of a product or device.' } },
  { id: 'met', term: { tr: 'MET (Metabolik eşdeğer)', en: 'MET (Metabolic equivalent)' }, category: { tr: 'Teknoloji', en: 'Technology' }, definition: { tr: 'Fiziksel aktivitenin enerji harcamasını ölçen birim; giyilebilir cihazlar aktiviteyi MET üzerinden tahmin eder.', en: 'A unit measuring the energy cost of physical activity; wearables estimate activity using METs.' } },
  { id: 'wearable', term: { tr: 'Giyilebilir cihaz', en: 'Wearable' }, category: { tr: 'Teknoloji', en: 'Technology' }, definition: { tr: 'Vücutta taşınan, sensörlerle aktivite ve sağlık verisi toplayan cihaz. Ecozyon bu veriyi karbon içgörüsüne çevirir.', en: 'A body-worn device that collects activity and health data via sensors. Ecozyon turns this data into carbon insight.' } },
  { id: 'on-device', term: { tr: 'Cihaz-içi işleme', en: 'On-device processing' }, category: { tr: 'Teknoloji', en: 'Technology' }, definition: { tr: 'Verinin buluta gönderilmeden doğrudan cihazda işlenmesi; gizliliği artırır ve gecikmeyi azaltır.', en: 'Processing data directly on the device instead of sending it to the cloud; improves privacy and reduces latency.' } },
];

// Categories present, each with a stable id (category.en) + bilingual label, in
// first-appearance order — mirrors helpCategories.
export function glossaryCategories(terms = GLOSSARY) {
  const seen = new Map();
  for (const t of terms) {
    if (!seen.has(t.category.en)) seen.set(t.category.en, { id: t.category.en, label: t.category });
  }
  return [...seen.values()];
}

// Filter by category id (category.en); null/undefined returns all.
export const filterByCategory = (terms, categoryId) =>
  categoryId ? terms.filter((t) => t.category.en === categoryId) : terms;

// Substring search across the term + definition for a language. Empty query
// returns the list unchanged (AND-composes with the category filter).
export function searchGlossary(terms, query, lang = 'tr') {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return terms;
  return terms.filter((t) => `${t.term[lang]} ${t.definition[lang]}`.toLowerCase().includes(q));
}

// A term by id, or undefined.
export const termById = (id, terms = GLOSSARY) => terms.find((t) => t.id === id);

// Resolve an ordered list of term ids to glossary entries, dropping unknown
// ids. Used to render a post's curated "related glossary terms".
export const glossaryByIds = (ids = [], terms = GLOSSARY) =>
  ids.map((id) => termById(id, terms)).filter(Boolean);
