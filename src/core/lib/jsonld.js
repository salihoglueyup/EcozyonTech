// Pure schema.org JSON-LD builders. Each returns a plain object (no DOM, no
// config imports) so the same code runs in the Vite app, in Vitest and in the
// Node prerender script. Callers pass site/url/data explicitly.
//
// `ldScript(obj | obj[])` wraps one or more nodes in a ready-to-inject
// <script type="application/ld+json"> string for the prerender step.

const CTX = 'https://schema.org';

const orgRef = (site) => ({ '@type': 'Organization', name: site.name, url: site.url });

const publisher = (site) => ({
  '@type': 'Organization',
  name: site.name,
  logo: { '@type': 'ImageObject', url: `${site.url}/og.png` },
});

const abs = (site, path) => `${site.url}${path === '/' ? '/' : path}`;

export function organization(site) {
  return {
    '@context': CTX,
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    logo: { '@type': 'ImageObject', url: `${site.url}/og.png` },
  };
}

// WebSite + SearchAction → eligible for the Google sitelinks search box.
export function website(site, lang = 'tr') {
  return {
    '@context': CTX,
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: lang,
    publisher: orgRef(site),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function blogPosting({ post, url, site, image, lang = 'tr' }) {
  return {
    '@context': CTX,
    '@type': 'BlogPosting',
    headline: post.title[lang],
    description: post.excerpt[lang],
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: orgRef(site),
    publisher: publisher(site),
    image,
    inLanguage: lang,
  };
}

export function article({ headline, description, url, site, image, lang = 'tr' }) {
  return {
    '@context': CTX,
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: orgRef(site),
    publisher: publisher(site),
    image,
    inLanguage: lang,
  };
}

// Product with one Offer per priced tier. Free/custom tiers (no numeric
// amount) become offers at price 0 / availability-only so the node stays valid.
export function product({ name, description, url, site, offers, currency = 'USD', lang = 'tr' }) {
  return {
    '@context': CTX,
    '@type': 'Product',
    name,
    description,
    brand: orgRef(site),
    url,
    offers: offers.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: String(o.price ?? 0),
      priceCurrency: o.currency || currency,
      availability: 'https://schema.org/InStock',
      url,
    })),
    inLanguage: lang,
  };
}

export function faqPage(qas, lang = 'tr') {
  return {
    '@context': CTX,
    '@type': 'FAQPage',
    mainEntity: qas.map((x) => ({
      '@type': 'Question',
      name: typeof x.q === 'string' ? x.q : x.q[lang],
      acceptedAnswer: { '@type': 'Answer', text: typeof x.a === 'string' ? x.a : x.a[lang] },
    })),
  };
}

// items: [{ name, path }] in order from root → current. `path` optional on the
// last (current) crumb. Positions are 1-based.
export function breadcrumbList(items, site) {
  return {
    '@context': CTX,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => {
      const node = { '@type': 'ListItem', position: i + 1, name: it.name };
      if (it.path) node.item = abs(site, it.path);
      return node;
    }),
  };
}

// CollectionPage + ItemList for index pages (blog, cases, integrations…).
export function collectionPage({ name, description, url, items, site, lang = 'tr' }) {
  return {
    '@context': CTX,
    '@type': 'CollectionPage',
    name,
    description,
    url,
    inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: abs(site, it.path),
      })),
    },
  };
}

export function ldScript(data) {
  const nodes = Array.isArray(data) ? data : [data];
  return nodes
    .map((n) => `<script type="application/ld+json">${JSON.stringify(n)}</script>`)
    .join('');
}
