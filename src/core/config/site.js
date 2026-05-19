// Central site configuration: brand metadata, routes, navigation.

export const SITE = {
  name: 'Ecozyon Tech',
  domain: 'ecozyon.tech',
  email: 'hello@ecozyon.tech',
  description:
    'Ecozyon Tech turns individual and corporate sustainability into measurable, practical habits with wearable technology and smart AI.',
};

// Route → page metadata. `navLabel` is keyed per language; pages pull the
// document <title>/description from here via useDocumentMeta.
export const ROUTES = [
  {
    path: '/',
    key: 'home',
    nav: { tr: 'Ana Sayfa', en: 'Home' },
    title: { tr: 'Ecozyon Tech — AI ile sürdürülebilirlik', en: 'Ecozyon Tech — Sustainability with AI' },
  },
  {
    path: '/services',
    key: 'services',
    nav: { tr: 'Çözümler', en: 'Solutions' },
    title: { tr: 'Çözümler — Ecozyon Tech', en: 'Solutions — Ecozyon Tech' },
  },
  {
    path: '/impact',
    key: 'impact',
    nav: { tr: 'Etki Haritası', en: 'Impact Map' },
    title: { tr: 'Etki Haritası — Ecozyon Tech', en: 'Impact Map — Ecozyon Tech' },
  },
  {
    path: '/about',
    key: 'about',
    nav: { tr: 'Hakkımızda', en: 'About' },
    title: { tr: 'Hakkımızda — Ecozyon Tech', en: 'About — Ecozyon Tech' },
  },
  {
    path: '/contact',
    key: 'contact',
    nav: { tr: 'İletişim', en: 'Contact' },
    title: { tr: 'İletişim — Ecozyon Tech', en: 'Contact — Ecozyon Tech' },
  },
];

// Items shown in the primary navbar (everything except the bare home route,
// which is reachable through the logo).
export const NAV_ITEMS = ROUTES.filter((r) => r.path !== '/');
