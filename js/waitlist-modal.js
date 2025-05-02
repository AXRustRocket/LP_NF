/**
 * Waitlist Modal v3 - Handles the animated waitlist popup with focus trapping
 * and progressive enhancement for the dialog element
 */

const LS_KEY = 'rr_wait_home_v3';
let modal = null;
let previouslyFocusedElement = null;
let focusableElements = [];

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
    
    modal = document.getElementById('waitlistModal');
    if (!modal) {
      console.warn('Waitlist modal element not found');
      return;
    }
    
    // Add keyboard event listener for Escape key
    modal.addEventListener('keydown', handleEscapeKey);
    
    // Add backdrop click listener for native dialog
    modal.addEventListener('click', handleBackdropClick);

    // Add click listeners for close buttons
    document.addEventListener('click', handleCloseButtonClick);

    // Add submit listener for the form
    document.addEventListener('submit', handleFormSubmit);
    
    // Show modal after delay
    setTimeout(() => openModal(), delay);
  } catch (error) {
    console.error('Error initializing waitlist modal:', error);
  }
}

/**
 * Opens the modal with animation
 */
function openModal() {
  try {
    if (!modal) return;
    
    // Store the previously focused element to restore it later
    previouslyFocusedElement = document.activeElement;
    
    // Use native showModal if available, otherwise fallback
    try {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
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
    });

    // Set up focus trap
    setupFocusTrap();
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Skip animations for users who prefer reduced motion
      modal.style.transition = 'none';
      modal.classList.remove('translate-y-full', 'opacity-0');
    }
  } catch (error) {
    console.error('Error opening modal:', error);
    // Ensure the page remains usable if modal fails
    document.body.style.overflow = 'auto';
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
    
    // Close dialog after animation completes
    setTimeout(() => {
      try {
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
    }, 300);
  } catch (error) {
    console.error('Error closing modal:', error);
    // Emergency fallback to ensure modal doesn't block the page
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
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
    
    if (!email) return;
    
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
        // Handle error
        console.error('Waitlist submission failed');
      }
    } catch (fetchError) {
      console.error('Error submitting to waitlist:', fetchError);
      // Show a fallback success message to prevent blocking the user
      showSuccessStep();
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