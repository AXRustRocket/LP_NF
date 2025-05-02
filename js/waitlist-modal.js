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
  // Only show on homepage
  if(!location.pathname.endsWith('index.html') && location.pathname !== '/' && location.pathname !== '') return;
  
  // Don't show if user already signed up
  if (localStorage.getItem(LS_KEY)) return;
  
  modal = document.getElementById('waitlistModal');
  if (!modal) return;
  
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
}

/**
 * Opens the modal with animation
 */
function openModal() {
  if (!modal) return;
  
  // Store the previously focused element to restore it later
  previouslyFocusedElement = document.activeElement;
  
  // Use native showModal if available, otherwise fallback
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.style.display = 'block';
    modal.setAttribute('open', '');
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
}

/**
 * Closes the modal with animation and sets localStorage flag
 */
function closeModal() {
  if (!modal) return;
  
  // Set localStorage flag to prevent showing again
  localStorage.setItem(LS_KEY, '1');
  
  // Animate out
  modal.classList.add('translate-y-full', 'opacity-0');
  
  // Close dialog after animation completes
  setTimeout(() => {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.style.display = 'none';
      modal.removeAttribute('open');
    }
    
    // Restore focus to the element that was focused before the modal opened
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }, 300);
}

/**
 * Handle Escape key to close modal
 */
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeModal();
    event.preventDefault();
  }
}

/**
 * Handle clicks on close buttons
 */
function handleCloseButtonClick(event) {
  if (event.target.closest('[data-close]')) {
    closeModal();
    event.preventDefault();
  }
}

/**
 * Handle clicks on the backdrop for native dialogs
 */
function handleBackdropClick(event) {
  // Only close if clicking directly on the backdrop, not on dialog content
  if (event.target === modal) {
    closeModal();
  }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
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
  } catch (error) {
    console.error('Error submitting to waitlist:', error);
  }
}

/**
 * Show the success step
 */
function showSuccessStep() {
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
}

/**
 * Set up focus trap inside modal
 */
function setupFocusTrap() {
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
}

/**
 * Trap tab key within modal
 */
function trapTabKey(event) {
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
} 