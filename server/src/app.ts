import express from 'express';
import path from 'path';
import fs from 'fs';

export function createApp() {
  const app = express();

  // Health check for testing/deploy
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // Compute public directory path
  // When running compiled server code (server/dist/index.js), __dirname = server/dist
  // Navigate up two levels to repo root, then into dist/public
  const publicDir = path.resolve(__dirname, '..', '..', 'dist', 'public');

  if (!fs.existsSync(publicDir)) {
    console.warn(`[server] Frontend assets not found at: ${publicDir}`);
    console.warn('[server] Run "pnpm --filter @ahd/client build" to generate frontend assets.');
  } else {
    app.use(express.static(publicDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(publicDir, 'index.html'));
    });
  }

  return app;
}

export default createApp;
