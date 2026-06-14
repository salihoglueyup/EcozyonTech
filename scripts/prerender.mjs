// Post-build static prerender: render every route to real HTML, inject
// per-route <head>, and emit sitemap.xml + robots.txt.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { ROUTES, SITE, routeByKey } from '../src/core/config/site.js';
import { POSTS, postTags, tagSlug } from '../src/core/data/posts.js';
import { CASES } from '../src/core/data/cases.js';
import { INTEGRATIONS } from '../src/core/data/integrations.js';
import { HELP } from '../src/core/data/help.js';
import { TIERS, PRICING_FAQ } from '../src/core/data/pricing.js';
import { buildFeed } from '../src/core/lib/feed.js';
import { ogCardSvg } from '../src/core/lib/og.js';
import { blogPosting, article, website, faqPage, product, breadcrumbList, ldScript } from '../src/core/lib/jsonld.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

const { render } = await import(
  pathToFileURL(join(root, 'dist-server', 'entry-server.js')).href
);
const template = await readFile(join(distDir, 'index.html'), 'utf8');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const today = new Date().toISOString().slice(0, 10);
const OG_FOOTER = 'React 19 · Vite 8 · Three.js';

// Rasterize the branded OG SVGs to real PNGs — most social crawlers (X,
// Facebook, LinkedIn, iMessage) don't render SVG og:image. We bundle the exact
// brand fonts (TTF) so text renders identically on every build machine.
const FONT_FILES = [
  join(root, 'node_modules/@expo-google-fonts/space-grotesk/700Bold/SpaceGrotesk_700Bold.ttf'),
  join(root, 'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
  join(root, 'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
];
const svgToPng = (svg) =>
  new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Space Grotesk' },
  })
    .render()
    .asPng();

// Branded OG cards via the shared (unit-tested) builder.
const postOgSvg = (post) =>
  ogCardSvg({
    eyebrow: 'Ecozyon Tech · Blog',
    title: post.title.tr,
    subtitle: post.excerpt.tr,
    footerLeft: 'ECOZYON.TECH/BLOG',
    footerRight: post.date || today,
  });

const routeOgSvg = (route) =>
  ogCardSvg({
    eyebrow: 'Ecozyon Tech',
    title: route.navTitle,
    subtitle: route.desc,
    footerLeft: 'ECOZYON.TECH',
    footerRight: OG_FOOTER,
  });

const caseOgSvg = (cs) =>
  ogCardSvg({
    eyebrow: `Ecozyon Tech · ${cs.city}`,
    title: cs.client.tr,
    subtitle: cs.summary.tr,
    footerLeft: 'ECOZYON.TECH/CASES',
    footerRight: String(cs.year),
  });

const integrationOgSvg = (it) =>
  ogCardSvg({
    eyebrow: 'Ecozyon Tech · Integrations',
    title: it.name,
    subtitle: it.tagline.tr,
    footerLeft: 'ECOZYON.TECH/INTEGRATIONS',
    footerRight: it.category.tr,
  });

// Build the list of concrete URLs to prerender.
const routes = ROUTES.filter((r) => r.path !== '*' && !r.path.includes(':')).map((r) => ({
  path: r.path,
  key: r.key,
  title: r.title.tr,
  navTitle: r.nav.tr,
  desc: SITE.description,
  lastmod: today,
}));
for (const p of POSTS) {
  routes.push({
    path: `/blog/${p.slug}`,
    title: `${p.title.tr} — Ecozyon Tech`,
    desc: p.excerpt.tr,
    lastmod: p.date || today,
    post: p, // carry the post so we can emit BlogPosting JSON-LD
  });
}
for (const tg of postTags(POSTS)) {
  routes.push({
    path: `/blog/tag/${tagSlug(tg.id)}`,
    title: `${tg.label.tr} — Blog — Ecozyon Tech`,
    desc: `${tg.label.tr} etiketli yazılar — Ecozyon Tech`,
    lastmod: today,
    tag: tg, // carry the tag so we can emit a BreadcrumbList
  });
}
for (const cs of CASES) {
  routes.push({
    path: `/cases/${cs.slug}`,
    title: `${cs.client.tr} — Ecozyon Tech`,
    desc: cs.summary.tr,
    lastmod: today,
    caseStudy: cs, // carry the case so we can emit Article JSON-LD + OG card
  });
}
for (const it of INTEGRATIONS) {
  routes.push({
    path: `/integrations/${it.slug}`,
    title: `${it.name} — Ecozyon Tech`,
    desc: it.tagline.tr,
    lastmod: today,
    integration: it, // carry the integration for its own OG card
  });
}

// Bilingual nav label for a parent section (used in breadcrumb trails).
const sectionName = (key) => routeByKey(key)?.nav.tr || key;
const HOME_CRUMB = { name: routeByKey('home')?.nav.tr || 'Ana Sayfa', path: '/' };

// One Offer per pricing tier; Free/Enterprise (no numeric amount) → price 0.
const pricingOffers = TIERS.map((tier) => ({
  name: tier.name.tr,
  price: tier.amounts?.USD ?? 0,
  currency: 'USD',
}));

// schema.org JSON-LD node(s) appropriate for a route, built from the shared
// (unit-tested) builders. Every non-home page gets a BreadcrumbList; content
// types add their own (BlogPosting/Article), and pricing/help add commerce/FAQ.
function structuredData(route, url) {
  const nodes = [];
  if (route.key === 'home') {
    nodes.push(website(SITE, 'tr'));
  } else if (route.post) {
    const p = route.post;
    nodes.push(blogPosting({ post: p, url, site: SITE, image: `${SITE.url}/og/${p.slug}.png`, lang: 'tr' }));
    nodes.push(breadcrumbList([HOME_CRUMB, { name: sectionName('blog'), path: '/blog' }, { name: p.title.tr }], SITE));
  } else if (route.caseStudy) {
    const c = route.caseStudy;
    nodes.push(article({ headline: c.client.tr, description: c.summary.tr, url, site: SITE, image: `${SITE.url}/og/case-${c.slug}.png`, lang: 'tr' }));
    nodes.push(breadcrumbList([HOME_CRUMB, { name: sectionName('cases'), path: '/cases' }, { name: c.client.tr }], SITE));
  } else if (route.integration) {
    const it = route.integration;
    nodes.push(breadcrumbList([HOME_CRUMB, { name: sectionName('integrations'), path: '/integrations' }, { name: it.name }], SITE));
  } else if (route.tag) {
    nodes.push(breadcrumbList([HOME_CRUMB, { name: sectionName('blog'), path: '/blog' }, { name: route.tag.label.tr }], SITE));
  } else if (route.key) {
    if (route.key === 'pricing') {
      nodes.push(product({ name: `${SITE.name} — ${route.navTitle}`, description: route.desc, url, site: SITE, offers: pricingOffers, currency: 'USD', lang: 'tr' }));
      nodes.push(faqPage(PRICING_FAQ, 'tr'));
    } else if (route.key === 'help') {
      nodes.push(faqPage(HELP, 'tr'));
    }
    nodes.push(breadcrumbList([HOME_CRUMB, { name: route.navTitle }], SITE));
  }
  return nodes;
}

// hreflang alternates. The site is one URL per route serving TR by default;
// `?lang=en` makes the client render English, so it is the EN alternate.
function hreflangFor(url) {
  const en = `${url}${url.includes('?') ? '&' : '?'}lang=en`;
  return [
    `<link rel="alternate" hreflang="tr" href="${esc(url)}" />`,
    `<link rel="alternate" hreflang="en" href="${esc(en)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${esc(url)}" />`,
  ].join('\n    ');
}

function headFor(route) {
  const url = SITE.url + (route.path === '/' ? '/' : route.path);
  // Every route gets its own branded OG card: posts by slug, cases by slug,
  // pages by key.
  const ogImage = route.post
    ? `${SITE.url}/og/${route.post.slug}.png`
    : route.caseStudy
      ? `${SITE.url}/og/case-${route.caseStudy.slug}.png`
      : route.integration
        ? `${SITE.url}/og/integration-${route.integration.slug}.png`
        : route.key
          ? `${SITE.url}/og/route-${route.key}.png`
          : null;
  const tags = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.desc)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.desc)}" />`,
  ];
  if (ogImage) {
    // Override the brand defaults from index.html so social previews show the
    // post's own card. Browsers/crawlers honor the last seen meta tag.
    tags.push(
      `<meta property="og:image" content="${esc(ogImage)}" />`,
      `<meta name="twitter:image" content="${esc(ogImage)}" />`,
    );
  }
  tags.push(hreflangFor(url));
  const ld = structuredData(route, url);
  if (ld.length) tags.push(ldScript(ld));
  return tags.join('\n    ');
}

// Emit branded OG SVGs to dist/og/ before HTML generation so the injected
// og:image / canonical references point at live files. Posts by slug, pages
// by route-<key>.
await mkdir(join(distDir, 'og'), { recursive: true });
let ogCount = 0;
for (const p of POSTS) {
  await writeFile(join(distDir, 'og', `${p.slug}.png`), svgToPng(postOgSvg(p)));
  ogCount++;
}
for (const cs of CASES) {
  await writeFile(join(distDir, 'og', `case-${cs.slug}.png`), svgToPng(caseOgSvg(cs)));
  ogCount++;
}
for (const it of INTEGRATIONS) {
  await writeFile(join(distDir, 'og', `integration-${it.slug}.png`), svgToPng(integrationOgSvg(it)));
  ogCount++;
}
for (const route of routes) {
  if (route.post || route.caseStudy || !route.key) continue;
  await writeFile(join(distDir, 'og', `route-${route.key}.png`), svgToPng(routeOgSvg(route)));
  ogCount++;
}
// Default brand card referenced by index.html (og:image fallback).
await writeFile(
  join(distDir, 'og.png'),
  svgToPng(
    ogCardSvg({
      eyebrow: 'Ecozyon Tech',
      title: 'AI ile sürdürülebilirlik',
      subtitle: SITE.description,
      footerLeft: 'ECOZYON.TECH',
      footerRight: OG_FOOTER,
    }),
  ),
);
ogCount++;

let count = 0;
for (const route of routes) {
  const appHtml = await render(route.path);
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${esc(route.desc)}" />`,
    )
    .replace('<!--ssr-head-->', headFor(route))
    .replace('<!--ssr-outlet-->', appHtml);

  const outPath =
    route.path === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.path, 'index.html');
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  count++;
}

// sitemap.xml — emit <lastmod> from the post date or the build date.
const urls = routes
  .map(
    (r) =>
      `  <url><loc>${SITE.url}${r.path === '/' ? '/' : r.path}</loc><lastmod>${r.lastmod}</lastmod></url>`,
  )
  .join('\n');
await writeFile(
  join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// robots.txt
await writeFile(
  join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`,
);

// feed.xml — RSS 2.0 of every blog post (newest-first, as authored).
await writeFile(join(distDir, 'feed.xml'), buildFeed({ posts: POSTS, site: SITE, lang: 'tr' }));

console.log(`✓ prerendered ${count} routes + ${ogCount} OG cards + sitemap.xml + robots.txt + feed.xml`);
