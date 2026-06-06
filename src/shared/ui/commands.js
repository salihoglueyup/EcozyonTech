// Pure data + matching logic for the ⌘K command palette. The React shell
// (CommandPalette.jsx) owns focus/keyboard/navigation; everything here is
// side-effect-free and unit-tested.

// Build the navigable item list from routes + blog posts + open roles. Action
// items (theme/lang) are appended by the component since they carry handlers.
// Each item: { id, type: 'page'|'post'|'job', label, hint, to }.
export function buildCommands({ routes, posts, jobs, lang = 'tr' }) {
  const pages = routes
    .filter((r) => r.path !== '*' && !r.path.includes(':'))
    .map((r) => ({
      id: `page:${r.path}`,
      type: 'page',
      label: r.nav?.[lang] || r.nav?.en || r.path,
      to: r.path,
    }));
  const blog = (posts || []).map((p) => ({
    id: `post:${p.slug}`,
    type: 'post',
    label: p.title?.[lang] || p.title?.en || p.slug,
    hint: p.tag?.[lang],
    to: `/blog/${p.slug}`,
  }));
  // Roles deep-link to the Careers page with the apply modal pre-opened.
  const roles = (jobs || []).map((j) => ({
    id: `job:${j.id}`,
    type: 'job',
    label: j.title?.[lang] || j.title?.en || j.id,
    hint: j.team?.[lang],
    to: `/careers?job=${j.id}`,
  }));
  return [...pages, ...blog, ...roles];
}

// Reorder so recently-viewed posts (by slug, in order) surface first; the
// recent copies get a distinct id + `recent` flag and are removed from the
// tail so each post appears once. Used for the empty-query palette view.
export function orderByRecents(items, recentSlugs) {
  const slugs = (recentSlugs || []).filter(Boolean);
  if (!slugs.length) return items;
  const slugSet = new Set(slugs);
  const slugOf = (it) =>
    it.type === 'post' && typeof it.to === 'string' && it.to.startsWith('/blog/')
      ? it.to.slice('/blog/'.length)
      : null;
  const bySlug = new Map();
  for (const it of items) {
    const s = slugOf(it);
    if (s) bySlug.set(s, it);
  }
  const recent = [];
  for (const s of slugs) {
    const it = bySlug.get(s);
    if (it) recent.push({ ...it, id: `recent:${s}`, recent: true });
  }
  const rest = items.filter((it) => {
    const s = slugOf(it);
    return !(s && slugSet.has(s));
  });
  return [...recent, ...rest];
}

// Substring filter over label + hint + keywords, ranked so that label
// prefix matches surface first. An empty query returns the list unchanged.
export function filterCommands(items, query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return items;
  const scored = [];
  for (const it of items) {
    const label = String(it.label).toLowerCase();
    const hay = `${label} ${it.hint || ''} ${(it.keywords || []).join(' ')}`.toLowerCase();
    const idx = hay.indexOf(q);
    if (idx === -1) continue;
    const score = label.startsWith(q) ? 0 : label.includes(q) ? 1 : 2;
    scored.push({ it, score, idx });
  }
  scored.sort((a, b) => a.score - b.score || a.idx - b.idx);
  return scored.map((s) => s.it);
}
