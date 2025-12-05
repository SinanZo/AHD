// Quick health check for the backend
// Usage:
//   node test-health.js 5001
//   (defaults to process.env.PORT or 5001)

const http = require('http');

const portArg = process.argv[2];
const port = Number(portArg || process.env.PORT || 5001);

const options = {
  hostname: 'localhost',
  port,
  path: '/api/health',
  method: 'GET',
};

console.log(`[health] GET http://localhost:${port}/api/health`);
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log(`[health] status: ${res.statusCode}`);
    console.log(`[health] body: ${data}`);
  });
});

req.on('error', (err) => {
  console.error('[health] request error:', err.message);
});

req.end();
