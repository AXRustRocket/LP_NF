/**
 * Waitlist Modal v2 - Handles the animated waitlist popup with focus trapping
 * and progressive enhancement for the dialog element
 */

const LS_KEY = 'rr_waitlist_done';
let modal = null;
let previouslyFocusedElement = null;
let focusableElements = [];

/**
 * Initialize the waitlist modal with a delay
 * @param {number} delay - Milliseconds to wait before showing the modal
 */
export function initWaitlistModal(delay = 3000) {
  // Don't show if user already signed up
  if (localStorage.getItem(LS_KEY)) return;
  
  modal = document.getElementById('waitlistModal');
  if (!modal) return;
  
  // Add keyboard event listener for Escape key
  modal.addEventListener('keydown', handleEscapeKey);
  
  // Add backdrop click listener for native dialog
  modal.addEventListener('click', handleBackdropClick);
  
  // Show modal after delay
  setTimeout(() => openModal(), delay);
}

/**
 * Open the modal with animation
 */
function openModal() {
  if (!modal) return;
  
  // Store the currently focused element to restore it later
  previouslyFocusedElement = document.activeElement;
  
  // Use native dialog if supported, fallback otherwise
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    // Fallback for browsers without dialog support
    document.body.classList.add('overflow-hidden');
    modal.setAttribute('open', '');
    modal.style.display = 'block';
    
    // Create backdrop if it doesn't exist
    if (!document.getElementById('modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.id = 'modal-backdrop';
      backdrop.className = 'fixed inset-0 bg-black/50 z-40';
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', () => closeModal());
    }
  }
  
  // Animate in after a tiny delay for the browser to process
  setTimeout(() => {
    modal.classList.remove('translate-y-full', 'opacity-0');
  }, 10);
  
  // Set up focus trap
  setupFocusTrap();
}

/**
 * Close the modal with animation
 */
function closeModal() {
  if (!modal) return;
  
  // Animate out
  modal.classList.add('translate-y-full', 'opacity-0');
  
  // Close after animation completes
  setTimeout(() => {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      // Fallback for browsers without dialog support
      modal.removeAttribute('open');
      modal.style.display = 'none';
      document.body.classList.remove('overflow-hidden');
      
      // Remove backdrop
      const backdrop = document.getElementById('modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
    
    // Restore focus to previously focused element
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }, 300);
}

/**
 * Handle Escape key press to close the modal
 */
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

/**
 * Handle clicks on the dialog backdrop (for native dialog implementation)
 */
function handleBackdropClick(event) {
  if (event.target === modal) {
    closeModal();
  }
}

/**
 * Set up a focus trap to keep keyboard focus within the modal
 */
function setupFocusTrap() {
  // Find all focusable elements
  focusableElements = [...modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )];
  
  if (focusableElements.length) {
    // Focus the first element
    focusableElements[0].focus();
    
    // Add event listener for Tab key
    modal.addEventListener('keydown', trapTabKey);
  }
}

/**
 * Trap the Tab key within the modal
 */
function trapTabKey(event) {
  // If not Tab key, return
  if (event.key !== 'Tab') return;
  
  // If no focusable elements, return
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Shift+Tab on first element should go to last element
  if (event.shiftKey && document.activeElement === firstElement) {
    lastElement.focus();
    event.preventDefault();
  }
  // Tab on last element should go to first element
  else if (!event.shiftKey && document.activeElement === lastElement) {
    firstElement.focus();
    event.preventDefault();
  }
}

/**
 * Set up event listeners for the modal
 */
document.addEventListener('DOMContentLoaded', () => {
  // Handle close button clicks
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) {
      closeModal();
    }
  });
  
  // Handle form submissions
  document.addEventListener('submit', async (event) => {
    if (!event.target.matches('[data-waitlist-form]')) return;
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('input[name="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!emailInput || !emailInput.value.trim()) return;
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="flex items-center"><svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-spaceBlack" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';
    
    try {
      // Submit to API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value.trim() }),
      });
      
      if (response.ok) {
        // Show success step
        showSuccessStep();
        
        // Store completion in localStorage
        localStorage.setItem(LS_KEY, '1');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // For demo, show success anyway (fallback)
      showSuccessStep();
      localStorage.setItem(LS_KEY, '1');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});

/**
 * Show the success step after form submission
 */
function showSuccessStep() {
  if (!modal) return;
  
  const step1 = modal.querySelector('[data-step="1"]');
  const step2 = modal.querySelector('[data-step="2"]');
  
  if (step1 && step2) {
    // Fade out step 1
    step1.style.opacity = '0';
    
    setTimeout(() => {
      // Hide step 1
      step1.classList.add('hidden');
      
      // Show step 2
      step2.classList.remove('hidden');
      
      // Wait a frame then fade in
      requestAnimationFrame(() => {
        // Force reflow
        step2.offsetHeight;
        
        // Fade in
        step2.style.opacity = '1';
        
        // Update focus trap
        setupFocusTrap();
      });
    }, 300);
  }
} 