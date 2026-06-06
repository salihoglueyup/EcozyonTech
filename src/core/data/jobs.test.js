import { describe, it, expect } from 'vitest';
import { JOBS, jobTeams, filterByTeam, searchJobs, jobById } from './jobs';

describe('JOBS data', () => {
  it('every job has a stable id, bilingual core fields and structured detail', () => {
    for (const j of JOBS) {
      expect(typeof j.id).toBe('string');
      for (const key of ['team', 'type', 'location', 'level', 'title', 'desc']) {
        expect(j[key], `${j.id}.${key}`).toHaveProperty('tr');
        expect(j[key], `${j.id}.${key}`).toHaveProperty('en');
      }
      for (const key of ['responsibilities', 'requirements']) {
        expect(Array.isArray(j[key].tr), `${j.id}.${key}.tr`).toBe(true);
        expect(j[key].tr.length, `${j.id}.${key}.tr`).toBeGreaterThan(0);
        // TR/EN bullet counts stay in parity so the detail reads the same.
        expect(j[key].en.length, `${j.id}.${key}.en`).toBe(j[key].tr.length);
      }
    }
  });

  it('ids are unique', () => {
    const ids = JOBS.map((j) => j.id);
    expect(ids).toEqual([...new Set(ids)]);
  });
});

describe('jobTeams', () => {
  it('returns distinct teams in first-appearance order with bilingual labels', () => {
    const teams = jobTeams(JOBS);
    const ids = teams.map((t) => t.id);
    expect(ids).toEqual([...new Set(ids)]);
    for (const tm of teams) {
      expect(tm.label).toHaveProperty('tr');
      expect(tm.label).toHaveProperty('en');
      expect(tm.id).toBe(tm.label.en);
    }
  });

  it('collapses duplicates from a synthetic list', () => {
    const list = [
      { id: 'a', team: { tr: 'Ürün', en: 'Product' } },
      { id: 'b', team: { tr: 'Ürün', en: 'Product' } },
      { id: 'c', team: { tr: 'AI', en: 'AI' } },
    ];
    expect(jobTeams(list).map((t) => t.id)).toEqual(['Product', 'AI']);
  });
});

describe('filterByTeam', () => {
  it('returns all jobs when the id is empty/null', () => {
    expect(filterByTeam(JOBS, null)).toBe(JOBS);
    expect(filterByTeam(JOBS, '')).toBe(JOBS);
  });

  it('keeps only jobs matching the stable team id', () => {
    const ai = filterByTeam(JOBS, 'AI');
    expect(ai.length).toBeGreaterThan(0);
    expect(ai.every((j) => j.team.en === 'AI')).toBe(true);
  });
});

describe('searchJobs', () => {
  it('returns the list unchanged for an empty/whitespace query', () => {
    expect(searchJobs(JOBS, '')).toBe(JOBS);
    expect(searchJobs(JOBS, '   ')).toBe(JOBS);
  });

  it('matches title case-insensitively in the active language', () => {
    const hits = searchJobs(JOBS, 'frontend', 'en');
    expect(hits.some((j) => j.id === 'senior-frontend')).toBe(true);
  });

  it('matches location and level too', () => {
    expect(searchJobs(JOBS, 'berlin', 'en').some((j) => j.id === 'ml-engineer')).toBe(true);
    expect(searchJobs(JOBS, 'remote', 'en').length).toBeGreaterThan(0);
  });

  it('composes with filterByTeam (AND semantics)', () => {
    const scoped = searchJobs(filterByTeam(JOBS, 'Product'), 'react', 'en');
    expect(scoped.every((j) => j.team.en === 'Product')).toBe(true);
    expect(scoped.some((j) => j.id === 'senior-frontend')).toBe(true);
  });

  it('returns nothing for a query that matches no job', () => {
    expect(searchJobs(JOBS, 'zzzznotarole', 'en')).toEqual([]);
  });
});

describe('jobById', () => {
  it('resolves a known id and returns undefined for an unknown one', () => {
    expect(jobById('ml-engineer')?.team.en).toBe('AI');
    expect(jobById('nope')).toBeUndefined();
  });
});
