// i18n namespace: assessment (TR/EN). Copy for the sustainability self-
// assessment; ids match src/core/lib/assessment.js. Keep TR/EN in parity.
export default {
  tr: {
    eyebrow: 'Değerlendirme',
    title: 'Sürdürülebilirlik ',
    titleAccent: 'karnen',
    intro: '4 kısa soru. Kişisel sürdürülebilirlik profilini, skorunu ve sana özel önerileri al — kayıt yok, veri cihazından çıkmaz.',
    start: 'Başla',
    next: 'Devam',
    back: 'Geri',
    step: 'Adım {n}/{total}',
    progressLabel: 'Test ilerlemesi',
    cat: {
      transport: 'Ulaşım',
      diet: 'Beslenme',
      energy: 'Enerji',
      consumption: 'Tüketim',
    },
    q: {
      transport: {
        q: 'Günlük ulaşımın çoğunlukla nasıl?',
        options: { car: 'Çoğunlukla özel araba', mixed: 'Araba + toplu taşıma karışık', transit: 'Çoğunlukla toplu taşıma', active: 'Yürüme / bisiklet' },
      },
      diet: {
        q: 'Beslenme alışkanlığın hangisine yakın?',
        options: { meat: 'Her öğün et', some: 'Sık sık et', flexi: 'Az et (esnek)', plant: 'Çoğunlukla bitkisel' },
      },
      energy: {
        q: 'Evinde enerji nasıl?',
        options: { grid: 'Standart şebeke', efficient: 'Verimli cihazlar', partial: 'Kısmen yenilenebilir', renew: '%100 yenilenebilir' },
      },
      consumption: {
        q: 'Tüketim ve alışveriş alışkanlığın?',
        options: { high: 'Sık yeni ürün', average: 'Ortalama', conscious: 'Bilinçli / ikinci el', minimal: 'Minimalist' },
      },
    },
    result: {
      scoreLabel: 'Sürdürülebilirlik skorun',
      recsTitle: 'Sana özel 3 adım',
      breakdownTitle: 'Kategori dağılımı',
      retake: 'Tekrar çöz',
      share: 'Sonucu paylaş',
      shared: 'Kopyalandı!',
      profiles: {
        leader: { t: 'Öncüsün', d: 'Etkin örnek bir yaşam sürüyorsun — ufak iyileştirmelerle başkalarına ilham ver.' },
        good: { t: 'İyi yoldasın', d: 'Sağlam temellerin var; birkaç alanda küçük değişiklikler büyük fark yaratır.' },
        starter: { t: 'Başlangıçtasın', d: 'Doğru yöne bakıyorsun. Tek bir alışkanlıkla başlamak ivmeyi getirir.' },
        beginner: { t: 'Potansiyel yüksek', d: 'En büyük kazanım fırsatı sende. Önerdiğimiz ilk adımla yola çık.' },
      },
    },
    recs: {
      transport: 'Haftada birkaç gün arabayı bırak: kısa mesafelerde yürüme/bisiklet en hızlı kazanç.',
      diet: 'Haftada 2-3 bitkisel öğün; et tüketimini azaltmak ayak izini belirgin düşürür.',
      energy: 'Yeşil enerji tarifesine geç ve bekleme modundaki cihazları kapat.',
      consumption: 'Yeni almadan önce onar/ikinci el düşün; “az ama kaliteli” kuralını dene.',
    },
  },
  en: {
    eyebrow: 'Assessment',
    title: 'Your sustainability ',
    titleAccent: 'report card',
    intro: '4 quick questions. Get your personal sustainability profile, score and tailored tips — no signup, data never leaves your device.',
    start: 'Start',
    next: 'Next',
    back: 'Back',
    step: 'Step {n}/{total}',
    progressLabel: 'Quiz progress',
    cat: {
      transport: 'Transport',
      diet: 'Diet',
      energy: 'Energy',
      consumption: 'Consumption',
    },
    q: {
      transport: {
        q: 'How do you mostly get around?',
        options: { car: 'Mostly private car', mixed: 'Car + transit mix', transit: 'Mostly public transit', active: 'Walking / cycling' },
      },
      diet: {
        q: 'Which is closest to your diet?',
        options: { meat: 'Meat every meal', some: 'Meat often', flexi: 'Low meat (flexible)', plant: 'Mostly plant-based' },
      },
      energy: {
        q: "What's your home energy like?",
        options: { grid: 'Standard grid', efficient: 'Efficient appliances', partial: 'Partly renewable', renew: '100% renewable' },
      },
      consumption: {
        q: 'Your shopping & consumption habits?',
        options: { high: 'Frequent new buys', average: 'Average', conscious: 'Conscious / second-hand', minimal: 'Minimalist' },
      },
    },
    result: {
      scoreLabel: 'Your sustainability score',
      recsTitle: '3 steps tailored to you',
      breakdownTitle: 'Category breakdown',
      retake: 'Retake',
      share: 'Share result',
      shared: 'Copied!',
      profiles: {
        leader: { t: "You're a leader", d: 'You live a strong example — small refinements now help inspire others.' },
        good: { t: "You're on track", d: 'Solid foundations; a few small changes in key areas go a long way.' },
        starter: { t: 'Getting started', d: "You're facing the right way. Starting with one habit builds momentum." },
        beginner: { t: 'High potential', d: 'The biggest gains are yours to make. Begin with our first suggested step.' },
      },
    },
    recs: {
      transport: 'Leave the car a few days a week: walking/cycling short trips is the fastest win.',
      diet: 'Add 2–3 plant-based meals a week; cutting meat noticeably lowers your footprint.',
      energy: 'Switch to a green energy tariff and kill standby power on idle devices.',
      consumption: 'Repair or buy second-hand before new; try the “less but better” rule.',
    },
  },
};
