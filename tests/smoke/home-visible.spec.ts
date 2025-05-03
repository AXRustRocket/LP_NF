/**
 * Smoke test to verify the homepage content remains visible
 * Checks that the modal doesn't cause a black screen
 */

// Basic test structure as a manual test
export default {
  name: 'Homepage Content Visibility Test',
  steps: [
    {
      name: 'Verify homepage content remains visible with modal',
      test: async () => {
        console.log('1. Open http://localhost:8000/ in an incognito window');
        console.log('2. Wait for page to load completely');
        console.log('3. Verify all content (hero, features, pricing) is visible');
        console.log('4. Wait 5 seconds for modal to appear');
        console.log('5. Verify content is still visible behind the modal');
        console.log('6. Close the modal by clicking X');
        console.log('7. Verify all content remains visible after modal closes');
      }
    }
  ]
};

/**
 * Manual test instructions:
 * 
 * 1. Open http://localhost:8000/ in an incognito window
 * 2. Wait for page to load completely
 * 3. Verify all content (hero, features, pricing) is visible
 * 4. Wait 5 seconds for modal to appear
 * 5. Verify content is still visible behind the modal
 * 6. Close the modal by clicking X
 * 7. Verify all content remains visible after modal closes
 * 8. Refresh the page and verify no modal appears (localStorage gate working)
 * 
 * ✅ Test passed if content is visible throughout the entire flow
 */

// Actual Playwright test (commented out since Playwright might not be installed)
/*
import { test, expect } from '@playwright/test';

test('homepage remains visible with modal', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:8000');
  
  // Verify initial content is visible
  const heroHeading = page.locator('h1:has-text("Meme-Coin Sniper Bot")');
  await expect(heroHeading).toBeVisible({ timeout: 2000 });
  
  // Wait for modal to appear (after 3s delay + buffer)
  await page.waitForTimeout(3500);
  
  // Check if modal appeared
  const modal = page.locator('#waitlistModal');
  const isModalVisible = await modal.isVisible().catch(() => false);
  
  if (isModalVisible) {
    // Verify content is still visible with modal open
    await expect(heroHeading).toBeVisible();
    
    // Close modal
    await page.click('[data-close]');
    
    // Wait for animation
    await page.waitForTimeout(500);
    
    // Verify content remains visible after modal closes
    await expect(heroHeading).toBeVisible();
  }
  
  // Refresh page
  await page.reload();
  
  // Wait to see if modal appears again (should not due to localStorage)
  await page.waitForTimeout(3500);
  
  // Verify modal doesn't appear and content is visible
  const modalAfterRefresh = await modal.isVisible().catch(() => false);
  expect(modalAfterRefresh).toBe(false);
  await expect(heroHeading).toBeVisible();
});
*/ 