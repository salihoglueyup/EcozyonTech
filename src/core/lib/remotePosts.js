// Fetch DB-published blog posts from the public /api/posts endpoint. Safe to
// call anywhere: returns [] on the server (no fetch), on network error, or when
// no database is configured (the endpoint returns an empty list). The caller
// merges the result with the static POSTS via mergePosts().
export async function fetchRemotePosts() {
  if (typeof fetch === 'undefined') return [];
  try {
    const res = await fetch('/api/posts', { headers: { accept: 'application/json' } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.posts) ? data.posts : [];
  } catch {
    return [];
  }
}
