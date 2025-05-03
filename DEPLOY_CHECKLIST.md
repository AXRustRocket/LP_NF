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
- `SUPABASE_URL`: URL of the Supabase instance
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep secret)
- `VITE_SUPABASE_ANON_KEY`: Public Supabase anon key
- `SIGNALS_API_KEY`: API key for the signals service

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

1. Verify the site loads at https://rustrocket.netlify.app
2. Test the authentication flow
3. Confirm all API calls are working
4. Check Core Web Vitals in Google Search Console

## Troubleshooting

- If Netlify build fails, check the build logs in the Netlify dashboard
- If edge functions are not working, verify environment variables are set correctly
- For auth issues, check the Supabase authentication settings 