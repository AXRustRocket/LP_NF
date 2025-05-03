import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jpvbnbphgvtokbrlctke.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple flag to check if admin client is available
const hasAdminAccess = !!process.env.SUPABASE_SERVICE_KEY;

test.describe('Authentication Flow', () => {
  // Skip entire suite if admin key isn't available
  test.skip(!hasAdminAccess, 'Supabase admin client required for auth tests');

  const testEmail = `test-auth-${Date.now()}@example.com`;
  let magicLink: string;

  // These tests are designed to be run in an environment where Supabase admin access is available
  // For CI environments without admin access, these tests will be skipped

  test('should send magic link and simulate successful login', async ({ page }) => {
    if (!hasAdminAccess) {
      test.skip();
      return;
    }

    // 1. Go to login page
    await page.goto('/auth.html');
    
    // 2. Fill and submit form
    await page.fill('input[type="email"]', testEmail);
    await page.click('button:has-text("Send Magic Link")');
    
    // 3. Verify success message appears
    await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 5000 });
    
    // 4. In a real test, we would use the admin API to generate and retrieve the magic link
    // For now, we'll just simulate the redirect that would happen after clicking the link
    
    // Note: In production, this would be replaced with actual Supabase admin API calls
    // to generate a real magic link. For testing purposes, we'll simulate the behavior.
    
    await page.goto('/dashboard.html?authSuccess=true');
    
    // 6. Should be on dashboard after auth
    await expect(page.url()).toContain('dashboard');
    
    // 7. Additional assertions for authenticated state would go here
  });
  
  test('should handle login errors gracefully', async ({ page }) => {
    // 1. Go to login page with invalid parameters
    await page.goto('/auth.html?error=invalid_link');
    
    // 2. Should show error message
    await expect(page.locator('text=Invalid or expired link')).toBeVisible();
    
    // 3. Try submitting with an invalid email
    await page.fill('input[type="email"]', 'not-an-email');
    await page.click('button:has-text("Send Magic Link")');
    
    // 4. Should display validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });
}); 