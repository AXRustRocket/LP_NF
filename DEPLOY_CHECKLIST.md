# Rust Rocket Deployment Checklist

This document outlines the key steps and procedures for deploying the Rust Rocket website to production.

## Environment Variables

### Adding Environment Variables in Netlify

1. Log into the Netlify Dashboard (https://app.netlify.com/)
2. Select the "Rust Rocket" project
3. Navigate to "Site settings" > "Environment variables"
4. Click "Add a variable"
5. Enter the variable's key and value
6. Set the scope to "All scopes" or restrict to specific branches as needed
7. Click "Save"

Important environment variables to maintain:
- `SUPABASE_URL`: URL of the Supabase instance (https://jpvbnbphgvtokbrlctke.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep secret)
- `VITE_SUPABASE_ANON_KEY`: Public Supabase anon key
- `SIGNALS_API_KEY`: API key for the signals service

## Custom Domain Setup

### Configuring DNS for www.rust-rocket.com

1. Access your domain registrar's DNS settings (e.g., IONOS)
2. Add a CNAME record:
   | Type  | Host | Value                  |
   |-------|------|------------------------|
   | CNAME | www  | rust-rocketx.netlify.app |

3. In Netlify dashboard:
   - Go to "Site settings" > "Domain management"
   - Add custom domain: www.rust-rocket.com
   - Follow verification steps

## Supabase Edge Functions

### Adding and Deploying a New Edge Function

1. Create a new function in the `supabase/functions/` directory:

```bash
mkdir -p supabase/functions/your-function-name
touch supabase/functions/your-function-name/index.ts
```

2. Implement your function in the `index.ts` file.

3. Test the function locally:

```bash
supabase functions serve your-function-name --no-verify-jwt
```

4. Deploy the function to Supabase:

```bash
supabase functions deploy your-function-name
```

5. For functions that need to access environment variables:

```bash
supabase secrets set MY_SECRET_KEY=my_secret_value
```

6. For functions that need to be publicly accessible (without JWT):

```bash
supabase functions deploy your-function-name --no-verify-jwt
```

## Pre-Deployment Checks

Before merging to main:

1. Run tests locally
   ```bash
   npm run test:e2e
   ```
   
2. Check for console.log statements and remove debugging code
   ```bash
   grep -r "console.log" --include="*.js" .
   ```
   
3. Verify all Lighthouse scores are passing
   ```bash
   npm run lighthouse
   ```

## Post-Deployment Checks

After deploying to production:

1. Verify the site loads at https://www.rust-rocket.com
2. Test the authentication flow
3. Confirm all API calls are working
4. Check Core Web Vitals in Google Search Console

## Supabase Auth Configuration

Ensure the following URLs are added to Supabase Auth Redirect URLs:
- https://www.rust-rocket.com
- https://rust-rocketx.netlify.app

## Troubleshooting

- If Netlify build fails, check the build logs in the Netlify dashboard
- If edge functions are not working, verify environment variables are set correctly
- For auth issues, check the Supabase authentication settings

## Supabase ▶ Netlify Cheat-Sheet

This section provides quick reference for common Supabase and Netlify integration tasks.

### 1. Deploying a New Edge Function

```bash
# Initialize Supabase (if not already done)
supabase init

# Create a new edge function
supabase functions new my-function

# Implement the function in /supabase/functions/my-function/index.ts

# Test locally 
supabase start
supabase functions serve my-function --no-verify-jwt

# Deploy to production
supabase functions deploy my-function --project-ref jpvbnbphgvtokbrlctke
```

### 2. Adding a New Column with RLS Policy

```sql
-- Add new column
ALTER TABLE profiles ADD COLUMN premium_tier TEXT DEFAULT 'free';

-- Set RLS policy for the column
CREATE POLICY "Users can read their own premium tier"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Only admins can update premium tier"
  ON profiles
  FOR UPDATE
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
```

### 3. Testing the Waitlist API

```bash
# Test with curl
curl -X POST https://rust-rocketx.netlify.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","source":"api-test"}'

# Expected response
# {"success":true,"message":"Thanks! You're in the queue."}

# Verify in database
supabase db select "SELECT * FROM waitlist WHERE email = 'test@example.com' LIMIT 1;"
```

### 4. Verifying Auth Integration

1. Check Redirect URLs in Supabase dashboard:
   - Go to Auth → URL Configuration
   - Ensure both production and staging URLs are present
   - Format: https://www.rust-rocket.com/*, https://rust-rocketx.netlify.app/*

2. Test login on staging environment:
   - Visit https://rust-rocketx.netlify.app/auth.html
   - Submit a valid email
   - Check for magic link in email
   - Confirm redirection to dashboard.html after login

3. Verify successful profile creation:
   - After login, check Supabase database for new profile record
   - `supabase db select "SELECT * FROM profiles WHERE email = 'your-test-email@example.com';"`

### 5. Environment Variable Reference

| Variable Name | Where to Use | Purpose |
|---------------|--------------|---------|
| VITE_SUPABASE_URL | Frontend | Public URL for client SDK |
| VITE_SUPABASE_ANON_KEY | Frontend | Public anon key for client SDK |
| SUPABASE_URL | Backend | Same as above, for server context |
| SUPABASE_SERVICE_KEY | Backend only | Admin access (keep secret!) |

Always test your environment variables configuration with:
```bash
npm run supabase:health
``` 