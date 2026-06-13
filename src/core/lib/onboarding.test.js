import { describe, it, expect } from 'vitest';
import { TOUR_KEY, shouldShowTour, clampStep, isLastStep } from './onboarding';

describe('onboarding helpers', () => {
  it('shows the tour for new visitors, hides it once done', () => {
    expect(shouldShowTour(null)).toBe(true);
    expect(shouldShowTour(undefined)).toBe(true);
    expect(shouldShowTour('done')).toBe(false);
  });

  it('clamps the step index into range', () => {
    expect(clampStep(-2, 4)).toBe(0);
    expect(clampStep(10, 4)).toBe(3);
    expect(clampStep(2, 4)).toBe(2);
    expect(clampStep(0, 0)).toBe(0);
  });

  it('detects the last step', () => {
    expect(isLastStep(3, 4)).toBe(true);
    expect(isLastStep(2, 4)).toBe(false);
  });

  it('exposes a storage key', () => {
    expect(TOUR_KEY).toBe('ecozyon.tour');
  });
});
