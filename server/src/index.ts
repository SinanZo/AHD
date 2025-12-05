// server/src/index.ts
import 'dotenv/config';
import { createServer } from 'http';
import { createApp } from './app';

async function startServer() {
  console.log('[server] Starting server...');
  console.log('[server] Working directory:', process.cwd());
  console.log('[server] NODE_ENV:', process.env.NODE_ENV || 'development');

  // Create Express app
  const app = createApp();
  const server = createServer(app);

  // Safe port parsing - default to 0 to let OS choose available port
  let port = 0;
  const portEnv = process.env.PORT;

  if (portEnv && portEnv.trim() !== '') {
    const parsed = Number(portEnv);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 65535) {
      port = parsed;
    } else {
      console.warn(
        `[server] Invalid PORT env var: "${portEnv}". Letting OS choose available port.`
      );
    }
  }

  // Bind explicitly to 0.0.0.0 for predictable reachability on Windows
  server.listen(port, '0.0.0.0', () => {
    const assignedPort = (server.address() as any)?.port;
    console.log(`[server] Server successfully running on port ${assignedPort}`);
    console.log('[server] Ready to serve requests');
    // Log to .env-like output for easy reference
    if (port === 0) {
      console.log(`[server] Update ContactPage.tsx to use: http://localhost:${assignedPort}/api/contact`);
    }
  });
}

startServer().catch((err) => {
  console.error('[server] Fatal error during startup:', err);
  process.exit(1);
});