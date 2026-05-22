// Pure builder for branded Open Graph cards (1200×630 SVG). Shared by the
// prerender step for blog posts and every main route, so social previews
// stay on-brand. Lives in src so it is unit-tested and counted in coverage.
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Word-wrap to at most `maxLines` lines of ~`width` chars; the final line is
// ellipsized if it still overflows. SVG has no auto-wrap so we pre-split.
export function wrap(text, width, maxLines) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = [''];
  for (const w of words) {
    const last = lines[lines.length - 1];
    const next = last ? last + ' ' + w : w;
    if (next.length <= width) lines[lines.length - 1] = next;
    else if (lines.length < maxLines) lines.push(w);
    else lines[lines.length - 1] = next;
  }
  const lastIdx = lines.length - 1;
  if (lines[lastIdx].length > width) {
    lines[lastIdx] = lines[lastIdx].slice(0, width - 1).trimEnd() + '…';
  }
  return lines;
}

export function ogCardSvg({
  eyebrow = 'Ecozyon Tech',
  title = '',
  subtitle = '',
  footerLeft = 'ECOZYON.TECH',
  footerRight = '',
} = {}) {
  const titleLines = wrap(title, 32, 2);
  const t1 = esc(titleLines[0] || '');
  const t2 = esc(titleLines[1] || '');
  const sub = esc(wrap(subtitle, 68, 1)[0] || '');
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
    <text x="58" y="30" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="28" fill="#0F172A" letter-spacing="-0.5">${esc(eyebrow)}</text>
  </g>
  <text x="80" y="280" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="64" fill="#0F172A" letter-spacing="-2">${t1}</text>
  <text x="80" y="358" font-family="'Space Grotesk', 'Inter', system-ui, sans-serif" font-weight="700" font-size="64" fill="url(#accent)" letter-spacing="-2">${t2}</text>
  <text x="80" y="430" font-family="'Inter', system-ui, sans-serif" font-weight="400" font-size="22" fill="#475569" letter-spacing="-0.3">${sub}</text>
  <g transform="translate(80 545)">
    <rect x="0" y="0" width="6" height="22" rx="3" fill="url(#accent)"/>
    <text x="18" y="17" font-family="'Inter', system-ui, sans-serif" font-weight="600" font-size="15" fill="#0F172A" letter-spacing="0.5">${esc(footerLeft)}</text>
    <text x="290" y="17" font-family="'Inter', system-ui, sans-serif" font-weight="400" font-size="14" fill="#64748B">${esc(footerRight)}</text>
  </g>
</svg>
`;
}
