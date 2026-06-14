// Design tokens — the single source of truth for brand color. Consumed by the
// Tailwind theme (tailwind.config.js), the accent system (AppProvider), the
// chart kit and the OG card builder, so the brand palette lives in one place
// instead of being hardcoded across the app.

// Core brand accents.
export const BRAND = {
  cyan: '#0EA5E9',
  emerald: '#10B981',
};

// Fixed semantic colors (accent-independent) used for status, charts, etc.
export const SEMANTIC = {
  amber: '#F59E0B',
  rose: '#E11D48',
  violet: '#7C3AED',
  slate900: '#0F172A',
  slate400: '#94A3B8',
};

// Canonical brand gradients, derived from BRAND so they never drift.
export const GRADIENTS = {
  // The display-heading text gradient (also available as the .eco-gradient-text
  // CSS utility, which is accent-var driven).
  brand: `linear-gradient(110deg,${BRAND.cyan} 0%,${BRAND.emerald} 100%)`,
  // CTA button fill (slightly different angle from the heading gradient).
  cta: `linear-gradient(120deg,${BRAND.cyan} 0%,${BRAND.emerald} 100%)`,
  // Faint brand-tinted panel background (cyan→emerald at 8% alpha).
  panel: 'linear-gradient(120deg,rgba(14,165,233,.08),rgba(16,185,129,.08))',
};
