// Pure ROI model for the business savings estimator. Deterministic so the page,
// the shareable URL and the unit tests never drift. The coefficients are
// illustrative (a demo estimate), but the math is internally consistent.

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Sectors carry a multiplier: some have more commute/energy footprint to shift.
export const SECTORS = [
  { id: 'tech', label: { tr: 'Teknoloji', en: 'Technology' }, factor: 1.0 },
  { id: 'finance', label: { tr: 'Finans', en: 'Finance' }, factor: 1.1 },
  { id: 'manufacturing', label: { tr: 'Üretim', en: 'Manufacturing' }, factor: 1.6 },
  { id: 'retail', label: { tr: 'Perakende', en: 'Retail' }, factor: 1.3 },
  { id: 'public', label: { tr: 'Kamu', en: 'Public sector' }, factor: 1.2 },
  { id: 'services', label: { tr: 'Hizmet', en: 'Services' }, factor: 0.9 },
];

// Annual CO₂ (kg) an engaged employee shifts, typical active-adoption rate, and
// an illustrative economic value per ton saved (energy/efficiency proxy).
const PER_PERSON_KG = 280;
const ADOPTION = 0.62;
const VALUE_PER_TON = 230;

export const sectorById = (id) => SECTORS.find((s) => s.id === id) || SECTORS[0];

// Core estimate from team size + sector. CO₂ in tons (1 decimal), savings in
// whole currency units.
export function estimateRoi({ teamSize = 50, sector = 'tech' } = {}) {
  const size = clamp(Math.round(Number(teamSize) || 0), 1, 100000);
  const factor = sectorById(sector).factor;
  const activeUsers = Math.round(size * ADOPTION);
  const co2Kg = activeUsers * PER_PERSON_KG * factor;
  const co2Tons = Math.round(co2Kg / 100) / 10; // 1-decimal tons
  const costSavings = Math.round(co2Tons * VALUE_PER_TON);
  return { size, activeUsers, adoptionPct: Math.round(ADOPTION * 100), co2Tons, costSavings, factor };
}

// 12-month cumulative ramp toward the annual figure — feeds the projection
// chart. Linear ramp keeps it readable and deterministic.
export function roiProjection(annualTons, months = 12) {
  return Array.from({ length: months }, (_, i) => Math.round(annualTons * ((i + 1) / months) * 10) / 10);
}

// Recommend a pricing tier id from team size (matches the pricing tiers).
export function recommendPlan(size) {
  if (size <= 1) return 'individual';
  if (size <= 250) return 'team';
  return 'enterprise';
}
