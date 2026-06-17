// Bilingual insight posts. Data-driven so /blog and /blog/:slug share one source.
export const POSTS = [
  {
    slug: 'carbon-budget-basics',
    date: '2026-04-22',
    author: { name: 'Dr. Selin Aydın', role: { tr: 'Veri Bilimi', en: 'Data Science' } },
    tag: { tr: 'Rehber', en: 'Guide' },
    terms: ['carbon-budget', 'baseline', 'carbon-footprint', 'co2e', 'net-zero'],
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
        'Sürdürülebilirlik araçlarının çoğu tek bir "ortalama" hedef sunar. Oysa bir kişinin ulaşım, enerji ve beslenme profili bambaşkadır; ortalama bir hedef çoğu insana ya çok katı ya da anlamsız gelir.',
        { h: 'Kişisel baseline yaklaşımı', id: 'personal-baseline' },
        'Ecozyon, ilk hafta verisinden kişisel bir baseline çıkarır ve önerileri buna göre kişiselleştirir. Sonuç: uygulanabilir, ölçülebilir alışkanlıklar.',
        'Baseline bir yargı değil, bir başlangıç noktasıdır; amacı suçlamak değil, ilerlemeyi görünür kılmaktır.',
        { h: 'Bütçe nasıl hesaplanır', id: 'how-we-calc' },
        'Karbon bütçesi, kişisel baseline ile bilimsel bir hedef arasındaki yolu aylara böler. Her ay küçük ama bileşik bir azalma hedeflenir.',
        'co2e cinsinden tek bir ortak birim kullanmak, farklı kaynakları (ulaşım, enerji, beslenme) adil biçimde karşılaştırmayı sağlar.',
        { h: 'Bütçeden alışkanlığa', id: 'budget-to-habits' },
        'Bir bütçe ancak günlük kararlara dönüştüğünde işe yarar. Uygulama her hedefi haftalık birkaç somut eyleme böler.',
        { h: 'Sık yapılan hatalar', id: 'pitfalls' },
        'En yaygın hata, tek seferde çok şey değiştirmeye çalışmaktır. İkincisi, ilerlemeyi ölçmeden tahmine güvenmektir.',
      ],
      en: [
        { h: 'Why an average target falls short', id: 'why-average' },
        'Most sustainability tools hand you a single "average" target. But transport, energy and diet profiles differ wildly per person; an average goal feels either too strict or meaningless to most people.',
        { h: 'The personal-baseline approach', id: 'personal-baseline' },
        'Ecozyon derives a personal baseline from week-one data and tailors suggestions to it. The result: actionable, measurable habits.',
        'A baseline is a starting point, not a verdict; its job is to make progress visible, not to assign blame.',
        { h: 'How the budget is calculated', id: 'how-we-calc' },
        'A carbon budget splits the path between your personal baseline and a science-based target into months, aiming for a small but compounding cut each month.',
        'Using a single shared unit — co2e — lets you compare different sources (transport, energy, diet) on fair terms.',
        { h: 'From budget to habit', id: 'budget-to-habits' },
        'A budget only works once it turns into daily decisions. The app breaks each target into a few concrete weekly actions.',
        { h: 'Common pitfalls', id: 'pitfalls' },
        'The most common mistake is changing too much at once. The second is trusting estimates instead of measuring progress.',
      ],
    },
  },
  {
    slug: 'wearable-design-notes',
    date: '2026-03-30',
    author: { name: 'Mert Koç', role: { tr: 'Donanım', en: 'Hardware' } },
    tag: { tr: 'Donanım', en: 'Hardware' },
    terms: ['wearable', 'met', 'on-device', 'embodied-carbon', 'renewable', 'energy-efficiency'],
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
        'Her miliwat önemlidir: daha düşük tüketim, daha küçük pil ve daha az gömülü emisyon demektir.',
        { h: 'Malzeme ve enerji', id: 'materials' },
        'Kasa %92 geri dönüştürülmüş alüminyum; güneş mikro-hücresi gün ışığında günlük tüketimin ~%38\'ini karşılıyor.',
        { h: 'Güneşle şarj', id: 'solar' },
        'Yenilenebilir bir mikro-hücre, cihazı şebeke şarjına bağımlılıktan kısmen kurtarır ve kullanım ömrü boyunca enerji ayak izini düşürür.',
        { h: 'Onarılabilirlik', id: 'repairability' },
        'Modüler bir pil ve standart vidalar cihazın ömrünü uzatır. En sürdürülebilir cihaz, değiştirmeniz gerekmeyen cihazdır.',
        { h: 'Üretim emisyonu', id: 'lifecycle' },
        'Gömülü emisyon, bir cihazın toplam etkisinin büyük bölümünü oluşturabilir. Bu yüzden tasarımı uzun ömür ve geri dönüşüm için optimize ettik.',
      ],
      en: [
        { h: 'Low-power design', id: 'low-power' },
        'Low power is the heart of sustainable hardware. Adaptive sensor sampling halved average draw.',
        'Every milliwatt counts: lower draw means a smaller battery and less embodied carbon.',
        { h: 'Materials and energy', id: 'materials' },
        'The housing is 92% recycled aluminium; the solar micro-cell covers ~38% of daily consumption in daylight.',
        { h: 'Solar charging', id: 'solar' },
        'A renewable micro-cell partly frees the device from grid charging and lowers its energy footprint across its lifetime.',
        { h: 'Repairability', id: 'repairability' },
        'A modular battery and standard screws extend the device\'s life. The most sustainable device is the one you never need to replace.',
        { h: 'Manufacturing emissions', id: 'lifecycle' },
        'Embodied carbon can make up most of a device\'s total impact, so we optimized the design for longevity and recycling.',
      ],
    },
  },
  {
    slug: 'community-challenges',
    date: '2026-02-14',
    author: { name: 'Aylin Demir', role: { tr: 'Topluluk', en: 'Community' } },
    tag: { tr: 'Topluluk', en: 'Community' },
    terms: ['baseline', 'carbon-footprint', 'co2e', 'gamification', 'behavioral-nudge'],
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
        { h: 'Yarışmaları tasarlamak', id: 'designing' },
        'İyi bir yarışma, herkesin kazanabileceği biçimde kurgulanır. Mutlak değer yerine kişisel ilerlemeyi ödüllendiririz.',
        'Böylece yeni başlayan biri de, deneyimli biri kadar motive olur.',
        { h: 'Liderlik tablosunu doğru kurmak', id: 'leaderboards' },
        'Yanlış kurgulanmış bir tablo cesaret kırar. Bu yüzden ligleri benzer baseline\'a sahip kişilerden oluştururuz.',
        { h: 'Etkiyi ölçmek', id: 'measuring' },
        'Oyunlaştırma bir amaç değil, araçtır. Başarıyı rozet sayısıyla değil, co2e cinsinden gerçek azalmayla ölçeriz.',
      ],
      en: [
        { h: 'The community effect', id: 'community-effect' },
        'Individual nudges work, but community makes them stick. In pilots, weekly challenges tripled retention.',
        { h: 'The formula that works', id: 'the-formula' },
        'The key: small reachable goals + visible progress + peer comparison.',
        { h: 'Designing the challenges', id: 'designing' },
        'A good challenge is framed so everyone can win. We reward personal progress rather than absolute values.',
        'That way a newcomer stays as motivated as a veteran.',
        { h: 'Getting leaderboards right', id: 'leaderboards' },
        'A badly framed leaderboard discourages people, so we group leagues by similar baselines.',
        { h: 'Measuring the impact', id: 'measuring' },
        'Gamification is a means, not an end. We measure success by real reduction in co2e, not badge counts.',
      ],
    },
  },
  {
    slug: 'how-ai-nudges-work',
    date: '2026-05-18',
    author: { name: 'Dr. Selin Aydın', role: { tr: 'Veri Bilimi', en: 'Data Science' } },
    tag: { tr: 'AI', en: 'AI' },
    terms: ['baseline', 'carbon-intensity', 'met', 'on-device', 'behavioral-nudge'],
    title: {
      tr: 'AI önerileri perde arkası: bağlamdan eyleme',
      en: 'Behind AI nudges: from context to action',
    },
    excerpt: {
      tr: 'Öneri motoru bağlamı, alışkanlığı ve zamanlamayı nasıl birleştirip işe yarayan bir dürtü üretir?',
      en: 'How the recommendation engine blends context, habit and timing into a nudge that works.',
    },
    body: {
      tr: [
        { h: 'Bağlam her şeydir', id: 'context' },
        'İyi bir öneri, doğru anda gelir. Motor; konum, aktivite ve geçmiş davranışı birleştirerek dürtüyü kişiselleştirir.',
        { h: 'Zamanlama ve güven', id: 'timing' },
        'Çok sık öneri yorgunluk yaratır. Modeli, yalnızca yüksek etkili anlarda devreye girecek şekilde kalibre ettik.',
        { h: 'Modelin içi', id: 'the-model' },
        'Motor, öğrenen bir katmanı basit kurallarla birleştirir. Şeffaflık için her önerinin neden geldiğini açıklayabiliriz.',
        { h: 'Geri besleme döngüsü', id: 'feedback-loop' },
        'Kullanıcı bir öneriyi kabul ya da reddettikçe model uyum sağlar. Reddedilen öneriler de en az kabul edilenler kadar değerlidir.',
        { h: 'Sınırlar ve güvence', id: 'guardrails' },
        'Dürtme manipülasyon değildir. Öneriler her zaman isteğe bağlıdır ve enerji şebekesinin emisyon yoğunluğu gibi nesnel verilere dayanır.',
      ],
      en: [
        { h: 'Context is everything', id: 'context' },
        'A good nudge arrives at the right moment. The engine blends location, activity and past behavior to personalize it.',
        { h: 'Timing and trust', id: 'timing' },
        'Too many nudges cause fatigue. We calibrated the model to fire only at high-impact moments.',
        { h: 'Inside the model', id: 'the-model' },
        'The engine combines a learning layer with simple rules. For transparency, we can explain why each nudge appeared.',
        { h: 'The feedback loop', id: 'feedback-loop' },
        'As a user accepts or rejects a nudge, the model adapts. Rejected nudges are as valuable as accepted ones.',
        { h: 'Guardrails', id: 'guardrails' },
        'Nudging is not manipulation. Suggestions are always optional and grounded in objective data like the grid\'s carbon intensity.',
      ],
    },
  },
  {
    slug: 'measuring-scope-3',
    date: '2026-05-02',
    author: { name: 'Ece Yılmaz', role: { tr: 'Sürdürülebilirlik', en: 'Sustainability' } },
    tag: { tr: 'Veri', en: 'Data' },
    terms: ['scope-3', 'scope-1', 'scope-2', 'ghg-protocol', 'lca', 'carbon-intensity'],
    title: {
      tr: 'Scope 3’ü ölçmek: en büyük ve en zor pay',
      en: 'Measuring Scope 3: the biggest, hardest share',
    },
    excerpt: {
      tr: 'Değer zinciri emisyonları genelde toplamın çoğunu oluşturur. Onları nasıl görünür kılıyoruz?',
      en: 'Value-chain emissions usually dominate the total. Here is how we make them visible.',
    },
    body: {
      tr: [
        { h: 'Neden zor', id: 'why-hard' },
        'Scope 3, doğrudan kontrolünüz dışındaki kaynakları kapsar; veri dağınık ve eksiktir.',
        { h: 'Yaklaşımımız', id: 'approach' },
        'Aktivite verisi + sektör ortalamaları + giyilebilir sinyalleri birleştirerek şeffaf, denetlenebilir bir tahmin üretiyoruz.',
        { h: 'Veri kaynakları', id: 'data-sources' },
        'Ulaşım, satın alma ve enerji üç ana sinyaldir. Hiçbiri tek başına yeterli değildir; güç birleşimdedir.',
        { h: 'Tahmin yöntemi', id: 'estimation' },
        'Eksik veriyi yaşam döngüsü analizi (LCA) ortalamalarıyla doldururuz ve her tahmine bir güven aralığı ekleriz.',
        { h: 'Şeffaflık', id: 'transparency' },
        'Bir sayı ancak izlenebilirse güvenilirdir. Her metriğin GHG Protokolü kategorisine kadar kaynağını gösteririz.',
      ],
      en: [
        { h: 'Why it is hard', id: 'why-hard' },
        'Scope 3 spans sources outside your direct control; the data is scattered and incomplete.',
        { h: 'Our approach', id: 'approach' },
        'We combine activity data + sector averages + wearable signals into a transparent, auditable estimate.',
        { h: 'Data sources', id: 'data-sources' },
        'Transport, purchases and energy are the three main signals. None is enough alone; the power is in the combination.',
        { h: 'The estimation method', id: 'estimation' },
        'We fill missing data with life-cycle assessment (LCA) averages and attach a confidence interval to every estimate.',
        { h: 'Transparency', id: 'transparency' },
        'A number is only trustworthy if it is traceable. We show each metric\'s source down to its GHG Protocol category.',
      ],
    },
  },
  {
    slug: 'on-device-privacy',
    date: '2026-04-08',
    author: { name: 'Mert Koç', role: { tr: 'Donanım', en: 'Hardware' } },
    tag: { tr: 'Gizlilik', en: 'Privacy' },
    terms: ['on-device', 'wearable', 'met', 'energy-efficiency'],
    title: {
      tr: 'Cihaz-içi işleme neden gizlilik için kritik?',
      en: 'Why on-device processing is critical for privacy',
    },
    excerpt: {
      tr: 'Ham veriyi buluta göndermeden işlemek hem gizliliği hem de pil ömrünü korur.',
      en: 'Processing raw data without sending it to the cloud protects both privacy and battery.',
    },
    body: {
      tr: [
        { h: 'Veri cihazda kalır', id: 'on-device' },
        'Hassas sensör verisi cihazda işlenir; yalnızca toplulaştırılmış metrikler paylaşılır.',
        { h: 'Yan fayda: enerji', id: 'energy' },
        'Daha az ağ trafiği, daha az radyo kullanımı demek — bu da pil ömrünü uzatır.',
        { h: 'Ne topluyoruz', id: 'what-we-collect' },
        'Yalnızca içgörü üretmek için gereken en az veriyi toplarız. Veri minimizasyonu bir slogan değil, bir tasarım kuralıdır.',
        { h: 'Anonimleştirme', id: 'anonymization' },
        'Toplulaştırılmış metrikler kimliğinizden ayrılır; bireysel hareketler geri izlenemez.',
        { h: 'Kontrol sizde', id: 'your-control' },
        'Verinizi istediğiniz an dışa aktarabilir veya silebilirsiniz. Açık ve geri alınabilir izin, varsayılan ayardır.',
      ],
      en: [
        { h: 'Data stays on the device', id: 'on-device' },
        'Sensitive sensor data is processed on the device; only aggregated metrics are shared.',
        { h: 'Side benefit: energy', id: 'energy' },
        'Less network traffic means less radio use — which extends battery life.',
        { h: 'What we collect', id: 'what-we-collect' },
        'We collect only the minimum data needed to produce an insight. Data minimization is a design rule, not a slogan.',
        { h: 'Anonymization', id: 'anonymization' },
        'Aggregated metrics are detached from your identity; individual movements cannot be traced back.',
        { h: 'You stay in control', id: 'your-control' },
        'You can export or delete your data at any time. Clear, revocable consent is the default.',
      ],
    },
  },
  {
    slug: 'rebound-effect-explained',
    date: '2026-01-20',
    author: { name: 'Ece Yılmaz', role: { tr: 'Sürdürülebilirlik', en: 'Sustainability' } },
    tag: { tr: 'Rehber', en: 'Guide' },
    terms: ['rebound-effect', 'energy-efficiency', 'behavioral-nudge', 'carbon-footprint'],
    title: {
      tr: 'Geri tepme etkisi: verimlilik neden bazen geri teper',
      en: 'The rebound effect: when efficiency backfires',
    },
    excerpt: {
      tr: 'Daha verimli olmak her zaman daha az salım demek değildir. Tasarrufu nasıl koruruz?',
      en: 'Being more efficient does not always mean fewer emissions. How do we protect the savings?',
    },
    body: {
      tr: [
        { h: 'Geri tepme nedir', id: 'what' },
        'Bir şey daha verimli ve ucuz hale geldiğinde çoğu zaman onu daha çok kullanırız. Kazanılan tasarrufun bir kısmı böylece geri teper.',
        { h: 'Günlük hayattan örnek', id: 'example' },
        'Daha verimli bir araç kilometre başına daha az yakar; ama insan daha çok yol gidince toplam tasarruf erir.',
        { h: 'Nasıl önleriz', id: 'prevent' },
        'Çözüm verimlilikten vazgeçmek değil, tasarrufu görünür kılmaktır. Bir kazanımı ölçtüğünüzde onu korumak kolaylaşır.',
        { h: 'Dürtmenin rolü', id: 'nudge-role' },
        'Doğru zamanlı bir hatırlatma, kazanılan tasarrufun yeniden harcanmasını engelleyebilir. Davranışsal dürtme tam burada devreye girer.',
      ],
      en: [
        { h: 'What the rebound effect is', id: 'what' },
        'When something becomes more efficient and cheaper, we often use more of it. Part of the saving rebounds away.',
        { h: 'An everyday example', id: 'example' },
        'A more efficient car burns less per kilometer; but if people drive more, the total saving melts.',
        { h: 'How we prevent it', id: 'prevent' },
        'The fix is not to abandon efficiency but to make savings visible. Once you measure a gain, it is easier to keep.',
        { h: 'The role of nudging', id: 'nudge-role' },
        'A well-timed reminder can stop a saving from being spent again. That is exactly where behavioral nudging helps.',
      ],
    },
  },
  {
    slug: 'solar-charging-notes',
    date: '2026-01-08',
    author: { name: 'Mert Koç', role: { tr: 'Donanım', en: 'Hardware' } },
    tag: { tr: 'Donanım', en: 'Hardware' },
    terms: ['renewable', 'energy-efficiency', 'embodied-carbon', 'wearable'],
    title: {
      tr: 'Güneşle şarj: küçük bir hücre ne kadar fark yaratır',
      en: 'Solar charging: how much a tiny cell really helps',
    },
    excerpt: {
      tr: 'Bir mikro güneş hücresi, giyilebilir cihazın enerji ayak izini nasıl değiştiriyor?',
      en: "How a micro solar cell changes a wearable's energy footprint.",
    },
    body: {
      tr: [
        { h: 'Neden güneş', id: 'why-solar' },
        'Giyilebilir bir cihaz gün boyu ışık görür. Bu ışığın küçük bir kısmını toplamak bile şarj sıklığını azaltır.',
        { h: 'Gerçek katkı', id: 'real-contribution' },
        'Gün ışığında mikro hücre, günlük tüketimin yaklaşık üçte birini karşılıyor. Bu, yıllık şebeke şarjını hissedilir biçimde düşürür.',
        { h: 'Tasarım ödünleşmeleri', id: 'tradeoffs' },
        'Daha büyük hücre daha çok enerji demek; ama aynı zamanda daha çok gömülü emisyon ve ağırlık. Denge anahtardır.',
        { h: 'Ömür boyu etki', id: 'lifetime' },
        'Yenilenebilir katkı, cihazın kullanım ömrü boyunca birikir. Küçük bir hücre, yıllar içinde anlamlı bir enerji tasarrufuna dönüşür.',
      ],
      en: [
        { h: 'Why solar', id: 'why-solar' },
        'A wearable sees light all day. Harvesting even a small part of it reduces how often you charge.',
        { h: 'The real contribution', id: 'real-contribution' },
        'In daylight the micro-cell covers about a third of daily consumption, noticeably cutting yearly grid charging.',
        { h: 'Design trade-offs', id: 'tradeoffs' },
        'A bigger cell means more energy — but also more embodied carbon and weight. Balance is key.',
        { h: 'Lifetime impact', id: 'lifetime' },
        "Renewable contribution adds up across the device's life. A small cell becomes a meaningful energy saving over years.",
      ],
    },
  },
  {
    slug: 'esg-for-individuals',
    date: '2025-12-18',
    author: { name: 'Ece Yılmaz', role: { tr: 'Sürdürülebilirlik', en: 'Sustainability' } },
    tag: { tr: 'Veri', en: 'Data' },
    terms: ['esg', 'scope-3', 'ghg-protocol', 'sbti'],
    title: {
      tr: 'ESG bireyler için ne anlatır?',
      en: 'What does ESG mean for individuals?',
    },
    excerpt: {
      tr: 'Kurumsal bir çerçeve olan ESG, kişisel sürdürülebilirlik için ne söyler?',
      en: 'ESG is a corporate framework — what does it say for personal sustainability?',
    },
    body: {
      tr: [
        { h: 'ESG kısaca', id: 'basics' },
        'ESG; çevresel, sosyal ve yönetişim ölçütlerini bir araya getirir. Kurumlar için tasarlanmıştır ama mantığı bireye de uyarlanabilir.',
        { h: 'Bireysel karşılığı', id: 'personal' },
        'Kişisel düzeyde "E" en somut olanıdır: ölçülebilir bir emisyon profili. Geri kalanı alışkanlık ve seçimlerle ilgilidir.',
        { h: 'Neden ölçüm önemli', id: 'measurement' },
        'Ölçülmeyen bir hedef yönetilemez. GHG Protokolü gibi ortak çerçeveler, kıyaslanabilir sayılar üretmeyi sağlar.',
        { h: 'Bilime dayalı hedefler', id: 'targets' },
        'SBTi gibi yaklaşımlar hedefleri keyfi olmaktan çıkarıp bilimsel bir yörüngeye bağlar. Aynı disiplin bireysel hedeflere de ilham verir.',
      ],
      en: [
        { h: 'ESG in brief', id: 'basics' },
        'ESG brings together environmental, social and governance criteria. It is built for organizations, but its logic adapts to individuals.',
        { h: 'The personal equivalent', id: 'personal' },
        'At a personal level the "E" is the most concrete: a measurable emissions profile. The rest is about habits and choices.',
        { h: 'Why measurement matters', id: 'measurement' },
        'A target you do not measure cannot be managed. Shared frameworks like the GHG Protocol produce comparable numbers.',
        { h: 'Science-based targets', id: 'targets' },
        'Approaches like SBTi move targets from arbitrary to a scientific trajectory. The same discipline inspires personal goals.',
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

// URL-safe slug for a tag's stable id (tag.en), e.g. "AI" → "ai". Powers the
// /blog/tag/:tag pages.
export const tagSlug = (tagEn) => String(tagEn).toLowerCase().replace(/\s+/g, '-');

// Resolve a tag { id, label } from its slug, or undefined.
export const postTagBySlug = (slug, posts = POSTS) => postTags(posts).find((t) => tagSlug(t.id) === slug);

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
