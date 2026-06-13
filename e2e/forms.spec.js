import { test, expect } from './fixtures';

// Forms run against the real serverless logic — the dev-api middleware is now
// mounted on the preview server too, in demo mode (no secrets).
test.describe('contact form', () => {
  test('keeps submit disabled until the email is valid', async ({ page }) => {
    await page.goto('/contact');
    await page.getByPlaceholder('[isim]').fill('Ada');
    await page.getByPlaceholder('[şirket/kurum]').fill('Acme');
    const submit = page.getByRole('button', { name: 'Mesajını gönder' });
    // Passes native type=email but fails the stricter regex (no TLD) → disabled.
    await page.locator('main input[type="email"]').fill('ada@acme');
    await expect(submit).toBeDisabled();
    // A valid address enables it.
    await page.locator('main input[type="email"]').fill('ada@acme.co');
    await expect(submit).toBeEnabled();
  });

  test('submits successfully with valid input', async ({ page }) => {
    await page.goto('/contact');
    await page.getByPlaceholder('[isim]').fill('Ada Lovelace');
    await page.getByPlaceholder('[şirket/kurum]').fill('Acme Co');
    await page.locator('main input[type="email"]').fill('ada@acme.co');
    await page.getByRole('button', { name: 'Mesajını gönder' }).click();
    await expect(page.getByText(/Teşekkürler! Mesajın alındı/)).toBeVisible();
  });
});

test.describe('newsletter form', () => {
  test('subscribes a valid email from the footer', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await footer.locator('input[type="email"]').fill('ada@acme.co');
    await footer.getByRole('button', { name: /Abone ol|Subscribe/ }).click();
    // The form swaps to a success status region.
    await expect(footer.getByRole('status')).toBeVisible();
  });
});
