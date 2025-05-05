import { openWaitlistModal } from './waitlist-modal.js';
['joinWaitlistBtn', 'joinWaitlistBtnDrawer'].forEach(id => {
  const b = document.getElementById(id);
  b && b.addEventListener('click', openWaitlistModal);
});
