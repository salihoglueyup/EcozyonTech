// Bilingual insight posts. Data-driven so /blog and /blog/:slug share one source.
export const POSTS = [
  {
    slug: 'carbon-budget-basics',
    date: '2026-04-22',
    tag: { tr: 'Rehber', en: 'Guide' },
    title: {
      tr: 'Karbon bütçesi nedir ve neden kişiselleştirilmeli?',
      en: 'What is a carbon budget, and why personalize it?',
    },
    excerpt: {
      tr: 'Ortalama bir hedef herkese uymaz. Kişisel baseline neden 10x daha etkili?',
      en: 'An average target fits no one. Why a personal baseline is 10x more effective.',
    },
    body: {
      tr: [
        { h: 'Ortalama hedef neden yetersiz', id: 'why-average' },
        'Sürdürülebilirlik araçlarının çoğu tek bir "ortalama" hedef sunar. Oysa bir kişinin ulaşım, enerji ve beslenme profili bambaşkadır.',
        { h: 'Kişisel baseline yaklaşımı', id: 'personal-baseline' },
        'Ecozyon, ilk hafta verisinden kişisel bir baseline çıkarır ve önerileri buna göre kişiselleştirir. Sonuç: uygulanabilir, ölçülebilir alışkanlıklar.',
        'Bu yazıda baseline hesabının arkasındaki sezgiyi ve neden davranış değişiminin anahtarı olduğunu ele alıyoruz.',
      ],
      en: [
        { h: 'Why an average target falls short', id: 'why-average' },
        'Most sustainability tools hand you a single "average" target. But transport, energy and diet profiles differ wildly per person.',
        { h: 'The personal-baseline approach', id: 'personal-baseline' },
        'Ecozyon derives a personal baseline from week-one data and tailors suggestions to it. The result: actionable, measurable habits.',
        'This post covers the intuition behind the baseline and why it is the key to behavior change.',
      ],
    },
  },
  {
    slug: 'wearable-design-notes',
    date: '2026-03-30',
    tag: { tr: 'Donanım', en: 'Hardware' },
    title: {
      tr: 'Giyilebilir cihazı 0.4W altında tutmanın notları',
      en: 'Notes on keeping the wearable under 0.4W',
    },
    excerpt: {
      tr: 'Güneş mikro-hücresi, geri dönüştürülmüş kasa ve 5nm AI çipi tasarım kararları.',
      en: 'Design decisions: solar micro-cell, recycled housing, and a 5nm AI chip.',
    },
    body: {
      tr: [
        { h: 'Düşük güç tasarımı', id: 'low-power' },
        'Düşük güç, sürdürülebilir donanımın kalbidir. Sensör örnekleme hızını uyarlamalı yaparak ortalama tüketimi yarıya indirdik.',
        { h: 'Malzeme ve enerji', id: 'materials' },
        'Kasa %92 geri dönüştürülmüş alüminyum; güneş mikro-hücresi gün ışığında günlük tüketimin ~%38\'ini karşılıyor.',
      ],
      en: [
        { h: 'Low-power design', id: 'low-power' },
        'Low power is the heart of sustainable hardware. Adaptive sensor sampling halved average draw.',
        { h: 'Materials and energy', id: 'materials' },
        'The housing is 92% recycled aluminium; the solar micro-cell covers ~38% of daily consumption in daylight.',
      ],
    },
  },
  {
    slug: 'community-challenges',
    date: '2026-02-14',
    tag: { tr: 'Topluluk', en: 'Community' },
    title: {
      tr: 'Topluluk yarışmaları davranışı nasıl 3x hızlandırıyor?',
      en: 'How community challenges accelerate behavior 3x',
    },
    excerpt: {
      tr: 'Rozetler, liderlik tabloları ve haftalık temalar: oyunlaştırmanın ölçülen etkisi.',
      en: 'Badges, leaderboards and weekly themes: the measured effect of gamification.',
    },
    body: {
      tr: [
        { h: 'Topluluğun etkisi', id: 'community-effect' },
        'Bireysel öneriler işe yarar, ama topluluk etkisi onları kalıcı kılar. Pilotlarda haftalık yarışmalar tutunmayı 3 katına çıkardı.',
        { h: 'İşe yarayan formül', id: 'the-formula' },
        'Anahtar: küçük, ulaşılabilir hedefler + görünür ilerleme + akran kıyaslaması.',
      ],
      en: [
        { h: 'The community effect', id: 'community-effect' },
        'Individual nudges work, but community makes them stick. In pilots, weekly challenges tripled retention.',
        { h: 'The formula that works', id: 'the-formula' },
        'The key: small reachable goals + visible progress + peer comparison.',
      ],
    },
  },
];

export const postBySlug = (slug) => POSTS.find((p) => p.slug === slug);

// Adjacent posts in list order (POSTS is newest-first): prev = the newer
// neighbor, next = the older one. Either is null at the ends.
export function postNeighbors(slug, all = POSTS) {
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: all[i - 1] || null, next: all[i + 1] || null };
}

// Up to `n` posts most relevant to `post`: same tag first, then most recent.
// Deterministic (stable sort keys) so prerender/tests don't drift.
export function relatedPosts(post, all = POSTS, n = 2) {
  if (!post) return [];
  const others = all.filter((p) => p.slug !== post.slug);
  const sorted = [...others].sort((a, b) => {
    const at = a.tag.en === post.tag.en ? 0 : 1;
    const bt = b.tag.en === post.tag.en ? 0 : 1;
    if (at !== bt) return at - bt; // same-tag posts win
    return String(b.date || '').localeCompare(String(a.date || '')); // then recency
  });
  return sorted.slice(0, n);
}

// Distinct tags in first-appearance order. `id` is the English tag (a stable
// key that survives language switches); `label` carries both translations so
// the UI can render in the active language without losing the active filter.
export function postTags(posts = POSTS) {
  const seen = new Map();
  for (const p of posts) {
    if (!seen.has(p.tag.en)) seen.set(p.tag.en, { id: p.tag.en, label: p.tag });
  }
  return [...seen.values()];
}

// Filter by the stable tag id. A null/empty id means "all".
export function filterByTag(posts, tagId) {
  if (!tagId) return posts;
  return posts.filter((p) => p.tag.en === tagId);
}

// A body block is either a paragraph string or a heading `{ h, id }`.
// `id` is shared across languages so anchors/TOC stay stable on language switch.
export const blockText = (b) => (typeof b === 'string' ? b : b?.h || '');

// Case-insensitive substring search over a post's title, excerpt, tag and
// body in the active language. An empty/whitespace query returns the list
// unchanged so it composes cleanly with filterByTag (AND semantics).
export function searchPosts(posts, query, lang = 'tr') {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return posts;
  return posts.filter((p) => {
    const hay = [p.title?.[lang], p.excerpt?.[lang], p.tag?.[lang], ...(p.body?.[lang] || []).map(blockText)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

// Approximate reading time for a post body, in minutes (200 wpm baseline).
// Counts the active language only — TR and EN word counts are usually close.
export function readingTime(post, lang = 'tr') {
  const text = (post.body?.[lang] || []).map(blockText).join(' ');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}
