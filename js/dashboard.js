// Dashboard.js - Handles dashboard interactions
import { fetchSignal } from './signals.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize signals display with default token (WIF)
    initSignalsDisplay();
    
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
    
    // Signal handling - Fetch and display token signals
    async function initSignalsDisplay() {
        try {
            // Default to WIF token
            await loadTokenSignal('WIF');
            
            // Setup token switcher if it exists
            const tokenSwitcher = document.getElementById('token-switcher');
            if (tokenSwitcher) {
                tokenSwitcher.addEventListener('change', function(e) {
                    loadTokenSignal(e.target.value);
                });
            }
            
            // Set up auto-refresh every 15 seconds
            setInterval(() => {
                const activeToken = tokenSwitcher ? tokenSwitcher.value : 'WIF';
                loadTokenSignal(activeToken);
            }, 15000);
            
        } catch (error) {
            console.error('Error initializing signals display:', error);
        }
    }
    
    // Load token signal data and update UI
    async function loadTokenSignal(token) {
        try {
            const signalData = await fetchSignal(token);
            updateSignalDisplay(signalData);
        } catch (error) {
            console.error(`Error loading ${token} signal:`, error);
        }
    }
    
    // Update the UI with signal data
    function updateSignalDisplay(data) {
        // Update KPI tiles
        updateElement('sig-price', formatCurrency(data.market_data.price_usd, true));
        updateElement('sig-volume', formatCurrency(data.market_data.volume_24h_usd));
        updateElement('sig-latency', `${data.rust_rocket_metrics.latency_ms} ms`);
        updateElement('sig-sentiment', data.sentiment.overall_sentiment);
        
        // Update token name/symbol
        updateElement('sig-token-name', data.token.name);
        updateElement('sig-token-symbol', data.token.symbol);
        
        // Draw sparkline chart if canvas exists
        const sparkCanvas = document.getElementById('sig-spark');
        if (sparkCanvas && data.market_data.sparklineData) {
            drawSparkline(sparkCanvas, data.market_data.sparklineData);
        }
        
        // Update last fetched timestamp
        updateElement('sig-last-updated', new Date().toLocaleTimeString());
    }
    
    // Helper: Update element text content if element exists
    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Helper: Format currency values
    function formatCurrency(value, showDecimals = false) {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}K`;
        } else if (showDecimals && value < 0.001) {
            return `$${value.toExponential(2)}`;
        } else if (showDecimals) {
            return `$${value.toFixed(6)}`;
        } else {
            return `$${value.toFixed(2)}`;
        }
    }
    
    // Draw sparkline chart with Chart.js
    function drawSparkline(canvas, sparklineData) {
        // Destroy existing chart if any
        if (window.signalChart) {
            window.signalChart.destroy();
        }
        
        // Create new chart
        window.signalChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: sparklineData.map((_, i) => i),
                datasets: [{
                    data: sparklineData,
                    borderColor: '#2AFF62',
                    borderWidth: 2,
                    tension: 0.2,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(42, 255, 98, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { 
                        display: false,
                        min: Math.min(...sparklineData) * 0.95,
                        max: Math.max(...sparklineData) * 1.05
                    }
                },
                animation: {
                    duration: 500
                }
            }
        });
    }
    
    // Simulate wallet connect
    const walletBtn = document.getElementById('walletBtn');
    if (walletBtn) {
        walletBtn.addEventListener('click', function() {
            alert('Wallet connection will be available in the private beta.');
        });
    }
}); 