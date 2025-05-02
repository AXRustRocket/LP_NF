// Headbar.js - Handles header functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('[headbar] Initializing header functionality');
  
  // Mobile menu functionality
  initMobileMenu();
  
  // Wallet connect functionality
  initWalletConnectButtons();
});

// Initialize mobile menu toggle functionality
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenuIcon = document.getElementById('mobileMenuIcon');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileNav = document.getElementById('mobileNav');
  
  if (!mobileMenuToggle || !mobileNav) {
    console.warn('[headbar] Mobile menu elements not found');
    return;
  }
  
  // Function to open mobile menu
  function openMobileMenu() {
    mobileNav.classList.remove('translate-x-full');
    mobileNav.classList.add('translate-x-0');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden');
    
    // Change icon to close
    if (mobileMenuIcon) {
      mobileMenuIcon.classList.remove('icon-menu');
      mobileMenuIcon.classList.add('icon-x');
    }
  }
  
  // Function to close mobile menu
  function closeMobileMenuFn() {
    mobileNav.classList.remove('translate-x-0');
    mobileNav.classList.add('translate-x-full');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');
    
    // Change icon back to menu
    if (mobileMenuIcon) {
      mobileMenuIcon.classList.remove('icon-x');
      mobileMenuIcon.classList.add('icon-menu');
    }
  }
  
  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', function() {
    if (mobileNav.classList.contains('translate-x-full')) {
      openMobileMenu();
    } else {
      closeMobileMenuFn();
    }
  });
  
  // Close button in mobile menu
  if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', closeMobileMenuFn);
  }
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !mobileNav.classList.contains('translate-x-full')) {
      closeMobileMenuFn();
    }
  });
  
  // Close when clicking on links
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenuFn);
  });
}

// Initialize wallet connect button functionality
function initWalletConnectButtons() {
  const walletConnectBtn = document.getElementById('walletConnectBtn');
  const mobileWalletConnectBtn = document.getElementById('mobileWalletConnectBtn');
  
  function handleWalletConnect() {
    // This will be replaced with actual wallet connection logic
    console.log('[headbar] Wallet connect button clicked');
    
    // For now, just show an alert
    alert('Wallet connection functionality will be implemented soon.');
    
    // If you have a wallet modal, you would open it here
    // Example: document.getElementById('walletModal').classList.remove('hidden');
  }
  
  if (walletConnectBtn) {
    walletConnectBtn.addEventListener('click', handleWalletConnect);
  }
  
  if (mobileWalletConnectBtn) {
    mobileWalletConnectBtn.addEventListener('click', handleWalletConnect);
  }
} 