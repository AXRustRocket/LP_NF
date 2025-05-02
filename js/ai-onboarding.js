/**
 * AI Onboarding Chatbot
 * 
 * This module implements a step-based onboarding flow for new users
 * with local storage encryption and privacy-preserving design.
 */

// Configuration
const ENCRYPTION_KEY = ''; // Generated at runtime, unique per user
const OPENAI_API_KEY = ''; // To be injected at build time from environment variables
const MAX_HISTORY_ITEMS = 10;

// State management
let userSelections = {
  wallet: null,
  budget: null,
  risk: null,
  strategy: null
};

let currentStep = 1;
let totalSteps = 5;

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create encryption key if not exists
  if (!getEncryptionKey()) {
    generateEncryptionKey();
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Check if onboarding is already completed
  const savedData = getOnboardingData();
  if (savedData) {
    userSelections = savedData;
    // We could auto-populate the form or skip directly to the dashboard
    // if onboarding is already complete
  }
});

/**
 * Generate a random encryption key and store it
 */
function generateEncryptionKey() {
  const key = window.crypto.getRandomValues(new Uint8Array(32));
  localStorage.setItem('rr_onboarding_key', Array.from(key).map(b => b.toString(16).padStart(2, '0')).join(''));
}

/**
 * Get the stored encryption key
 */
function getEncryptionKey() {
  return localStorage.getItem('rr_onboarding_key');
}

/**
 * Setup event listeners for the chatbot
 */
function setupEventListeners() {
  // Modal open/close
  const onboardingTrigger = document.getElementById('onboarding-trigger');
  const closeButton = document.getElementById('closeOnboardingBtn');
  const modal = document.getElementById('ai-onboarding-modal');
  
  if (onboardingTrigger && closeButton && modal) {
    onboardingTrigger.addEventListener('click', () => {
      modal.classList.remove('hidden');
      
      // Track event
      if (window.plausible) {
        window.plausible('ai_start');
      }
    });
    
    closeButton.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    });
  }
  
  // Navigation buttons
  const prevButton = document.getElementById('prev-step');
  const nextButton = document.getElementById('next-step');
  
  if (prevButton && nextButton) {
    prevButton.addEventListener('click', goToPreviousStep);
    nextButton.addEventListener('click', goToNextStep);
    
    // Disable prev button on first step
    prevButton.disabled = currentStep === 1;
  }
  
  // Step 1: Risk Consent checkbox
  const riskConsent = document.getElementById('risk-consent');
  if (riskConsent) {
    riskConsent.addEventListener('change', () => {
      nextButton.disabled = !riskConsent.checked;
    });
    
    // Initialize button state
    nextButton.disabled = !riskConsent.checked;
  }
  
  // Step 2: Wallet Selection
  const walletOptions = document.querySelectorAll('.wallet-option');
  walletOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      walletOptions.forEach(opt => opt.classList.remove('border-neonGreen'));
      
      // Add active class to selected option
      option.classList.add('border-neonGreen');
      
      // Update user selections
      userSelections.wallet = option.getAttribute('data-wallet');
    });
  });
  
  // Step 3: Budget & Risk Selection
  const budgetOptions = document.querySelectorAll('.budget-option');
  budgetOptions.forEach(option => {
    option.addEventListener('click', () => {
      budgetOptions.forEach(opt => opt.classList.remove('border-neonGreen'));
      option.classList.add('border-neonGreen');
      userSelections.budget = option.getAttribute('data-budget');
    });
  });
  
  const riskOptions = document.querySelectorAll('.risk-option');
  riskOptions.forEach(option => {
    option.addEventListener('click', () => {
      riskOptions.forEach(opt => opt.classList.remove('border-neonGreen'));
      option.classList.add('border-neonGreen');
      userSelections.risk = option.getAttribute('data-risk');
    });
  });
  
  // Step 4: Strategy Selection
  const strategyOptions = document.querySelectorAll('.strategy-option');
  strategyOptions.forEach(option => {
    option.addEventListener('click', () => {
      strategyOptions.forEach(opt => opt.classList.remove('border-neonGreen'));
      option.classList.add('border-neonGreen');
      userSelections.strategy = option.getAttribute('data-strategy');
    });
  });
}

/**
 * Navigate to the previous step
 */
function goToPreviousStep() {
  if (currentStep > 1) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.add('hidden');
    
    // Decrement current step
    currentStep--;
    
    // Show new current step
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');
    
    // Update progress bar and text
    updateProgress();
    
    // Manage button states
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');
    
    prevButton.disabled = currentStep === 1;
    nextButton.textContent = 'Next';
    nextButton.disabled = false;
    
    // Special case for step 1
    if (currentStep === 1) {
      const riskConsent = document.getElementById('risk-consent');
      nextButton.disabled = !riskConsent.checked;
    }
  }
}

/**
 * Navigate to the next step
 */
function goToNextStep() {
  if (currentStep < totalSteps) {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }
    
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.add('hidden');
    
    // Increment current step
    currentStep++;
    
    // Show new current step
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');
    
    // For the final step (summary), populate the summary fields
    if (currentStep === totalSteps) {
      populateSummary();
    }
    
    // Update progress bar and text
    updateProgress();
    
    // Manage button states
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');
    
    prevButton.disabled = false;
    
    if (currentStep === totalSteps) {
      nextButton.textContent = 'Finish';
    }
  } else {
    // This is the last step, complete the onboarding
    completeOnboarding();
  }
}

/**
 * Validate the current step before proceeding
 */
function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      // Risk consent must be checked
      return document.getElementById('risk-consent').checked;
    case 2:
      // Wallet must be selected
      return userSelections.wallet !== null;
    case 3:
      // Budget and risk profile must be selected
      return userSelections.budget !== null && userSelections.risk !== null;
    case 4:
      // Strategy must be selected
      return userSelections.strategy !== null;
    default:
      return true;
  }
}

/**
 * Update the progress bar and step indicator
 */
function updateProgress() {
  const progressBar = document.getElementById('progress-bar');
  const currentStepEl = document.getElementById('current-step');
  
  if (progressBar && currentStepEl) {
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    currentStepEl.textContent = currentStep;
  }
}

/**
 * Populate the summary step with user selections
 */
function populateSummary() {
  const walletEl = document.getElementById('summary-wallet');
  const budgetEl = document.getElementById('summary-budget');
  const riskEl = document.getElementById('summary-risk');
  const strategyEl = document.getElementById('summary-strategy');
  
  if (walletEl && budgetEl && riskEl && strategyEl) {
    // Map data values to display text
    const walletNames = {
      'phantom': 'Phantom',
      'solflare': 'Solflare',
      'backpack': 'Backpack',
      'other': 'Other Wallet'
    };
    
    const budgetRanges = {
      '100': '$100-$500',
      '1000': '$500-$1000',
      '5000': '$1000+'
    };
    
    const riskProfiles = {
      'conservative': 'Conservative',
      'moderate': 'Moderate',
      'aggressive': 'Aggressive'
    };
    
    const strategyNames = {
      'sniper': 'Launch Sniper',
      'pump': 'Pump Detector',
      'copy': 'Copy Trading',
      'custom': 'Custom Strategy'
    };
    
    walletEl.textContent = walletNames[userSelections.wallet] || 'Not selected';
    budgetEl.textContent = budgetRanges[userSelections.budget] || 'Not selected';
    riskEl.textContent = riskProfiles[userSelections.risk] || 'Not selected';
    strategyEl.textContent = strategyNames[userSelections.strategy] || 'Not selected';
  }
}

/**
 * Complete the onboarding process
 */
function completeOnboarding() {
  // Save the user selections to encrypted local storage
  saveOnboardingData(userSelections);
  
  // Close the modal
  const modal = document.getElementById('ai-onboarding-modal');
  modal.classList.add('hidden');
  
  // Track completion event
  if (window.plausible) {
    window.plausible('ai_complete', { 
      props: { 
        wallet: userSelections.wallet,
        risk_profile: userSelections.risk,
        strategy: userSelections.strategy
      } 
    });
  }
  
  // Redirect to dashboard or show a success message
  // In a real implementation, this could trigger wallet connection
  alert('Onboarding completed! Redirecting to dashboard...');
  
  // For demonstration, reload the page after a short delay
  setTimeout(() => {
    window.location.href = '/dashboard.html';
  }, 1500);
}

/**
 * Save onboarding data to local storage with encryption
 */
function saveOnboardingData(data) {
  try {
    const encryptedData = encryptData(JSON.stringify(data));
    localStorage.setItem('rr_onboarding_data', encryptedData);
    return true;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return false;
  }
}

/**
 * Get onboarding data from local storage
 */
function getOnboardingData() {
  try {
    const encryptedData = localStorage.getItem('rr_onboarding_data');
    if (!encryptedData) return null;
    
    const decryptedData = decryptData(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error retrieving onboarding data:', error);
    return null;
  }
}

/**
 * Encrypt data using AES-GCM
 * In a real implementation, this would use the Web Crypto API
 */
function encryptData(data) {
  // This is a placeholder implementation for demonstration
  // In production, use proper AES-GCM encryption with Web Crypto API
  return btoa(data);
}

/**
 * Decrypt data using AES-GCM
 * In a real implementation, this would use the Web Crypto API
 */
function decryptData(encryptedData) {
  // This is a placeholder implementation for demonstration
  // In production, use proper AES-GCM decryption with Web Crypto API
  return atob(encryptedData);
}

/**
 * Simulate connecting to OpenAI GPT-4 for personalized feedback
 * In a real implementation, this would call the OpenAI API
 */
async function getAIFeedback(prompt) {
  // This is a placeholder for demonstration
  console.log('AI feedback requested with prompt:', prompt);
  
  // In production, this would call the OpenAI API
  // with proper prompt engineering for compliance
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return simulated response
  return "Based on your trading profile, I recommend starting with a conservative allocation to meme coins (no more than 5% of your total portfolio). The Launch Sniper strategy works well with your risk profile, but remember to set strict stop-losses. This is not financial advice - always do your own research.";
}

// Export functions for external use
export {
  getAIFeedback,
  getOnboardingData
}; 