import { test, expect } from '@playwright/test';

test.describe('search', () => {
  test('command palette opens, filters and navigates', async ({ page }) => {
    await page.goto('/');
    // Open via the navbar search affordance (fires the same ecozyon:cmdk event
    // as ⌘K; more reliable than a synthetic global keypress in headless).
    await page.getByRole('button', { name: /Her şeyde ara|Search everything/ }).click();
    const box = page.getByRole('combobox');
    await expect(box).toBeVisible();
    await box.fill('fiyat');
    const options = page.getByRole('option');
    await expect(options.first()).toBeVisible();
    await options.first().click();
    await expect(page).toHaveURL(/\/pricing$/);
  });

  test('/search?q= returns ranked content results', async ({ page }) => {
    await page.goto('/search?q=karbon');
    // The query is reflected into the input post-mount.
    await expect(page.locator('input[type="search"]')).toHaveValue('karbon');
    // At least one result links somewhere in the site (scoped to main so the
    // footer's nav lists don't count).
    const results = page.locator('main#main').getByRole('list').getByRole('link');
    await expect(results.first()).toBeVisible();
  });

  test('searching unmatched text shows an empty state', async ({ page }) => {
    await page.goto('/search?q=zzzznotfound');
    await expect(page.locator('input[type="search"]')).toHaveValue('zzzznotfound');
    await expect(page.locator('main#main').getByRole('list').getByRole('link')).toHaveCount(0);
  });
});
