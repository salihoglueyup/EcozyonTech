// Shareable state for the carbon calculator. Pure encode/decode so a result
// can round-trip through a URL (?car=120&kwh=220&meat=7) or localStorage and
// restore the exact sliders. This module owns the calculator's input model
// (fields, defaults, bounds); the feature imports it so the two never drift.
import { estimateAnnualCO2 } from './co2';

// `key` is the model field, `param` the short URL token, `max` the slider
// ceiling. All inputs are non-negative integers.
export const CALC_FIELDS = [
  { key: 'carKmPerWeek', param: 'car', max: 600, step: 10 },
  { key: 'kwhPerMonth', param: 'kwh', max: 800, step: 10 },
  { key: 'meatMealsPerWeek', param: 'meat', max: 21, step: 1 },
];

export const DEFAULT_CALC = { carKmPerWeek: 120, kwhPerMonth: 220, meatMealsPerWeek: 7 };

// Clamp a single field to [0, max], rounding to an integer. Garbage → default.
function clampField(field, raw, fallback) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(field.max, Math.round(n)));
}

// Normalize an arbitrary object to a valid calc state (every field present,
// in-bounds). Missing/invalid fields fall back to the default.
export function normalizeCalc(vals = {}) {
  const out = {};
  for (const f of CALC_FIELDS) {
    out[f.key] = clampField(f, vals[f.key], DEFAULT_CALC[f.key]);
  }
  return out;
}

// Encode calc state to a query string (no leading '?'), short param keys.
export function encodeCalc(vals) {
  const v = normalizeCalc(vals);
  const params = new URLSearchParams();
  for (const f of CALC_FIELDS) params.set(f.param, String(v[f.key]));
  return params.toString();
}

// Decode from a query string, URLSearchParams, or a plain object of params.
// Any field absent or out of range falls back to its default. Returns null
// when no recognized param is present (so callers can tell "no shared state"
// apart from "shared the defaults").
export function decodeCalc(input) {
  const params = toParams(input);
  if (!params) return null;
  let seen = false;
  const vals = { ...DEFAULT_CALC };
  for (const f of CALC_FIELDS) {
    const raw = params.get(f.param);
    if (raw != null) {
      seen = true;
      vals[f.key] = clampField(f, raw, DEFAULT_CALC[f.key]);
    }
  }
  return seen ? vals : null;
}

// Quick scenarios. Each is a pure transform of the *current* inputs, so its
// saving is always measured against whatever the sliders show now (no baseline
// bookkeeping). Clicking one applies the transform; the badge shows what it
// would cut from the current footprint.
export const CALC_PRESETS = [
  { id: 'carLite', apply: (v) => ({ ...v, carKmPerWeek: Math.round(v.carKmPerWeek / 2) }) },
  { id: 'veg', apply: (v) => ({ ...v, meatMealsPerWeek: 0 }) },
  { id: 'energySave', apply: (v) => ({ ...v, kwhPerMonth: Math.round(v.kwhPerMonth * 0.7) }) },
];

// Apply a preset to current values, returning a normalized (in-bounds) state.
export function applyPreset(preset, vals) {
  return normalizeCalc(preset.apply(normalizeCalc(vals)));
}

// What a preset would cut from the current footprint: absolute kg and the
// share of the current total. Zero (never negative) when it changes nothing.
export function presetSaving(preset, vals) {
  const current = estimateAnnualCO2(normalizeCalc(vals)).total;
  const next = estimateAnnualCO2(applyPreset(preset, vals)).total;
  const savedKg = Math.max(0, current - next);
  return { savedKg, pct: current > 0 ? savedKg / current : 0, next };
}

function toParams(input) {
  if (!input) return null;
  if (input instanceof URLSearchParams) return input;
  if (typeof input === 'string') return new URLSearchParams(input.replace(/^\?/, ''));
  if (typeof input === 'object') {
    const p = new URLSearchParams();
    for (const [k, val] of Object.entries(input)) {
      if (val != null) p.set(k, String(val));
    }
    return p;
  }
  return null;
}
