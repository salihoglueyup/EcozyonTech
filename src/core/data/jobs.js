// Bilingual open positions for the Careers page. Each job carries enough
// structured content (location, level, responsibilities, requirements) to
// render a real role detail. `id` doubles as the deep-link slug (?job=<id>).
//
// The pure query helpers below (jobTeams/filterByTeam/searchJobs/jobById)
// are the tested core; the page composes them the same way Blog composes
// postTags/filterByTag/searchPosts.
export const JOBS = [
  {
    id: 'senior-cloud-engineer',
    team: { tr: 'Bulut Mimarisi', en: 'Cloud Architecture' },
    type: { tr: 'Tam zamanlı · Uzaktan', en: 'Full-time · Remote' },
    location: { tr: 'Uzaktan (TR/EU)', en: 'Remote (TR/EU)' },
    level: { tr: 'Kıdemli', en: 'Senior' },
    title: { tr: 'Kıdemli Cloud & Backend Mühendisi', en: 'Senior Cloud & Backend Engineer' },
    desc: {
      tr: 'Büyük veri boru hatlarını ve API entegrasyonlarını ölçeklersin.',
      en: 'Scale massive data pipelines and enterprise API integrations.',
    },
    responsibilities: {
      tr: [
        'Kurumsal sistemlerle (ERP, bankacılık) API entegrasyonlarını kur',
        'Yüksek trafikli veri akışları için bulut mimarisini tasarla',
        'Sistem güvenliğini ve performansını optimize et',
      ],
      en: [
        'Build API integrations with enterprise systems (ERP, banking)',
        'Design cloud architecture for high-traffic data streams',
        'Optimize system security and performance',
      ],
    },
    requirements: {
      tr: [
        '5+ yıl Node.js / Python ve Bulut (AWS/GCP) deneyimi',
        'Mikroservisler ve veri tabanı optimizasyonunda uzmanlık',
        'Sıfırdan ölçeklenebilir sistem kurma kültürü',
      ],
      en: [
        '5+ years Node.js / Python and Cloud (AWS/GCP) experience',
        'Expertise in microservices and database optimization',
        'Culture of building scalable systems from scratch',
      ],
    },
  },
  {
    id: 'ml-ai-engineer',
    team: { tr: 'Yapay Zeka', en: 'AI' },
    type: { tr: 'Tam zamanlı · İstanbul/Berlin', en: 'Full-time · Istanbul/Berlin' },
    location: { tr: 'İstanbul / Berlin', en: 'Istanbul / Berlin' },
    level: { tr: 'Orta–Kıdemli', en: 'Mid–Senior' },
    title: { tr: 'AI & Makine Öğrenmesi Mühendisi', en: 'AI & Machine Learning Engineer' },
    desc: {
      tr: 'Karbon azaltma modellerini ve tahminsel analitik algoritmalarını kurarsın.',
      en: 'Build carbon reduction models and predictive analytics algorithms.',
    },
    responsibilities: {
      tr: [
        'Kurumsal karbon ayak izini tahminleyen modeller geliştir',
        'Veri entegrasyonlarından anlamlı içgörüler çıkaran AI akışları tasarla',
        'LLM entegrasyonları ile otonom raporlama araçları oluştur',
      ],
      en: [
        'Develop models that predict enterprise carbon footprints',
        'Design AI flows to extract insights from data integrations',
        'Build autonomous reporting tools using LLM integrations',
      ],
    },
    requirements: {
      tr: [
        'Python, PyTorch/TensorFlow ile sağlam ML temeli',
        'Büyük dil modelleri (LLM) ve RAG mimarilerinde deneyim',
        'Ham veriyi ürün kararına dönüştürme yetisi',
      ],
      en: [
        'Solid ML foundation with Python, PyTorch/TensorFlow',
        'Experience with Large Language Models (LLM) and RAG architectures',
        'Ability to turn raw data into product decisions',
      ],
    },
  },
  {
    id: 'growth-ai-pm',
    team: { tr: 'Ürün', en: 'Product' },
    type: { tr: 'Tam zamanlı · İstanbul', en: 'Full-time · Istanbul' },
    location: { tr: 'İstanbul', en: 'Istanbul' },
    level: { tr: 'Kıdemli', en: 'Senior' },
    title: { tr: 'Growth & AI Ürün Yöneticisi', en: 'Growth & AI Product Manager' },
    desc: {
      tr: 'B2B kurumsal müşteriler için AI tabanlı sürdürülebilirlik ürünlerini yönetirsin.',
      en: 'Manage AI-driven sustainability products for B2B enterprise clients.',
    },
    responsibilities: {
      tr: [
        'B2B kurumsal müşterilerin ürün entegrasyon süreçlerini yönet',
        'AI özelliklerinin yol haritasını planla ve önceliklendir',
        'Satış, pazarlama ve mühendislik ekipleri arasında köprü kur',
      ],
      en: [
        'Manage product integration processes for B2B enterprise clients',
        'Plan and prioritize the roadmap for AI features',
        'Bridge the gap between sales, marketing, and engineering teams',
      ],
    },
    requirements: {
      tr: [
        'B2B SaaS veya veri/AI ürünlerinde ürün yönetimi deneyimi',
        'Kurumsal satış döngülerine aşinalık',
        'Teknik ekiplerle veriye dayalı strateji kurma becerisi',
      ],
      en: [
        'Product management experience in B2B SaaS or data/AI products',
        'Familiarity with enterprise sales cycles',
        'Ability to build data-driven strategies with technical teams',
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

export function mergeJobs(remote = [], statics = JOBS) {
  const merged = [...remote];
  const seen = new Set(merged.map((j) => j.id || j.slug));
  for (const j of statics) {
    if (!seen.has(j.id) && !seen.has(j.slug)) merged.push(j);
  }
  return merged;
}

