// Supabase Edge Function - postSignup.ts
// This function runs after a user signs up and creates a profile entry

import { serve } from 'https://deno.land/x/sift@0.6.0/mod.ts';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE')!;

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRole);

serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers,
      status: 405,
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { email, user_metadata } = body;
    
    // Get user ID from Supabase Auth webhook header
    const userId = req.headers.get('x-supabase-user-id');
    if (!userId) {
      throw new Error('User ID not found in request headers');
    }
    
    // Create profile record
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        username: user_metadata?.username || null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error creating profile:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers,
        status: 500,
      });
    }

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers,
      status: 500,
    });
  }
}); 