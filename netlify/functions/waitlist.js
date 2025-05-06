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

// Simple in-memory rate limiting
// Note: This will reset when the function is redeployed or scaled
// For production, use Redis or a similar service
const rateLimitStore = {};
const RATE_LIMIT = 10; // max requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function isRateLimited(ip) {
  const now = Date.now();
  
  // Initialize or clean up old entries
  if (!rateLimitStore[ip] || now - rateLimitStore[ip].timestamp > RATE_WINDOW) {
    rateLimitStore[ip] = {
      count: 0,
      timestamp: now
    };
  }
  
  // Increment count
  rateLimitStore[ip].count++;
  
  // Check if rate limited
  return rateLimitStore[ip].count > RATE_LIMIT;
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
    // Get client IP for rate limiting
    const clientIP = event.headers['client-ip'] || 
                    event.headers['x-forwarded-for'] || 
                    event.ip || 
                    'unknown';
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ success: false, message: 'Too many requests, please try again later' }),
      };
    }

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