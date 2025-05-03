import { test, expect } from '@playwright/test';

test.describe('Production smoke tests', () => {
  test('Home page loads without JS errors and hero buttons scroll correctly', async ({ page }) => {
    // Capture JS errors
    const jsErrors: string[] = [];
    page.on('pageerror', exception => {
      jsErrors.push(exception.message);
    });
    
    // Navigate to home page
    await page.goto('/');
    
    // Check title is present
    await expect(page.locator('h1')).toBeVisible();
    
    // Check hero buttons are visible
    const heroButtons = page.locator('.hero-section a.btn, .hero-section button.btn');
    await expect(heroButtons).toHaveCount(2, { timeout: 5000 });
    
    // Click the "Learn More" or similar button that should scroll
    const scrollButton = heroButtons.first();
    await scrollButton.click();
    
    // Wait for scroll and check if we're no longer at the top of the page
    await page.waitForTimeout(500);
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(100);
    
    // Verify no JS errors occurred
    expect(jsErrors.length).toBe(0);
  });
  
  test('Magic-link auth flow', async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth.html');
    
    // Intercept Supabase auth requests
    await page.route('**/_supabase/auth**', async route => {
      // Simulate successful response for auth
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'test_token',
          refresh_token: 'test_refresh',
          expires_in: 3600,
          user: {
            id: 'test-user-id',
            email: 'test+ci@rustrocket.io',
            user_metadata: { full_name: 'Test CI' }
          }
        })
      });
    });
    
    // Fill email address
    await page.fill('input[type="email"]', 'test+ci@rustrocket.io');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Simulate redirect with auth token (this varies based on implementation)
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'test_token',
        refresh_token: 'test_refresh',
        expires_at: new Date(Date.now() + 3600 * 1000).getTime(),
        user: {
          id: 'test-user-id',
          email: 'test+ci@rustrocket.io',
          user_metadata: { full_name: 'Test CI' }
        }
      }));
      window.location.href = '/dashboard.html';
    });
    
    // Wait for dashboard page to load
    await page.waitForURL('**/dashboard.html');
    
    // Check if welcome message contains the test user name
    const welcomeText = await page.textContent('.dashboard-welcome, .welcome-message');
    expect(welcomeText).toContain('test+ci');
  });
  
  test('Key pages return 200 and contain main tag', async ({ page }) => {
    const pages = [
      '/sniper-bot.html',
      '/pump-alerts.html',
      '/copy-trading.html',
      '/pricing.html'
    ];
    
    for (const pagePath of pages) {
      // Navigate to page
      const response = await page.goto(pagePath);
      
      // Check status code
      expect(response?.status()).toBe(200);
      
      // Check that <main> tag exists
      const mainTag = page.locator('main');
      await expect(mainTag).toBeVisible();
      
      // Check page has loaded properly (has a heading)
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    }
  });
}); 