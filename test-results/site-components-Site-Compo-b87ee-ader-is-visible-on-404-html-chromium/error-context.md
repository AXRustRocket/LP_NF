# Test info

- Name: Site Components >> Header is visible on /404.html
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/site-components.spec.ts:17:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('header')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('header')

    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/site-components.spec.ts:22:28
```

# Page snapshot

```yaml
- heading "Site not found" [level=1]
- paragraph: Looks like you followed a broken link or entered a URL that doesn’t exist on Netlify.
- separator
- paragraph:
  - text: If this is your site, and you weren’t expecting a 404 for this path, please visit Netlify’s
  - link "“page not found” support guide":
    - /url: https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125?utm_source=404page&utm_campaign=community_tracking
  - text: for troubleshooting tips.
- paragraph:
  - text: "Netlify Internal ID:"
  - code: 01JTH0X727NQYAZS26DSPS4K4W
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Check header and footer presence on all pages
   4 | test.describe('Site Components', () => {
   5 |   // Base URLs
   6 |   const pages = [
   7 |     '/',
   8 |     '/index.html',
   9 |     '/arbitrage.html',
  10 |     '/pricing.html',
  11 |     '/sniper-bot.html',
  12 |     '/404.html'
  13 |   ];
  14 |
  15 |   // Test header on all pages
  16 |   for (const page of pages) {
  17 |     test(`Header is visible on ${page}`, async ({ page: playwrightPage }) => {
  18 |       await playwrightPage.goto(page);
  19 |       
  20 |       // Verify header
  21 |       const header = playwrightPage.locator('header');
> 22 |       await expect(header).toBeVisible();
     |                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  23 |       
  24 |       // Verify header elements
  25 |       await expect(playwrightPage.locator('header img')).toBeVisible(); // Logo
  26 |       await expect(playwrightPage.locator('header nav')).toBeAttached(); // Navigation
  27 |       await expect(playwrightPage.locator('header #loginBtn')).toBeVisible(); // Login button
  28 |     });
  29 |   }
  30 |
  31 |   // Test footer on all pages
  32 |   for (const page of pages) {
  33 |     test(`Footer is visible on ${page}`, async ({ page: playwrightPage }) => {
  34 |       await playwrightPage.goto(page);
  35 |       
  36 |       // Verify footer
  37 |       const footer = playwrightPage.locator('footer');
  38 |       await expect(footer).toBeVisible();
  39 |       
  40 |       // Verify footer elements
  41 |       await expect(playwrightPage.locator('footer h4')).toBeVisible(); // Section headers
  42 |       await expect(playwrightPage.locator('footer a')).toBeAttached(); // Links
  43 |       
  44 |       // Verify copyright text
  45 |       const footerText = await playwrightPage.locator('footer').textContent();
  46 |       expect(footerText).toContain('Rust Rocket');
  47 |     });
  48 |   }
  49 |   
  50 |   // Test mobile menu
  51 |   test('Mobile menu opens and closes', async ({ page }) => {
  52 |     // Use mobile viewport
  53 |     await page.setViewportSize({ width: 375, height: 812 });
  54 |     await page.goto('/');
  55 |     
  56 |     // Initial state - menu closed
  57 |     await expect(page.locator('#mobileMenu')).toHaveClass(/translate-x-full/);
  58 |     
  59 |     // Open menu
  60 |     await page.locator('[data-menu-toggle="open"]').click();
  61 |     await expect(page.locator('#mobileMenu')).not.toHaveClass(/translate-x-full/);
  62 |     
  63 |     // Close menu
  64 |     await page.locator('[data-menu-toggle="close"]').click();
  65 |     await expect(page.locator('#mobileMenu')).toHaveClass(/translate-x-full/);
  66 |   });
  67 |   
  68 |   // Test navigation links
  69 |   test('Navigation links work correctly', async ({ page }) => {
  70 |     await page.goto('/');
  71 |     
  72 |     // Check all main navigation links
  73 |     const navLinks = page.locator('header nav a');
  74 |     const count = await navLinks.count();
  75 |     
  76 |     // Verify we have at least 3 links
  77 |     expect(count).toBeGreaterThanOrEqual(3);
  78 |     
  79 |     // Check that links have href attributes
  80 |     for (let i = 0; i < count; i++) {
  81 |       const href = await navLinks.nth(i).getAttribute('href');
  82 |       expect(href).toBeTruthy();
  83 |     }
  84 |   });
  85 | }); 
```