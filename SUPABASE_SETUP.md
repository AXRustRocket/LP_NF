# Supabase Authentication Setup

This document provides guidance on setting up and implementing Supabase authentication for the Rust Rocket platform.

## Setup Steps

1. **Create a Supabase project**
   - Go to [https://supabase.com](https://supabase.com) and sign in/create an account
   - Create a new project with a name like "rust-rocket-prod"
   - Note your project URL and anon key (these are already implemented in auth.js)

2. **Configure Authentication**
   - In Supabase dashboard, go to Authentication → Settings
   - Enable Email provider
   - Under "Email Templates", customize the magic link email template:
     - Change "Site Name" to "Rust Rocket"
     - Update the email subject to "Rust Rocket: Magic Link Login"
     - Customize the email content to match our branding
   - Under "URL Configuration":
     - Set Site URL to your production domain (e.g., https://rustrocket.io)
     - Add all redirect URLs:
       - https://rustrocket.io/dashboard
       - https://rustrocket.io/dashboard.html
       - https://[staging-domain]/dashboard
       - http://localhost:3000/dashboard (for local development)

3. **Configure Database**
   - The RLS (Row Level Security) policies have been defined in the supabase_rls_update.sql file
   - These policies ensure users can only access their own data

## Integration Tests

Before deploying to production, test the following scenarios:

1. Magic link login flow
   - Sign up with a new email
   - Verify magic link is received
   - Click magic link and verify redirect to dashboard
   - Check that user is properly authenticated

2. Session handling
   - Verify authentication state persists on page refresh
   - Verify authentication state persists when navigating between pages
   - Verify session expiration works as expected

3. Protected routes
   - Verify that unauthenticated users are redirected to login when visiting /dashboard
   - Verify that authenticated users can access /dashboard

4. UI updates
   - Verify login/logout buttons display correctly based on auth state
   - Verify user email is displayed when logged in

## Troubleshooting

Common issues and solutions:

1. **Magic link not working**
   - Check that the redirect URL matches exactly what's configured in Supabase
   - Ensure the URL is added to the allowed redirect URLs list
   - Check browser console for CORS errors

2. **Session not persisting**
   - Ensure localStorage is available and not being blocked
   - Check for any script errors in the auth.js file
   - Verify the Supabase client is properly initialized

3. **Authentication redirects not working**
   - Check the implementation of requireAuth() function
   - Ensure the redirect URL is properly encoded

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Magic Link Authentication Guide](https://supabase.com/docs/guides/auth/auth-magic-link)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 