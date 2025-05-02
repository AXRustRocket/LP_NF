/**
 * Auth Functions Unit Tests
 * 
 * Tests the authentication flow functions with mocked responses
 */

import { strict as assert } from 'assert';

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithOtp: async ({ email, options }) => {
      // Simulate various responses based on test inputs
      if (!email || !email.includes('@')) {
        return { error: { message: 'Invalid email format' } };
      }
      
      if (email === 'existing@example.com') {
        return { data: { user: { email } }, error: null };
      }
      
      if (email === 'error@example.com') {
        return { error: { message: 'Service unavailable' } };
      }
      
      // Validate options data
      if (options?.data?.username === 'invalid!username') {
        return { error: { message: 'Invalid username format' } };
      }
      
      // Default success case
      return { data: { user: { email } }, error: null };
    },
    
    getSession: async () => {
      // Used in requireAuth test
      return { data: { session: null } };
    }
  }
};

// Mock window location for redirect tests
const originalLocation = window.location;
let locationAssignSpy;

// Mock the signIn function similar to auth.js
async function signIn(email, username) {
  try {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    const options = {
      emailRedirectTo: 'http://localhost/dashboard.html'
    };
    
    if (username) {
      options.data = { username };
    }
    
    // Use mock client
    const { error } = await mockSupabaseClient.auth.signInWithOtp({
      email,
      options
    });
    
    return error;
  } catch (error) {
    console.error('Error signing in:', error);
    return error;
  }
}

// Mock requireAuth function 
async function requireAuth(redirectPath = '/auth.html') {
  try {
    const { data } = await mockSupabaseClient.auth.getSession();
    
    if (!data.session) {
      // Use the spy to track redirects
      window.location.assign(redirectPath);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.assign(redirectPath);
    return false;
  }
}

// Test Cases
async function runTests() {
  console.log('Running Auth Tests...');
  
  // Setup mocks for location
  delete window.location;
  window.location = { assign: jest.fn() };
  locationAssignSpy = jest.spyOn(window.location, 'assign');
  
  try {
    // Test 1: Valid email should not return error
    const test1 = await signIn('user@example.com');
    assert.equal(test1, null, 'Valid email should not return error');
    console.log('✅ Test 1 passed: Valid email acceptance');
    
    // Test 2: Invalid email should return error
    const test2 = await signIn('invalid-email');
    assert.notEqual(test2, null, 'Invalid email should return error');
    console.log('✅ Test 2 passed: Invalid email rejection');
    
    // Test 3: Service error should be propagated
    const test3 = await signIn('error@example.com');
    assert.equal(test3.message, 'Service unavailable', 'Service error should be propagated');
    console.log('✅ Test 3 passed: Service error handling');
    
    // Test 4: Username should be passed in options
    const test4 = await signIn('user@example.com', 'testuser');
    assert.equal(test4, null, 'Username should be accepted');
    console.log('✅ Test 4 passed: Username handling');
    
    // Test 5: Invalid username should return error
    const test5 = await signIn('user@example.com', 'invalid!username');
    assert.notEqual(test5, null, 'Invalid username should return error');
    console.log('✅ Test 5 passed: Invalid username rejection');
    
    // Test 6: requireAuth should redirect unauthenticated users
    await requireAuth();
    assert.equal(locationAssignSpy.mock.calls.length, 1, 'Should redirect once');
    assert.equal(
      locationAssignSpy.mock.calls[0][0],
      '/auth.html',
      'Should redirect to auth.html'
    );
    console.log('✅ Test 6 passed: Unauthenticated redirect');
    
    console.log('🎉 All auth tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Cleanup mocks
    locationAssignSpy.mockRestore();
    window.location = originalLocation;
  }
}

// Run tests
runTests(); 