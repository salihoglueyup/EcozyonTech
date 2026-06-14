import { describe, it, expect } from 'vitest';
import {
  QUESTIONS,
  scoreAssessment,
  isComplete,
  profileFor,
  recommendationsFor,
  categoryBreakdown,
} from './assessment';

const perfect = { transport: 'active', diet: 'plant', energy: 'renew', consumption: 'minimal' };
const worst = { transport: 'car', diet: 'meat', energy: 'grid', consumption: 'high' };

describe('scoreAssessment', () => {
  it('is 0 with no answers', () => {
    expect(scoreAssessment({})).toBe(0);
  });
  it('averages only the answered categories', () => {
    // transit(70) + plant(100) → mean 85
    expect(scoreAssessment({ transport: 'transit', diet: 'plant' })).toBe(85);
  });
  it('caps at 100 for the best answers and is low for the worst', () => {
    expect(scoreAssessment(perfect)).toBe(100);
    expect(scoreAssessment(worst)).toBeLessThan(20);
  });
  it('ignores unknown option ids', () => {
    expect(scoreAssessment({ transport: 'nope' })).toBe(0);
  });
});

describe('isComplete', () => {
  it('is true only when every category is answered', () => {
    expect(isComplete(perfect)).toBe(true);
    expect(isComplete({ transport: 'active' })).toBe(false);
  });
});

describe('profileFor', () => {
  it('maps scores to the right band', () => {
    expect(profileFor(100)).toBe('leader');
    expect(profileFor(80)).toBe('leader');
    expect(profileFor(65)).toBe('good');
    expect(profileFor(40)).toBe('starter');
    expect(profileFor(0)).toBe('beginner');
  });
});

describe('recommendationsFor', () => {
  it('returns the lowest-scoring categories first (energy=20 drops off)', () => {
    // worst scores: transport 0, diet 0, consumption 10, energy 20.
    const recs = recommendationsFor(worst);
    expect(recs[0]).toBe('transport'); // tied at 0, array order wins
    expect(recs).toEqual(['transport', 'diet', 'consumption']);
    expect(recs).not.toContain('energy');
  });
  it('excludes already-perfect categories and caps at n', () => {
    const recs = recommendationsFor({ transport: 'active', diet: 'some', energy: 'grid', consumption: 'minimal' }, 3);
    expect(recs).not.toContain('transport'); // perfect (100)
    expect(recs).not.toContain('consumption'); // perfect (100)
    expect(recs.length).toBeLessThanOrEqual(3);
    expect(recs[0]).toBe('energy'); // 20 < diet's 45
  });
});

describe('categoryBreakdown', () => {
  it('returns one entry per question, defaulting unanswered to 0', () => {
    const b = categoryBreakdown({ transport: 'active' });
    expect(b).toHaveLength(QUESTIONS.length);
    expect(b.find((x) => x.id === 'transport').score).toBe(100);
    expect(b.find((x) => x.id === 'diet').score).toBe(0);
  });
});
