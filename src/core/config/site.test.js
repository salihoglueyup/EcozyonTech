import { describe, it, expect } from 'vitest';
import {
  ROUTES,
  NAV_GROUPS,
  FOOTER_GROUPS,
  NAV_ITEMS,
  routesInGroup,
  routeByKey,
} from './site';

const GROUP_IDS = new Set(FOOTER_GROUPS.map((g) => g.id));
const PLACES = new Set(['nav', 'footer', 'none']);

describe('site routes', () => {
  it('every route declares a known group and place, plus bilingual nav', () => {
    for (const r of ROUTES) {
      expect(GROUP_IDS.has(r.group), `${r.key} group "${r.group}"`).toBe(true);
      expect(PLACES.has(r.place), `${r.key} place "${r.place}"`).toBe(true);
      expect(r.nav.tr, `${r.key} tr`).toBeTruthy();
      expect(r.nav.en, `${r.key} en`).toBeTruthy();
    }
  });

  it('route keys and paths are unique', () => {
    const keys = ROUTES.map((r) => r.key);
    const paths = ROUTES.map((r) => r.path);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe('navigation grouping', () => {
  it('every navbar group has at least one nav-placed route', () => {
    for (const g of NAV_GROUPS) {
      expect(routesInGroup(g.id, ['nav']).length, g.id).toBeGreaterThan(0);
    }
  });

  it('footer groups carry bilingual labels and extend the nav groups', () => {
    expect(FOOTER_GROUPS.length).toBe(NAV_GROUPS.length + 1);
    for (const g of FOOTER_GROUPS) {
      expect(g.label.tr && g.label.en, g.id).toBeTruthy();
    }
  });

  it('routesInGroup filters by place; no filter returns the whole group', () => {
    const legalAll = routesInGroup('legal');
    const legalNav = routesInGroup('legal', ['nav']);
    expect(legalAll.length).toBeGreaterThanOrEqual(legalNav.length);
    expect(legalAll.every((r) => r.group === 'legal')).toBe(true);
  });

  it('featured highlights are reachable (never place "none")', () => {
    expect(NAV_ITEMS.length).toBeGreaterThanOrEqual(4);
    expect(NAV_ITEMS.every((r) => r.place !== 'none')).toBe(true);
  });

  it('the CTA target (pricing) exists and is nav-placed', () => {
    const pricing = routeByKey('pricing');
    expect(pricing.path).toBe('/pricing');
    expect(pricing.place).toBe('nav');
  });
});
