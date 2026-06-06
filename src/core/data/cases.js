// Case studies — one per partner city (CITIES where partner: true), so the
// impact map and the /cases section bridge cleanly both ways. Fictional but
// internally consistent with the city dataset (users/co2 figures echo it).
//
// `city` matches a CITIES `name` exactly; `caseByCity` powers the impact-map
// link. The pure helpers below are the tested core — pages stay declarative.
export const CASES = [
  {
    slug: 'istanbul-metropolitan',
    city: 'İstanbul',
    accent: '#0EA5E9',
    year: 2024,
    client: { tr: 'İstanbul Büyükşehir pilotu', en: 'Istanbul Metropolitan pilot' },
    sector: { tr: 'Kamu · Belediye', en: 'Public · Municipality' },
    summary: {
      tr: '1.840 çalışana giyilebilir karbon koçu; ilk yılda günde 412 kg CO₂ tasarrufu.',
      en: '1,840 staff on a wearable carbon coach; 412 kg CO₂ saved per day in year one.',
    },
    challenge: {
      tr: [
        'Belediye, sürdürülebilirlik hedeflerini personel davranışına indirgemekte zorlanıyordu — raporlar yıllıktı, geri bildirim yoktu.',
        'Hedef: ölçülebilir, gönüllü ve günlük hayata sızan bir program; ceza değil, oyunlaştırma.',
      ],
      en: [
        'The municipality struggled to translate sustainability targets into staff behavior — reporting was annual, feedback non-existent.',
        'The goal: a measurable, voluntary program woven into daily life — gamified, not punitive.',
      ],
    },
    approach: {
      tr: [
        'Ecozyon giyilebilir cihazı ve kişisel baseline modeli 1.840 gönüllüye dağıtıldı; öneriler cihaz üstünde, gizlilik öncelikli çalıştı.',
        'Departman bazlı liderlik tablosu ve aylık ESG özeti yönetici paneline bağlandı.',
      ],
      en: [
        'The Ecozyon wearable and a personal baseline model rolled out to 1,840 volunteers; suggestions ran on-device, privacy-first.',
        'A department leaderboard and a monthly ESG digest were wired into the admin dashboard.',
      ],
    },
    results: [
      { value: '412', unit: { tr: 'kg/gün', en: 'kg/day' }, label: { tr: 'CO₂ tasarrufu', en: 'CO₂ saved' } },
      { value: '1.840', unit: { tr: 'kişi', en: 'people' }, label: { tr: 'Aktif kullanıcı', en: 'Active users' } },
      { value: '%38', unit: { tr: '', en: '' }, label: { tr: 'Güneş katkısı', en: 'Solar share' } },
    ],
    quote: {
      text: {
        tr: 'İlk kez sürdürülebilirlik bir slayt değil, ekibin günlük oyunu oldu.',
        en: 'For the first time sustainability became the team’s daily game, not a slide.',
      },
      author: 'Elif Demir',
      role: { tr: 'Sürdürülebilirlik Direktörü', en: 'Director of Sustainability' },
    },
  },
  {
    slug: 'berlin-mobility',
    city: 'Berlin',
    accent: '#10B981',
    year: 2024,
    client: { tr: 'Berlin mobilite ittifakı', en: 'Berlin mobility alliance' },
    sector: { tr: 'Ulaşım · Kurumsal', en: 'Mobility · Corporate' },
    summary: {
      tr: '412 çalışanlık ittifak; işe gidiş-gelişte araç km’sini gözle görülür düşürdü.',
      en: 'A 412-person alliance that visibly cut commuting car-km.',
    },
    challenge: {
      tr: [
        'Birden çok şirketin paylaştığı kampüste ulaşım kaynaklı emisyon en büyük kalemdi ama kimse sahiplenmiyordu.',
        'İhtiyaç: şirketler arası, adil ve karşılaştırılabilir bir ölçüm.',
      ],
      en: [
        'On a shared multi-company campus, commute emissions were the biggest line item but no one owned them.',
        'The need: a cross-company, fair and comparable measurement.',
      ],
    },
    approach: {
      tr: [
        'Ortak bir liderlik tablosu kuruldu; her şirket kendi baseline’ına göre yarıştı, mutlak sayıya göre değil.',
        'Haftalık öneriler toplu taşıma ve bisiklet rotalarıyla entegre edildi.',
      ],
      en: [
        'A shared leaderboard let each company compete against its own baseline, not absolute numbers.',
        'Weekly suggestions integrated public-transit and cycling routes.',
      ],
    },
    results: [
      { value: '96', unit: { tr: 'kg/gün', en: 'kg/day' }, label: { tr: 'CO₂ tasarrufu', en: 'CO₂ saved' } },
      { value: '%27', unit: { tr: '', en: '' }, label: { tr: 'Araç km düşüşü', en: 'Car-km drop' } },
      { value: '412', unit: { tr: 'kişi', en: 'people' }, label: { tr: 'Aktif kullanıcı', en: 'Active users' } },
    ],
    quote: {
      text: {
        tr: 'Rekabeti adil kıldığımız an katılım kendiliğinden geldi.',
        en: 'The moment we made the competition fair, participation took care of itself.',
      },
      author: 'Jonas Weber',
      role: { tr: 'Operasyon Lideri', en: 'Head of Operations' },
    },
  },
  {
    slug: 'copenhagen-districts',
    city: 'Copenhagen',
    accent: '#0EA5E9',
    year: 2024,
    client: { tr: 'Kopenhag mahalle programı', en: 'Copenhagen districts program' },
    sector: { tr: 'Kamu · Topluluk', en: 'Public · Community' },
    summary: {
      tr: 'Mahalleler arası topluluk yarışmasıyla davranış değişimi kalıcı hâle geldi.',
      en: 'Inter-district community challenges made behavior change stick.',
    },
    challenge: {
      tr: [
        'Şehir zaten düşük emisyonluydu; asıl zorluk son yüzdeleri kalıcı alışkanlığa çevirmekti.',
        'Bireysel motivasyon birkaç hafta sonra düşüyordu.',
      ],
      en: [
        'The city was already low-emission; the real challenge was turning the last few percent into lasting habit.',
        'Individual motivation dropped off after a few weeks.',
      ],
    },
    approach: {
      tr: [
        'Topluluk yarışmaları mahalle kimliğine bağlandı; bireysel hedef yerine ortak hedef konuldu.',
        'Sezonluk turnuvalar ve yerel ödüllerle süreklilik sağlandı.',
      ],
      en: [
        'Community challenges were tied to district identity — a shared goal instead of an individual one.',
        'Seasonal tournaments and local rewards sustained momentum.',
      ],
    },
    results: [
      { value: '42', unit: { tr: 'kg/gün', en: 'kg/day' }, label: { tr: 'CO₂ tasarrufu', en: 'CO₂ saved' } },
      { value: '178', unit: { tr: 'kişi', en: 'people' }, label: { tr: 'Aktif kullanıcı', en: 'Active users' } },
      { value: '12', unit: { tr: 'hafta', en: 'weeks' }, label: { tr: 'Ortalama süreklilik', en: 'Avg. retention' } },
    ],
    quote: {
      text: {
        tr: 'Mahalleler birbirine meydan okuyunca alışkanlık komşuluk kültürüne döndü.',
        en: 'Once districts challenged each other, the habit turned into neighborhood culture.',
      },
      author: 'Sofie Jensen',
      role: { tr: 'Topluluk Koordinatörü', en: 'Community Coordinator' },
    },
  },
  {
    slug: 'new-york-towers',
    city: 'New York',
    accent: '#7C3AED',
    year: 2024,
    client: { tr: 'New York kuleleri konsorsiyumu', en: 'New York towers consortium' },
    sector: { tr: 'Gayrimenkul · Kurumsal', en: 'Real estate · Corporate' },
    summary: {
      tr: '548 kullanıcılık konsorsiyum; bina enerjisi ve ulaşımı tek panelde topladı.',
      en: 'A 548-user consortium unified building energy and commute on one dashboard.',
    },
    challenge: {
      tr: [
        'Çok kiracılı kulelerde Scope 1-2-3 raporlaması dağınıktı; her kiracı ayrı sistem kullanıyordu.',
        'Yatırımcılar tek, denetlenebilir bir ESG anlatısı istiyordu.',
      ],
      en: [
        'In multi-tenant towers, Scope 1-2-3 reporting was fragmented; each tenant used a different system.',
        'Investors wanted one auditable ESG narrative.',
      ],
    },
    approach: {
      tr: [
        'Kurumsal plan SSO/SCIM ile bağlandı; kiracılar tek panelde, veri sahipliği korunarak birleşti.',
        'GHG/GRI uyumlu aylık raporlar otomatik üretildi.',
      ],
      en: [
        'The enterprise plan connected via SSO/SCIM; tenants unified on one dashboard with data ownership preserved.',
        'GHG/GRI-aligned monthly reports were generated automatically.',
      ],
    },
    results: [
      { value: '121', unit: { tr: 'kg/gün', en: 'kg/day' }, label: { tr: 'CO₂ tasarrufu', en: 'CO₂ saved' } },
      { value: '548', unit: { tr: 'kişi', en: 'people' }, label: { tr: 'Aktif kullanıcı', en: 'Active users' } },
      { value: '1', unit: { tr: 'panel', en: 'dashboard' }, label: { tr: 'Birleşik ESG raporu', en: 'Unified ESG report' } },
    ],
    quote: {
      text: {
        tr: 'İlk kez tüm kiracılar aynı tabloya bakıp aynı dili konuştu.',
        en: 'For the first time every tenant looked at the same dashboard and spoke the same language.',
      },
      author: 'Maria Santos',
      role: { tr: 'ESG Yöneticisi', en: 'ESG Manager' },
    },
  },
  {
    slug: 'dubai-campus',
    city: 'Dubai',
    accent: '#F59E0B',
    year: 2024,
    client: { tr: 'Dubai güneş kampüsü', en: 'Dubai solar campus' },
    sector: { tr: 'Enerji · Kurumsal', en: 'Energy · Corporate' },
    summary: {
      tr: 'Yüksek güneş potansiyelini bireysel tüketim kararlarına bağladı.',
      en: 'Connected high solar potential to individual consumption decisions.',
    },
    challenge: {
      tr: [
        'Kampüs bol güneş üretiyordu ama tüketim zirveleri üretimle örtüşmüyordu.',
        'Çalışanların ne zaman enerji kullandığı görünmezdi.',
      ],
      en: [
        'The campus produced abundant solar, but consumption peaks didn’t line up with generation.',
        'When employees used energy was invisible.',
      ],
    },
    approach: {
      tr: [
        'Öneriler güneş üretim eğrisine göre zamanlandı; yüksek üretim saatlerine kaydırma teşvik edildi.',
        'Kişisel baseline, iklimlendirme alışkanlıklarını da kapsayacak şekilde genişletildi.',
      ],
      en: [
        'Suggestions were timed to the solar generation curve, nudging load into high-output hours.',
        'The personal baseline expanded to cover cooling habits.',
      ],
    },
    results: [
      { value: '68', unit: { tr: 'kg/gün', en: 'kg/day' }, label: { tr: 'CO₂ tasarrufu', en: 'CO₂ saved' } },
      { value: '%47', unit: { tr: '', en: '' }, label: { tr: 'Güneş katkısı', en: 'Solar share' } },
      { value: '308', unit: { tr: 'kişi', en: 'people' }, label: { tr: 'Aktif kullanıcı', en: 'Active users' } },
    ],
    quote: {
      text: {
        tr: 'Tüketimi güneşe göre kaydırmak, yeni panel kurmaktan daha hızlı kazanç getirdi.',
        en: 'Shifting load to the sun paid off faster than installing new panels.',
      },
      author: 'Omar Al-Farsi',
      role: { tr: 'Tesis Müdürü', en: 'Facilities Manager' },
    },
  },
  {
    slug: 'singapore-grid',
    city: 'Singapore',
    accent: '#10B981',
    year: 2024,
    client: { tr: 'Singapur akıllı şebeke pilotu', en: 'Singapore smart-grid pilot' },
    sector: { tr: 'Enerji · Kamu-özel', en: 'Energy · Public-private' },
    summary: {
      tr: 'Yoğun kentte cihaz-üstü öneriyle şebeke yükünü dengeledi.',
      en: 'Balanced grid load in a dense city with on-device suggestions.',
    },
    challenge: {
      tr: [
        'Yoğun nüfuslu adada talep zirveleri şebekeyi zorluyordu; merkezi kontrol gizlilik endişesi yaratıyordu.',
        'Çözüm bireysel veriyi merkeze taşımadan çalışmalıydı.',
      ],
      en: [
        'On a dense island, demand peaks strained the grid; central control raised privacy concerns.',
        'The solution had to work without moving individual data to a center.',
      ],
    },
    approach: {
      tr: [
        'Öneri modelleri tamamen cihaz üstünde çalıştı; yalnızca toplulaştırılmış sinyaller paylaşıldı.',
        'Zirve saat uyarıları kişisel baseline’a göre kişiselleştirildi.',
      ],
      en: [
        'Recommendation models ran fully on-device; only aggregated signals were shared.',
        'Peak-hour nudges were personalized against the individual baseline.',
      ],
    },
    results: [
      { value: '72', unit: { tr: 'kg/gün', en: 'kg/day' }, label: { tr: 'CO₂ tasarrufu', en: 'CO₂ saved' } },
      { value: '308', unit: { tr: 'kişi', en: 'people' }, label: { tr: 'Aktif kullanıcı', en: 'Active users' } },
      { value: '0', unit: { tr: 'kayıt', en: 'records' }, label: { tr: 'Merkeze taşınan kişisel veri', en: 'Personal data centralized' } },
    ],
    quote: {
      text: {
        tr: 'Gizliliği bozmadan şebekeyi dengelemek mümkünmüş — kanıtladık.',
        en: 'Balancing the grid without breaking privacy is possible — we proved it.',
      },
      author: 'Wei Lin',
      role: { tr: 'Şebeke Stratejisi Lideri', en: 'Grid Strategy Lead' },
    },
  },
  {
    slug: 'zurich-finance',
    city: 'Zurich',
    accent: '#0EA5E9',
    year: 2024,
    client: { tr: 'Zürih finans bölgesi', en: 'Zurich finance district' },
    sector: { tr: 'Finans · Kurumsal', en: 'Finance · Corporate' },
    summary: {
      tr: 'Denetlenebilir ESG verisini çalışan katılımıyla birleştirdi.',
      en: 'Married auditable ESG data with employee engagement.',
    },
    challenge: {
      tr: [
        'Finans kurumları için ESG raporu denetimden geçmek zorundaydı; tahmini sayılar kabul edilmiyordu.',
        'Aynı zamanda çalışan katılımı düşük kalmamalıydı.',
      ],
      en: [
        'For financial institutions, ESG reports had to survive audit; estimated figures weren’t accepted.',
        'At the same time, employee engagement couldn’t stay low.',
      ],
    },
    approach: {
      tr: [
        'Ölçüm metodolojisi denetim izine açıldı; her metriğin kaynağı izlenebilir kılındı.',
        'Katılım, gönüllü liderlik tablosu ve şeffaf hedeflerle yüksek tutuldu.',
      ],
      en: [
        'The measurement methodology was opened to an audit trail; every metric’s source became traceable.',
        'Engagement stayed high through a voluntary leaderboard and transparent targets.',
      ],
    },
    results: [
      { value: '54', unit: { tr: 'kg/gün', en: 'kg/day' }, label: { tr: 'CO₂ tasarrufu', en: 'CO₂ saved' } },
      { value: '100%', unit: { tr: '', en: '' }, label: { tr: 'Denetlenebilir metrik', en: 'Auditable metrics' } },
      { value: '146', unit: { tr: 'kişi', en: 'people' }, label: { tr: 'Aktif kullanıcı', en: 'Active users' } },
    ],
    quote: {
      text: {
        tr: 'Denetçi “bu sayı nereden geliyor?” diye sorduğunda cevabımız hazırdı.',
        en: 'When the auditor asked “where does this number come from?”, we had the answer ready.',
      },
      author: 'Anna Meier',
      role: { tr: 'Risk & Uyum Müdürü', en: 'Risk & Compliance Lead' },
    },
  },
];

// Resolve a case by its slug (used by the /cases/:slug detail route).
export const caseBySlug = (slug, all = CASES) => all.find((c) => c.slug === slug);

// Resolve the case study for a city name (exact CITIES `name` match) — powers
// the impact-map "read the case" link. Returns undefined when none exists.
export const caseByCity = (cityName, all = CASES) => all.find((c) => c.city === cityName);

// Sectors present, each with a stable id (sector.en) + bilingual label, in
// first-appearance order — mirrors postTags/jobTeams for an optional filter.
export function caseSectors(cases = CASES) {
  const seen = new Map();
  for (const c of cases) {
    if (!seen.has(c.sector.en)) seen.set(c.sector.en, { id: c.sector.en, label: c.sector });
  }
  return [...seen.values()];
}
