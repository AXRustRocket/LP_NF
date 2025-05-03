# Rust Rocket Authentication System

## Overview

The Rust Rocket Trading Platform uses Supabase for authentication with magic links. This system provides a secure, passwordless login experience for users without requiring them to remember credentials.

## Implementation Details

### Core Files

1. **js/auth.js** - Main authentication module with the following functions:
   - `createSupabaseClient()` - Creates and initializes the Supabase client
   - `getSupabaseClient()` - Returns a cached client instance
   - `signInWithMagicLink(email)` - Sends a magic link to the provided email
   - `signOut()` - Signs out the current user
   - `getSession()` - Gets the current session object
   - `getCurrentUser()` - Gets the current user object
   - `requireAuth(redirectPath)` - Checks if user is authenticated, redirects if not
   - `setupAuthUI()` - Updates UI elements based on auth state
   - `getRedirectUrl()` - Safely processes redirect URL parameters
   - `handleAuthRedirect()` - Processes auth redirects from Supabase

2. **login.html** - Login page with magic link form
   - Includes a glass-card design consistent with the platform
   - Shows appropriate loading states during auth operations
   - Displays success messages after sending magic links
   - Handles validation and error states

3. **components/headbar.html** - Header with auth-aware elements:
   - Shows login button when logged out
   - Shows user email and logout button when logged in

### Authentication Flow

1. **User Login**:
   - User navigates to /login
   - User enters email and requests magic link
   - System sends magic link email
   - User clicks link in email
   - System validates token and creates session
   - User is redirected to dashboard or original destination

2. **Session Management**:
   - Sessions are stored in browser localStorage
   - Sessions expire after 1 hour (configurable in Supabase)
   - The `getSession()` function checks if the session is valid

3. **Protected Routes**:
   - The `requireAuth()` function protects routes that require authentication
   - If user tries to access a protected route without auth, they are redirected to login
   - After successful login, they're redirected back to the original route

4. **UI Updates**:
   - The `setupAuthUI()` function updates login/logout buttons
   - User email is displayed when logged in
   - This function runs on page load and after auth state changes

## Security Considerations

1. **Magic Link Safety**:
   - Links expire after 1 hour
   - Links can only be used once
   - Email addresses are confirmed implicitly

2. **Redirect Protection**:
   - The `getRedirectUrl()` function validates redirect URLs
   - Only relative URLs are allowed to prevent open redirect vulnerabilities

3. **Session Security**:
   - Sessions use JWT tokens with secure signing
   - Tokens include user ID and expiration time
   - Supabase handles token validation and refresh automatically

## Database Integration

The authentication system connects to the Supabase database with Row Level Security (RLS) policies:

1. Users can only read/write their own data
2. Admin operations require additional permissions
3. Public data is available to all authenticated users

The RLS policies are defined in `supabase_rls_update.sql`.

## Testing

Use the `tests/auth_test.html` file to verify the authentication system functionality:

1. Test Supabase client initialization
2. Test magic link sending
3. Test session management
4. Test sign out functionality

## Troubleshooting

Common issues and solutions:

1. **Magic Link Not Working**:
   - Check email spam folder
   - Verify the redirect URL is configured in Supabase
   - Check browser console for CORS errors

2. **Session Issues**:
   - Clear browser localStorage and try again
   - Check for script errors in the console
   - Verify the Supabase client is properly initialized

3. **Auth UI Not Updating**:
   - Make sure the `setupAuthUI()` function is being called
   - Check that DOM elements have the correct data attributes
   - Verify the auth event listeners are properly set up

## Future Improvements

Planned enhancements for the authentication system:

1. Add social login providers (Google, GitHub)
2. Implement MFA for additional security
3. Add user profile management
4. Enhance session monitoring and inactive user detection 