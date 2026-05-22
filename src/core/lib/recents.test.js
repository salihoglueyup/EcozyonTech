import { describe, it, expect } from 'vitest';
import { pushRecent, readRecents, recordRecent } from './recents';

function memStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

describe('pushRecent', () => {
  it('puts the slug at the front without mutating the input', () => {
    const list = ['a', 'b'];
    const next = pushRecent(list, 'c');
    expect(next).toEqual(['c', 'a', 'b']);
    expect(list).toEqual(['a', 'b']); // unchanged
  });

  it('de-duplicates by moving an existing slug to the front', () => {
    expect(pushRecent(['a', 'b', 'c'], 'c')).toEqual(['c', 'a', 'b']);
  });

  it('caps the list length', () => {
    expect(pushRecent(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b']);
  });

  it('ignores a falsy slug but still normalizes/caps', () => {
    expect(pushRecent(['a', 'b'], '', 1)).toEqual(['a']);
    expect(pushRecent(null, '')).toEqual([]);
  });
});

describe('readRecents', () => {
  it('reads and parses a stored string array', () => {
    const s = memStorage({ 'ecozyon.recents': JSON.stringify(['a', 'b']) });
    expect(readRecents(s)).toEqual(['a', 'b']);
  });

  it('returns [] for missing or corrupt data', () => {
    expect(readRecents(memStorage())).toEqual([]);
    expect(readRecents(memStorage({ 'ecozyon.recents': '{not json' }))).toEqual([]);
  });

  it('filters out non-string entries', () => {
    const s = memStorage({ 'ecozyon.recents': JSON.stringify(['a', 3, null, 'b']) });
    expect(readRecents(s)).toEqual(['a', 'b']);
  });
});

describe('recordRecent', () => {
  it('persists the updated list and returns it', () => {
    const s = memStorage();
    expect(recordRecent('a', s)).toEqual(['a']);
    expect(recordRecent('b', s)).toEqual(['b', 'a']);
    expect(recordRecent('a', s)).toEqual(['a', 'b']); // re-view moves to front
    expect(readRecents(s)).toEqual(['a', 'b']);
  });
});
