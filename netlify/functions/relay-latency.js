const fetch = require('node-fetch');

// Node.js Version für Netlify Functions festlegen
exports.config = { nodeVersion: '18.x' };

exports.handler = async () => {
  const res = await fetch('https://api.bloxroute.com/solana/v1/latency', {
    headers: { 'Authorization': `Bearer ${process.env.BLOXROUTE_API_KEY}` }
  });
  const { p50 } = await res.json();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=20' },
    body: JSON.stringify({ p50 })
  };
}; 