import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Base URL from environment variables or default to production
const baseURL = process.env.PW_BASE_URL || 'https://rust-rocket.com';

// Test email with unique timestamp to avoid conflicts
const testEmail = `e2e-${Date.now()}@test.dev`;

test.describe('waitlist functionality', () => {
  
  test('waitlist form shows on button click and submission works', async ({ page }) => {
    // Set cookie consent to accepted
    await page.goto(baseURL);
    await page.evaluate(() => {
      localStorage.setItem('rr_cookie_consent', 'accepted');
    });
    
    // Reload page after setting localStorage
    await page.reload();
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Click the header waitlist button
    const waitlistButton = page.locator('#joinWaitlistBtn');
    await expect(waitlistButton).toBeVisible();
    await waitlistButton.click();
    
    // Dialog should be visible
    const modal = page.locator('#waitlistModal');
    await expect(modal).toBeVisible();
    
    // Fill the form
    await page.fill('#waitlist_email', testEmail);
    await page.fill('#waitlist_full_name', 'Playwright Test User');
    await page.check('#waitlist_marketing');
    
    // Submit the form
    await page.click('#waitlistForm button[type="submit"]');
    
    // Expect success message
    const successMessage = page.locator('#waitlist_success');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Wait a moment to ensure the DB record is created
    await page.waitForTimeout(1000);
    
    // Verify the record exists in Supabase
    const { exists, error } = await verifyRecordExists(testEmail);
    expect(error).toBeNull();
    expect(exists).toBe(true);
  });
  
  test('waitlist form rejects duplicate email', async ({ page }) => {
    // Use the same email as the previous test to trigger duplication error
    await page.goto(baseURL);
    
    // Click the header waitlist button
    const waitlistButton = page.locator('#joinWaitlistBtn');
    await waitlistButton.click();
    
    // Dialog should be visible
    const modal = page.locator('#waitlistModal');
    await expect(modal).toBeVisible();
    
    // Fill the form with the same email
    await page.fill('#waitlist_email', testEmail);
    await page.click('#waitlistForm button[type="submit"]');
    
    // Expect error message about duplication
    const errorMessage = page.locator('#waitlist_error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText(/already/i);
  });
});

// Helper function to verify record exists in Supabase
async function verifyRecordExists(email: string) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );
    
    const { data, error } = await supabase
      .from('waitlist')
      .select('email, full_name, marketing_ok')
      .eq('email', email)
      .single();
    
    return { 
      exists: !!data, 
      data, 
      error 
    };
  } catch (err) {
    console.error('Error checking Supabase record:', err);
    return { exists: false, error: err };
  }
} 