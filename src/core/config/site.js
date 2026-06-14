// Central site configuration: brand metadata, routes, navigation.

export const SITE = {
  name: 'Ecozyon Tech',
  domain: 'ecozyon.tech',
  url: 'https://ecozyon.tech',
  email: 'hello@ecozyon.tech',
  description:
    'Ecozyon Tech turns individual and corporate sustainability into measurable, practical habits with wearable technology and smart AI.',
};

// Route → page metadata.
//  - `group`: information-architecture bucket. Drives the navbar mega-menu,
//    the footer columns and the sitemap — all derived from one place.
//  - `place`: navigation surface. 'nav' shows in the navbar dropdown + footer,
//    'footer' is footer-only, 'none' is reachable but listed only in the
//    sitemap (home is covered by the logo, search by ⌘K).
//  - `featured`: a curated highlight (NotFound "popular pages" chips).
// Pages pull the document <title> from here via useDocumentMeta.
export const ROUTES = [
  {
    path: '/',
    key: 'home',
    group: 'product',
    place: 'none',
    nav: { tr: 'Ana Sayfa', en: 'Home' },
    title: { tr: 'Ecozyon Tech — AI ile sürdürülebilirlik', en: 'Ecozyon Tech — Sustainability with AI' },
  },
  {
    path: '/services',
    key: 'services',
    group: 'product',
    place: 'nav',
    featured: true,
    nav: { tr: 'Hizmetler', en: 'Services' },
    title: { tr: 'Çözümler — Ecozyon Tech', en: 'Solutions — Ecozyon Tech' },
  },
  {
    path: '/pricing',
    key: 'pricing',
    group: 'product',
    place: 'nav',
    featured: true,
    nav: { tr: 'Fiyatlandırma', en: 'Pricing' },
    title: { tr: 'Fiyatlandırma — Ecozyon Tech', en: 'Pricing — Ecozyon Tech' },
  },
  {
    path: '/impact',
    key: 'impact',
    group: 'product',
    place: 'nav',
    featured: true,
    nav: { tr: 'Etki Haritası', en: 'Impact Map' },
    title: { tr: 'Etki Haritası — Ecozyon Tech', en: 'Impact Map — Ecozyon Tech' },
  },
  {
    path: '/compare',
    key: 'compare',
    group: 'product',
    place: 'nav',
    nav: { tr: 'Karşılaştırma', en: 'Compare' },
    title: { tr: 'Neden Ecozyon? — Ecozyon Tech', en: 'Why Ecozyon? — Ecozyon Tech' },
  },
  {
    path: '/roi',
    key: 'roi',
    group: 'product',
    place: 'nav',
    nav: { tr: 'ROI Hesaplayıcı', en: 'ROI Calculator' },
    title: { tr: 'Kurumsal ROI Hesaplayıcı — Ecozyon Tech', en: 'Business ROI Calculator — Ecozyon Tech' },
  },
  {
    path: '/integrations',
    key: 'integrations',
    group: 'product',
    place: 'nav',
    nav: { tr: 'Entegrasyonlar', en: 'Integrations' },
    title: { tr: 'Entegrasyonlar — Ecozyon Tech', en: 'Integrations — Ecozyon Tech' },
  },
  {
    path: '/assessment',
    key: 'assessment',
    group: 'product',
    place: 'nav',
    nav: { tr: 'Değerlendirme', en: 'Assessment' },
    title: { tr: 'Sürdürülebilirlik Değerlendirmesi — Ecozyon Tech', en: 'Sustainability Assessment — Ecozyon Tech' },
  },
  {
    path: '/leaderboard',
    key: 'leaderboard',
    group: 'product',
    place: 'nav',
    nav: { tr: 'Liderlik Tablosu', en: 'Leaderboard' },
    title: { tr: 'Liderlik Tablosu — Ecozyon Tech', en: 'Leaderboard — Ecozyon Tech' },
  },
  {
    path: '/blog',
    key: 'blog',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Blog', en: 'Blog' },
    title: { tr: 'Blog — Ecozyon Tech', en: 'Blog — Ecozyon Tech' },
  },
  {
    path: '/cases',
    key: 'cases',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Vaka Çalışmaları', en: 'Case Studies' },
    title: { tr: 'Vaka Çalışmaları — Ecozyon Tech', en: 'Case Studies — Ecozyon Tech' },
  },
  {
    path: '/glossary',
    key: 'glossary',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Sözlük', en: 'Glossary' },
    title: { tr: 'Sürdürülebilirlik Sözlüğü — Ecozyon Tech', en: 'Sustainability Glossary — Ecozyon Tech' },
  },
  {
    path: '/help',
    key: 'help',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Yardım', en: 'Help' },
    title: { tr: 'Yardım Merkezi — Ecozyon Tech', en: 'Help Center — Ecozyon Tech' },
  },
  {
    path: '/developers',
    key: 'developers',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Geliştiriciler', en: 'Developers' },
    title: { tr: 'API Referansı — Ecozyon Tech', en: 'API Reference — Ecozyon Tech' },
  },
  {
    path: '/changelog',
    key: 'changelog',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Sürüm Notları', en: 'Changelog' },
    title: { tr: 'Sürüm Notları — Ecozyon Tech', en: 'Changelog — Ecozyon Tech' },
  },
  {
    path: '/status',
    key: 'status',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Sistem Durumu', en: 'Status' },
    title: { tr: 'Sistem Durumu — Ecozyon Tech', en: 'System Status — Ecozyon Tech' },
  },
  {
    path: '/resources',
    key: 'resources',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Kaynaklar', en: 'Resources' },
    title: { tr: 'Kaynaklar — Ecozyon Tech', en: 'Resources — Ecozyon Tech' },
  },
  {
    path: '/about',
    key: 'about',
    group: 'company',
    place: 'nav',
    featured: true,
    nav: { tr: 'Hakkımızda', en: 'About' },
    title: { tr: 'Hakkımızda — Ecozyon Tech', en: 'About — Ecozyon Tech' },
  },
  {
    path: '/careers',
    key: 'careers',
    group: 'company',
    place: 'nav',
    nav: { tr: 'Kariyer', en: 'Careers' },
    title: { tr: 'Kariyer — Ecozyon Tech', en: 'Careers — Ecozyon Tech' },
  },
  {
    path: '/press',
    key: 'press',
    group: 'company',
    place: 'nav',
    nav: { tr: 'Basın', en: 'Press' },
    title: { tr: 'Basın Odası — Ecozyon Tech', en: 'Newsroom — Ecozyon Tech' },
  },
  {
    path: '/contact',
    key: 'contact',
    group: 'company',
    place: 'nav',
    featured: true,
    nav: { tr: 'İletişim', en: 'Contact' },
    title: { tr: 'İletişim — Ecozyon Tech', en: 'Contact — Ecozyon Tech' },
  },
  {
    path: '/legal',
    key: 'legal',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Yasal', en: 'Legal' },
    title: { tr: 'Yasal — Gizlilik & Şartlar — Ecozyon Tech', en: 'Legal — Privacy & Terms — Ecozyon Tech' },
  },
  {
    path: '/accessibility',
    key: 'accessibility',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Erişilebilirlik', en: 'Accessibility' },
    title: { tr: 'Erişilebilirlik Beyanı — Ecozyon Tech', en: 'Accessibility Statement — Ecozyon Tech' },
  },
  {
    path: '/sitemap',
    key: 'sitemap',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Site Haritası', en: 'Sitemap' },
    title: { tr: 'Site Haritası — Ecozyon Tech', en: 'Sitemap — Ecozyon Tech' },
  },
  {
    path: '/styleguide',
    key: 'styleguide',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Tasarım Sistemi', en: 'Design System' },
    title: { tr: 'Tasarım Sistemi — Ecozyon Tech', en: 'Design System — Ecozyon Tech' },
  },
  {
    path: '/search',
    key: 'search',
    group: 'legal',
    place: 'none',
    nav: { tr: 'Arama', en: 'Search' },
    title: { tr: 'Arama — Ecozyon Tech', en: 'Search — Ecozyon Tech' },
  },
];

export const routeByKey = (key) => ROUTES.find((r) => r.key === key);

// Routes in an IA group, optionally filtered to specific nav surfaces.
// `places` omitted = every route in the group (used by the sitemap).
export const routesInGroup = (groupId, places) =>
  ROUTES.filter((r) => r.group === groupId && (!places || places.includes(r.place)));

// Navbar mega-menu groups, in display order (the logo covers home).
export const NAV_GROUPS = [
  { id: 'product', label: { tr: 'Çözümler', en: 'Solutions' } },
  { id: 'resources', label: { tr: 'Kaynaklar', en: 'Resources' } },
  { id: 'company', label: { tr: 'Şirket', en: 'Company' } },
];

// Footer columns = the nav groups + a legal/utility column.
export const FOOTER_GROUPS = [
  ...NAV_GROUPS,
  { id: 'legal', label: { tr: 'Yasal', en: 'Legal' } },
];

// Curated highlights, surfaced as the NotFound "popular pages" chips.
export const NAV_ITEMS = ROUTES.filter((r) => r.featured);
