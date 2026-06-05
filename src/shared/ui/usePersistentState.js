import { useCallback, useEffect, useRef, useState } from 'react';

// usePersistentState — useState backed by Web Storage, SSR-safe.
//
// Mirrors the AppProvider/recents pattern: the initial render always returns
// `initial` (so server-prerendered HTML matches the client's first render and
// there is no hydration mismatch). The persisted value is read once after
// mount and applied in a single set. Writes are guarded so a disabled or full
// storage never throws.
//
// `options.storage` is the Web Storage area ('local' | 'session'), defaulting
// to localStorage. `options.raw` stores the string verbatim (no JSON) — handy
// for plain-string values. A custom `options.serialize`/`deserialize` pair can
// override the JSON default for richer encodings.
export function usePersistentState(key, initial, options = {}) {
  const { storage = 'local', raw = false } = options;
  const serialize = options.serialize ?? (raw ? String : JSON.stringify);
  const deserialize = options.deserialize ?? (raw ? (s) => s : JSON.parse);

  // Keep the latest codecs without re-subscribing the storage effects when
  // callers pass inline functions (common). Reads happen through the ref.
  // This effect is declared first, so on mount it commits before the read
  // effect below sees codecRef.current.
  const codecRef = useRef({ serialize, deserialize });
  useEffect(() => {
    codecRef.current = { serialize, deserialize };
  });

  const [value, setValue] = useState(initial);
  const hydrated = useRef(false);

  // One-time post-hydration read. Storage access stays client-only.
  useEffect(() => {
    hydrated.current = true;
    const store = storageOf(storage);
    if (!store) return;
    try {
      const rawValue = store.getItem(key);
      if (rawValue != null) {
        setValue(codecRef.current.deserialize(rawValue));
      }
    } catch {
      /* unreadable storage — keep the in-memory initial */
    }
    // Read once for the mounted key; a key change re-reads.
  }, [key, storage]);

  // Persist on change, but never before the post-mount read has run — that
  // would clobber a stored value with the SSR default on first paint.
  useEffect(() => {
    if (!hydrated.current) return;
    const store = storageOf(storage);
    if (!store) return;
    try {
      store.setItem(key, codecRef.current.serialize(value));
    } catch {
      /* storage full or unavailable — keep in-memory only */
    }
  }, [key, storage, value]);

  // Stable updater that also tolerates being called with a function, like
  // useState. (Identity is stable; value flows through the setter.)
  const set = useCallback((next) => setValue(next), []);

  return [value, set];
}

function storageOf(kind) {
  if (typeof window === 'undefined') return null;
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null; // access can throw in sandboxed iframes
  }
}
