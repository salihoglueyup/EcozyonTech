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
        'Sürdürülebilirlik araçlarının çoğu tek bir "ortalama" hedef sunar. Oysa bir kişinin ulaşım, enerji ve beslenme profili bambaşkadır.',
        'Ecozyon, ilk hafta verisinden kişisel bir baseline çıkarır ve önerileri buna göre kişiselleştirir. Sonuç: uygulanabilir, ölçülebilir alışkanlıklar.',
        'Bu yazıda baseline hesabının arkasındaki sezgiyi ve neden davranış değişiminin anahtarı olduğunu ele alıyoruz.',
      ],
      en: [
        'Most sustainability tools hand you a single "average" target. But transport, energy and diet profiles differ wildly per person.',
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
        'Düşük güç, sürdürülebilir donanımın kalbidir. Sensör örnekleme hızını uyarlamalı yaparak ortalama tüketimi yarıya indirdik.',
        'Kasa %92 geri dönüştürülmüş alüminyum; güneş mikro-hücresi gün ışığında günlük tüketimin ~%38\'ini karşılıyor.',
      ],
      en: [
        'Low power is the heart of sustainable hardware. Adaptive sensor sampling halved average draw.',
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
        'Bireysel öneriler işe yarar, ama topluluk etkisi onları kalıcı kılar. Pilotlarda haftalık yarışmalar tutunmayı 3 katına çıkardı.',
        'Anahtar: küçük, ulaşılabilir hedefler + görünür ilerleme + akran kıyaslaması.',
      ],
      en: [
        'Individual nudges work, but community makes them stick. In pilots, weekly challenges tripled retention.',
        'The key: small reachable goals + visible progress + peer comparison.',
      ],
    },
  },
];

export const postBySlug = (slug) => POSTS.find((p) => p.slug === slug);
