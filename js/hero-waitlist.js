/**
 * Hero Waitlist Form Handler
 * Manages the inline waitlist form in the hero section
 */

import { joinWaitlist } from './waitlist-modal.js';

// Create a toast notification
function toast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 z-50 py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-0 ${
    type === 'success' ? 'bg-neonGreen text-spaceBlack' : 'bg-red-500 text-white'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);
  
  // Animate out and remove after delay
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('heroWaitlist');
  if (!form) return;
  
  // Handle form submission
  form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const email = form.email.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorMsg = form.querySelector('.hero-form-error');
    
    // Reset any previous error state
    form.email.classList.remove('border-red-500');
    if (errorMsg) errorMsg.textContent = '';
    
    // Validate email format client-side
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.email.classList.add('border-red-500');
      if (errorMsg) errorMsg.textContent = 'Enter valid email';
      return;
    }
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    
    try {
      // Submit to waitlist API
      await joinWaitlist(email);
      
      // Show success UI
      submitBtn.innerHTML = 'Thanks!';
      form.email.disabled = true;
      
      // Show toast message
      toast('Check your inbox for the magic link 🚀');
      
      // Add to localStorage to prevent popup modal
      localStorage.setItem('rr_wait_home_v3', '1');
      
    } catch (err) {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      
      // Show error message
      if (errorMsg) errorMsg.textContent = err.message || 'Something went wrong, try again';
      form.email.classList.add('border-red-500');
      
      // Show toast message
      toast('Something went wrong, try again', 'error');
    }
  });
}); 