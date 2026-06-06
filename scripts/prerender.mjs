// Post-build static prerender: render every route to real HTML, inject
// per-route <head>, and emit sitemap.xml + robots.txt.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROUTES, SITE } from '../src/core/config/site.js';
import { POSTS } from '../src/core/data/posts.js';
import { CASES } from '../src/core/data/cases.js';
import { buildFeed } from '../src/core/lib/feed.js';
import { ogCardSvg } from '../src/core/lib/og.js';

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
for (const cs of CASES) {
  routes.push({
    path: `/cases/${cs.slug}`,
    title: `${cs.client.tr} — Ecozyon Tech`,
    desc: cs.summary.tr,
    lastmod: today,
    caseStudy: cs, // carry the case so we can emit Article JSON-LD + OG card
  });
}

function blogPostingLd(route, url) {
  const p = route.post;
  const ogUrl = `${SITE.url}/og/${p.slug}.svg`;
  return [
    '<script type="application/ld+json">',
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title.tr,
      description: p.excerpt.tr,
      datePublished: p.date,
      dateModified: p.date,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Organization', name: 'Ecozyon Tech', url: SITE.url },
      publisher: {
        '@type': 'Organization',
        name: 'Ecozyon Tech',
        logo: { '@type': 'ImageObject', url: `${SITE.url}/og.svg` },
      },
      image: ogUrl,
      inLanguage: 'tr',
    }),
    '</script>',
  ].join('');
}

function caseStudyLd(route, url) {
  const c = route.caseStudy;
  const ogUrl = `${SITE.url}/og/case-${c.slug}.svg`;
  return [
    '<script type="application/ld+json">',
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.client.tr,
      description: c.summary.tr,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Organization', name: 'Ecozyon Tech', url: SITE.url },
      publisher: {
        '@type': 'Organization',
        name: 'Ecozyon Tech',
        logo: { '@type': 'ImageObject', url: `${SITE.url}/og.svg` },
      },
      image: ogUrl,
      inLanguage: 'tr',
    }),
    '</script>',
  ].join('');
}

function headFor(route) {
  const url = SITE.url + (route.path === '/' ? '/' : route.path);
  // Every route gets its own branded OG card: posts by slug, cases by slug,
  // pages by key.
  const ogImage = route.post
    ? `${SITE.url}/og/${route.post.slug}.svg`
    : route.caseStudy
      ? `${SITE.url}/og/case-${route.caseStudy.slug}.svg`
      : route.key
        ? `${SITE.url}/og/route-${route.key}.svg`
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
  if (route.post) tags.push(blogPostingLd(route, url));
  if (route.caseStudy) tags.push(caseStudyLd(route, url));
  return tags.join('\n    ');
}

// Emit branded OG SVGs to dist/og/ before HTML generation so the injected
// og:image / canonical references point at live files. Posts by slug, pages
// by route-<key>.
await mkdir(join(distDir, 'og'), { recursive: true });
let ogCount = 0;
for (const p of POSTS) {
  await writeFile(join(distDir, 'og', `${p.slug}.svg`), postOgSvg(p));
  ogCount++;
}
for (const cs of CASES) {
  await writeFile(join(distDir, 'og', `case-${cs.slug}.svg`), caseOgSvg(cs));
  ogCount++;
}
for (const route of routes) {
  if (route.post || route.caseStudy || !route.key) continue;
  await writeFile(join(distDir, 'og', `route-${route.key}.svg`), routeOgSvg(route));
  ogCount++;
}

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
