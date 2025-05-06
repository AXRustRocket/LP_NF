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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY     // service key – NOT anon
);

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {        // CORS pre-flight
    return { statusCode: 204,
             headers: { 'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, fullName, marketingOK, ...meta } = body;

    if (!email) return { statusCode: 400, body: 'Missing email' };

    const { error } = await supabase.from('waitlist').insert({
      email,
      full_name: fullName || '',
      marketing_ok: !!marketingOK,
      ...meta
    });

    if (error) {
      if (error.code === '23505')       // duplicate
        return { statusCode: 409, body: 'E-Mail already registered' };
      console.error(error);
      return { statusCode: 500, body: 'DB error' };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
}; 