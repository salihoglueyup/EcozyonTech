import { describe, it, expect } from 'vitest';
import { sparklineGeometry, barGeometry, donutGeometry } from './geometry';

describe('sparklineGeometry', () => {
  it('spans the full width: first x is 0, last x is width', () => {
    const { points } = sparklineGeometry([1, 2, 3], { width: 100, height: 20 });
    const xs = points.split(' ').map((p) => Number(p.split(',')[0]));
    expect(xs[0]).toBe(0);
    expect(xs[xs.length - 1]).toBe(100);
  });

  it('puts the max at the top (y=0) and min at the bottom (y=height)', () => {
    const { points } = sparklineGeometry([0, 10], { width: 10, height: 20 });
    const ys = points.split(' ').map((p) => Number(p.split(',')[1]));
    expect(ys[0]).toBe(20); // min → bottom
    expect(ys[1]).toBe(0); // max → top
  });

  it('handles a flat series without NaN', () => {
    const { points } = sparklineGeometry([5, 5, 5], { width: 10, height: 20 });
    expect(points).not.toMatch(/NaN/);
  });

  it('handles a single point (x at width)', () => {
    const { last } = sparklineGeometry([7], { width: 64, height: 22 });
    expect(last.x).toBe(64);
  });

  it('returns empty geometry for an empty series', () => {
    expect(sparklineGeometry([])).toEqual({ points: '', area: '', last: { x: 0, y: 22 } });
  });
});

describe('barGeometry', () => {
  it('produces one rect per value', () => {
    expect(barGeometry([1, 2, 3]).length).toBe(3);
  });

  it('the tallest bar reaches full height and sits on the baseline', () => {
    const bars = barGeometry([1, 2], { width: 20, height: 40, gap: 0 });
    const tall = bars[1];
    expect(tall.h).toBe(40);
    expect(tall.y).toBe(0);
    expect(bars[0].y + bars[0].h).toBe(40); // baseline
  });

  it('clamps negative values to zero height', () => {
    const bars = barGeometry([-3, 6], { width: 20, height: 40 });
    expect(bars[0].h).toBe(0);
  });

  it('is empty for no data', () => {
    expect(barGeometry([])).toEqual([]);
  });
});

describe('donutGeometry', () => {
  it('dash + gap equals the circumference', () => {
    const { dash, gap, circumference } = donutGeometry(40);
    expect(round(dash + gap)).toBe(circumference);
  });

  it('a full value fills the whole ring (gap ~ 0)', () => {
    const { dash, circumference } = donutGeometry(100);
    expect(dash).toBe(circumference);
  });

  it('clamps out-of-range values', () => {
    expect(donutGeometry(150).dash).toBe(donutGeometry(100).dash);
    expect(donutGeometry(-20).dash).toBe(0);
  });
});

const round = (n) => Math.round(n * 100) / 100;
