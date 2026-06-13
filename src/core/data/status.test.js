import { describe, it, expect } from 'vitest';
import {
  STATUS_META,
  COMPONENTS,
  INCIDENTS,
  statusMeta,
  overallStatus,
  uptimeAverage,
} from './status';

describe('status data', () => {
  it('every component has a bilingual name, a known status and a sane uptime', () => {
    for (const c of COMPONENTS) {
      expect(c.name).toHaveProperty('tr');
      expect(c.name).toHaveProperty('en');
      expect(STATUS_META, `unknown status ${c.status}`).toHaveProperty(c.status);
      expect(c.uptime).toBeGreaterThanOrEqual(0);
      expect(c.uptime).toBeLessThanOrEqual(100);
      expect(Array.isArray(c.series)).toBe(true);
      expect(c.series.length).toBeGreaterThan(1);
      expect(c.series.every((n) => typeof n === 'number')).toBe(true);
    }
  });

  it('every incident has an ISO date, a known severity and bilingual updates', () => {
    for (const inc of INCIDENTS) {
      expect(inc.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(STATUS_META, `unknown severity ${inc.severity}`).toHaveProperty(inc.severity);
      expect(inc.updates.length).toBeGreaterThan(0);
      for (const u of inc.updates) {
        expect(u.text).toHaveProperty('tr');
        expect(u.text).toHaveProperty('en');
      }
    }
  });

  it('incidents are ordered newest-first by date', () => {
    const dates = INCIDENTS.map((i) => i.date);
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1));
    expect(dates).toEqual(sorted);
  });
});

describe('statusMeta', () => {
  it('returns the bilingual label + accent for a known status', () => {
    expect(statusMeta('operational').label).toHaveProperty('tr');
    expect(statusMeta('outage').accent).toBe(STATUS_META.outage.accent);
  });

  it('falls back gracefully for an unknown status', () => {
    expect(statusMeta('mystery').label.en).toBe('mystery');
    expect(statusMeta('mystery').rank).toBe(0);
  });
});

describe('overallStatus', () => {
  it('is operational when every component is operational', () => {
    expect(overallStatus()).toBe('operational');
  });

  it('returns the worst (highest-rank) status', () => {
    const mixed = [
      { status: 'operational' },
      { status: 'degraded' },
      { status: 'outage' },
      { status: 'maintenance' },
    ];
    expect(overallStatus(mixed)).toBe('outage');
  });

  it('prefers degraded over maintenance', () => {
    expect(overallStatus([{ status: 'maintenance' }, { status: 'degraded' }])).toBe('degraded');
  });
});

describe('uptimeAverage', () => {
  it('averages component uptime to two decimals', () => {
    expect(uptimeAverage([{ uptime: 100 }, { uptime: 99 }])).toBe(99.5);
  });

  it('is 0 for an empty list', () => {
    expect(uptimeAverage([])).toBe(0);
  });
});
