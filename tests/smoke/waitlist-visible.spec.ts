import { test, expect } from '@playwright/test';

test('waitlist modal shows & submits', async ({ page }) => {
  await page.goto('/');
  await page.locator('#joinWaitlistBtn').click();
  await expect(page.locator('#waitlistModal')).toBeVisible();
  await page.fill('#waitlist_email', `e2e-${Date.now()}@example.dev`);
  await page.fill('#waitlist_full_name', 'Test User');
  await page.click('#waitlistForm button[type="submit"]');
  await expect(page.locator('#waitlist_success')).toBeVisible({ timeout: 8000 });
}); 