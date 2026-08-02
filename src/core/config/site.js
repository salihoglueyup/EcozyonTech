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
//  - `description`: per-route, bilingual meta description — the single source
//    for the prerendered <meta name="description">/og:description (so each route
//    ships a distinct snippet, not the generic SITE.description) and the runtime
//    <title>'s sibling. Detail/list routes (blog post, case, integration, tag)
//    set their description dynamically in the prerender from their own data.
// Pages pull the document <title> from here via useDocumentMeta.
export const ROUTES = [
  {
    path: '/',
    key: 'home',
    group: 'product',
    place: 'none',
    nav: { tr: 'Ana Sayfa', en: 'Home' },
    title: { tr: 'Ecozyon Tech — AI ile sürdürülebilirlik', en: 'Ecozyon Tech — Sustainability with AI' },
    description: {
      tr: 'Giyilebilir teknoloji ve akıllı AI ile bireysel ve kurumsal sürdürülebilirliği ölçülebilir, uygulanabilir alışkanlıklara dönüştürüyoruz.',
      en: 'We turn individual and corporate sustainability into measurable, practical habits with wearable technology and smart AI.',
    },
  },
  {
    path: '/services',
    key: 'services',
    group: 'product',
    place: 'nav',
    featured: true,
    nav: { tr: 'Hizmetler', en: 'Services' },
    title: { tr: 'Çözümler — Ecozyon Tech', en: 'Solutions — Ecozyon Tech' },
    description: {
      tr: 'Ecozyon Tech çözümleri: nasıl çalışır, teknoloji ekosistemi, kullanım senaryoları ve canlı dashboard.',
      en: 'Ecozyon Tech solutions: how it works, the technology ecosystem, use cases and a live dashboard.',
    },
  },
  {
    path: '/impact',
    key: 'impact',
    group: 'product',
    place: 'nav',
    featured: true,
    nav: { tr: 'Etki Haritası', en: 'Impact Map' },
    title: { tr: 'Etki Haritası — Ecozyon Tech', en: 'Impact Map — Ecozyon Tech' },
    description: {
      tr: 'Şehir şehir gerçek etki: kullanıcılar, önlenen CO₂ ve yenilenebilir kullanımı interaktif 3B dünya üzerinde.',
      en: 'Real impact city by city: users, CO₂ avoided and renewable use on an interactive 3D globe.',
    },
  },
  {
    path: '/roi',
    key: 'roi',
    group: 'product',
    place: 'nav',
    nav: { tr: 'ROI Hesaplayıcı', en: 'ROI Calculator' },
    title: { tr: 'Kurumsal ROI Hesaplayıcı — Ecozyon Tech', en: 'Business ROI Calculator — Ecozyon Tech' },
    description: {
      tr: 'Kurumsal yatırım getirinizi hesaplayın: ekip büyüklüğü ve hedeflerinize göre tasarruf, önlenen emisyon ve geri dönüş süresi.',
      en: 'Estimate your business ROI: savings, emissions avoided and payback based on your team size and goals.',
    },
  },
  {
    path: '/assessment',
    key: 'assessment',
    group: 'product',
    place: 'nav',
    nav: { tr: 'Değerlendirme', en: 'Assessment' },
    title: { tr: 'Sürdürülebilirlik Değerlendirmesi — Ecozyon Tech', en: 'Sustainability Assessment — Ecozyon Tech' },
    description: {
      tr: 'Birkaç soruda sürdürülebilirlik olgunluğunuzu ölçün ve size uygun başlangıç adımlarını alın.',
      en: 'Gauge your sustainability maturity in a few questions and get tailored first steps.',
    },
  },
  {
    path: '/blog',
    key: 'blog',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Blog', en: 'Blog' },
    title: { tr: 'Blog — Ecozyon Tech', en: 'Blog — Ecozyon Tech' },
    description: {
      tr: 'Sürdürülebilirlik, donanım ve davranış değişimi üzerine notlar ve içgörüler.',
      en: 'Notes and insights on sustainability, hardware and behavior change.',
    },
  },
  {
    path: '/cases',
    key: 'cases',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Vaka Çalışmaları', en: 'Case Studies' },
    title: { tr: 'Vaka Çalışmaları — Ecozyon Tech', en: 'Case Studies — Ecozyon Tech' },
    description: {
      tr: 'Gerçek kurumların ölçülen sonuçları: önlenen emisyon, tasarruf ve davranış değişimi vaka çalışmalarıyla.',
      en: 'Measured results from real organizations: emissions avoided, savings and behavior change, case by case.',
    },
  },
  {
    path: '/glossary',
    key: 'glossary',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Sözlük', en: 'Glossary' },
    title: { tr: 'Sürdürülebilirlik Sözlüğü — Ecozyon Tech', en: 'Sustainability Glossary — Ecozyon Tech' },
    description: {
      tr: 'Karbon bütçesinden Scope 3’e: sürdürülebilirlik terimlerinin sade, aranabilir bir sözlüğü.',
      en: 'From carbon budget to Scope 3: a plain, searchable glossary of sustainability terms.',
    },
  },
  {
    path: '/help',
    key: 'help',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Yardım', en: 'Help' },
    title: { tr: 'Yardım Merkezi — Ecozyon Tech', en: 'Help Center — Ecozyon Tech' },
    description: {
      tr: 'Kurulum, cihaz, veri ve faturalandırma hakkında sık sorulan soruların yanıtları.',
      en: 'Answers to common questions about setup, devices, data and billing.',
    },
  },
  {
    path: '/developers',
    key: 'developers',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Geliştiriciler', en: 'Developers' },
    title: { tr: 'API Referansı — Ecozyon Tech', en: 'API Reference — Ecozyon Tech' },
    description: {
      tr: 'Ecozyon Tech API’si: kimlik doğrulama, uç noktalar ve örneklerle entegrasyon geliştirin.',
      en: 'The Ecozyon Tech API: build integrations with authentication, endpoints and examples.',
    },
  },
  {
    path: '/changelog',
    key: 'changelog',
    group: 'resources',
    place: 'nav',
    nav: { tr: 'Sürüm Notları', en: 'Changelog' },
    title: { tr: 'Sürüm Notları — Ecozyon Tech', en: 'Changelog — Ecozyon Tech' },
    description: {
      tr: 'Ecozyon Tech’te yeni neler var: ürün güncellemeleri, iyileştirmeler ve düzeltmeler sürüm sürüm.',
      en: 'What’s new in Ecozyon Tech: product updates, improvements and fixes, release by release.',
    },
  },
  {
    path: '/about',
    key: 'about',
    group: 'company',
    place: 'nav',
    featured: true,
    nav: { tr: 'Hakkımızda', en: 'About' },
    title: { tr: 'Hakkımızda — Ecozyon Tech', en: 'About — Ecozyon Tech' },
    description: {
      tr: 'Ecozyon Tech’in hikâyesi, misyonu ve ekibi — sürdürülebilirliği herkes için ölçülebilir kılma yolculuğu.',
      en: 'The story, mission and team behind Ecozyon Tech — making sustainability measurable for everyone.',
    },
  },
  {
    path: '/careers',
    key: 'careers',
    group: 'company',
    place: 'nav',
    nav: { tr: 'Kariyer', en: 'Careers' },
    title: { tr: 'Kariyer — Ecozyon Tech', en: 'Careers — Ecozyon Tech' },
    description: {
      tr: 'Sürdürülebilir bir geleceği inşa eden ekibe katılın. Açık pozisyonları görün ve başvurun.',
      en: 'Join the team building a sustainable future. See open roles and apply.',
    },
  },
  {
    path: '/press',
    key: 'press',
    group: 'company',
    place: 'nav',
    nav: { tr: 'Basın', en: 'Press' },
    title: { tr: 'Basın Odası — Ecozyon Tech', en: 'Newsroom — Ecozyon Tech' },
    description: {
      tr: 'Basın bültenleri, medya yansımaları, marka varlıkları ve basın iletişimi tek yerde.',
      en: 'Press releases, media coverage, brand assets and press contact in one place.',
    },
  },
  {
    path: '/contact',
    key: 'contact',
    group: 'company',
    place: 'nav',
    featured: true,
    nav: { tr: 'İletişim', en: 'Contact' },
    title: { tr: 'İletişim — Ecozyon Tech', en: 'Contact — Ecozyon Tech' },
    description: {
      tr: 'Ekibimizle konuşun: satış, destek, basın veya kariyer — doğru kanala birkaç saniyede ulaşın.',
      en: 'Talk to our team: sales, support, press or careers — reach the right channel in seconds.',
    },
  },
  {
    path: '/legal',
    key: 'legal',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Yasal', en: 'Legal' },
    title: { tr: 'Yasal — Gizlilik & Şartlar — Ecozyon Tech', en: 'Legal — Privacy & Terms — Ecozyon Tech' },
    description: {
      tr: 'Gizlilik politikası, kullanım şartları ve veri işleme uygulamalarımız.',
      en: 'Our privacy policy, terms of use and data-processing practices.',
    },
  },
  {
    path: '/accessibility',
    key: 'accessibility',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Erişilebilirlik', en: 'Accessibility' },
    title: { tr: 'Erişilebilirlik Beyanı — Ecozyon Tech', en: 'Accessibility Statement — Ecozyon Tech' },
    description: {
      tr: 'Erişilebilirlik taahhüdümüz: WCAG uyumu, desteklenen teknolojiler ve geri bildirim yolları.',
      en: 'Our accessibility commitment: WCAG conformance, supported assistive tech and how to give feedback.',
    },
  },
  {
    path: '/sitemap',
    key: 'sitemap',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Site Haritası', en: 'Sitemap' },
    title: { tr: 'Site Haritası — Ecozyon Tech', en: 'Sitemap — Ecozyon Tech' },
    description: {
      tr: 'Ecozyon Tech’teki tüm sayfaların tek listede gezinilebilir bir haritası.',
      en: 'A browsable map of every page on Ecozyon Tech in one list.',
    },
  },
  {
    path: '/styleguide',
    key: 'styleguide',
    group: 'legal',
    place: 'footer',
    nav: { tr: 'Tasarım Sistemi', en: 'Design System' },
    title: { tr: 'Tasarım Sistemi — Ecozyon Tech', en: 'Design System — Ecozyon Tech' },
    description: {
      tr: 'Ecozyon Tech tasarım sistemi: renkler, tipografi, bileşenler ve etkileşim örnekleri.',
      en: 'The Ecozyon Tech design system: colors, typography, components and interaction examples.',
    },
  },
  {
    path: '/search',
    key: 'search',
    group: 'legal',
    place: 'none',
    nav: { tr: 'Arama', en: 'Search' },
    title: { tr: 'Arama — Ecozyon Tech', en: 'Search — Ecozyon Tech' },
    description: {
      tr: 'Ecozyon Tech genelinde arayın: sayfalar, blog yazıları, vaka çalışmaları, sözlük ve daha fazlası.',
      en: 'Search across Ecozyon Tech: pages, blog posts, case studies, glossary and more.',
    },
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
