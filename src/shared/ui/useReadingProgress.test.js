import { describe, it, expect } from 'vitest';
import { progressFromRect } from './useReadingProgress';

describe('progressFromRect', () => {
  it('is 0 at the top and 100 at the bottom of a tall element', () => {
    expect(progressFromRect(0, 2000, 800)).toBe(0);
    expect(progressFromRect(-1200, 2000, 800)).toBe(100);
  });

  it('is linear in between', () => {
    expect(progressFromRect(-600, 2000, 800)).toBe(50);
  });

  it('clamps below 0 (not reached) and above 100 (scrolled past)', () => {
    expect(progressFromRect(100, 2000, 800)).toBe(0);
    expect(progressFromRect(-5000, 2000, 800)).toBe(100);
  });

  it('treats elements shorter than the viewport as 0 then 100', () => {
    expect(progressFromRect(10, 500, 800)).toBe(0);
    expect(progressFromRect(-1, 500, 800)).toBe(100);
  });
});
