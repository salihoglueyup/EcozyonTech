import { describe, it, expect, beforeEach } from 'vitest';
import { toggleSaved, isSaved, readSaved, toggleSavedSlug } from './saved';

describe('toggleSaved (pure)', () => {
  it('adds an absent slug to the front', () => {
    expect(toggleSaved(['b'], 'a')).toEqual(['a', 'b']);
  });

  it('removes a present slug', () => {
    expect(toggleSaved(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('never mutates the input', () => {
    const list = ['a'];
    toggleSaved(list, 'b');
    expect(list).toEqual(['a']);
  });

  it('treats a falsy slug as a no-op copy', () => {
    expect(toggleSaved(['a'], '')).toEqual(['a']);
    expect(toggleSaved(undefined, '')).toEqual([]);
  });
});

describe('isSaved', () => {
  it('reports membership', () => {
    expect(isSaved(['a', 'b'], 'b')).toBe(true);
    expect(isSaved(['a'], 'z')).toBe(false);
    expect(isSaved(null, 'a')).toBe(false);
  });
});

describe('storage wrappers', () => {
  beforeEach(() => window.localStorage.clear());

  it('round-trips through localStorage', () => {
    expect(readSaved()).toEqual([]);
    const next = toggleSavedSlug('post-1');
    expect(next).toEqual(['post-1']);
    expect(readSaved()).toEqual(['post-1']);
  });

  it('toggles off on a second call', () => {
    toggleSavedSlug('post-1');
    expect(toggleSavedSlug('post-1')).toEqual([]);
    expect(readSaved()).toEqual([]);
  });

  it('ignores corrupt stored JSON', () => {
    window.localStorage.setItem('ecozyon.saved', '{bad');
    expect(readSaved()).toEqual([]);
  });
});
