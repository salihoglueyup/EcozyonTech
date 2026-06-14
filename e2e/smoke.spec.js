import { test, expect } from './fixtures';

test.describe('smoke', () => {
  test('home loads with hero and primary nav', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ecozyon Tech/);
    // The main landmark and at least one heading render.
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('navigates from the navbar mega-menu to a route', async ({ page }) => {
    await page.goto('/');
    // Pricing lives in the "Solutions" mega-menu — open it, then click through.
    await page.getByRole('button', { name: /Çözümler|Solutions/ }).hover();
    await page.getByRole('link', { name: /Fiyatlandırma|Pricing/ }).first().click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.getByRole('heading', { name: /Fiyat|Pricing/i }).first()).toBeVisible();
  });

  test('deep-links into a prerendered content route', async ({ page }) => {
    await page.goto('/help');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    // The help search box is present (the page is interactive).
    await expect(page.getByRole('searchbox').or(page.locator('input[type="search"]')).first()).toBeVisible();
  });
});
