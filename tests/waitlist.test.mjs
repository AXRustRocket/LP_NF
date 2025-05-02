import fetch from 'node-fetch';

/**
 * Waitlist API endpoint test
 * Tests POST submission to the waitlist endpoint
 */

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:8000';
const ENDPOINT = '/api/waitlist';
const TEST_EMAIL = `test.${Date.now()}@fakemail.io`;

// Main test function
async function testWaitlistEndpoint() {
  console.log(`🧪 Testing Waitlist API at ${API_URL}${ENDPOINT}`);
  console.log(`Using test email: ${TEST_EMAIL}`);
  
  try {
    // Test valid submission
    console.log('\n1. Testing valid email submission...');
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: TEST_EMAIL,
        source: 'unit-test'
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Server returned status 200');
      console.log(`Response data: ${JSON.stringify(data)}`);
    } else {
      console.error('❌ ERROR: Server returned non-200 status', response.status);
      console.error(`Response data: ${JSON.stringify(data)}`);
      process.exit(1);
    }
    
    // Test invalid email
    console.log('\n2. Testing invalid email submission...');
    const invalidResponse = await fetch(`${API_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'invalid-email',
        source: 'unit-test'
      }),
    });
    
    const invalidData = await invalidResponse.json();
    
    if (invalidResponse.status === 400) {
      console.log('✅ SUCCESS: Server correctly rejected invalid email with 400 status');
      console.log(`Response data: ${JSON.stringify(invalidData)}`);
    } else {
      console.error('❌ ERROR: Server should have returned 400 for invalid email, got', invalidResponse.status);
      console.error(`Response data: ${JSON.stringify(invalidData)}`);
      process.exit(1);
    }
    
    // Test empty submission
    console.log('\n3. Testing empty submission...');
    const emptyResponse = await fetch(`${API_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const emptyData = await emptyResponse.json();
    
    if (emptyResponse.status === 400) {
      console.log('✅ SUCCESS: Server correctly rejected empty submission with 400 status');
      console.log(`Response data: ${JSON.stringify(emptyData)}`);
    } else {
      console.error('❌ ERROR: Server should have returned 400 for empty submission, got', emptyResponse.status);
      console.error(`Response data: ${JSON.stringify(emptyData)}`);
      process.exit(1);
    }
    
    console.log('\n🎉 All tests passed successfully!');
  } catch (error) {
    console.error('❌ TEST FAILURE:', error.message);
    process.exit(1);
  }
}

// Run the test
testWaitlistEndpoint(); 