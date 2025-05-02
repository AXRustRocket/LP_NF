/**
 * Pricing Toggle - Switches between monthly and yearly pricing
 */
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('billing-toggle');
  const priceElements = document.querySelectorAll('.price');
  const priceBadges = document.querySelectorAll('.price-badge');
  const annualLabels = document.querySelectorAll('.annual-label');
  
  if (!toggle) return;
  
  // Initialize to monthly pricing by default
  let isAnnual = false;
  
  toggle.addEventListener('click', function() {
    // Toggle the switch state
    isAnnual = !isAnnual;
    toggle.setAttribute('aria-checked', isAnnual);
    
    // Animate the toggle switch
    const toggleButton = toggle.querySelector('.toggle-button');
    if (isAnnual) {
      toggleButton.style.transform = 'translateX(100%)';
      toggleButton.style.backgroundColor = '#2AFF62';
    } else {
      toggleButton.style.transform = 'translateX(0)';
      toggleButton.style.backgroundColor = '#FFD600';
    }
    
    // Update prices
    priceElements.forEach(el => {
      const monthlyPrice = el.getAttribute('data-monthly');
      const yearlyPrice = el.getAttribute('data-yearly');
      
      if (monthlyPrice && yearlyPrice) {
        el.textContent = isAnnual ? yearlyPrice : monthlyPrice;
      }
    });
    
    // Show/hide annual discount badges
    priceBadges.forEach(badge => {
      badge.style.display = isAnnual ? 'flex' : 'none';
    });
    
    // Update annual labels
    annualLabels.forEach(label => {
      if (isAnnual) {
        label.classList.add('text-neonGreen');
        label.classList.remove('text-white/60');
      } else {
        label.classList.remove('text-neonGreen');
        label.classList.add('text-white/60');
      }
    });
  });
}); 