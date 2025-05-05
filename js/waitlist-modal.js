/**
 * Waitlist Modal - Handles the "Join Waitlist" modal functionality
 */

// Track if modal is initialized to avoid duplicating event listeners
let initialized = false;
let modal = null;
let form = null;
let spinner = null;
let successMessage = null;
let errorMessage = null;

// Initialize modal when the DOM is ready
document.addEventListener('DOMContentLoaded', initModal);

/**
 * Initialize the modal and add event listeners
 */
function initModal() {
  if (initialized) return;
  
  modal = document.getElementById('waitlistModal');
  if (!modal) {
    console.error('Waitlist modal element not found');
    return;
  }
  
  // Get form elements
  form = document.getElementById('waitlistForm');
  spinner = document.getElementById('waitlist_spinner');
  successMessage = document.getElementById('waitlist_success');
  errorMessage = document.getElementById('waitlist_error');
  
  // Add form submit listener
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  // Add close button listeners
  const closeButtons = modal.querySelectorAll('[data-close]');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Close on escape key and backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.open) closeModal();
  });
  
  initialized = true;
}

/**
 * Open the waitlist modal
 * This function is exported for use by the header button
 */
export function openWaitlistModal() {
  if (!initialized) initModal();
  if (!modal) return;
  
  // Reset form if it exists
  if (form) {
    form.reset();
    form.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
  }
  
  // Capture UTM parameters from URL
  captureUtmParams();
  
  // Open modal using native dialog method if available, with fallback
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
    document.body.classList.add('modal-open');
  }
}

/**
 * Close the waitlist modal
 */
function closeModal() {
  if (!modal) return;
  
  // Use native close if available, otherwise fallback
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
    document.body.classList.remove('modal-open');
  }
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
  e.preventDefault();
  
  // Show spinner
  spinner.classList.remove('hidden');
  
  // Get form data
  const formData = new FormData(form);
  const data = {
    email: formData.get('email'),
    fullName: formData.get('fullName'),
    marketingOK: formData.get('marketingOK') === 'on',
    
    // UTM parameters
    utm_source: formData.get('utm_source'),
    utm_medium: formData.get('utm_medium'),
    utm_campaign: formData.get('utm_campaign'),
    utm_term: formData.get('utm_term'),
    utm_content: formData.get('utm_content'),
    
    // Click IDs
    gclid: formData.get('gclid'),
    fbclid: formData.get('fbclid'),
    referral_code: formData.get('referral_code')
  };
  
  try {
    const response = await fetch('/.netlify/functions/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // Handle different response status codes
    if (response.status === 200) {
      // Success - show success message and track event
      handleSuccess();
    } else if (response.status === 409) {
      // Duplicate email - show friendly message
      showError('This email is already on our waitlist.');
    } else {
      // Other errors
      const text = await response.text();
      showError('Error: ' + (text || 'Something went wrong. Please try again.'));
    }
  } catch (error) {
    console.error('Waitlist submission error:', error);
    showError('Network error. Please check your connection and try again.');
  } finally {
    // Hide spinner regardless of outcome
    spinner.classList.add('hidden');
  }
}

/**
 * Handle successful submission
 */
function handleSuccess() {
  // Hide form, show success message
  form.style.display = 'none';
  successMessage.style.display = 'block';
  
  // Track event in analytics if consent given
  const consent = localStorage.getItem('rr_cookie_consent') === 'accepted';
  if (consent && typeof gtag === 'function') {
    gtag('event', 'waitlist_submit', { method: 'modal' });
  }
  
  // Meta Pixel tracking for leads
  if (typeof fbq === 'function') {
    fbq('track', 'Lead');
  }
  
  // Auto-close after 3 seconds
  setTimeout(closeModal, 3000);
}

/**
 * Show error message
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

/**
 * Capture UTM and click ID parameters from URL
 */
function captureUtmParams() {
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    // UTM parameters
    setParamValueIfExists(params, 'utm_source', 'waitlist_utm_source');
    setParamValueIfExists(params, 'utm_medium', 'waitlist_utm_medium');
    setParamValueIfExists(params, 'utm_campaign', 'waitlist_utm_campaign');
    setParamValueIfExists(params, 'utm_term', 'waitlist_utm_term');
    setParamValueIfExists(params, 'utm_content', 'waitlist_utm_content');
    
    // Click IDs
    setParamValueIfExists(params, 'gclid', 'waitlist_gclid');
    setParamValueIfExists(params, 'fbclid', 'waitlist_fbclid');
    setParamValueIfExists(params, 'ref', 'waitlist_referral_code');
  } catch (error) {
    console.error('Error capturing UTM params:', error);
  }
}

/**
 * Helper to set form field value from URL parameter
 */
function setParamValueIfExists(params, paramName, elementId) {
  const value = params.get(paramName);
  if (value) {
    const element = document.getElementById(elementId);
    if (element) element.value = value;
  }
} 