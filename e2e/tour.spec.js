import { test, expect } from './fixtures';

// The fixture seeds ecozyon.tour='done', so the tour is treated as already
// completed — exactly the returning-visitor state.
test.describe('onboarding tour', () => {
  test('does not auto-open once completed', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('opens via the event and steps through to finish', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.dispatchEvent(new Event('ecozyon:tour')));
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Walk Next until the final step's Start button, then it closes.
    for (let i = 0; i < 3; i++) {
      await dialog.getByRole('button', { name: /İleri|Next/ }).click();
    }
    await dialog.getByRole('button', { name: /Başla|Start/ }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
