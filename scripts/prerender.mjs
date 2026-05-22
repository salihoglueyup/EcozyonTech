// Post-build static prerender: render every route to real HTML, inject
// per-route <head>, and emit sitemap.xml + robots.txt.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROUTES, SITE } from '../src/core/config/site.js';
import { POSTS } from '../src/core/data/posts.js';
import { buildFeed } from '../src/core/lib/feed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

const { render } = await import(
  pathToFileURL(join(root, 'dist-server', 'entry-server.js')).href
);
const template = await readFile(join(distDir, 'index.html'), 'utf8');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── Per-post OG image generation ──────────────────────────────────────────
// Wraps a string to at most `maxLines` lines of ~`width` chars each, breaking
// on word boundaries. SVG has no auto-wrap so we pre-split here.
function wrap(text, width, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [''];
  for (const w of words) {
    const last = lines[lines.length - 1];
    const next = last ? last + ' ' + w : w;
    if (next.length <= width) {
      lines[lines.length - 1] = next;
    } else if (lines.length < maxLines) {
      lines.push(w);
    } else {
      // No room left — let the last line overflow; we ellipsize below.
      lines[lines.length - 1] = next;
    }
  }
  const lastIdx = lines.length - 1;
  if (lines[lastIdx].length > width) {
    lines[lastIdx] = lines[lastIdx].slice(0, width - 1).trimEnd() + '…';
  }
  return lines;
}

// Branded OG card with the post title and excerpt swapped in. Same layout as
// public/og.svg so the visual identity stays consistent across the site.
function postOgSvg(post) {
  const titleLines = wrap(post.title.tr, 32, 2);
  const excerpt = wrap(post.excerpt.tr, 68, 1)[0] || '';
  const t1 = esc(titleLines[0] || '');
  const t2 = esc(titleLines[1] || '');
  const sub = esc(excerpt);
  const date = post.date || today;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F8FAFC"/><stop offset="100%" stop-color="#ECFEFF"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#0EA5E9"/><stop offset="100%" stop-color="#10B981"/></linearGradient>
    <radialGradient id="glow1" cx="0.85" cy="0.2" r="0.55"><stop offset="0%" stop-color="#0EA5E9" stop-opacity="0.28"/><stop offset="100%" stop-color="#0EA5E9" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="0.15" cy="0.95" r="0.5"><stop offset="0%" stop-color="#10B981" stop-opacity="0.30"/><stop offset="100%" stop-color="#10B981" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <g transform="translate(950 480)">
    <circle r="190" fill="none" stroke="url(#accent)" stroke-width="1.5" opacity="0.35"/>
    <circle r="150" fill="none" stroke="#0EA5E9" stroke-width="1" opacity="0.25"/>
    <circle r="105" fill="none" stroke="#10B981" stroke-width="1" opacity="0.3"/>
    <circle r="60" fill="url(#accent)" opacity="0.18"/>
  </g>
  <g transform="translate(80 110)">
    <circle cx="22" cy="22" r="22" fill="url(#accent)"/>
    <path d="M14 22 L20 28 L32 16" stroke="white" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="58" y="30" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="28" fill="#0F172A" letter-spacing="-0.5">Ecozyon Tech · Blog</text>
  </g>
  <text x="80" y="280" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="64" fill="#0F172A" letter-spacing="-2">${t1}</text>
  <text x="80" y="358" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="64" fill="url(#accent)" letter-spacing="-2">${t2}</text>
  <text x="80" y="430" font-family="'Inter', system-ui, sans-serif" font-weight="400" font-size="22" fill="#475569" letter-spacing="-0.3">${sub}</text>
  <g transform="translate(80 545)">
    <rect x="0" y="0" width="6" height="22" rx="3" fill="url(#accent)"/>
    <text x="18" y="17" font-family="'Inter', system-ui, sans-serif" font-weight="600" font-size="15" fill="#0F172A" letter-spacing="0.5">ECOZYON.TECH/BLOG</text>
    <text x="290" y="17" font-family="'Inter', system-ui, sans-serif" font-weight="400" font-size="14" fill="#64748B">${esc(date)}</text>
  </g>
</svg>
`;
}

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

function headFor(route) {
  const url = SITE.url + (route.path === '/' ? '/' : route.path);
  // Blog posts get their own dynamically generated OG card; everything else
  // shares the brand card already injected by index.html.
  const ogImage = route.post ? `${SITE.url}/og/${route.post.slug}.svg` : null;
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
  return tags.join('\n    ');
}

// Emit a per-post OG SVG to dist/og/<slug>.svg before HTML generation so
// canonical URLs and the BlogPosting LD reference live files.
let ogCount = 0;
for (const p of POSTS) {
  await mkdir(join(distDir, 'og'), { recursive: true });
  await writeFile(join(distDir, 'og', `${p.slug}.svg`), postOgSvg(p));
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

console.log(`✓ prerendered ${count} routes + ${ogCount} blog OG cards + sitemap.xml + robots.txt + feed.xml`);
