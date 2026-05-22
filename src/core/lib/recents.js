// Recently-viewed blog posts, persisted to localStorage. The pure transform
// (pushRecent) is the tested core; read/record are thin guarded wrappers so
// the rest of the app never touches storage directly.
const KEY = 'ecozyon.recents';
const CAP = 6;

// Return a new list with `slug` moved to the front, de-duplicated, capped.
// Never mutates the input. Empty/falsy slugs are ignored.
export function pushRecent(list, slug, cap = CAP) {
  if (!slug) return Array.isArray(list) ? list.slice(0, cap) : [];
  const base = Array.isArray(list) ? list : [];
  return [slug, ...base.filter((s) => s !== slug)].slice(0, cap);
}

function storageOf(storage) {
  if (storage) return storage;
  return typeof window !== 'undefined' ? window.localStorage : null;
}

export function readRecents(storage) {
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

// Record a viewed slug and return the updated list.
export function recordRecent(slug, storage) {
  const s = storageOf(storage);
  const next = pushRecent(readRecents(s), slug);
  if (s) {
    try {
      s.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }
  return next;
}
