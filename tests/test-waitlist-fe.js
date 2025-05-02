// Test script for frontend waitlist submission flow
// This script simulates browser interaction with the waitlist form

console.log('🧪 Testing frontend waitlist submission flow');

// Test function to verify localStorage behavior
function testLocalStorage() {
  console.log('\n1. Testing localStorage behavior:');
  
  // Clear any existing waitlist localStorage item
  localStorage.removeItem('rr_waitlist_done');
  
  // Check initial state
  const initialValue = localStorage.getItem('rr_waitlist_done');
  console.log(`- Initial localStorage value: ${initialValue === null ? 'null (correct)' : initialValue}`);
  
  // Set the value and verify
  localStorage.setItem('rr_waitlist_done', '1');
  const setValue = localStorage.getItem('rr_waitlist_done');
  console.log(`- After setting, localStorage value: ${setValue === '1' ? '1 (correct)' : setValue}`);
  
  // Clear for next test
  localStorage.removeItem('rr_waitlist_done');
  console.log('- Cleared localStorage for next test');
  
  return initialValue === null && setValue === '1';
}

// Test function to simulate form submission
async function testFormSubmission() {
  console.log('\n2. Testing form submission:');
  
  // Wait for the modal to appear
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Find modal and form elements
  const modal = document.getElementById('waitlistModal');
  
  if (!modal) {
    console.error('- ❌ Modal not found in the DOM');
    return false;
  }
  
  console.log(`- ✅ Found modal: ${modal.tagName}`);
  
  const form = modal.querySelector('form[data-waitlist-form]');
  if (!form) {
    console.error('- ❌ Form not found in modal');
    return false;
  }
  
  console.log(`- ✅ Found form: ${form.tagName}[data-waitlist-form]`);
  
  const emailInput = form.querySelector('input[name="email"]');
  if (!emailInput) {
    console.error('- ❌ Email input not found in form');
    return false;
  }
  
  console.log(`- ✅ Found email input: ${emailInput.tagName}[name="email"]`);
  
  // Fill in test email
  const testEmail = `test.${Date.now()}@fakemail.io`;
  emailInput.value = testEmail;
  console.log(`- Set test email: ${testEmail}`);
  
  // Create a promise to track form submission
  let formSubmitted = false;
  const originalFetch = window.fetch;
  
  // Mock fetch to intercept the API call
  window.fetch = async (url, options) => {
    if (url === '/api/waitlist' && options.method === 'POST') {
      console.log(`- ✅ Intercepted fetch to ${url}`);
      console.log(`- Request body: ${options.body}`);
      
      formSubmitted = true;
      
      // Simulate a successful response
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, message: "Thanks! You're in the queue." })
      };
    }
    
    // Pass through any other requests
    return originalFetch(url, options);
  };
  
  // Submit the form
  console.log('- Submitting form...');
  const submitEvent = new Event('submit', { cancelable: true });
  form.dispatchEvent(submitEvent);
  
  // Wait for submission processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Reset fetch
  window.fetch = originalFetch;
  
  // Check localStorage after submission
  const lsAfterSubmit = localStorage.getItem('rr_waitlist_done');
  console.log(`- After submission, localStorage value: ${lsAfterSubmit === '1' ? '1 (correct)' : lsAfterSubmit}`);
  
  // Check if step 2 is displayed
  const step1 = modal.querySelector('[data-step="1"]');
  const step2 = modal.querySelector('[data-step="2"]');
  
  if (step1.classList.contains('hidden') && !step2.classList.contains('hidden')) {
    console.log('- ✅ Success screen is displayed');
  } else {
    console.log('- ❌ Success screen not displayed correctly');
    return false;
  }
  
  return formSubmitted && lsAfterSubmit === '1';
}

// Main test function
async function runTests() {
  console.log('🔍 Starting tests...');
  
  let testsPassed = 0;
  let testsFailed = 0;
  
  try {
    // Test 1: localStorage behavior
    if (testLocalStorage()) {
      console.log('✅ Test 1 passed: localStorage behavior is correct');
      testsPassed++;
    } else {
      console.error('❌ Test 1 failed: localStorage behavior is incorrect');
      testsFailed++;
    }
    
    // Test 2: Form submission
    if (await testFormSubmission()) {
      console.log('✅ Test 2 passed: Form submission is working correctly');
      testsPassed++;
    } else {
      console.error('❌ Test 2 failed: Form submission not working correctly');
      testsFailed++;
    }
    
    // Report results
    console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    
    if (testsFailed === 0) {
      console.log('🎉 All tests passed successfully!');
    } else {
      console.error('⚠️ Some tests failed, check the logs above for details.');
    }
  } catch (error) {
    console.error('💥 Test execution error:', error);
    testsFailed++;
  }
}

// Execute tests when page is loaded
document.addEventListener('DOMContentLoaded', runTests); 