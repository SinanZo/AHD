import { createServer } from 'http';
import { createApp } from './app';

async function startServer() {
  console.log('[server] Starting server...');
  console.log('[server] Working directory:', process.cwd());
  console.log('[server] __dirname would be:', __dirname);
  console.log('[server] NODE_ENV:', process.env.NODE_ENV || 'development');
  
  const app = createApp();
  const server = createServer(app);

  // Safe port parsing
  let port = 3000;
  const portEnv = process.env.PORT;
  
  if (portEnv && portEnv.trim() !== '') {
    const parsed = Number(portEnv);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 65535) {
      port = parsed;
    } else {
      console.warn(`[server] Invalid PORT env var: "${portEnv}". Using default port 3000.`);
    }
  }

  server.listen(port, () => {
    console.log(`[server] Server successfully running on port ${port}`);
    console.log(`[server] Ready to serve requests`);
  });
}

startServer().catch((err) => {
  console.error('[server] Fatal error during startup:', err);
  process.exit(1);
});
