# Test info

- Name: Arbitrage page loads header, footer, and main content correctly
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/home-arbitrage.spec.ts:38:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('a:has-text("Contact Us")').first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('a:has-text("Contact Us")').first()

    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/home-arbitrage.spec.ts:51:66
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
  - text: 25 ms execution
  - heading "Arbitrage Scanner – Cross-DEX Profits in 25 ms" [level=1]
  - paragraph: Detect price gaps across Raydium, Orca & Jupiter before they close. Capitalize on market inefficiencies with millisecond precision.
  - link "Coming Soon":
    - /url: ./pricing.html
  - link "How It Works":
    - /url: "#how-it-works"
  - img "Arbitrage Scanner Dashboard Interface"
  - text: 25ms Execution Speed 12+ DEX Supported 100% MEV Protected
  - heading "How Our Arbitrage Scanner Works" [level=2]
  - paragraph: Three simple steps to capitalize on cross-DEX price gaps with our lightning-fast infrastructure.
  - heading "Detection" [level=3]
  - paragraph: Our system continuously scans all major Solana DEXes in real-time, detecting price differentials that exist for the same token pairs across platforms.
  - text: 1 Speed Advantage
  - paragraph: Arbitrage opportunities can vanish in milliseconds. Our scanner refreshes price data every 15-25ms.
  - heading "Execution" [level=3]
  - paragraph: When a profitable opportunity is identified, our MEV-protected system executes the trade across multiple DEXes within 25ms.
  - text: 2 MEV Protection
  - paragraph: Jito bundles protect your trades from front-running, ensuring the price gaps remain intact until execution.
  - heading "Profit" [level=3]
  - paragraph: The arbitrage is complete – buy low on one DEX, sell high on another – with profits automatically credited to your wallet.
  - text: 3 Performance Fee
  - paragraph: We only charge a small fee on successful arbitrage profits. No profit, no fee – guaranteed.
  - heading "Frequently Asked Questions" [level=2]
  - paragraph: Find answers to common questions about our Arbitrage Scanner.
  - heading "Which DEXes are supported by the arbitrage scanner?" [level=3]
  - paragraph: Our arbitrage scanner supports all major Solana DEXes including Raydium, Orca, Jupiter, Meteora, and Openbook. This comprehensive coverage ensures we can identify price gaps across the entire Solana ecosystem, maximizing profit opportunities.
  - heading "How are fees calculated for arbitrage trades?" [level=3]
  - paragraph: For arbitrage trades, we charge a small performance fee of 5-10% (depending on your plan) on successful arbitrage profits only. This is calculated as a percentage of the net profit after all network fees and DEX fees have been accounted for. You only pay when you make money.
  - heading "What is the minimum capital required for arbitrage trading?" [level=3]
  - paragraph: For effective arbitrage trading, we recommend a minimum of 5 SOL or equivalent. While you can start with less, larger capital allows you to capture more significant price gaps and offset transaction costs more effectively, resulting in higher net profits.
  - heading "How does MEV-Shield protect my arbitrage trades?" [level=3]
  - paragraph: Our MEV-Shield uses Jito bundles to execute your arbitrage trades in private transaction bundles. This prevents front-running and sandwich attacks from MEV bots that might otherwise intercept your transactions, ensuring you receive the full profit from identified price gaps.
  - heading "Pricing Plans" [level=2]
  - paragraph: Choose the plan that fits your arbitrage trading needs and budget.
  - heading "Starter" [level=3]
  - text: Price TBA
  - paragraph: Free tier
  - list:
    - listitem:  Arbitrage scanner
    - listitem:  Manual execution
    - listitem:  200ms latency
    - listitem:  Automated execution
  - link "Coming Soon":
    - /url: ./pricing.html
  - text: MOST POPULAR
  - heading "Pro" [level=3]
  - text: Price TBA
  - paragraph: For active traders
  - list:
    - listitem:  All Starter features
    - listitem:  Automated execution
    - listitem:  80ms latency
    - listitem:  Cross-exchange routing
  - link "Coming Soon":
    - /url: ./pricing.html
  - heading "Ultra" [level=3]
  - text: Price TBA
  - paragraph: For professional traders
  - list:
    - listitem:  All Pro features
    - listitem:  25ms latency
    - listitem:  Multi-route execution
    - listitem:  MEV protection
  - link "Coming Soon":
    - /url: ./pricing.html
  - link "See all plans ":
    - /url: ./pricing.html
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
   6 | test('Home page loads header, footer, and main content correctly', async ({ page }) => {
   7 |   await page.goto(`${baseURL}/index.html`);
   8 |   
   9 |   // Check if the header is visible
  10 |   await expect(page.locator('header')).toBeVisible();
  11 |   
  12 |   // Check if the main content has loaded
  13 |   await expect(page.locator('h1')).toContainText('Solana Meme-Coin Sniper Bot');
  14 |   
  15 |   // Verify key sections exist
  16 |   await expect(page.getByRole('heading', { name: /Why Choose Our/i })).toBeVisible();
  17 |   await expect(page.getByRole('heading', { name: /How Our Sniper Bot Works/i })).toBeVisible();
  18 |   await expect(page.getByRole('heading', { name: /Simple Pricing Plans/i })).toBeVisible();
  19 |   await expect(page.getByRole('heading', { name: /Frequently/i })).toBeVisible();
  20 |   
  21 |   // Check for the CTA buttons
  22 |   await expect(page.locator('a:has-text("Contact Us")').first()).toBeVisible();
  23 |   await expect(page.locator('[type="submit"]:has-text("Join Waitlist")')).toBeVisible();
  24 |   
  25 |   // Test scroll links work - without actual scrolling in the test
  26 |   await expect(page.locator('a[href="#pricing-snapshot"]')).toBeVisible();
  27 |   
  28 |   // Check if the footer is visible
  29 |   await expect(page.locator('footer')).toBeVisible();
  30 |   await expect(page.locator('footer a[href="./sniper-bot.html"]')).toBeVisible();
  31 |   await expect(page.locator('footer a[href="./arbitrage.html"]')).toBeVisible();
  32 |   
  33 |   // Verify documentation link is not present in footer
  34 |   await expect(page.locator('footer a:has-text("Documentation")')).not.toBeVisible();
  35 |   await expect(page.locator('footer a[href="./docs/index.html"]')).not.toBeVisible();
  36 | });
  37 |
  38 | test('Arbitrage page loads header, footer, and main content correctly', async ({ page }) => {
  39 |   await page.goto(`${baseURL}/arbitrage.html`);
  40 |   
  41 |   // Check if the header is visible
  42 |   await expect(page.locator('header')).toBeVisible();
  43 |   
  44 |   // Check if the main content has loaded
  45 |   await expect(page.locator('h1')).toContainText('Arbitrage Scanner');
  46 |   
  47 |   // Verify key sections exist
  48 |   await expect(page.getByRole('heading', { name: /How Our Arbitrage Scanner Works/i })).toBeVisible();
  49 |   
  50 |   // Check for the CTA buttons
> 51 |   await expect(page.locator('a:has-text("Contact Us")').first()).toBeVisible();
     |                                                                  ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  52 |   await expect(page.locator('a:has-text("How It Works")').first()).toBeVisible();
  53 |   
  54 |   // Test scroll links work - without actual scrolling in the test
  55 |   await expect(page.locator('a[href="#how-it-works"]')).toBeVisible();
  56 |   
  57 |   // Check if the footer is visible
  58 |   await expect(page.locator('footer')).toBeVisible();
  59 |   await expect(page.locator('footer a[href="./sniper-bot.html"]')).toBeVisible();
  60 |   await expect(page.locator('footer a[href="./pricing.html"]')).toBeVisible();
  61 |   
  62 |   // Verify documentation link is not present in footer
  63 |   await expect(page.locator('footer a:has-text("Docs")')).not.toBeVisible();
  64 | }); 
```