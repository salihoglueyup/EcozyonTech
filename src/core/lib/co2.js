// Pure CO₂ footprint model for the lifestyle calculator. Emission factors are
// plausible demo values (kg CO₂e per unit), not audited figures.
export const FACTORS = {
  car: 0.18, // per km driven
  electricity: 0.42, // per kWh
  meat: 3.6, // per meat-based meal
};

// Default share of the footprint Ecozyon's nudges aim to remove.
export const DEFAULT_REDUCTION = 0.22;

// Annual kg CO₂e from weekly/monthly lifestyle inputs, with a per-source
// breakdown. Negative/garbage inputs are floored to 0 so the UI never
// shows negative emissions.
export function estimateAnnualCO2({ carKmPerWeek = 0, kwhPerMonth = 0, meatMealsPerWeek = 0 } = {}) {
  const num = (v) => (Number.isFinite(v) && v > 0 ? v : 0);
  const transport = num(carKmPerWeek) * 52 * FACTORS.car;
  const energy = num(kwhPerMonth) * 12 * FACTORS.electricity;
  const diet = num(meatMealsPerWeek) * 52 * FACTORS.meat;
  return { transport, energy, diet, total: transport + energy + diet };
}

// kg CO₂e you could cut at a given reduction share.
export function potentialSavings(total, pct = DEFAULT_REDUCTION) {
  const t = Number.isFinite(total) && total > 0 ? total : 0;
  const p = Math.max(0, Math.min(1, pct));
  return t * p;
}

// Human-friendly mass: tonnes once we cross 1000 kg, else rounded kg.
export function formatCO2(kg) {
  const v = Number.isFinite(kg) && kg > 0 ? kg : 0;
  return v >= 1000 ? `${(v / 1000).toFixed(1)} t` : `${Math.round(v)} kg`;
}
