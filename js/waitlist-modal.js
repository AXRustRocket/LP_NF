/**
 * Waitlist Modal Handler for Rust Rocket
 * Handles open/close and submission of waitlist form
 */

// Export the openWaitlistModal function for use by the header connector
export function openWaitlistModal() {
  const modal = document.getElementById('waitlistModalNew');
  if (!modal) return;

  // Reset form and messages
  const form = document.getElementById('waitlistModalForm');
  const successMsg = document.getElementById('modalSuccessMessage');
  const errorMsg = document.getElementById('modalErrorMessage');

  if (form) form.reset();
  if (successMsg) successMsg.classList.add('hidden');
  if (errorMsg) {
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';
  }

  // Capture UTM parameters
  captureUtmParams();

  // Show modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

// Close the modal
function closeWaitlistModal() {
  const modal = document.getElementById('waitlistModalNew');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
}

// Capture UTM parameters from URL
function captureUtmParams() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 
      'utm_term', 'utm_content', 'gclid', 'fbclid'
    ];

    // Set UTM values to hidden fields
    utmParams.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        const field = document.getElementById(param);
        if (field) field.value = value;
      }
    });

    // Handle referral code (might be named 'ref' in URL)
    const refCode = urlParams.get('ref');
    if (refCode) {
      const refField = document.getElementById('referral_code');
      if (refField) refField.value = refCode;
    }
  } catch (error) {
    console.error('Error capturing UTM params:', error);
  }
}

// Form submission handler
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorMsg = document.getElementById('modalErrorMessage');
  
  // Disable button during submission
  if (submitBtn) {
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-spaceBlack inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Submitting...
    `;
  }

  // Collect form data
  const formData = new FormData(form);
  const data = {
    email: formData.get('email'),
    fullName: formData.get('fullName') || '',
    marketingOK: formData.get('marketingOK') === 'on',
    utm_source: formData.get('utm_source'),
    utm_medium: formData.get('utm_medium'),
    utm_campaign: formData.get('utm_campaign'),
    utm_term: formData.get('utm_term'),
    utm_content: formData.get('utm_content'),
    gclid: formData.get('gclid'),
    fbclid: formData.get('fbclid'),
    referral_code: formData.get('referral_code')
  };

  try {
    // Submit to Netlify function
    const response = await fetch('/.netlify/functions/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      // Success - hide form, show success message
      form.classList.add('hidden');
      const successMsg = document.getElementById('modalSuccessMessage');
      if (successMsg) successMsg.classList.remove('hidden');

      // Track conversions if cookie consent is given
      const hasConsent = localStorage.getItem('rr_cookie_consent') === 'accepted';
      
      // GA4 event tracking
      if (hasConsent && typeof gtag === 'function') {
        gtag('event', 'waitlist_submit', {
          'event_category': 'waitlist',
          'event_label': data.email,
          'value': 1
        });
      }
      
      // Meta Pixel tracking
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }

      // Auto-close after 3 seconds
      setTimeout(closeWaitlistModal, 3000);
    } else {
      // Show error message
      if (errorMsg) {
        errorMsg.textContent = result.message || 'An error occurred. Please try again.';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.error('Waitlist submission error:', error);
    if (errorMsg) {
      errorMsg.textContent = 'Network error. Please check your connection and try again.';
      errorMsg.classList.remove('hidden');
    }
  } finally {
    // Re-enable button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Join the Waitlist';
    }
  }
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Form submission
  const form = document.getElementById('waitlistModalForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Close buttons
  const closeBtn = document.getElementById('closeWaitlistModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeWaitlistModal);
  }

  // Success message close button
  const closeSuccessBtn = document.getElementById('closeSuccessModal');
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeWaitlistModal);
  }

  // Close on click outside modal content
  const modal = document.getElementById('waitlistModalNew');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeWaitlistModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeWaitlistModal();
    }
  });
}); 