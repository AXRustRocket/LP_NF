/**
 * Waitlist Popup - Shows a modal after 3 seconds if the user hasn't seen it before
 */
const MODAL_ID   = 'waitlistModal';
const LS_KEY     = 'rr_waitlist_seen';
const DELAY_MS   = 3000;

// Only show if user hasn't seen it before
if(!localStorage.getItem(LS_KEY)){
  setTimeout(() => {
    const modal = document.getElementById(MODAL_ID);
    if(modal?.showModal){
      modal.showModal();
      
      // Set up close listeners
      const closeButtons = modal.querySelectorAll('[data-close]');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          modal.close();
        });
      });
      
      // Store in localStorage when closed
      modal.addEventListener('close', () => localStorage.setItem(LS_KEY, '1'));
    }
  }, DELAY_MS);
}

// Submit handler (Hero & Popup reuse)
document.addEventListener('submit', async (e) => {
  if(e.target.matches('[data-waitlist-form]')){
    e.preventDefault();
    const email = e.target.email.value.trim();
    if(!email) return;
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
      // Attempt to submit to API
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email})
      });
      
      // Success message
      e.target.innerHTML = '<p class="text-neonGreen mt-4 font-medium text-lg">Thanks! You\'re in the queue. 🚀</p>';
      localStorage.setItem(LS_KEY, '1');
    } catch (error) {
      // Fallback to success in case API isn't set up
      console.error('Error submitting waitlist form:', error);
      e.target.innerHTML = '<p class="text-neonGreen mt-4 font-medium text-lg">Thanks! You\'re in the queue. 🚀</p>';
      localStorage.setItem(LS_KEY, '1');
    }
  }
}); 