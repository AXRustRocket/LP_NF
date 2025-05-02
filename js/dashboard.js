// Dashboard.js - Handles dashboard interactions
import { fetchSignal } from './signals.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';
import { requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated - redirects to auth.html if not
    const isAuthenticated = await requireAuth();
    
    // Only initialize dashboard if user is authenticated
    if (isAuthenticated) {
        console.log('User authenticated, initializing dashboard');
        
        // Initialize signals display with default token (WIF)
        initDashboard();
        
        // Initialize global tab handlers
        initTabSystem();
        
        // Initialize configuration modal
        initConfigModal();
        
        // Simulated wallet connect
        const walletBtn = document.getElementById('walletBtn');
        if (walletBtn) {
            walletBtn.addEventListener('click', function() {
                alert('Wallet connection will be available in the private beta.');
            });
        }
    } else {
        console.log('User not authenticated, redirecting to login');
        // The requireAuth function already handles the redirect
    }
});

// Initialize the dashboard
async function initDashboard() {
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
        
        // Load profit chart for default token
        loadProfitChart('WIF');
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

// Initialize tab system for Bot Configuration
function initTabSystem() {
    const tabBasic = document.getElementById('tab-basic');
    const tabAdvanced = document.getElementById('tab-advanced');
    const contentBasic = document.getElementById('content-basic');
    const contentAdvanced = document.getElementById('content-advanced');
    
    if (tabBasic && tabAdvanced) {
        tabBasic.addEventListener('click', () => {
            tabBasic.classList.add('border-neonGreen', 'text-white');
            tabBasic.classList.remove('border-transparent', 'text-white/60');
            tabAdvanced.classList.remove('border-neonGreen', 'text-white');
            tabAdvanced.classList.add('border-transparent', 'text-white/60');
            
            contentBasic.classList.remove('hidden');
            contentAdvanced.classList.add('hidden');
        });
        
        tabAdvanced.addEventListener('click', () => {
            tabAdvanced.classList.add('border-neonGreen', 'text-white');
            tabAdvanced.classList.remove('border-transparent', 'text-white/60');
            tabBasic.classList.remove('border-neonGreen', 'text-white');
            tabBasic.classList.add('border-transparent', 'text-white/60');
            
            contentAdvanced.classList.remove('hidden');
            contentBasic.classList.add('hidden');
        });
    }
}

// Initialize Configuration Modal
function initConfigModal() {
    const configBtn = document.getElementById('configBtn');
    const configModal = document.getElementById('configModal');
    const closeModal = document.getElementById('closeModal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const saveConfig = document.getElementById('save-config');
    const resetConfig = document.getElementById('reset-config');
    
    if (configBtn && configModal) {
        // Open modal
        configBtn.addEventListener('click', () => {
            configModal.classList.remove('hidden');
            
            // Transfer values from simple config to modal
            const tradeSize = document.getElementById('trade-size');
            const slippage = document.getElementById('slippage');
            const modalTradeSize = document.getElementById('modal-trade-size');
            const modalSlippage = document.getElementById('modal-slippage');
            
            if (tradeSize && modalTradeSize) {
                modalTradeSize.value = tradeSize.value;
            }
            
            if (slippage && modalSlippage) {
                modalSlippage.value = slippage.value;
            }
            
            // Set focus to first input for accessibility
            setTimeout(() => {
                if (modalTradeSize) modalTradeSize.focus();
            }, 100);
        });
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                configModal.classList.add('hidden');
            });
        }
        
        // Close when clicking outside
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) {
                    configModal.classList.add('hidden');
                }
            });
        }
        
        // Save configuration
        if (saveConfig) {
            saveConfig.addEventListener('click', () => {
                // Transfer values from modal to simple config
                const tradeSize = document.getElementById('trade-size');
                const slippage = document.getElementById('slippage');
                const modalTradeSize = document.getElementById('modal-trade-size');
                const modalSlippage = document.getElementById('modal-slippage');
                
                if (tradeSize && modalTradeSize) {
                    tradeSize.value = modalTradeSize.value;
                }
                
                if (slippage && modalSlippage) {
                    slippage.value = modalSlippage.value;
                }
                
                configModal.classList.add('hidden');
                
                // Simulate success notification
                const notification = document.createElement('div');
                notification.className = 'fixed bottom-4 right-4 bg-neonGreen text-spaceBlack px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-500';
                notification.textContent = 'Configuration saved successfully!';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 500);
                }, 3000);
            });
        }
        
        // Reset to defaults
        if (resetConfig) {
            resetConfig.addEventListener('click', () => {
                // Reset modal values to defaults
                const modalTradeSize = document.getElementById('modal-trade-size');
                const modalSlippage = document.getElementById('modal-slippage');
                const modalGasBoost = document.getElementById('modal-gas-boost');
                const modalAutoSell = document.getElementById('modal-auto-sell');
                const modalAutoSellPercent = document.getElementById('modal-auto-sell-percent');
                const modalTrailingStop = document.getElementById('modal-trailing-stop');
                const modalTrailingPercent = document.getElementById('modal-trailing-percent');
                const modalStopLoss = document.getElementById('modal-stop-loss');
                const modalStopLossPercent = document.getElementById('modal-stop-loss-percent');
                
                if (modalTradeSize) modalTradeSize.value = '1';
                if (modalSlippage) modalSlippage.value = '5';
                if (modalGasBoost) modalGasBoost.value = '1.5';
                if (modalAutoSell) modalAutoSell.checked = true;
                if (modalAutoSellPercent) modalAutoSellPercent.value = '50';
                if (modalTrailingStop) modalTrailingStop.checked = true;
                if (modalTrailingPercent) modalTrailingPercent.value = '10';
                if (modalStopLoss) modalStopLoss.checked = false;
                if (modalStopLossPercent) modalStopLossPercent.value = '';
            });
        }
    }
}

// Load token signal data and update UI
async function loadTokenSignal(token) {
    try {
        const signalData = await fetchSignal(token);
        updateSignalDisplay(signalData);
        drawSparkline(document.getElementById('sig-spark'), generateSparklineData());
    } catch (error) {
        console.error(`Error loading ${token} signal:`, error);
    }
}

// Update the UI with signal data
function updateSignalDisplay(data) {
    // Update KPI tiles
    updateElement('sig-price', formatCurrency(data.market_data.price_usd, true));
    updateElement('sig-volume', formatCurrency(data.market_data.volume_24h_usd));
    updateElement('sig-latency', `${80} ms`); // Hardcoded for demo
    updateElement('sig-pump-score', formatPumpScore(data.alerts.pump_probability));
    
    // Update token info
    updateElement('sig-token-name', data.token.name);
    updateElement('sig-token-symbol', data.token.symbol);
    updateElement('token-symbol-short', data.token.symbol);
    
    // Format address with ellipsis
    const shortAddress = `${data.token.address.substring(0, 5)}...${data.token.address.substring(data.token.address.length - 4)}`;
    updateElement('sig-token-address', shortAddress);
    
    // Format creation date
    const createdDate = new Date(data.token.created_at);
    const formattedDate = `Created ${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`;
    updateElement('sig-token-created', formattedDate);
    
    // Update last fetched timestamp
    updateElement('sig-last-updated', `Updated ${new Date().toLocaleTimeString()}`);
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

// Format pump score percentage
function formatPumpScore(score) {
    return `${Math.round(score * 100)}/100`;
}

// Generate random sparkline data for demo
function generateSparklineData() {
    const points = 24;
    const data = [];
    let current = 0.0003;
    
    for (let i = 0; i < points; i++) {
        // Add some randomness
        const change = (Math.random() - 0.4) * 0.00002;
        current += change;
        if (current < 0.0002) current = 0.0002;
        data.push(current);
    }
    
    return data;
}

// Draw sparkline chart with Chart.js
function drawSparkline(canvas, sparklineData) {
    if (!canvas) return;
    
    // Destroy existing chart if any
    if (window.signalChart) {
        window.signalChart.destroy();
    }
    
    // Get context and create gradient
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(42, 255, 98, 0.2)');
    gradient.addColorStop(1, 'rgba(42, 255, 98, 0.02)');
    
    // Create new chart
    window.signalChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: sparklineData.map((_, i) => i),
            datasets: [{
                data: sparklineData,
                borderColor: '#2AFF62',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                fill: true,
                backgroundColor: gradient
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

// Load and render profit chart
async function loadProfitChart(token) {
    try {
        const response = await fetch(`/signals/profit-${token.toLowerCase()}.json`);
        if (!response.ok) throw new Error(`No profit data found for ${token}`);
        
        const data = await response.json();
        renderProfitChart(data);
    } catch (error) {
        console.error(`Error loading profit chart:`, error);
        // Generate fallback data if needed
        renderProfitChart({
            chart_data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                values: [0, 5, 12, 8, 14, 18, 25],
                baseline: 0
            }
        });
    }
}

// Render profit chart with Chart.js
function renderProfitChart(data) {
    const canvas = document.getElementById('profit-chart');
    if (!canvas) return;
    
    // Destroy existing chart if any
    if (window.profitChart) {
        window.profitChart.destroy();
    }
    
    // Get context and create gradient
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(42, 255, 98, 0.3)');
    gradient.addColorStop(1, 'rgba(42, 255, 98, 0.05)');
    
    // Create new chart
    window.profitChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: data.chart_data.labels,
            datasets: [{
                label: 'Profit %',
                data: data.chart_data.values,
                borderColor: '#2AFF62',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#2AFF62',
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(11, 22, 36, 0.8)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: 'rgba(42, 255, 98, 0.3)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Profit: +${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
} 