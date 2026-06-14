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

test.describe('sustainability assessment', () => {
  test('answering every step reveals a score and tailored steps', async ({ page }) => {
    await page.goto('/assessment');
    const main = page.locator('main#main');
    // Four steps: pick the first option each time (click the label — the radio
    // is sr-only) and advance.
    for (let i = 0; i < 4; i++) {
      await main.locator('fieldset label').first().click();
      await main.getByRole('button', { name: /Devam|Next|skor|score/i }).click();
    }
    // Result: the category breakdown + retake control render.
    await expect(main.getByText(/Kategori dağılımı|Category breakdown/i)).toBeVisible();
    await expect(main.getByRole('button', { name: /Tekrar çöz|Retake/i })).toBeVisible();
  });
});
