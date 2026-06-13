import { test as base } from '@playwright/test';

// Shared e2e fixture: mark the onboarding tour as already completed before any
// page script runs, so its first-visit auto-open never blocks a flow. Tests
// that exercise the tour itself reopen it explicitly via the ecozyon:tour event.
export const test = base.extend({
  page: async ({ page }, runTest) => {
    await page.addInitScript(() => {
      try {
        // Suppress first-visit overlays (tour + cookie banner) so they never
        // confound a flow; both expose role="dialog".
        localStorage.setItem('ecozyon.tour', 'done');
        localStorage.setItem('ecozyon.cookies.ack', '1');
      } catch {
        /* ignore */
      }
    });
    await runTest(page);
  },
});

export { expect } from '@playwright/test';
