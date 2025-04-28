/**
 * Rust Rocket Application
 * Component loading and core functionality
 */

console.log('app.js loaded');

// DOM ready event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar transparency immediately
    const navbar = document.querySelector('#navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-spaceBlack/80', 'backdrop-blur-md', 'shadow-md');
            } else {
                navbar.classList.remove('bg-spaceBlack/80', 'backdrop-blur-md', 'shadow-md');
            }
        });
    }
    
    // Initialize form handlers immediately for better UX
    setupFormHandlers();
    
    // Use requestIdleCallback for non-critical initialization
    const idleCallback = window.requestIdleCallback || function(callback) {
        const start = Date.now();
        return setTimeout(function() {
            callback({
                didTimeout: false,
                timeRemaining: function() {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    };
    
    // Defer non-critical initialization
    idleCallback(() => {
        // Find placeholder elements
        const featuresSlot = document.getElementById('featuresSlot');
        const roadmapSlot = document.getElementById('roadmapSlot');
        const plansSlot = document.getElementById('plansSlot');
        
        console.log('Found components:', { 
            featuresSlot: !!featuresSlot, 
            roadmapSlot: !!roadmapSlot, 
            plansSlot: !!plansSlot 
        });
        
        // Check if navbar menu buttons exist
        const menuBtn = document.getElementById('menuBtn');
        const menuBtnDesk = document.getElementById('menuBtnDesk');
        console.log('Menu buttons:', { menuBtn: !!menuBtn, menuBtnDesk: !!menuBtnDesk });
    });
});

/**
 * Setup form submission handlers
 */
function setupFormHandlers() {
    // Hero form
    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
        heroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show feedback immediately
            const feedbackElement = document.getElementById('heroFormFeedback');
            if (feedbackElement) {
                feedbackElement.classList.remove('hidden');
            }
            
            // Submit form data asynchronously
            const email = document.getElementById('hero-email').value;
            setTimeout(() => {
                console.log('Form submitted with email:', email);
                // Here you would normally send the data to a server
            }, 0);
        });
    }
    
    // Waitlist form
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show feedback immediately
            const feedbackElement = document.getElementById('waitlistFormFeedback');
            if (feedbackElement) {
                feedbackElement.classList.remove('hidden');
            }
            
            // Submit form data asynchronously
            setTimeout(() => {
                console.log('Waitlist form submitted');
                // Here you would normally send the data to a server
            }, 0);
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show feedback immediately
            const feedbackElement = document.getElementById('contactFormFeedback');
            if (feedbackElement) {
                feedbackElement.classList.remove('hidden');
            }
            
            // Submit form data asynchronously
            setTimeout(() => {
                console.log('Contact form submitted');
                // Here you would normally send the data to a server
            }, 0);
        });
    }
}
