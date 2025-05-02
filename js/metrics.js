/* Latency Mini Chart – dummy data */
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';

// Global variables for metrics
let latestLatency = 74;
let traderCount = 2260;
let volumeUSD = 68.7;

// Initialize Latency Mini Chart
const ctx = document.getElementById('latencyMini')?.getContext('2d');
if (ctx) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['-40','-30','-20','-10','now'],
      datasets: [{ data: [60,55,50,45,42], borderWidth:1.5, tension:0.4 }]
    },
    options:{ plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}} }
  });
  document.getElementById('latencyUpdated').textContent = 'Stand: 18 s ago';
}

// Function to fetch updated metrics
async function fetchLatencyMetrics() {
  try {
    // In a real implementation, this would call your backend API
    // Simulate API response for demo purposes
    const randomLatency = Math.floor(Math.random() * 10) + 70; // 70-79ms
    latestLatency = randomLatency;

    // Occasionally update other metrics to simulate real-time data
    if (Math.random() > 0.7) {
      traderCount = Math.floor(Math.random() * 100) + 2200; // 2200-2299
    }
    if (Math.random() > 0.8) {
      volumeUSD = (Math.random() * 2 + 67.5).toFixed(1); // 67.5-69.5M
    }

    // Update the marquee text
    updateMarqueeText();
    
    // Update latency display
    if (document.getElementById('latency-count')) {
      document.getElementById('latency-count').textContent = `${latestLatency} ms`;
    }
    
    document.getElementById('latencyUpdated').textContent = `Stand: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    console.error('Error fetching metrics:', err);
  }
}

// Function to update the marquee text with latest metrics
function updateMarqueeText() {
  const marqueeElement = document.querySelector("#whyNow .whitespace-nowrap .inline-block span");
  if (marqueeElement) {
    marqueeElement.textContent = `Median Latency ${latestLatency} ms • ${traderCount} Traders • ${volumeUSD} M US$ Volume • TVTG-registered • Open Treasury ↗`;
  }
}

// Initial update
updateMarqueeText();

// Set interval to regularly update metrics
setInterval(fetchLatencyMetrics, 12000); // Every 12 seconds

// Metrics tracking for Rust Rocket
// This script handles metrics animation and analytics tracking

document.addEventListener('DOMContentLoaded', () => {
  // Metrics animation for dashboard
  const metricsContainer = document.getElementById('hubMetrics');
  
  if (metricsContainer) {
    setTimeout(() => {
      animateMetrics();
    }, 1500);
  }
  
  // Setup tracking for referral attribution
  trackReferralAttribution();
});

// Animate dashboard metrics with realistic values
function animateMetrics() {
  const latencyBlock = document.querySelector('#hubMetrics .metric-tile:nth-child(1) .skeleton');
  const txLeadBlock = document.querySelector('#hubMetrics .metric-tile:nth-child(2) .skeleton');
  const volumeBlock = document.querySelector('#hubMetrics .metric-tile:nth-child(3) .skeleton');
  
  if (latencyBlock && txLeadBlock && volumeBlock) {
    // Replace skeleton loaders with actual values
    latencyBlock.classList.remove('skeleton');
    latencyBlock.classList.add('text-neonGreen', 'text-2xl', 'font-bold');
    latencyBlock.innerHTML = '78 <span class="text-sm font-normal">ms</span>';
    
    txLeadBlock.classList.remove('skeleton');
    txLeadBlock.classList.add('text-white', 'text-2xl', 'font-bold'); 
    txLeadBlock.innerHTML = '+143 <span class="text-sm font-normal">ms</span>';
    
    volumeBlock.classList.remove('skeleton');
    volumeBlock.classList.add('text-white', 'text-2xl', 'font-bold');
    volumeBlock.innerHTML = '29.3 <span class="text-sm font-normal">SOL</span>';
  }
}

// Track events to analytics provider
function trackEvent(eventName, props = {}) {
  // Track with Plausible if available
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
  
  // Log event for debugging
  console.log(`[Metrics] Event tracked: ${eventName}`, props);
}

// Track referral attribution from URL parameters
function trackReferralAttribution() {
  const urlParams = new URLSearchParams(window.location.search);
  const refId = urlParams.get('ref');
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  
  if (refId) {
    // Store referral info in localStorage
    localStorage.setItem('rr_referrer', refId);
    
    // Track the referral visit
    trackEvent('referral_visit', {
      referrer_id: refId,
      utm_source: utmSource || 'direct',
      utm_medium: utmMedium || 'none',
      utm_campaign: utmCampaign || 'none'
    });
    
    // In production, you would also make an API call to record this referral visit
    console.log(`[Referral] Visit from referrer: ${refId}`);
  }
}
