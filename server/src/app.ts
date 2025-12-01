import express from 'express';
import path from 'path';
import fs from 'fs';

export function createApp() {
  const app = express();

  // Health check for testing/deploy
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // Determine built client assets path.
  // Vite build output (from client build) goes to root dist/public.
  // When running compiled server code (server/dist/src/app.js), __dirname = server/dist/src
  // Navigate up three levels to repo root then into dist/public.
  const publicPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'public');

  if (!fs.existsSync(publicPath)) {
    console.warn('[server] dist/public not found at', publicPath, '- run "pnpm -F client build" first to serve frontend');
  } else {
    app.use(express.static(publicPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  return app;
}

export default createApp;
