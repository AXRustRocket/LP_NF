import { createClient } from '@supabase/supabase-js';

// Helper function to return JSON responses
const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method Not Allowed' });
  }

  let email, name;
  try {
    const body = JSON.parse(event.body || '{}');
    email = body.email;
    name = body.name || ''; // Optional name field
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return jsonResponse(400, { success: false, error: 'Invalid email address provided.' });
    }
  } catch (parseError) {
    console.error('[ERROR] Parsing request body:', parseError);
    return jsonResponse(400, { success: false, error: 'Invalid request body.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[FATAL] Missing Supabase environment variables (URL or Service Key).');
    return jsonResponse(500, { success: false, error: 'Server configuration error.' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log(`[INFO] Attempting waitlist insert for: ${email}`);

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert({ email, name })
      .select('id'); // Select only the ID

    if (error) {
      // Handle known duplicate error gracefully
      if (error.code === '23505') {
        console.warn(`[WARN] Duplicate email submitted: ${email}`);
        return jsonResponse(200, { success: true, message: 'Email already on waitlist.' }); // Still success for user
      }
      // Log other errors and throw to be caught below
      console.error(`[ERROR] Supabase insert failed: Code=${error.code}, Msg=${error.message}`);
      throw error;
    }

    console.log(`[SUCCESS] Waitlist entry created for ${email}, ID: ${data?.[0]?.id}`);
    return jsonResponse(200, { success: true, message: 'Successfully added to waitlist.' }); // 200 OK is fine here

  } catch (err) {
    // Catch errors from the insert attempt or client init issues
    console.error('[ERROR] Handler failed:', err.message || err);
    return jsonResponse(500, { success: false, error: 'Failed to process waitlist request.' });
  }
}; 