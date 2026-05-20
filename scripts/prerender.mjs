// Post-build static prerender: render every route to real HTML, inject
// per-route <head>, and emit sitemap.xml + robots.txt.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROUTES, SITE } from '../src/core/config/site.js';
import { POSTS } from '../src/core/data/posts.js';

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

// Build the list of concrete URLs to prerender.
const routes = ROUTES.filter((r) => r.path !== '*' && !r.path.includes(':')).map((r) => ({
  path: r.path,
  title: r.title.tr,
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

function blogPostingLd(route, url) {
  const p = route.post;
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
      image: `${SITE.url}/og.svg`,
      inLanguage: 'tr',
    }),
    '</script>',
  ].join('');
}

function headFor(route) {
  const url = SITE.url + (route.path === '/' ? '/' : route.path);
  const tags = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.desc)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.desc)}" />`,
  ];
  if (route.post) tags.push(blogPostingLd(route, url));
  return tags.join('\n    ');
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

console.log(`✓ prerendered ${count} routes + sitemap.xml + robots.txt`);
