// Build social share intent URLs for a page. Pure + unit-tested; the React
// side adds the clipboard "copy link" affordance.
export function shareLinks(url, title) {
  const u = encodeURIComponent(String(url ?? ''));
  const t = encodeURIComponent(String(title ?? ''));
  return {
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  };
}
