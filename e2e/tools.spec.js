import { test, expect } from './fixtures';

test.describe('carbon calculator', () => {
  test('moving a slider updates the estimated total', async ({ page }) => {
    await page.goto('/services');
    const calc = page.locator('#calculator');
    await calc.scrollIntoViewIfNeeded();
    const total = calc.locator('[aria-live="polite"]').first();
    const before = (await total.innerText()).trim();
    // Drop the first input (transport) to its minimum — the total must change.
    const slider = calc.locator('input[type="range"]').first();
    await slider.fill('0');
    await expect(total).not.toHaveText(before);
  });
});

test.describe('ROI estimator', () => {
  test('team size + sector drive the savings and plan recommendation', async ({ page }) => {
    await page.goto('/roi');
    await page.locator('#roi-team').fill('500');
    await page.locator('#roi-sector').selectOption('manufacturing');
    // A large team should recommend the enterprise tier.
    await expect(page.locator('a[href="/pricing?plan=enterprise"]')).toBeVisible();
    // The CO2 + savings figures render.
    await expect(page.getByText(/\$\d/).first()).toBeVisible();
  });

  test('a small team recommends the team tier', async ({ page }) => {
    await page.goto('/roi');
    await page.locator('#roi-team').fill('40');
    await expect(page.locator('a[href="/pricing?plan=team"]')).toBeVisible();
  });
});
