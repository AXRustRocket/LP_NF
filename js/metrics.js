/* Latency Mini Chart – dummy data */
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js/+esm';
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
