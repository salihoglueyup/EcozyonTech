import { test, expect } from './fixtures';

// Visual regression — full-page screenshot baselines for the most static pages.
// reducedMotion freezes our animations (we honor prefers-reduced-motion), and
// Playwright disables CSS animations + waits for fonts, so shots are stable.
//
// Tagged @visual so the default `npm run e2e` (behavioral) excludes them — the
// baselines are platform-specific (font rendering), so this suite is meant to
// run locally with `npm run e2e:visual`. Update with `e2e:visual:update`.
test.use({ reducedMotion: 'reduce' });

const PAGES = [
  ['pricing', '/pricing'],
  ['styleguide', '/styleguide'],
  ['compare', '/compare'],
  ['leaderboard', '/leaderboard'],
  ['glossary', '/glossary'],
  ['sitemap', '/sitemap'],
];

test.describe('@visual visual regression', () => {
  for (const [name, path] of PAGES) {
    test(`${name} page @visual`, async ({ page }) => {
      await page.goto(path);
      // Ensure web fonts are loaded so glyph metrics are stable.
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      });
    });
  }
});
