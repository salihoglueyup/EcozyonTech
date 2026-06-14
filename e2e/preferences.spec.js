import { test, expect } from './fixtures';

test.describe('preferences', () => {
  test('language toggle switches and persists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await page.getByRole('button', { name: 'English' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    // Persisted across reload.
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('?lang=en renders English (the prerendered hreflang alternate)', async ({ page }) => {
    // The prerendered <link hreflang="en"> points at …?lang=en; visiting it
    // must actually switch the app to English for the alternate to be honest.
    await page.goto('/pricing?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('theme toggle flips the dark class and persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const wasDark = await html.evaluate((el) => el.classList.contains('dark'));
    await page.getByRole('button', { name: /tema|theme/i }).first().click();
    if (wasDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
    await page.reload();
    // Preference survives the reload.
    const afterReload = await html.evaluate((el) => el.classList.contains('dark'));
    expect(afterReload).toBe(!wasDark);
  });
});
