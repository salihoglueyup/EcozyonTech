// Pure helpers for the first-visit onboarding tour. The React component owns
// timing/focus/storage side effects; this logic is side-effect-free + tested.

export const TOUR_KEY = 'ecozyon.tour';

// Show the tour unless it's been completed/dismissed before.
export const shouldShowTour = (stored) => stored !== 'done';

// Keep a step index within [0, total-1].
export const clampStep = (i, total) => Math.max(0, Math.min(i, Math.max(0, total - 1)));

// Is this the last step?
export const isLastStep = (i, total) => i >= total - 1;
