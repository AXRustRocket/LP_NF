# Test info

- Name: waitlist modal shows & submits
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/waitlist-visible.spec.ts:3:5

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#joinWaitlistBtn')

    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/waitlist-visible.spec.ts:5:42
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
  - code: 01JTHAPPE4S9ZY1WKZRNPY098G
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('waitlist modal shows & submits', async ({ page }) => {
   4 |   await page.goto('/');
>  5 |   await page.locator('#joinWaitlistBtn').click();
     |                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
   6 |   await expect(page.locator('#waitlistModal')).toBeVisible();
   7 |   await page.fill('#waitlist_email', `e2e-${Date.now()}@example.dev`);
   8 |   await page.fill('#waitlist_full_name', 'Test User');
   9 |   await page.click('#waitlistForm button[type="submit"]');
  10 |   await expect(page.locator('#waitlist_success')).toBeVisible({ timeout: 8000 });
  11 | }); 
```