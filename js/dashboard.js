// Dashboard.js - Handles dashboard interactions

document.addEventListener('DOMContentLoaded', function() {
    // Form handling for the waitlist
    const waitlistForm = document.getElementById('hubWaitlist');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = waitlistForm.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (!email || !email.includes('@') || !email.includes('.')) {
                // Show error
                const errorMsg = document.createElement('div');
                errorMsg.className = 'w-full px-5 py-3 rounded-full bg-red-500/20 text-red-400 mt-4';
                errorMsg.textContent = 'Please enter a valid email address';
                
                // Replace any existing error
                const existingError = waitlistForm.querySelector('.bg-red-500\\/20');
                if (existingError) {
                    existingError.remove();
                }
                
                waitlistForm.appendChild(errorMsg);
                return;
            }
            
            // Display success message (in a real implementation, you would send this to your backend)
            waitlistForm.innerHTML = '<div class="w-full px-5 py-3 rounded-full bg-neonGreen/20 text-neonGreen">Thank you! You\'re on the early-access list.</div>';
            
            // In a real implementation, you would add:
            // saveToSupabase(email);
        });
    }
    
    // Simulated API call to Supabase
    async function saveToSupabase(email) {
        // This is just a placeholder - in production you would use the Supabase JS client
        console.log(`Would save ${email} to Supabase waitlist table`);
        
        // Example of actual implementation:
        // try {
        //     const { data, error } = await supabase
        //         .from('waitlist')
        //         .insert([{ email, source: 'dashboard', created_at: new Date() }]);
        //         
        //     if (error) throw error;
        //     console.log('Saved successfully', data);
        // } catch (err) {
        //     console.error('Error saving to waitlist:', err);
        // }
    }
    
    // Animate metrics on scroll
    const metricsSection = document.querySelector('.glass-card h4');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a class to animate when visible
                    document.querySelectorAll('.skeleton').forEach(el => {
                        el.classList.add('animate-pulse');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(metricsSection);
    }
    
    // Wallet connect simulation
    const walletBtn = document.getElementById('walletBtn');
    if (walletBtn) {
        walletBtn.addEventListener('click', function() {
            alert('Wallet connection will be available in the private beta.');
        });
    }
}); 