import { test, expect } from '@playwright/test';

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
