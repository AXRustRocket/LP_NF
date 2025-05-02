/**
 * Supabase Auth Client for Rust Rocket
 * Handles authentication flow with magic links
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Supabase client initialization
const SUPABASE_URL = 'https://jpvbnbphgvtokbrlctke.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdmJuYnBoZ3Z0b2ticmxjdGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM5MDI1NTYsImV4cCI6MTk5OTQ3ODU1Nn0.J2osgpgynCqWh0qcGDiEb59x0gMihNdwJxyJTN6e5PY';

// Initialize Supabase client
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Get DOM elements
const authBtns = document.getElementById('authBtns');
const mobileAuthBtns = document.getElementById('mobileAuthBtns');
let authModal = null;

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initial render of the auth buttons
  const session = (await supabase.auth.getSession()).data.session;
  render(session);
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_, session) => render(session));
});

/**
 * Render auth buttons based on session state
 * @param {Object|null} session - The current Supabase session
 */
async function render(session = null) {
  if (!session && !session?.user) {
    // Not authenticated - show login button
    if (authBtns) {
      authBtns.innerHTML = `
        <button class="btn-neon inline-flex items-center justify-center gap-2 bg-neonGreen hover:bg-[#28D94C] text-spaceBlack font-medium px-4 py-2 rounded-lg transition-colors" id="loginBtn">
          Log In
        </button>
      `;
    }
    
    if (mobileAuthBtns) {
      mobileAuthBtns.innerHTML = `
        <button class="text-white hover:text-neonGreen py-2 border-b border-white/10 text-left w-full" id="mobileLoginBtn">
          Log In
        </button>
      `;
    }
    
    // Add event listeners to login buttons
    document.getElementById('loginBtn')?.addEventListener('click', () => openModal());
    document.getElementById('mobileLoginBtn')?.addEventListener('click', () => openModal());
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
 * Open the auth modal
 */
async function openModal() {
  try {
    // First, check if the modal is already in the DOM
    authModal = document.getElementById('authModal');
    
    if (!authModal) {
      // If not, inject it
      await injectAuthModal();
      authModal = document.getElementById('authModal');
      
      if (!authModal) {
        console.error('Failed to inject auth modal');
        return;
      }
    }
    
    // Show the modal
    if (typeof authModal.showModal === 'function') {
      authModal.showModal();
    } else {
      // Fallback for browsers that don't support <dialog>
      authModal.style.display = 'block';
      document.body.classList.add('overflow-hidden');
    }
    
    // Add event listeners to the form and close button
    setupModalEventListeners();
    
  } catch (error) {
    console.error('Error opening auth modal:', error);
  }
}

/**
 * Close the auth modal
 */
function closeModal() {
  if (!authModal) return;
  
  try {
    if (typeof authModal.close === 'function') {
      authModal.close();
    } else {
      // Fallback
      authModal.style.display = 'none';
      document.body.classList.remove('overflow-hidden');
    }
  } catch (error) {
    console.error('Error closing auth modal:', error);
  }
}

/**
 * Inject the auth modal into the DOM
 */
async function injectAuthModal() {
  try {
    // Fetch the modal HTML
    const response = await fetch('/components/auth-modal.html');
    if (!response.ok) throw new Error('Failed to fetch auth modal');
    
    const html = await response.text();
    
    // Create a container and insert the HTML
    const container = document.createElement('div');
    container.innerHTML = html;
    
    // Append to body
    document.body.appendChild(container.firstElementChild);
    
  } catch (error) {
    console.error('Error injecting auth modal:', error);
    throw error;
  }
}

/**
 * Set up event listeners for the auth modal
 */
function setupModalEventListeners() {
  // Close button
  const closeBtn = document.getElementById('closeAuthModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Form submission
  const form = document.getElementById('authForm');
  if (form) {
    form.addEventListener('submit', handleAuthFormSubmit);
  }
  
  // Close on Escape key
  authModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  
  // Close when clicking on backdrop (for browsers that support <dialog>)
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
  });
}

/**
 * Handle auth form submission
 * @param {Event} e - Form submit event
 */
async function handleAuthFormSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('authEmail').value.trim();
  const errorEl = document.getElementById('authError');
  const submitBtn = document.getElementById('authSubmit');
  const loadingIcon = document.getElementById('authLoading');
  
  // Reset error
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
  
  // Basic validation
  if (!email || !isValidEmail(email)) {
    errorEl.textContent = 'Please enter a valid email address';
    errorEl.classList.remove('hidden');
    return;
  }
  
  // Show loading state
  submitBtn.disabled = true;
  loadingIcon.classList.remove('hidden');
  
  try {
    // Send magic link
    const { error } = await signInWithMagicLink(email);
    
    if (error) throw error;
    
    // Show success message
    document.getElementById('authForm').classList.add('hidden');
    document.getElementById('authSuccess').classList.remove('hidden');
    document.getElementById('sentEmail').textContent = email;
    
    // Close modal after 5 seconds
    setTimeout(closeModal, 5000);
    
  } catch (error) {
    console.error('Error sending magic link:', error);
    
    // Show error
    errorEl.textContent = error.message || 'An error occurred. Please try again.';
    errorEl.classList.remove('hidden');
    
    // Reset button
    submitBtn.disabled = false;
    loadingIcon.classList.add('hidden');
  }
}

/**
 * Sign in with magic link
 * @param {string} email - User's email address
 * @returns {Promise} - Auth result promise
 */
async function signInWithMagicLink(email) {
  try {
    const redirectTo = new URL('/dashboard', window.location.origin).toString();
    
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    });
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
async function signOut() {
  try {
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated and redirect to login if not
 * @param {string} [redirectPath='/dashboard'] - Path to redirect to after login
 */
export async function requireAuth(redirectPath = null) {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      // User is not authenticated, trigger auth modal
      const currentPath = redirectPath || window.location.pathname;
      
      // Store the current path for redirect after auth
      sessionStorage.setItem('authRedirect', currentPath);
      
      // Open the auth modal
      await openModal();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
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
      const redirectPath = sessionStorage.getItem('authRedirect') || '/dashboard';
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