# Test info

- Name: Header appears on all pages and renders correctly
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/header.spec.ts:6:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('header')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('header')

    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/header.spec.ts:10:40
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
  - code: 01JTH0VYEZ5JMDG8Y1RTNRP2DA
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Use the live site for testing
   4 | const baseURL = 'https://rust-rocketx.netlify.app';
   5 |
   6 | test('Header appears on all pages and renders correctly', async ({ page }) => {
   7 |   await page.goto(baseURL);
   8 |   
   9 |   // Prüfen, ob der Header sichtbar ist
> 10 |   await expect(page.locator('header')).toBeVisible();
     |                                        ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  11 |   
  12 |   // Überprüfen, ob der Header die richtigen Elemente enthält
  13 |   await expect(page.locator('header img[alt*="Rust Rocket"]')).toBeVisible();
  14 |   await expect(page.locator('header nav').first()).toBeVisible();
  15 |   await expect(page.locator('header button:has-text("Join Waitlist")').first()).toBeVisible();
  16 |   await expect(page.locator('header button:has-text("Join")').last()).toBeVisible();
  17 |   
  18 |   // Prüfen Navigation-Links
  19 |   await expect(page.locator('header nav a[href="/index.html"]').first()).toBeVisible();
  20 |   await expect(page.locator('header nav a[href="/arbitrage.html"]').first()).toBeVisible();
  21 | }); 
```