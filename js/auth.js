/**
 * Supabase Auth Client for Rust Rocket
 * Handles authentication flow with magic links
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Supabase client initialization with environment variables support
let SUPABASE_URL;
let SUPABASE_ANON_KEY;

// Try to use environment variables if available (Vite)
try {
  // Check for environment variables in Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Warning for missing environment variables
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Missing Supabase environment variables. Using fallback values.');
    }
  }
} catch (error) {
  console.warn('Error accessing environment variables:', error);
}

// Fallback to hardcoded values if environment variables are not available
// This ensures the app works in development without env setup
if (!SUPABASE_URL) {
  SUPABASE_URL = 'https://jpvbnbphgvtokbrlctke.supabase.co';
}

if (!SUPABASE_ANON_KEY) {
  SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdmJuYnBoZ3Z0b2ticmxjdGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM5MDI1NTYsImV4cCI6MTk5OTQ3ODU1Nn0.J2osgpgynCqWh0qcGDiEb59x0gMihNdwJxyJTN6e5PY';
}

// Initialize Supabase client
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Log confirmation or warning
console.log(`Supabase initialized with URL: ${SUPABASE_URL.substring(0, 20)}...`);
if (typeof import.meta === 'undefined' || !import.meta.env?.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using fallback API key. For production, set environment variables.');
}

// Get DOM elements
const authBtns = document.getElementById('authBtns');
const mobileAuthBtns = document.getElementById('mobileAuthBtns');
let authModal = null;

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Check if we're on the auth page
  if (window.location.pathname.includes('/auth.html')) {
    initAuthPage();
  }
  
  // Initial render of the auth buttons in header
  const session = (await supabase.auth.getSession()).data.session;
  render(session);
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_, session) => render(session));
});

/**
 * Initialize the auth page form and handlers
 */
function initAuthPage() {
  const authForm = document.getElementById('authForm');
  const submitBtn = document.getElementById('submitBtn');
  const loadingIcon = document.getElementById('loadingIcon');
  const formError = document.getElementById('formError');
  const successState = document.getElementById('successState');
  const emailDisplay = document.getElementById('emailDisplay');
  
  if (!authForm) return;
  
  // Handle form submission
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      showError(formError, 'Please enter a valid email address');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    loadingIcon.classList.remove('hidden');
    formError.classList.add('hidden');
    
    try {
      // Call signIn function with email and optional username
      const error = await signIn(email, username);
      
      if (error) {
        throw error;
      }
      
      // Show success state
      authForm.classList.add('hidden');
      successState.classList.remove('hidden');
      if (emailDisplay) {
        emailDisplay.textContent = email;
      }
      
    } catch (error) {
      console.error('Authentication error:', error);
      showError(formError, error.message || 'Failed to send magic link. Please try again.');
      
      // Reset loading state
      submitBtn.disabled = false;
      loadingIcon.classList.add('hidden');
    }
  });
}

/**
 * Show an error message in the form
 * @param {HTMLElement} errorElement - Error element to show the message in
 * @param {string} message - Error message to display
 */
function showError(errorElement, message) {
  if (!errorElement) return;
  
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

/**
 * Sign in with email and optional username
 * @param {string} email - User's email address
 * @param {string} username - Optional username
 * @returns {Error|null} - Error if any occurred
 */
export async function signIn(email, username) {
  try {
    if (!email || !isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    const redirectTo = new URL('/dashboard.html', window.location.origin).toString();
    
    // Create sign-in options with metadata
    const options = {
      emailRedirectTo: redirectTo
    };
    
    // Add username to metadata if provided
    if (username) {
      options.data = { username };
    }
    
    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options
    });
    
    return error;
  } catch (error) {
    console.error('Error signing in:', error);
    return error;
  }
}

/**
 * Render auth buttons based on session state
 * @param {Object|null} session - The current Supabase session
 */
async function render(session = null) {
  if (!authBtns && !mobileAuthBtns) return;
  
  if (!session || !session.user) {
    // Not authenticated - show login button
    if (authBtns) {
      authBtns.innerHTML = `
        <a href="/auth.html" class="btn-neon inline-flex items-center justify-center gap-2 bg-neonGreen hover:bg-[#28D94C] text-spaceBlack font-medium px-4 py-2 rounded-lg transition-colors">
          Log In
        </a>
      `;
    }
    
    if (mobileAuthBtns) {
      mobileAuthBtns.innerHTML = `
        <a href="/auth.html" class="text-white hover:text-neonGreen py-2 border-b border-white/10 text-left w-full">
          Log In
        </a>
      `;
    }
  } else {
    // Authenticated - show user info and logout button
    const userEmail = session.user.email;
    const initials = getUserInitials(userEmail);
    
    if (authBtns) {
      authBtns.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen text-sm font-medium">
            ${initials}
          </div>
          <button class="btn-ghost inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white hover:text-white font-medium px-4 py-2 rounded-lg transition-colors" id="logoutBtn">
            Log Out
          </button>
        </div>
      `;
    }
    
    if (mobileAuthBtns) {
      mobileAuthBtns.innerHTML = `
        <div class="py-2 border-b border-white/10 flex items-center space-x-2">
          <div class="w-6 h-6 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen text-xs font-medium">
            ${initials}
          </div>
          <span class="text-neonGreen text-sm font-medium">${userEmail}</span>
        </div>
        <button class="text-white hover:text-neonGreen py-2 border-b border-white/10 text-left w-full" id="mobileLogoutBtn">
          Log Out
        </button>
      `;
    }
    
    // Add event listeners to logout buttons
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await signOut();
      toast('Logged out successfully');
    });
    
    document.getElementById('mobileLogoutBtn')?.addEventListener('click', async () => {
      await signOut();
      toast('Logged out successfully');
    });
  }
}

/**
 * Sign out the current user
 */
async function signOut() {
  try {
    await supabase.auth.signOut();
    
    // Redirect to home page
    window.location.href = '/';
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated and redirect to login if not
 * @param {string} [redirectPath='/auth.html'] - Path to redirect to if not authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export async function requireAuth(redirectPath = '/auth.html') {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      // User is not authenticated, redirect to auth page
      console.log('User not authenticated, redirecting to auth page');
      
      // Store the current path for redirect after auth
      const currentPath = window.location.pathname;
      sessionStorage.setItem('authRedirect', currentPath);
      
      // Redirect to auth page
      window.location.href = redirectPath;
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.href = redirectPath;
    return false;
  }
}

/**
 * Get user initials from email
 * @param {string} email - User's email address
 * @returns {string} - User's initials
 */
function getUserInitials(email) {
  if (!email) return '?';
  
  // Get the part before @ symbol
  const name = email.split('@')[0];
  
  // Handle special cases like emails with dots or numbers
  if (name.includes('.')) {
    // If format is firstname.lastname@example.com
    const parts = name.split('.');
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  } else {
    // Default case: use first two characters
    return name.substring(0, 2).toUpperCase();
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function toast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 z-50 py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-2 opacity-0 ${
    type === 'success' ? 'bg-neonGreen text-spaceBlack' : 'bg-red-500 text-white'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);
  
  // Animate out and remove after delay
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Handle auth state from URL hash (for magic link redirects)
async function handleAuthRedirect() {
  try {
    // Check if we have a hash in URL that indicates an auth redirect
    if (window.location.hash && window.location.hash.includes('access_token')) {
      // Process the hash
      const { error } = await supabase.auth.getSession();
      if (error) throw error;
      
      // Get redirect path if any
      const redirectPath = sessionStorage.getItem('authRedirect') || '/dashboard.html';
      sessionStorage.removeItem('authRedirect');
      
      // Show success message
      toast('Successfully logged in!');
      
      // Redirect if needed
      if (window.location.pathname !== redirectPath) {
        window.location.href = redirectPath;
      }
    }
  } catch (error) {
    console.error('Error handling auth redirect:', error);
    toast('Authentication failed. Please try again.', 'error');
  }
}

// Handle auth redirects when DOM is loaded
document.addEventListener('DOMContentLoaded', handleAuthRedirect); 