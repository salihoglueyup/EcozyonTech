import { useId } from 'react';
import { BRAND } from '@/core/tokens';
import { prefersReducedMotion } from '@/core/motion';
import { sparklineGeometry, barGeometry, donutGeometry } from './geometry';

// Reusable SVG chart primitives built on the pure geometry helpers. All are
// deterministic and SSR-safe (useId keeps gradient ids hydration-stable).
// Pass `label` to expose the chart to assistive tech (role=img + aria-label);
// omit it and the chart is treated as decorative (aria-hidden).

// a11y attrs: labelled → role=img, otherwise hidden from the a11y tree.
const a11y = (label) => (label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true });

// Sparkline — a compact trend line with an optional gradient area fill and a
// head dot at the latest value.
export function Sparkline({
  data,
  color = BRAND.cyan,
  width = 64,
  height = 22,
  fill = true,
  dot = true,
  label,
  play,
  className = 'h-6 w-16',
}) {
  const id = useId();
  const { points, area, last } = sparklineGeometry(data, { width, height });
  if (!points) return null;
  // Draw-in: with `play` provided (and motion allowed), the line draws left→
  // right via a normalized (pathLength=1) dash offset 1→0. Omit `play` → static.
  const animate = play !== undefined && !prefersReducedMotion();
  const lineDash = animate
    ? { pathLength: 1, strokeDasharray: 1, strokeDashoffset: play ? 0 : 1, style: { transition: 'stroke-dashoffset 900ms var(--ease-out)' } }
    : {};
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`flex-none ${className}`} {...a11y(label)}>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity=".28" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={area} fill={`url(#${id})`} stroke="none" />
        </>
      )}
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...lineDash} />
      {dot && <circle cx={last.x} cy={last.y} r="1.6" fill={color} />}
    </svg>
  );
}

// BarMini — a small bar chart; bars fade in from left to right for a subtle
// sense of progression. With `play` (and motion allowed) the bars also grow up
// from the baseline in a left→right cascade on reveal; omit it for the static
// render.
export function BarMini({ data, color = BRAND.emerald, width = 80, height = 32, gap = 2, label, play, className = 'h-8 w-20' }) {
  const bars = barGeometry(data, { width, height, gap });
  if (!bars.length) return null;
  const animate = play !== undefined && !prefersReducedMotion();
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`flex-none ${className}`} {...a11y(label)}>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="1"
          fill={color}
          opacity={round(0.4 + (0.6 * (i + 1)) / bars.length)}
          style={animate ? {
            transformBox: 'fill-box',
            transformOrigin: 'bottom',
            transform: play ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 600ms var(--ease-out)',
            transitionDelay: `${i * 60}ms`,
          } : undefined}
        />
      ))}
    </svg>
  );
}

// Donut — a single-value progress ring (0–100). `children` renders centred
// (e.g. the percentage label).
export function Donut({
  value,
  color = BRAND.emerald,
  size = 44,
  stroke = 5,
  track = 'rgba(148,163,184,.25)',
  label,
  play,
  children,
}) {
  const { r, cx, cy, dash, gap } = donutGeometry(value, { size, stroke });
  // Draw-in: with `play` provided (and motion allowed), the arc grows from
  // hidden (offset=dash) to full (offset=0). Omit `play` → static final arc.
  const animate = play !== undefined && !prefersReducedMotion();
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} {...a11y(label)}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={animate && !play ? dash : 0}
          style={animate ? { transition: 'stroke-dashoffset 700ms var(--ease-out)' } : undefined}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      {children != null && (
        <span className="absolute text-[11px] font-semibold tabular-nums text-slate-700 dark:text-slate-200">{children}</span>
      )}
    </span>
  );
}

const round = (n) => Math.round(n * 100) / 100;
