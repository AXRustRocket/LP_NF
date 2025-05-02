/**
 * Waitlist Modal v3 - Handles the animated waitlist popup with focus trapping
 * and progressive enhancement for the dialog element
 */

const LS_KEY = 'rr_wait_home_v3';
let modal = null;
let previouslyFocusedElement = null;
let focusableElements = [];
let autoCloseTimer = null; // Safety timer to ensure modal doesn't permanently block page
let eventListenersRegistered = false;

// When the DOM is fully loaded, add click event listener for waitlist buttons
document.addEventListener('DOMContentLoaded', () => {
  // Global event delegation for all waitlist buttons
  document.addEventListener('click', (event) => {
    const waitlistButton = event.target.closest('[data-waitlist]');
    if (waitlistButton) {
      event.preventDefault();
      openWaitlistModal();
    }
  });
});

/**
 * Join waitlist API function
 * @param {string} email - Email to add to waitlist
 * @param {string} source - Source of signup (default: 'hero-form')
 * @returns {Promise} - Resolution or rejection
 */
export async function joinWaitlist(email, source = 'hero-form') {
  if (!email || !validateEmail(email)) {
    throw new Error('Please enter a valid email address');
  }
  
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        source
      }),
    });
    
    if (!response.ok) {
      const responseData = await response.json().catch(() => ({ message: 'Something went wrong. Please try again later.' }));
      throw new Error(responseData.message || 'Something went wrong. Please try again later.');
    }
    
    // Set localStorage flag to prevent showing modal again
    localStorage.setItem(LS_KEY, '1');
    
    return { success: true };
  } catch (error) {
    console.error('Error joining waitlist:', error);
    throw error;
  }
}

/**
 * Manually open the waitlist modal when a button is clicked
 * This can be called from anywhere in the app
 */
export function openWaitlistModal() {
  try {
    // Don't show if user already signed up (check localStorage)
    if (localStorage.getItem(LS_KEY)) {
      console.log('User already on waitlist, not showing modal again');
      return;
    }
    
    // Initialize the modal if not already done
    initModal();
    
    // Open the modal without delay
    if (modal) {
      openModal();
    }
  } catch (error) {
    console.error('Error opening waitlist modal:', error);
  }
}

/**
 * Initialize the modal element and event listeners
 */
function initModal() {
  if (modal !== null) return; // Already initialized
  
  try {
    // Ensure body scrolling is always enabled by default
    document.body.style.overflow = 'auto';
    
    // Safety timeout - if modal implementation gets stuck, force reset the page state
    // This prevents permanent black screens if modal code fails
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => {
      console.warn('Waitlist modal safety timeout triggered - resetting page state');
      forceCleanupPageState();
    }, 10000); // 10 seconds max before forcing reset
    
    modal = document.getElementById('waitlistModal');
    if (!modal) {
      console.warn('Waitlist modal element not found, attempting to inject it');
      injectModal();
      return;
    }
    
    if (!eventListenersRegistered) {
      // Add keyboard event listener for Escape key
      modal.addEventListener('keydown', handleEscapeKey);
      
      // Add backdrop click listener for native dialog
      modal.addEventListener('click', handleBackdropClick);

      // Add click listeners for close buttons
      document.addEventListener('click', handleCloseButtonClick);

      // Add submit listener for the form
      document.addEventListener('submit', handleFormSubmit);
      
      eventListenersRegistered = true;
    }
  } catch (error) {
    console.error('Error initializing modal:', error);
    forceCleanupPageState();
  }
}

/**
 * Try to inject the modal if it doesn't exist
 */
async function injectModal() {
  try {
    // Dynamic import of include.js
    const { inject } = await import('/js/include.js');
    await inject('body', '/components/waitlist-modal-v3');
    
    // Try to get the modal again after injecting
    modal = document.getElementById('waitlistModal');
    if (!modal) {
      console.error('Failed to inject waitlist modal');
      return;
    }
    
    // Register event listeners for the newly injected modal
    if (!eventListenersRegistered) {
      modal.addEventListener('keydown', handleEscapeKey);
      modal.addEventListener('click', handleBackdropClick);
      document.addEventListener('click', handleCloseButtonClick);
      document.addEventListener('submit', handleFormSubmit);
      eventListenersRegistered = true;
    }
  } catch (error) {
    console.error('Error injecting modal:', error);
  }
}

/**
 * Initialize the homepage-only waitlist modal with a delay
 * @param {number} delay - Milliseconds to wait before showing the modal
 */
export function initHomepagePopup(delay = 3000) {
  try {
    // Only show on homepage
    if(!location.pathname.endsWith('index.html') && location.pathname !== '/' && location.pathname !== '') return;
    
    // Don't show if user already signed up
    if (localStorage.getItem(LS_KEY)) return;
    
    // Don't show if user already submitted through hero form
    if (localStorage.getItem('rr_wait_home_v3')) return;
    
    // Initialize the modal
    initModal();
    
    // Show modal after delay
    if (modal) {
      setTimeout(() => openModal(), delay);
    }
  } catch (error) {
    console.error('Error initializing waitlist modal:', error);
    forceCleanupPageState();
  }
}

/**
 * Opens the modal with animation
 */
function openModal() {
  try {
    if (!modal) {
      clearTimeout(autoCloseTimer);
      return;
    }
    
    // Store the previously focused element to restore it later
    previouslyFocusedElement = document.activeElement;
    
    // Use native showModal if available, otherwise fallback
    try {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
        
        // Fix for backdrop issues - ensure it doesn't block the page
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-backdrop-fix';
        styleSheet.textContent = `
          dialog::backdrop {
            background-color: rgba(0, 0, 0, 0.5);
            pointer-events: none;
          }
        `;
        document.head.appendChild(styleSheet);
      } else {
        modal.style.display = 'block';
        modal.setAttribute('open', '');
      }
    } catch (dialogError) {
      // Fallback if dialog API fails
      console.warn('Dialog API failed, using fallback:', dialogError);
      modal.style.display = 'block';
      modal.setAttribute('open', '');
      // Ensure we don't have an overlay issue
      document.body.style.overflow = 'auto';
    }
    
    // Start animation after a small delay to ensure the dialog is in the DOM
    requestAnimationFrame(() => {
      modal.classList.remove('translate-y-full', 'opacity-0');
      modal.classList.remove('pointer-events-none');
      modal.classList.add('pointer-events-auto');
    });

    // Set up focus trap
    setupFocusTrap();
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Skip animations for users who prefer reduced motion
      modal.style.transition = 'none';
      modal.classList.remove('translate-y-full', 'opacity-0');
      modal.classList.remove('pointer-events-none');
      modal.classList.add('pointer-events-auto');
    }
    
    // Clear the safety timeout since the modal opened successfully
    clearTimeout(autoCloseTimer);
  } catch (error) {
    console.error('Error opening modal:', error);
    // Ensure the page remains usable if modal fails
    forceCleanupPageState();
  }
}

/**
 * Closes the modal with animation and sets localStorage flag
 */
function closeModal() {
  try {
    if (!modal) return;
    
    // Set localStorage flag to prevent showing again
    localStorage.setItem(LS_KEY, '1');
    
    // Animate out
    modal.classList.add('translate-y-full', 'opacity-0');
    modal.classList.remove('pointer-events-auto');
    modal.classList.add('pointer-events-none');
    
    // Clear the safety timeout since we're explicitly closing
    clearTimeout(autoCloseTimer);
    
    // Close dialog after animation completes
    setTimeout(() => {
      try {
        // Remove the backdrop fix style if it exists
        const backdropFixStyle = document.getElementById('modal-backdrop-fix');
        if (backdropFixStyle) {
          backdropFixStyle.remove();
        }
        
        if (typeof modal.close === 'function') {
          modal.close();
        } else {
          modal.style.display = 'none';
          modal.removeAttribute('open');
        }
      } catch (dialogError) {
        // Fallback if dialog API fails
        console.warn('Dialog API failed during close, using fallback:', dialogError);
        modal.style.display = 'none';
        modal.removeAttribute('open');
      }
      
      // Ensure body scrolling is restored
      document.body.style.overflow = 'auto';
      
      // Restore focus to the element that was focused before the modal opened
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
      
      // Remove event listeners to prevent memory leaks
      cleanupEventListeners();
    }, 300);
  } catch (error) {
    console.error('Error closing modal:', error);
    // Emergency fallback to ensure modal doesn't block the page
    forceCleanupPageState();
  }
}

/**
 * Emergency function to reset page state if modal implementation fails
 * This ensures users won't be stuck with a black screen
 */
function forceCleanupPageState() {
  clearTimeout(autoCloseTimer);
  
  // Reset body styles
  document.body.style.overflow = 'auto';
  
  // Remove backdrop fix style if it exists
  const backdropFixStyle = document.getElementById('modal-backdrop-fix');
  if (backdropFixStyle) {
    backdropFixStyle.remove();
  }
  
  // Force clean modal if it exists
  if (modal) {
    // Hide modal with force
    modal.style.display = 'none';
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('pointer-events-auto');
    
    // Close dialog if it's open
    if (modal.hasAttribute('open')) {
      try {
        if (typeof modal.close === 'function') {
          modal.close();
        }
        modal.removeAttribute('open');
      } catch (e) {
        console.error('Error force closing modal:', e);
      }
    }
  }
  
  // Clean up event listeners
  cleanupEventListeners();
  
  // Set localStorage to prevent showing again on this visit
  localStorage.setItem(LS_KEY, '1');
}

/**
 * Clean up event listeners to prevent memory leaks
 */
function cleanupEventListeners() {
  if (!eventListenersRegistered) return;
  
  if (modal) {
    modal.removeEventListener('keydown', handleEscapeKey);
    modal.removeEventListener('click', handleBackdropClick);
    modal.removeEventListener('keydown', trapTabKey);
  }
  
  document.removeEventListener('click', handleCloseButtonClick);
  document.removeEventListener('submit', handleFormSubmit);
  
  eventListenersRegistered = false;
}

/**
 * Handle Escape key to close modal
 */
function handleEscapeKey(event) {
  try {
    if (event.key === 'Escape') {
      closeModal();
      event.preventDefault();
    }
  } catch (error) {
    console.error('Error handling escape key:', error);
    forceCleanupPageState();
  }
}

/**
 * Handle clicks on close buttons
 */
function handleCloseButtonClick(event) {
  try {
    if (event.target.closest('[data-close]')) {
      closeModal();
      event.preventDefault();
    }
  } catch (error) {
    console.error('Error handling close button click:', error);
    forceCleanupPageState();
  }
}

/**
 * Handle clicks on the backdrop for native dialogs
 */
function handleBackdropClick(event) {
  try {
    // Only close if clicking directly on the backdrop, not on dialog content
    if (event.target === modal) {
      closeModal();
    }
  } catch (error) {
    console.error('Error handling backdrop click:', error);
    forceCleanupPageState();
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Show error message on form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - Error message to display
 */
function showFormError(form, message) {
  // Check if error element already exists
  let errorElement = form.querySelector('.form-error-message');
  
  // Create error element if it doesn't exist
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'form-error-message text-red-500 text-sm mt-2';
    form.appendChild(errorElement);
  }
  
  // Set error message
  errorElement.textContent = message;
  
  // Highlight input field
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.classList.add('border-red-500');
    emailInput.focus();
  }
}

/**
 * Clear error messages from form
 * @param {HTMLFormElement} form - The form element
 */
function clearFormErrors(form) {
  // Remove error message
  const errorElement = form.querySelector('.form-error-message');
  if (errorElement) {
    errorElement.remove();
  }
  
  // Remove input highlighting
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.classList.remove('border-red-500');
  }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
  try {
    if (!event.target.matches('[data-waitlist-form]')) return;
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value.trim();
    
    // Clear any previous errors
    clearFormErrors(form);
    
    // Validate email
    if (!email) {
      showFormError(form, 'Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      showFormError(form, 'Please enter a valid email address');
      return;
    }
    
    // Disable form while submitting
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Submitting...';
    }
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'homepage-modal-v3'
        }),
      });
      
      if (response.ok) {
        // Set localStorage flag to prevent showing again
        localStorage.setItem(LS_KEY, '1');
        
        // Show success message
        showSuccessStep();
      } else {
        // Handle error response
        const responseData = await response.json().catch(() => ({ message: 'Something went wrong. Please try again later.' }));
        showFormError(form, responseData.message || 'Something went wrong. Please try again later.');
        
        // Re-enable form
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Join Waitlist';
        }
      }
    } catch (fetchError) {
      console.error('Error submitting to waitlist:', fetchError);
      showFormError(form, 'Network error. Please try again later.');
      
      // Re-enable form
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Join Waitlist';
      }
    }
  } catch (error) {
    console.error('Error handling form submission:', error);
    // Make sure the modal can be closed even if submission fails
    closeModal();
  }
}

/**
 * Show the success step
 */
function showSuccessStep() {
  try {
    const step1 = modal.querySelector('[data-step="1"]');
    const step2 = modal.querySelector('[data-step="2"]');
    
    if (!step1 || !step2) return;
    
    // Fade out step 1
    step1.style.opacity = '0';
    
    // After fade out, switch steps
    setTimeout(() => {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      
      // Trigger reflow to enable animation
      step2.offsetHeight;
      
      // Fade in step 2
      step2.style.opacity = '1';
    }, 300);
  } catch (error) {
    console.error('Error showing success step:', error);
    closeModal();
  }
}

/**
 * Set up focus trap inside modal
 */
function setupFocusTrap() {
  try {
    // Get all focusable elements
    focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      // Focus the first element
      focusableElements[0].focus();
      
      // Add event listener for tab key
      modal.addEventListener('keydown', trapTabKey);
    }
  } catch (error) {
    console.error('Error setting up focus trap:', error);
  }
}

/**
 * Trap tab key within modal
 */
function trapTabKey(event) {
  try {
    if (event.key !== 'Tab') return;
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // If shift + tab and on first element, move to last element
    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } 
    // If tab and on last element, move to first element
    else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  } catch (error) {
    console.error('Error trapping tab key:', error);
  }
} 