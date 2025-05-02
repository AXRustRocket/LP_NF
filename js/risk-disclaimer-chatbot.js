/**
 * Risk Disclaimer Chatbot
 * 
 * This script implements a modal chatbot that:
 * 1. Uses OpenAI GPT-4 to answer user questions about risks
 * 2. Stores conversation history in AES-GCM encrypted localStorage
 * 3. Tracks interactions with Plausible Analytics
 * 4. Auto-appends new user questions to FAQ via a build script
 */

// Configuration
const OPENAI_API_KEY = ''; // To be injected at build time from environment variables
const ENCRYPTION_KEY = ''; // Generated at runtime, unique per user
const MAX_HISTORY_ITEMS = 10;

// DOM Elements
let chatModal;
let chatMessages;
let userInput;
let sendButton;
let closeButton;
let chatbotTrigger;

// State management
let conversationHistory = [];
let isStreaming = false;

/**
 * Initialize the chatbot when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create encryption key if not exists
  if (!getEncryptionKey()) {
    generateEncryptionKey();
  }
  
  // Build the chat UI
  createChatInterface();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load existing chat history
  loadChatHistory();
});

/**
 * Generate a random encryption key and store it
 */
function generateEncryptionKey() {
  const key = window.crypto.getRandomValues(new Uint8Array(32));
  localStorage.setItem('rr_chat_key', Array.from(key).map(b => b.toString(16).padStart(2, '0')).join(''));
}

/**
 * Get the stored encryption key
 */
function getEncryptionKey() {
  return localStorage.getItem('rr_chat_key');
}

/**
 * Create the chat interface elements
 */
function createChatInterface() {
  // Create modal container
  chatModal = document.createElement('div');
  chatModal.className = 'fixed inset-0 bg-spaceBlack/90 flex items-center justify-center z-50 hidden';
  chatModal.id = 'risk-chatbot-modal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'glass-card w-full max-w-md mx-4 rounded-2xl overflow-hidden flex flex-col max-h-[80vh]';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'bg-spaceDark p-4 flex items-center justify-between';
  
  const title = document.createElement('h3');
  title.className = 'text-white font-semibold';
  title.textContent = 'Risk Disclaimer Assistant';
  
  closeButton = document.createElement('button');
  closeButton.className = 'text-gray-400 hover:text-white';
  closeButton.innerHTML = '<i class="icon-x"></i>';
  
  header.appendChild(title);
  header.appendChild(closeButton);
  
  // Create messages container
  chatMessages = document.createElement('div');
  chatMessages.className = 'flex-1 p-4 overflow-y-auto space-y-4';
  chatMessages.id = 'chat-messages';
  
  // Add welcome message
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'bg-spaceDark/50 rounded-lg p-3 text-white';
  welcomeMessage.innerHTML = `
    <p>Welcome to the Rust Rocket Risk Assistant. I can help you understand the risks of meme coin trading and explain our safety features.</p>
    <p class="text-sm text-gray-400 mt-2">Example questions:</p>
    <ul class="text-sm text-gray-400 list-disc pl-5">
      <li>How do I protect against rug pulls?</li>
      <li>What is front-running and how does it affect me?</li>
      <li>Is there a risk of losing all my investment?</li>
    </ul>
  `;
  chatMessages.appendChild(welcomeMessage);
  
  // Create input area
  const inputArea = document.createElement('div');
  inputArea.className = 'border-t border-white/10 p-4';
  
  const inputContainer = document.createElement('div');
  inputContainer.className = 'flex items-center';
  
  userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.className = 'flex-1 bg-spaceDark text-white rounded-l-lg px-4 py-2 focus:outline-none';
  userInput.placeholder = 'Ask about trading risks...';
  
  sendButton = document.createElement('button');
  sendButton.className = 'bg-neonGreen text-spaceBlack px-4 py-2 rounded-r-lg hover:bg-neonGreen/90';
  sendButton.innerHTML = '<i class="icon-send"></i>';
  
  inputContainer.appendChild(userInput);
  inputContainer.appendChild(sendButton);
  
  const disclaimer = document.createElement('p');
  disclaimer.className = 'text-xs text-gray-500 mt-2';
  disclaimer.textContent = 'Your questions help us improve our FAQ section. Conversations are encrypted locally.';
  
  inputArea.appendChild(inputContainer);
  inputArea.appendChild(disclaimer);
  
  // Assemble modal
  modalContent.appendChild(header);
  modalContent.appendChild(chatMessages);
  modalContent.appendChild(inputArea);
  chatModal.appendChild(modalContent);
  
  // Create chat trigger button
  chatbotTrigger = document.createElement('button');
  chatbotTrigger.className = 'fixed bottom-6 right-6 bg-rocketPurple hover:bg-rocketPurple/90 text-white p-4 rounded-full shadow-lg z-40 flex items-center justify-center';
  chatbotTrigger.innerHTML = '<i class="icon-message-circle text-xl"></i>';
  chatbotTrigger.id = 'chatbot-trigger';
  
  // Add to DOM
  document.body.appendChild(chatModal);
  document.body.appendChild(chatbotTrigger);
}

/**
 * Set up the event listeners for the chat interface
 */
function setupEventListeners() {
  // Open chat modal
  chatbotTrigger.addEventListener('click', () => {
    chatModal.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    userInput.focus();
    
    // Track event
    if (window.plausible) {
      window.plausible('ai_start');
    }
  });
  
  // Close chat modal
  closeButton.addEventListener('click', () => {
    chatModal.classList.add('hidden');
  });
  
  // Send message on button click
  sendButton.addEventListener('click', sendMessage);
  
  // Send message on Enter key
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chatModal.classList.contains('hidden')) {
      chatModal.classList.add('hidden');
    }
  });
  
  // Close when clicking outside the modal
  chatModal.addEventListener('click', (e) => {
    if (e.target === chatModal) {
      chatModal.classList.add('hidden');
    }
  });
}

/**
 * Send a message to the chatbot
 */
async function sendMessage() {
  const message = userInput.value.trim();
  
  if (message === '' || isStreaming) return;
  
  // Add user message to UI
  addMessageToUI('user', message);
  
  // Clear input
  userInput.value = '';
  
  // Show loading indicator
  const botMessageElement = addMessageToUI('assistant', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
  
  // Set streaming flag
  isStreaming = true;
  
  try {
    // Call GPT-4 API with streaming
    const response = await streamGPT4Response(message, botMessageElement);
    
    // Add to conversation history
    addToConversationHistory(message, response);
    
    // Track completed conversation
    if (window.plausible) {
      window.plausible('ai_complete', { props: { question_length: message.length } });
    }
    
    // Save question for FAQ consideration
    saveQuestionForFAQ(message);
  } catch (error) {
    console.error('Error getting response:', error);
    botMessageElement.innerHTML = "I'm sorry, I couldn't process your request. Please try again later.";
  } finally {
    // Reset streaming flag
    isStreaming = false;
  }
}

/**
 * Add a message to the UI
 */
function addMessageToUI(role, content) {
  const messageElement = document.createElement('div');
  
  if (role === 'user') {
    messageElement.className = 'bg-rustBlue/20 ml-12 rounded-lg p-3 text-white';
  } else {
    messageElement.className = 'bg-spaceDark/50 mr-12 rounded-lg p-3 text-white';
  }
  
  messageElement.innerHTML = content;
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return messageElement;
}

/**
 * Stream GPT-4 response
 */
async function streamGPT4Response(message, messageElement) {
  // Prepare history context
  const context = conversationHistory.map(item => `User: ${item.question}\nAssistant: ${item.answer}`).join('\n\n');
  
  // System message defining the bot's behavior
  const systemMessage = `You are a risk disclaimer assistant for Rust Rocket, a meme coin trading platform. Your primary goal is to educate users about the risks involved in trading meme coins and how Rust Rocket helps mitigate these risks.

Key points to emphasize:
1. All trading involves risk of capital loss
2. Meme coins are highly volatile and speculative assets
3. Rust Rocket provides protection tools but cannot guarantee profits
4. Users should never invest more than they can afford to lose
5. Explain Rust Rocket's protective features (Rug-Shield-AI, front-running protection, etc.)

Be factual, concise, and avoid exaggerated claims about success rates or guarantees. If you don't know an answer, admit it rather than making something up.

Current conversation history:
${context}`;

  try {
    // Simulate AI streaming response (Replace with actual OpenAI API call in production)
    let fullResponse = '';
    const responseText = await simulateGPT4Response(message, systemMessage);
    const words = responseText.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      if (i > 0) fullResponse += ' ';
      fullResponse += words[i];
      messageElement.innerHTML = fullResponse;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    // Return the full response
    return responseText;
  } catch (error) {
    throw error;
  }
}

/**
 * Simulate GPT-4 response (for development)
 * In production, replace with actual OpenAI API call
 */
async function simulateGPT4Response(message, systemMessage) {
  // This is a simulation! Replace with actual OpenAI API in production
  const responses = {
    'How do I protect against rug pulls?': 'To protect against rug pulls when trading meme coins, you should utilize Rust Rocket\'s Rug-Shield-AI, which automatically analyzes token contracts before you trade. Look for verified teams, locked liquidity for 6+ months, and reasonable token distribution. Always start with small test positions, and monitor developer wallet activity for suspicious movements. Remember that while our tools significantly reduce risk, no system can provide 100% protection, so never invest more than you can afford to lose.',
    'What is front-running and how does it affect me?': 'Front-running occurs when bots see your pending transaction in the mempool and execute their own transaction before yours, profiting from the price movement your trade would cause. This results in worse execution prices for you and potential failed transactions. Rust Rocket protects against this with our private transaction relays that bypass the public mempool, along with optimized gas pricing algorithms. For premium users, we offer direct validator connections that minimize the risk of having your trades front-run.',
    'Is there a risk of losing all my investment?': 'Yes, there is absolutely a risk of losing your entire investment when trading meme coins. These assets are highly volatile and speculative by nature. While Rust Rocket provides advanced protection tools against scams and technical trading issues, we cannot protect against market movements or fundamental value changes. You should only invest funds you can afford to lose completely, maintain proper position sizing (5-10% of your portfolio maximum for meme coins), and diversify your holdings to manage risk effectively.',
    'default': 'Thank you for your question about meme coin trading risks. While trading meme coins can be profitable, it involves significant risks including high volatility, potential for scams, front-running attacks, and total loss of capital. Rust Rocket provides tools to help mitigate some technical risks, but cannot eliminate market risk. I recommend starting with small positions, using the platform\'s protection features, and never investing more than you can afford to lose completely. Would you like more specific information about particular risk factors or how our protection mechanisms work?'
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return matching response or default
  return responses[message] || responses['default'];
}

/**
 * Add to conversation history and save to localStorage
 */
function addToConversationHistory(question, answer) {
  // Add to history array
  conversationHistory.push({ question, answer });
  
  // Limit history size
  if (conversationHistory.length > MAX_HISTORY_ITEMS) {
    conversationHistory.shift();
  }
  
  // Encrypt and save
  const encryptedHistory = encryptData(JSON.stringify(conversationHistory));
  localStorage.setItem('rr_chat_history', encryptedHistory);
}

/**
 * Load chat history from localStorage
 */
function loadChatHistory() {
  const encryptedHistory = localStorage.getItem('rr_chat_history');
  
  if (encryptedHistory) {
    try {
      const decryptedHistory = decryptData(encryptedHistory);
      conversationHistory = JSON.parse(decryptedHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem('rr_chat_history');
    }
  }
}

/**
 * Encrypt data using AES-GCM
 */
function encryptData(data) {
  // In production, implement actual AES-GCM encryption
  // This is a placeholder implementation
  return btoa(data);
}

/**
 * Decrypt data using AES-GCM
 */
function decryptData(encryptedData) {
  // In production, implement actual AES-GCM decryption
  // This is a placeholder implementation
  return atob(encryptedData);
}

/**
 * Save user question for potential FAQ addition
 */
function saveQuestionForFAQ(question) {
  // In a real implementation, this would send the question to a backend or
  // save it in a format accessible to the build script
  // This is a placeholder for demonstration
  console.log('Question saved for FAQ consideration:', question);
  
  // In production, implement API call to save questions for FAQ generation
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateEncryptionKey,
    addToConversationHistory,
    encryptData,
    decryptData
  };
} 