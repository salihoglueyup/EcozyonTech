// i18n namespace: leaderboard (TR/EN). Split from the former monolithic
// dictionary; keep TR and EN keys in parity (enforced by the i18n test).
export default {
  "tr": {
    "eyebrow": "Liderlik Tablosu",
    "title": "Ağın en ",
    "titleAccent": "etkili şehirleri",
    "intro": "Ecozyon ağındaki şehirleri karbon tasarrufu, kişi başı verim ve aktif kullanıcıya göre sırala. Veriler şehir veri setinden türetilir.",
    "metricLabel": "Sıralama ölçütü",
    "metrics": {
      "co2": "CO₂ tasarrufu",
      "efficiency": "Kişi başı verim",
      "users": "Aktif kullanıcı"
    },
    "metricDesc": {
      "co2": "Şehrin günlük toplam karbon tasarrufu. Daha yüksek değer = daha fazla önlenen emisyon.",
      "efficiency": "Aktif kullanıcı başına düşen karbon etkisi — ağın ne kadar verimli çalıştığını gösterir.",
      "users": "Şehirdeki aktif Ecozyon kullanıcı sayısı."
    },
    "units": {
      "co2": "kg/gün",
      "users": "kullanıcı",
      "efficiency": "kg/kişi"
    },
    "partner": "Partner",
    "onMap": "Haritada gör",
    "howTitle": "Sıralama nasıl çalışır",
    "how": [
      { "t": "Ölçülen veri", "d": "Sıralama beyana değil; giyilebilir ve entegrasyon verisinden türetilen gerçek tasarrufa dayanır." },
      { "t": "Adil ligler", "d": "Şehirler benzer baseline ve büyüklüğe göre gruplanır; küçük bir şehir de zirveye oynayabilir." },
      { "t": "Günlük güncelleme", "d": "Değerler her gün yenilenir; kişi başı verim metriği büyüklük avantajını dengeler." }
    ]
  },
  "en": {
    "eyebrow": "Leaderboard",
    "title": "The network's most ",
    "titleAccent": "effective cities",
    "intro": "Rank cities in the Ecozyon network by carbon saved, per-user efficiency and active users. Figures are derived from the city dataset.",
    "metricLabel": "Rank by",
    "metrics": {
      "co2": "CO₂ saved",
      "efficiency": "Per-user efficiency",
      "users": "Active users"
    },
    "metricDesc": {
      "co2": "Total carbon a city saves per day. Higher = more emissions avoided.",
      "efficiency": "Carbon impact per active user — how efficiently the network performs.",
      "users": "Number of active Ecozyon users in the city."
    },
    "units": {
      "co2": "kg/day",
      "users": "users",
      "efficiency": "kg/user"
    },
    "partner": "Partner",
    "onMap": "See on map",
    "howTitle": "How the ranking works",
    "how": [
      { "t": "Measured data", "d": "Rankings come from real savings derived from wearable and integration data — not self-reported claims." },
      { "t": "Fair leagues", "d": "Cities are grouped by similar baseline and size, so a small city can still compete for the top." },
      { "t": "Daily updates", "d": "Figures refresh every day; the per-user efficiency metric offsets the advantage of size." }
    ]
  }
};
