// Currency presentation for /pricing. These are curated per-market prices
// (the demo's "Team" tier is priced per region), not live FX conversions —
// so each currency carries its own integer amount rather than a rate.
export const CURRENCIES = [
  { id: 'TRY', symbol: '₺', label: 'TRY' },
  { id: 'USD', symbol: '$', label: 'USD' },
  { id: 'EUR', symbol: '€', label: 'EUR' },
];

export const CURRENCY_IDS = CURRENCIES.map((c) => c.id);

// Default currency for the visitor's language; everything else falls to USD.
export const defaultCurrency = (lang) => (lang === 'tr' ? 'TRY' : 'USD');

// Symbol-prefixed integer amount, e.g. formatMoney(149, 'TRY') -> '₺149'.
// Unknown currencies fall back to the first entry so the UI never shows NaN.
export function formatMoney(amount, currencyId) {
  const c = CURRENCIES.find((x) => x.id === currencyId) || CURRENCIES[0];
  return `${c.symbol}${amount}`;
}
