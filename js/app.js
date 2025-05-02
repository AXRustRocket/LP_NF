/**
 * Rust Rocket Application
 * Component loading and core functionality
 */

console.log('app.js loaded');

/* Main Application JavaScript */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');
    
    // Initialize features that don't require user interaction
    setupModals();
    setupScrollEffects();
    
    // Initialize metrics display if elements exist
    const metricsTable = document.querySelector('#metricsTable');
    if (metricsTable) {
        updateMetrics();
        // Update every 10 seconds
        setInterval(updateMetrics, 10000);
    }
});

// Setup modal behaviors
function setupModals() {
    // Video modal
    const videoModal = document.querySelector('#videoModal');
    const videoOpenBtn = document.querySelector('#openVideoModal');
    const videoCloseBtn = document.querySelector('#closeVideoModal');
    
    if (videoModal && videoOpenBtn && videoCloseBtn) {
        videoOpenBtn.addEventListener('click', () => {
            videoModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        });
        
        videoCloseBtn.addEventListener('click', () => {
            videoModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
    
    // Demo modal
    const demoModal = document.querySelector('#demoModal');
    const demoOpenBtn = document.querySelector('#openDemoModal');
    const demoCloseBtn = document.querySelector('#closeDemoModal');
    
    if (demoModal && demoOpenBtn && demoCloseBtn) {
        demoOpenBtn.addEventListener('click', () => {
            demoModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        });
        
        demoCloseBtn.addEventListener('click', () => {
            demoModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
}

// Setup scroll effects 
function setupScrollEffects() {
    // Fade-in elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(el => {
            el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
            fadeObserver.observe(el);
        });
    }
}

// Update metrics display 
function updateMetrics() {
    // Random values for demo purposes
    const metrics = {
        latency: Math.floor(Math.random() * 10) + 70, // 70-79ms
        txLead: Math.floor(Math.random() * 50) + 100, // 100-149ms
        volume: (Math.random() * 2 + 27).toFixed(1), // 27.0-29.0 SOL
        activeTraders: Math.floor(Math.random() * 100) + 2200, // 2200-2299
    };
    
    // Update metric displays
    document.querySelectorAll('[data-metric="latency"]').forEach(el => {
        el.textContent = `${metrics.latency} ms`;
    });
    
    document.querySelectorAll('[data-metric="txLead"]').forEach(el => {
        el.textContent = `+${metrics.txLead} ms`;
    });
    
    document.querySelectorAll('[data-metric="volume"]').forEach(el => {
        el.textContent = `${metrics.volume} SOL`;
    });
    
    document.querySelectorAll('[data-metric="activeTraders"]').forEach(el => {
        el.textContent = metrics.activeTraders.toLocaleString();
    });
    
    // Update last updated timestamp
    document.querySelectorAll('[data-metric="lastUpdated"]').forEach(el => {
        el.textContent = new Date().toLocaleTimeString();
    });
}

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
