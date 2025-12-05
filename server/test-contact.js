// Quick contact endpoint tester (no deps)
// Usage:
//   $env:PORT=5001; node test-contact.js
//   node test-contact.js 5001

const http = require('http');

const portArg = process.argv[2];
const port = Number(portArg || process.env.PORT || 5001);

const payload = JSON.stringify({
  name: 'Tester',
  email: 'tester@example.com',
  message: 'Hello from test-contact.js',
});

const options = {
  hostname: 'localhost',
  port,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

console.log(`[test] POST http://localhost:${port}/api/contact`);
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log(`[test] status: ${res.statusCode}`);
    console.log(`[test] body: ${data}`);
  });
});

req.on('error', (err) => {
  console.error('[test] request error:', err.message);
});

req.write(payload);
req.end();
