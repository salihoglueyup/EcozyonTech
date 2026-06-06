// Bilingual open positions for the Careers page. Each job carries enough
// structured content (location, level, responsibilities, requirements) to
// render a real role detail. `id` doubles as the deep-link slug (?job=<id>).
//
// The pure query helpers below (jobTeams/filterByTeam/searchJobs/jobById)
// are the tested core; the page composes them the same way Blog composes
// postTags/filterByTag/searchPosts.
export const JOBS = [
  {
    id: 'senior-frontend',
    team: { tr: 'Ürün', en: 'Product' },
    type: { tr: 'Tam zamanlı · Uzaktan', en: 'Full-time · Remote' },
    location: { tr: 'Uzaktan (TR/EU)', en: 'Remote (TR/EU)' },
    level: { tr: 'Kıdemli', en: 'Senior' },
    title: { tr: 'Kıdemli Frontend Mühendisi', en: 'Senior Frontend Engineer' },
    desc: {
      tr: 'React/Vite ile ölçeklenebilir, erişilebilir arayüzler. Tasarım sistemine sahip çıkarsın.',
      en: 'Scalable, accessible UIs with React/Vite. You own the design system.',
    },
    responsibilities: {
      tr: [
        'Tasarım sistemini ve bileşen kütüphanesini büyüt',
        'Erişilebilirlik (WCAG AA) ve performans bütçelerini koru',
        'Ürün ekibiyle birlikte yeni akışları uçtan uca kur',
      ],
      en: [
        'Grow the design system and component library',
        'Uphold accessibility (WCAG AA) and performance budgets',
        'Build new flows end-to-end with the product team',
      ],
    },
    requirements: {
      tr: [
        '5+ yıl modern React deneyimi',
        'Güçlü CSS/Tailwind ve animasyon sezgisi',
        'Erişilebilirlik ve test kültürüne bağlılık',
      ],
      en: [
        '5+ years of modern React experience',
        'Strong CSS/Tailwind and animation sensibility',
        'Commitment to accessibility and a testing culture',
      ],
    },
  },
  {
    id: 'ml-engineer',
    team: { tr: 'AI', en: 'AI' },
    type: { tr: 'Tam zamanlı · İstanbul/Berlin', en: 'Full-time · Istanbul/Berlin' },
    location: { tr: 'İstanbul / Berlin', en: 'Istanbul / Berlin' },
    level: { tr: 'Orta–Kıdemli', en: 'Mid–Senior' },
    title: { tr: 'Makine Öğrenmesi Mühendisi', en: 'Machine Learning Engineer' },
    desc: {
      tr: 'Kişisel baseline ve öneri modellerini cihaz-üstü çalışacak şekilde tasarlarsın.',
      en: 'Design baseline & recommendation models to run on-device.',
    },
    responsibilities: {
      tr: [
        'Kişisel karbon baseline modellerini geliştir ve değerlendir',
        'Modelleri cihaz-üstü çalışacak şekilde küçült ve hızlandır',
        'Öneri kalitesini ölçen deney altyapısını kur',
      ],
      en: [
        'Develop and evaluate personal carbon baseline models',
        'Shrink and accelerate models to run on-device',
        'Build the experiment harness that measures nudge quality',
      ],
    },
    requirements: {
      tr: [
        'Python ve PyTorch/TF ile sağlam ML temeli',
        'Edge/quantization veya zaman serisi deneyimi artı',
        'Veriden ürün kararına köprü kurma yetisi',
      ],
      en: [
        'Solid ML foundation with Python and PyTorch/TF',
        'Edge/quantization or time-series experience a plus',
        'Ability to bridge from data to product decisions',
      ],
    },
  },
  {
    id: 'hardware-eng',
    team: { tr: 'Donanım', en: 'Hardware' },
    type: { tr: 'Tam zamanlı · İstanbul', en: 'Full-time · Istanbul' },
    location: { tr: 'İstanbul', en: 'Istanbul' },
    level: { tr: 'Kıdemli', en: 'Senior' },
    title: { tr: 'Gömülü Donanım Mühendisi', en: 'Embedded Hardware Engineer' },
    desc: {
      tr: 'Düşük güçlü giyilebilir platform; güç bütçesi 0.4W altında.',
      en: 'Low-power wearable platform; keep the power budget under 0.4W.',
    },
    responsibilities: {
      tr: [
        'Giyilebilir cihazın güç bütçesini 0.4W altında tut',
        'Sensör füzyonu ve firmware mimarisini şekillendir',
        'Üretim ve sertifikasyon süreçlerini yürüt',
      ],
      en: [
        'Keep the wearable power budget under 0.4W',
        'Shape sensor fusion and firmware architecture',
        'Drive manufacturing and certification processes',
      ],
    },
    requirements: {
      tr: [
        'Düşük güçlü gömülü sistemlerde C/C++ deneyimi',
        'PCB tasarımı ve donanım bring-up tecrübesi',
        'Pil/güç optimizasyonuna hâkimiyet',
      ],
      en: [
        'C/C++ experience on low-power embedded systems',
        'PCB design and hardware bring-up experience',
        'Command of battery/power optimization',
      ],
    },
  },
  {
    id: 'product-designer',
    team: { tr: 'Tasarım', en: 'Design' },
    type: { tr: 'Tam zamanlı · Uzaktan', en: 'Full-time · Remote' },
    location: { tr: 'Uzaktan (TR/EU)', en: 'Remote (TR/EU)' },
    level: { tr: 'Orta–Kıdemli', en: 'Mid–Senior' },
    title: { tr: 'Ürün Tasarımcısı', en: 'Product Designer' },
    desc: {
      tr: 'Davranış değişimini eğlenceli kılan akışlar; donanımdan mobile tutarlı bir dil.',
      en: 'Flows that make behavior change delightful; one language from hardware to mobile.',
    },
    responsibilities: {
      tr: [
        'Karbon alışkanlıklarını oyunlaştıran akışları tasarla',
        'Donanım, mobil ve web arasında tutarlı bir dil kur',
        'Araştırmadan prototipe hızlı döngüler çevir',
      ],
      en: [
        'Design flows that gamify carbon habits',
        'Build one consistent language across hardware, mobile and web',
        'Run fast loops from research to prototype',
      ],
    },
    requirements: {
      tr: [
        'Güçlü etkileşim ve görsel tasarım portföyü',
        'Figma ve tasarım sistemleriyle akıcılık',
        'Veriyle beslenen tasarım kararları alma',
      ],
      en: [
        'Strong interaction and visual design portfolio',
        'Fluency with Figma and design systems',
        'Making data-informed design decisions',
      ],
    },
  },
  {
    id: 'growth-lead',
    team: { tr: 'Büyüme', en: 'Growth' },
    type: { tr: 'Tam zamanlı · Uzaktan', en: 'Full-time · Remote' },
    location: { tr: 'Uzaktan (TR/EU)', en: 'Remote (TR/EU)' },
    level: { tr: 'Kıdemli', en: 'Senior' },
    title: { tr: 'Büyüme Lideri', en: 'Growth Lead' },
    desc: {
      tr: 'Bireysel ve kurumsal kanalları ölçülebilir biçimde büyütürsün; etki = metrik.',
      en: 'Grow individual and enterprise channels measurably; impact = metric.',
    },
    responsibilities: {
      tr: [
        'Bireysel ve kurumsal edinim kanallarını kur ve ölç',
        'Aktivasyon ve elde tutma deneylerini yürüt',
        'Etki hikâyesini sayılarla anlatan içerik üret',
      ],
      en: [
        'Build and measure individual and enterprise acquisition channels',
        'Run activation and retention experiments',
        'Produce content that tells the impact story with numbers',
      ],
    },
    requirements: {
      tr: [
        'Ürün-liderliğinde büyüme (PLG) deneyimi',
        'Analitik araçlar ve deney tasarımına hâkimiyet',
        'Hem TR hem EU pazarına aşinalık artı',
      ],
      en: [
        'Product-led growth (PLG) experience',
        'Command of analytics tooling and experiment design',
        'Familiarity with both TR and EU markets a plus',
      ],
    },
  },
];

// Unique teams in source order, each with a stable id (team.en) + bilingual
// label — mirrors postTags. Used for the filter chips.
export function jobTeams(jobs = JOBS) {
  const seen = new Map();
  for (const j of jobs) {
    if (!seen.has(j.team.en)) seen.set(j.team.en, { id: j.team.en, label: j.team });
  }
  return [...seen.values()];
}

// Filter by the stable team id. A null/empty id means "all".
export function filterByTeam(jobs, teamId) {
  if (!teamId) return jobs;
  return jobs.filter((j) => j.team.en === teamId);
}

// Case-insensitive substring search over a job's title, desc, team, level,
// location and type in the active language. An empty query returns the list
// unchanged so it composes with filterByTeam (AND semantics).
export function searchJobs(jobs, query, lang = 'tr') {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return jobs;
  return jobs.filter((j) => {
    const hay = [j.title?.[lang], j.desc?.[lang], j.team?.[lang], j.level?.[lang], j.location?.[lang], j.type?.[lang]]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

// Resolve a job by its id/slug (used by the ?job= deep link).
export const jobById = (id, all = JOBS) => all.find((j) => j.id === id);
