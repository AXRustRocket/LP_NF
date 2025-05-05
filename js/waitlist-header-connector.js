/**
 * Waitlist Header Connector - Connects the waitlist buttons in the header
 * to the waitlist-modal.js functionality
 */

// Import the openWaitlistModal function from waitlist-modal.js
import { openWaitlistModal } from './waitlist-modal.js';

// When the DOM is fully loaded, add event listeners to header waitlist buttons
document.addEventListener('DOMContentLoaded', () => {
  ['joinWaitlistBtn', 'joinWaitlistBtnDrawer'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openWaitlistModal();
        console.log(`[waitlist-header] Button ${id} clicked, opening modal`);
      });
      console.log(`[waitlist-header] Connected ${id} button`);
    } else {
      console.warn(`[waitlist-header] Could not find ${id} button`);
    }
  });
}); 