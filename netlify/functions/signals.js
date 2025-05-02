const fs = require('fs');
exports.handler = async (event) => {
  const { token } = event.pathParameters;
  try {
    const raw = fs.readFileSync(`signals/${token.toUpperCase()}.json`, 'utf8');
    return { statusCode: 200, body: raw, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=15' } };
  } catch (e) {
    return { statusCode: 404, body: JSON.stringify({ error: 'token_not_found' }) };
  }
}; 