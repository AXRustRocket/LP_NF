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
