// Pure RSS 2.0 feed builder. Lives in src (not scripts/) so it's unit-tested
// and counted in coverage; scripts/prerender.mjs imports it to emit feed.xml.
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// RSS pubDate wants an RFC-822 date; toUTCString() is the accepted form.
// A missing/invalid date falls back to `now` so the feed never emits NaN.
function rfc822(date, now) {
  const d = date ? new Date(date) : now;
  const valid = d instanceof Date && !Number.isNaN(d.getTime());
  return (valid ? d : now).toUTCString();
}

export function buildFeed({ posts = [], site, lang = 'tr', now = new Date() }) {
  const self = `${site.url}/feed.xml`;
  const items = posts
    .map((p) => {
      const url = `${site.url}/blog/${p.slug}`;
      return [
        '    <item>',
        `      <title>${esc(p.title?.[lang])}</title>`,
        `      <link>${esc(url)}</link>`,
        `      <guid isPermaLink="true">${esc(url)}</guid>`,
        `      <pubDate>${rfc822(p.date, now)}</pubDate>`,
        `      <description>${esc(p.excerpt?.[lang])}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Blog</title>
    <link>${site.url}/blog</link>
    <atom:link href="${esc(self)}" rel="self" type="application/rss+xml" />
    <description>${esc(site.description)}</description>
    <language>${esc(lang)}</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}
