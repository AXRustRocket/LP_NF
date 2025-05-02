const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Basic validation for email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

exports.handler = async (event, context) => {
  // Set CORS headers for browser clients
  const headers = {
    'Access-Control-Allow-Origin': '*', // Or specify your domains
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }
  
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const { email, name } = requestBody;
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Valid email is required' }),
      };
    }
    
    // Basic rate limiting (by IP) - Just an example, real implementation would use Redis
    // const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'];
    // TODO: Implement proper rate limiting
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        { 
          email: email.toLowerCase().trim(),
          name: name ? name.trim() : null,
          source: requestBody.source || 'website'
        }
      ]);
    
    if (error) throw error;
    
    console.log(`Waitlist entry successful: ${email}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "Thanks! You're in the queue." }),
    };
  } catch (error) {
    console.error('Waitlist submission error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Submission failed', error: error.message }),
    };
  }
}; 