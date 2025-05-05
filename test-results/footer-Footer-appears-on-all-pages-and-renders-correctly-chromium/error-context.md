# Test info

- Name: Footer appears on all pages and renders correctly
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/footer.spec.ts:6:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('footer')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('footer')

    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/footer.spec.ts:10:40
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
  - code: 01JTH0VYEZ3XPK246V8YG9APFW
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Use the live site for testing
   4 | const baseURL = 'https://rust-rocketx.netlify.app';
   5 |
   6 | test('Footer appears on all pages and renders correctly', async ({ page }) => {
   7 |   await page.goto(baseURL);
   8 |   
   9 |   // Prüfen, ob der Footer sichtbar ist
> 10 |   await expect(page.locator('footer')).toBeVisible();
     |                                        ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  11 |   
  12 |   // Überprüfen, ob der Footer die richtigen Elemente enthält
  13 |   await expect(page.locator('footer h4')).toBeVisible();
  14 |   await expect(page.locator('footer a[href="/arbitrage.html"]')).toBeVisible();
  15 |   
  16 |   // Prüfen Copyright-Text
  17 |   const copyrightText = await page.locator('footer p').textContent();
  18 |   expect(copyrightText).toContain('© 2025 Rust Rocket');
  19 | }); 
```