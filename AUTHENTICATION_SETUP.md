# Authentication System Setup

This document provides instructions for setting up and configuring the Rust Rocket authentication system.

## Overview

The authentication system uses:
- Supabase for authentication with magic links (passwordless)
- User profiles stored in Supabase database
- Edge Functions for post-signup processes

## 1. Supabase Setup

### Create Profiles Table

Execute the following SQL in Supabase:

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set row level security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can read own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Create policy for the service role to manage profiles
CREATE POLICY "Service role can manage profiles" 
  ON public.profiles 
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### Edge Function Setup

1. Deploy the `postSignup.ts` edge function:

```bash
cd supabase
supabase functions deploy postSignup --no-verify-jwt
```

2. Set environment variables for the edge function:

```bash
supabase secrets set SUPABASE_URL=https://jpvbnbphgvtokbrlctke.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

3. Configure the Auth Webhook in Supabase:
   - Go to Authentication → Webhooks
   - Create a new webhook for "After sign-up"
   - Set the URL to your Edge Function URL
   - Save the webhook

## 2. Frontend Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```
VITE_SUPABASE_URL=https://jpvbnbphgvtokbrlctke.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

For production deployment (Netlify/Vercel), set these environment variables in your hosting platform.

### Deployment Service Environment Variables

For the backend Edge Functions, add these to your deployment service:

```
SUPABASE_URL=https://jpvbnbphgvtokbrlctke.supabase.co
SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

> ⚠️ **IMPORTANT**: Never expose the `SUPABASE_SERVICE_ROLE` key in your frontend code. This key has administrative privileges.

## 3. Testing the Auth Flow

1. **Basic Auth Flow Test**
   - Open the site and navigate to `/auth.html`
   - Enter a valid email (and optional username)
   - Verify you receive the magic link email
   - Click the magic link
   - Verify redirection to `/dashboard.html`

2. **Protection Test**
   - Open an incognito window
   - Navigate directly to `/dashboard.html`
   - Verify redirection to `/auth.html`

3. **Auto-Redirect Test**
   - Click a magic link
   - Verify automatic redirection to the protected page you were trying to access

## 4. Troubleshooting

### "Invalid API Key" Error
- Check that your `VITE_SUPABASE_ANON_KEY` is correct
- Verify you're using the anon key, not the service role key
- Ensure environment variables are properly loaded

### Magic Link Not Received
- Check spam/junk folder
- Verify Supabase email templates are configured
- Confirm your auth service has email sending permissions

### Redirect Issues
- Check browser console for errors
- Ensure `auth.js` is properly loaded and running
- Verify session handling in browser (storage) 