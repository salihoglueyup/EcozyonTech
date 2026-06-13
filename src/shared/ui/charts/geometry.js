// Pure SVG geometry helpers for the chart primitives. Deterministic — no DOM,
// no randomness — so charts render identically on the server (prerender) and
// on the hydrated client. All numbers are rounded to 2 decimals to keep the
// emitted SVG markup stable and compact.

const round = (n) => Math.round(n * 100) / 100;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Map a numeric series to a polyline within a width×height box. Returns the
// line points string, a closed area points string (baseline at the bottom,
// for a gradient fill) and the last point (for the head dot). A flat or
// single-point series is handled without NaN.
export function sparklineGeometry(data, { width = 64, height = 22 } = {}) {
  const n = data.length;
  if (n === 0) return { points: '', area: '', last: { x: 0, y: height } };
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = Math.max(max - min, 1e-9);
  const pts = data.map((v, i) => {
    const x = n === 1 ? width : (i / (n - 1)) * width;
    const y = height - ((v - min) / span) * height;
    return { x: round(x), y: round(y) };
  });
  const points = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `0,${height} ${points} ${width},${height}`;
  return { points, area, last: pts[n - 1] };
}

// Bars for a small bar chart, baseline at the bottom. Each bar is {x,y,w,h}.
// Heights scale to the max value; negative values clamp to zero height.
export function barGeometry(data, { width = 80, height = 32, gap = 2 } = {}) {
  const n = data.length;
  if (n === 0) return [];
  const max = Math.max(...data, 0);
  const span = Math.max(max, 1e-9);
  const bw = (width - gap * (n - 1)) / n;
  return data.map((v, i) => {
    const h = (Math.max(v, 0) / span) * height;
    return { x: round(i * (bw + gap)), y: round(height - h), w: round(bw), h: round(h) };
  });
}

// Ring geometry for a single 0–100 value. Returns the radius/centre plus the
// stroke-dash split (dash = filled arc, gap = remainder) whose sum is the
// circumference, so a single circle can render `value`% of the ring.
export function donutGeometry(value, { size = 44, stroke = 5 } = {}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = clamp(value, 0, 100) / 100;
  const dash = circumference * pct;
  return {
    r: round(r),
    cx: round(size / 2),
    cy: round(size / 2),
    circumference: round(circumference),
    dash: round(dash),
    gap: round(circumference - dash),
  };
}
