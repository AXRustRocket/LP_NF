import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

// Supabase client for test verification
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jpvbnbphgvtokbrlctke.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

test.describe('Waitlist API Integration', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  
  test('should successfully submit to waitlist API and create DB entry', async ({ request }) => {
    // Submit to API endpoint
    const response = await request.post('/api/waitlist', {
      data: {
        email: testEmail,
        name: 'Test User',
        source: 'e2e-test'
      }
    });

    // Check API response
    expect(response.ok()).toBeTruthy();
    const jsonResponse = await response.json();
    expect(jsonResponse.success).toBeTruthy();
    
    // Wait briefly for database to be updated
    await new Promise(r => setTimeout(r, 1000));
    
    // Verify entry in Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', testEmail)
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    
    if (data && data.length > 0) {
      expect(data.length).toBe(1);
      expect(data[0].email).toBe(testEmail);
      expect(data[0].source).toBe('e2e-test');
      
      // Clean up test data
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail);
    } else {
      expect(false, 'Expected to find the entry in the database').toBeTruthy();
    }
  });
  
  test('should handle invalid email gracefully', async ({ request }) => {
    const response = await request.post('/api/waitlist', {
      data: {
        email: 'invalid-email',
        name: 'Test User'
      }
    });
    
    expect(response.status()).toBe(400);
    const jsonResponse = await response.json();
    expect(jsonResponse.success).toBeFalsy();
  });
  
  test('should handle missing required fields', async ({ request }) => {
    const response = await request.post('/api/waitlist', {
      data: { name: 'Test User Only' }
    });
    
    expect(response.status()).toBe(400);
    const jsonResponse = await response.json();
    expect(jsonResponse.success).toBeFalsy();
  });
  
  test('should handle Supabase errors gracefully', async ({ request }) => {
    // Create a test that simulates a Supabase error by using an intentionally very long email
    // that might exceed DB column limits
    const veryLongEmail = `test-${'x'.repeat(500)}@example.com`;
    
    const response = await request.post('/api/waitlist', {
      data: {
        email: veryLongEmail,
        name: 'Test User'
      }
    });
    
    // Even if it's an error, the API should respond gracefully
    const status = response.status();
    expect(status === 400 || status === 500).toBeTruthy();
    
    const jsonResponse = await response.json();
    expect(jsonResponse).toHaveProperty('message');
  });
}); 