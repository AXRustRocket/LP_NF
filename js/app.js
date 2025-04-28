/**
 * Rust Rocket Application
 * Component loading and core functionality
 */

// Debug flag
window.DEBUG = true;
console.log('app.js loaded');

// DOM ready event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
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
    
    // Initialize navbar transparency
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
    
    // Initialize form handlers
    setupFormHandlers();
});

/**
 * Setup form submission handlers
 */
function setupFormHandlers() {
    // Hero form
    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
        console.log('Setting up hero form handler');
        heroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Thank you for subscribing to our waitlist!');
            document.getElementById('heroFormFeedback').classList.remove('hidden');
        });
    }
    
    // Waitlist form
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        console.log('Setting up waitlist form handler');
        waitlistForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Thank you for joining our waitlist!');
            document.getElementById('waitlistFormFeedback').classList.remove('hidden');
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('Setting up contact form handler');
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Thank you for your message! We will be in touch soon.');
            document.getElementById('contactFormFeedback').classList.remove('hidden');
        });
    }
}
