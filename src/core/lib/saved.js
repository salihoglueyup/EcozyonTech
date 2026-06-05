// Saved/bookmarked blog posts, persisted to localStorage. Mirrors recents.js:
// the pure transforms (toggleSaved/isSaved) are the tested core; read/toggle
// are thin guarded wrappers so the rest of the app never touches storage.
const KEY = 'ecozyon.saved';

// Return a new list with `slug` toggled (added to the front if absent, removed
// if present), de-duplicated. Never mutates the input. Falsy slugs are no-ops.
export function toggleSaved(list, slug) {
  const base = Array.isArray(list) ? list : [];
  if (!slug) return base.slice();
  return base.includes(slug) ? base.filter((s) => s !== slug) : [slug, ...base];
}

export function isSaved(list, slug) {
  return Array.isArray(list) && list.includes(slug);
}

function storageOf(storage) {
  if (storage) return storage;
  return typeof window !== 'undefined' ? window.localStorage : null;
}

export function readSaved(storage) {
  const s = storageOf(storage);
  if (!s) return [];
  try {
    const raw = s.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

// Toggle a slug's saved state and return the updated list.
export function toggleSavedSlug(slug, storage) {
  const s = storageOf(storage);
  const next = toggleSaved(readSaved(s), slug);
  if (s) {
    try {
      s.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }
  return next;
}
