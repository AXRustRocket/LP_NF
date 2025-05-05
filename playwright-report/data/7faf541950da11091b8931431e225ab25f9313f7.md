# Test info

- Name: Cookie Consent Banner >> Banner appears on first visit, disappears on decline, no GA loads
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/consent.spec.ts:50:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('#cookieConsentBanner')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('#cookieConsentBanner')

    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/consent.spec.ts:62:49
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
  - code: 01JTH0W8PM8CJT7KW6752T1GS0
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Cookie Consent Banner', () => {
   4 |   const BANNER_SELECTOR = '#cookieConsentBanner';
   5 |   const ACCEPT_SELECTOR = '#cookieAccept';
   6 |   const DECLINE_SELECTOR = '#cookieDecline';
   7 |   const STORAGE_KEY = 'rr_cookie_consent';
   8 |
   9 |   test.beforeEach(async ({ context }) => {
  10 |     // Clear storage before each test to ensure a fresh state
  11 |     await context.clearCookies();
  12 |     await context.addInitScript((key) => {
  13 |       window.localStorage.removeItem(key);
  14 |     }, STORAGE_KEY);
  15 |   });
  16 |
  17 |   test('Banner appears on first visit, disappears on accept, GA loads', async ({ page }) => {
  18 |     let gaRequestDetected = false;
  19 |     page.on('request', request => {
  20 |       if (request.url().includes('google-analytics.com/collect') || request.url().includes('googletagmanager.com/gtag/js')) {
  21 |          console.log('>> GA Request Detected:', request.url());
  22 |          gaRequestDetected = true;
  23 |       }
  24 |     });
  25 |
  26 |     await page.goto('/');
  27 |
  28 |     // 1. Banner should be visible initially
  29 |     await expect(page.locator(BANNER_SELECTOR)).toBeVisible();
  30 |
  31 |     // 2. Click Accept
  32 |     await page.locator(ACCEPT_SELECTOR).click();
  33 |
  34 |     // 3. Banner should be hidden
  35 |     await expect(page.locator(BANNER_SELECTOR)).toBeHidden();
  36 |
  37 |     // 4. LocalStorage should be set to true
  38 |     const consentValue = await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY);
  39 |     expect(consentValue).toBe('true');
  40 |
  41 |     // 5. Wait a moment for GA script to potentially load and fire request
  42 |     await page.waitForTimeout(1000); // Adjust timeout if needed
  43 |     expect(gaRequestDetected).toBe(true);
  44 |
  45 |     // 6. Reload page, banner should stay hidden
  46 |     await page.reload();
  47 |     await expect(page.locator(BANNER_SELECTOR)).toBeHidden();
  48 |   });
  49 |
  50 |   test('Banner appears on first visit, disappears on decline, no GA loads', async ({ page }) => {
  51 |     let gaRequestDetected = false;
  52 |     page.on('request', request => {
  53 |         if (request.url().includes('google-analytics.com/collect') || request.url().includes('googletagmanager.com/gtag/js')) {
  54 |            console.log('>> GA Request Detected (should not happen):', request.url());
  55 |            gaRequestDetected = true;
  56 |         }
  57 |       });
  58 |
  59 |     await page.goto('/');
  60 |
  61 |     // 1. Banner should be visible initially
> 62 |     await expect(page.locator(BANNER_SELECTOR)).toBeVisible();
     |                                                 ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  63 |
  64 |     // 2. Click Decline
  65 |     await page.locator(DECLINE_SELECTOR).click();
  66 |
  67 |     // 3. Banner should be hidden
  68 |     await expect(page.locator(BANNER_SELECTOR)).toBeHidden();
  69 |
  70 |     // 4. LocalStorage should be set to false
  71 |     const consentValue = await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY);
  72 |     expect(consentValue).toBe('false');
  73 |
  74 |     // 5. Wait a moment, ensure no GA request was made
  75 |     await page.waitForTimeout(500);
  76 |     expect(gaRequestDetected).toBe(false);
  77 |
  78 |     // 6. Reload page, banner should stay hidden
  79 |     await page.reload();
  80 |     await expect(page.locator(BANNER_SELECTOR)).toBeHidden();
  81 |   });
  82 | }); 
```