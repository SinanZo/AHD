import express from 'express';
import path from 'path';
import fs from 'fs';

export function createApp() {
  const app = express();

  // Health check for testing/deploy
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // Compute public directory path
  // Try multiple possible locations for the built frontend assets
  const possiblePaths = [
    // When running from server/dist/index.js (typical compiled setup)
    path.resolve(__dirname, '..', '..', 'dist', 'public'),
    // Alternative: relative to process.cwd() (production)
    path.resolve(process.cwd(), 'dist', 'public'),
    // Alternative: if dist/public is at same level as server
    path.resolve(process.cwd(), '..', 'dist', 'public'),
  ];

  let publicDir = possiblePaths[0];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      publicDir = p;
      console.log(`[server] Found frontend assets at: ${publicDir}`);
      break;
    }
  }

  if (!fs.existsSync(publicDir)) {
    console.warn(`[server] Frontend assets not found. Tried:`);
    possiblePaths.forEach(p => console.warn(`  - ${p}`));
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
