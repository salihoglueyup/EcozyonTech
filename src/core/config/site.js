// Central site configuration: brand metadata, routes, navigation.

export const SITE = {
  name: 'Ecozyon Tech',
  domain: 'ecozyon.tech',
  url: 'https://ecozyon.tech',
  email: 'hello@ecozyon.tech',
  description:
    'Ecozyon Tech turns individual and corporate sustainability into measurable, practical habits with wearable technology and smart AI.',
};

// Route → page metadata. `place`: 'primary' shows in the navbar, 'footer'
// only in the footer, 'none' is reachable but unlisted. Pages pull the
// document <title> from here via useDocumentMeta.
export const ROUTES = [
  {
    path: '/',
    key: 'home',
    place: 'none',
    nav: { tr: 'Ana Sayfa', en: 'Home' },
    title: { tr: 'Ecozyon Tech — AI ile sürdürülebilirlik', en: 'Ecozyon Tech — Sustainability with AI' },
  },
  {
    path: '/services',
    key: 'services',
    place: 'primary',
    nav: { tr: 'Çözümler', en: 'Solutions' },
    title: { tr: 'Çözümler — Ecozyon Tech', en: 'Solutions — Ecozyon Tech' },
  },
  {
    path: '/compare',
    key: 'compare',
    place: 'footer',
    nav: { tr: 'Karşılaştırma', en: 'Compare' },
    title: { tr: 'Neden Ecozyon? — Ecozyon Tech', en: 'Why Ecozyon? — Ecozyon Tech' },
  },
  {
    path: '/roi',
    key: 'roi',
    place: 'footer',
    nav: { tr: 'ROI Hesaplayıcı', en: 'ROI Calculator' },
    title: { tr: 'Kurumsal ROI Hesaplayıcı — Ecozyon Tech', en: 'Business ROI Calculator — Ecozyon Tech' },
  },
  {
    path: '/pricing',
    key: 'pricing',
    place: 'primary',
    nav: { tr: 'Fiyatlandırma', en: 'Pricing' },
    title: { tr: 'Fiyatlandırma — Ecozyon Tech', en: 'Pricing — Ecozyon Tech' },
  },
  {
    path: '/leaderboard',
    key: 'leaderboard',
    place: 'footer',
    nav: { tr: 'Liderlik Tablosu', en: 'Leaderboard' },
    title: { tr: 'Liderlik Tablosu — Ecozyon Tech', en: 'Leaderboard — Ecozyon Tech' },
  },
  {
    path: '/impact',
    key: 'impact',
    place: 'primary',
    nav: { tr: 'Etki Haritası', en: 'Impact Map' },
    title: { tr: 'Etki Haritası — Ecozyon Tech', en: 'Impact Map — Ecozyon Tech' },
  },
  {
    path: '/about',
    key: 'about',
    place: 'primary',
    nav: { tr: 'Hakkımızda', en: 'About' },
    title: { tr: 'Hakkımızda — Ecozyon Tech', en: 'About — Ecozyon Tech' },
  },
  {
    path: '/cases',
    key: 'cases',
    place: 'footer',
    nav: { tr: 'Vaka Çalışmaları', en: 'Case Studies' },
    title: { tr: 'Vaka Çalışmaları — Ecozyon Tech', en: 'Case Studies — Ecozyon Tech' },
  },
  {
    path: '/integrations',
    key: 'integrations',
    place: 'footer',
    nav: { tr: 'Entegrasyonlar', en: 'Integrations' },
    title: { tr: 'Entegrasyonlar — Ecozyon Tech', en: 'Integrations — Ecozyon Tech' },
  },
  {
    path: '/glossary',
    key: 'glossary',
    place: 'footer',
    nav: { tr: 'Sözlük', en: 'Glossary' },
    title: { tr: 'Sürdürülebilirlik Sözlüğü — Ecozyon Tech', en: 'Sustainability Glossary — Ecozyon Tech' },
  },
  {
    path: '/help',
    key: 'help',
    place: 'footer',
    nav: { tr: 'Yardım', en: 'Help' },
    title: { tr: 'Yardım Merkezi — Ecozyon Tech', en: 'Help Center — Ecozyon Tech' },
  },
  {
    path: '/developers',
    key: 'developers',
    place: 'footer',
    nav: { tr: 'Geliştiriciler', en: 'Developers' },
    title: { tr: 'API Referansı — Ecozyon Tech', en: 'API Reference — Ecozyon Tech' },
  },
  {
    path: '/changelog',
    key: 'changelog',
    place: 'footer',
    nav: { tr: 'Sürüm Notları', en: 'Changelog' },
    title: { tr: 'Sürüm Notları — Ecozyon Tech', en: 'Changelog — Ecozyon Tech' },
  },
  {
    path: '/status',
    key: 'status',
    place: 'footer',
    nav: { tr: 'Sistem Durumu', en: 'Status' },
    title: { tr: 'Sistem Durumu — Ecozyon Tech', en: 'System Status — Ecozyon Tech' },
  },
  {
    path: '/resources',
    key: 'resources',
    place: 'footer',
    nav: { tr: 'Kaynaklar', en: 'Resources' },
    title: { tr: 'Kaynaklar — Ecozyon Tech', en: 'Resources — Ecozyon Tech' },
  },
  {
    path: '/press',
    key: 'press',
    place: 'footer',
    nav: { tr: 'Basın', en: 'Press' },
    title: { tr: 'Basın Odası — Ecozyon Tech', en: 'Newsroom — Ecozyon Tech' },
  },
  {
    path: '/blog',
    key: 'blog',
    place: 'footer',
    nav: { tr: 'Blog', en: 'Blog' },
    title: { tr: 'Blog — Ecozyon Tech', en: 'Blog — Ecozyon Tech' },
  },
  {
    path: '/careers',
    key: 'careers',
    place: 'footer',
    nav: { tr: 'Kariyer', en: 'Careers' },
    title: { tr: 'Kariyer — Ecozyon Tech', en: 'Careers — Ecozyon Tech' },
  },
  {
    path: '/contact',
    key: 'contact',
    place: 'primary',
    nav: { tr: 'İletişim', en: 'Contact' },
    title: { tr: 'İletişim — Ecozyon Tech', en: 'Contact — Ecozyon Tech' },
  },
  {
    path: '/styleguide',
    key: 'styleguide',
    place: 'footer',
    nav: { tr: 'Tasarım Sistemi', en: 'Design System' },
    title: { tr: 'Tasarım Sistemi — Ecozyon Tech', en: 'Design System — Ecozyon Tech' },
  },
  {
    path: '/search',
    key: 'search',
    place: 'none',
    nav: { tr: 'Arama', en: 'Search' },
    title: { tr: 'Arama — Ecozyon Tech', en: 'Search — Ecozyon Tech' },
  },
  {
    path: '/legal',
    key: 'legal',
    place: 'footer',
    nav: { tr: 'Yasal', en: 'Legal' },
    title: { tr: 'Yasal — Gizlilik & Şartlar — Ecozyon Tech', en: 'Legal — Privacy & Terms — Ecozyon Tech' },
  },
];

export const routeByKey = (key) => ROUTES.find((r) => r.key === key);

// Primary navbar items (logo covers home).
export const NAV_ITEMS = ROUTES.filter((r) => r.place === 'primary');

// Footer navigation = primary + footer-only routes.
export const FOOTER_ITEMS = ROUTES.filter(
  (r) => r.place === 'primary' || r.place === 'footer',
);
