import { describe, it, expect } from 'vitest';
import { CURRENCIES, CURRENCY_IDS, defaultCurrency, formatMoney } from './currency';

describe('defaultCurrency', () => {
  it('maps Turkish to TRY and everything else to USD', () => {
    expect(defaultCurrency('tr')).toBe('TRY');
    expect(defaultCurrency('en')).toBe('USD');
    expect(defaultCurrency('de')).toBe('USD');
  });
});

describe('formatMoney', () => {
  it('prefixes the amount with the currency symbol', () => {
    expect(formatMoney(149, 'TRY')).toBe('₺149');
    expect(formatMoney(5, 'USD')).toBe('$5');
    expect(formatMoney(5, 'EUR')).toBe('€5');
  });

  it('falls back to the first currency for an unknown id', () => {
    expect(formatMoney(10, 'XYZ')).toBe(`${CURRENCIES[0].symbol}10`);
  });
});

describe('CURRENCY_IDS', () => {
  it('lists every currency id once', () => {
    expect(CURRENCY_IDS).toEqual(['TRY', 'USD', 'EUR']);
    expect(new Set(CURRENCY_IDS).size).toBe(CURRENCY_IDS.length);
  });
});
