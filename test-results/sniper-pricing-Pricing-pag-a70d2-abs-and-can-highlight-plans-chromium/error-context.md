# Test info

- Name: Pricing page loads with tabs and can highlight plans
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/sniper-pricing.spec.ts:35:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/sniper-pricing.spec.ts:71:29
```

# Page snapshot

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- banner:
  - link "Rust Rocket":
    - /url: ./index.html
    - img "Rust Rocket"
  - navigation "Primary":
    - link "Home":
      - /url: ./index.html
    - link "Sniper Bot":
      - /url: ./sniper-bot.html
    - link "Pump Alerts":
      - /url: ./pump-alerts.html
    - link "Arbitrage":
      - /url: ./arbitrage.html
    - link "Copy Trading":
      - /url: ./copy-trading.html
    - link "Pricing":
      - /url: ./pricing.html
  - button "Login"
- main:
  - heading "Choose Your Plan" [level=1]
  - paragraph: Select the perfect trading package that fits your needs and budget. All plans include access to our community and basic support.
  - link "Sniper Bot":
    - /url: "#sniper"
  - link "Copy Trading":
    - /url: "#copy"
  - link "UltraSpeed (Arbitrage)":
    - /url: "#ultra"
  - heading "Starter" [level=3]
  - text: Price TBA
  - paragraph: Free tier
  - list:
    - listitem:
      - img: 
      - text: Basic sniping tools
    - listitem:
      - img: 
      - text: 200ms execution
    - listitem:
      - img: 
      - text: Basic rug protection
    - listitem:
      - img: 
      - text: Priority execution
    - listitem:
      - img: 
      - text: Advanced analytics
  - link "Contact Us":
    - /url: ./auth.html?plan=sniper-starter
  - text: MOST POPULAR
  - heading "Pro" [level=3]
  - text: Price TBA
  - paragraph: For serious traders
  - list:
    - listitem:
      - img: 
      - text: Advanced sniping tools
    - listitem:
      - img: 
      - text: 80ms execution
    - listitem:
      - img: 
      - text: Enhanced rug protection
    - listitem:
      - img: 
      - text: Priority execution
    - listitem:
      - img: 
      - text: Advanced analytics
  - link "Contact Us":
    - /url: ./auth.html?plan=sniper-pro
  - heading "Ultra" [level=3]
  - text: Price TBA
  - paragraph: For professional traders
  - list:
    - listitem:
      - img: 
      - text: All Pro features
    - listitem:
      - img: 
      - text: 50ms execution
    - listitem:
      - img: 
      - text: Premium rug protection
    - listitem:
      - img: 
      - text: VIP execution priority
    - listitem:
      - img: 
      - text: API access
  - link "Contact Us":
    - /url: ./auth.html?plan=sniper-ultra
  - heading "Frequently Asked Questions" [level=2]
  - paragraph: Find answers to common questions about our pricing plans.
  - heading "How is billing handled?" [level=3]
  - paragraph: Billing is processed securely through our payment provider. Contact us for current pricing options. For annual plans, you'll receive a discount compared to monthly payments.
  - heading "Can I upgrade my plan later?" [level=3]
  - paragraph: Yes, you can upgrade your plan at any time. When upgrading, we'll prorate your remaining subscription period and apply it to your new plan. Your new features will be available immediately after upgrading.
  - heading "Is there a trial period?" [level=3]
  - paragraph: Our Starter plans offer free access to basic features with no time limit. We recommend starting with the free tier to test our platform before upgrading to a paid plan.
  - heading "How can I cancel my subscription?" [level=3]
  - paragraph: You can cancel your subscription at any time from your dashboard settings. After cancellation, your premium features will remain active until the end of your current billing cycle. There are no cancellation fees.
  - heading "Ready to Start Trading?" [level=2]
  - paragraph: Join thousands of traders who use Rust Rocket's tools to gain an edge in crypto markets.
  - link "Contact Us":
    - /url: ./auth.html?plan=sniper-starter
- contentinfo:
  - heading "Product" [level=4]
  - list "Product":
    - listitem:
      - link "Sniper Bot":
        - /url: ./sniper-bot.html
    - listitem:
      - link "Arbitrage":
        - /url: ./arbitrage.html
    - listitem:
      - link "Pump Alerts":
        - /url: ./pump-alerts.html
    - listitem:
      - link "Copy Trading":
        - /url: ./copy-trading.html
    - listitem:
      - link "Pricing":
        - /url: ./pricing.html
  - heading "Resources" [level=4]
  - list "Resources":
    - listitem:
      - link "Roadmap":
        - /url: ./roadmap.html
    - listitem:
      - link "Blog":
        - /url: ./blog/index.html
    - listitem:
      - link "Terms & Conditions":
        - /url: ./legal/terms.html
    - listitem:
      - link "Privacy Policy":
        - /url: ./legal/privacy.html
  - heading "Community" [level=4]
  - list "Community":
    - listitem:
      - link "Twitter":
        - /url: https://x.com/aX_RustRocket
    - listitem:
      - link "Discord (Rust_Rocket)":
        - /url: https://discord.gg/rustrocket
    - listitem:
      - link "Telegram":
        - /url: https://t.me/rustxrocket
  - paragraph: © 2025 Rust Rocket • TVTG-regulated
  - img "TVTG Regulated"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Use the local development server for testing
   4 | const baseURL = 'http://localhost:3000';
   5 |
   6 | test('Sniper Bot page loads header, footer, and main content correctly', async ({ page }) => {
   7 |   await page.goto(`${baseURL}/sniper-bot.html`);
   8 |   
   9 |   // Check if the header is visible
  10 |   await expect(page.locator('header')).toBeVisible();
  11 |   
  12 |   // Check if the main content has loaded
  13 |   await expect(page.locator('h1')).toContainText('Fastest TVTG-Licensed Sniper Bot');
  14 |   
  15 |   // Verify key sections exist
  16 |   await expect(page.getByRole('heading', { name: 'Why Choose Our Sniper Bot' })).toBeVisible();
  17 |   await expect(page.getByRole('heading', { name: 'How It Works' })).toBeVisible();
  18 |   await expect(page.getByRole('heading', { name: 'Pricing Plans' })).toBeVisible();
  19 |   await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
  20 |   
  21 |   // Check for the CTA buttons - be more specific with selectors
  22 |   await expect(page.locator('section:first-of-type a:has-text("Get Started")')).toBeVisible();
  23 |   await expect(page.locator('section:first-of-type a:has-text("Documentation")')).toBeVisible();
  24 |   
  25 |   // Verify live metrics are present
  26 |   await expect(page.locator('#latency-count')).toBeVisible();
  27 |   await expect(page.locator('#volume-count')).toBeVisible();
  28 |   await expect(page.locator('#tokens-count')).toBeVisible();
  29 |   await expect(page.locator('#success-count')).toBeVisible();
  30 |   
  31 |   // Check if the footer is visible
  32 |   await expect(page.locator('footer')).toBeVisible();
  33 | });
  34 |
  35 | test('Pricing page loads with tabs and can highlight plans', async ({ page }) => {
  36 |   // Test base pricing page loads
  37 |   await page.goto(`${baseURL}/pricing.html`);
  38 |   
  39 |   // Check if the header, title, and tabs are visible
  40 |   await expect(page.locator('header')).toBeVisible();
  41 |   await expect(page.locator('h1')).toContainText('Choose Your Plan');
  42 |   await expect(page.locator('.tab-button[data-tab="sniper-tab"]')).toBeVisible();
  43 |   await expect(page.locator('.tab-button[data-tab="copy-tab"]')).toBeVisible();
  44 |   await expect(page.locator('.tab-button[data-tab="ultra-tab"]')).toBeVisible();
  45 |   
  46 |   // Default tab should be Sniper Bot tab
  47 |   await expect(page.locator('#sniper-tab')).toBeVisible();
  48 |   
  49 |   // Click on Copy Trading tab and check if content is visible
  50 |   await page.click('.tab-button[data-tab="copy-tab"]');
  51 |   await expect(page.locator('#copy-tab')).toBeVisible();
  52 |   await expect(page.locator('#sniper-tab')).not.toBeVisible();
  53 |   
  54 |   // Click on UltraSpeed tab and check if content is visible
  55 |   await page.click('.tab-button[data-tab="ultra-tab"]');
  56 |   await expect(page.locator('#ultra-tab')).toBeVisible();
  57 |   await expect(page.locator('#copy-tab')).not.toBeVisible();
  58 |   
  59 |   // Test URL parameter functionality
  60 |   await page.goto(`${baseURL}/pricing.html?plan=sniper-pro`);
  61 |   
  62 |   // Check if correct tab is active and plan is highlighted
  63 |   await expect(page.locator('#sniper-tab')).toBeVisible();
  64 |   const sniperProCard = page.locator('[data-plan="sniper-pro"]');
  65 |   await expect(sniperProCard).toBeVisible();
  66 |   
  67 |   // Check if the Pro plan has the 'highlighted' class
  68 |   const hasHighlightClass = await sniperProCard.evaluate(
  69 |     (element) => element.classList.contains('highlighted')
  70 |   );
> 71 |   expect(hasHighlightClass).toBeTruthy();
     |                             ^ Error: expect(received).toBeTruthy()
  72 |   
  73 |   // Check footer links
  74 |   await expect(page.locator('footer')).toBeVisible();
  75 |   await expect(page.locator('footer a[href="./sniper-bot.html"]')).toBeVisible();
  76 | }); 
```