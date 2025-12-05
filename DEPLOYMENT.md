# AHD — Deployment & CI/CD Guide

This repository is a monorepo with a Vite React frontend and an Express (TypeScript) backend.

## Stack & Structure

- Monorepo package manager: PNPM (workspace)
- Root scripts orchestrate both apps

Structure
- `/client` → React + Vite SPA (public site)
- `/server` → Express API (TS)
- `/shared` → Shared consts/types

Key scripts
- Root
   - `pnpm dev` → run client and server concurrently
   - `pnpm build` → build client and server
   - `pnpm start` → start server (prod)
- Client
   - `pnpm -C client dev` → dev server (Vite)
   - `pnpm -C client build` → builds to `../dist/public` (monorepo layout)
   - `pnpm -C client build:vercel` → builds to `client/dist` (for Vercel)
- Server
   - `pnpm -C server dev` → watch with `tsx`
   - `pnpm -C server build` → `tsc` (uses `tsconfig.server.json`)
   - `pnpm -C server start` → `node dist/index.js`

## Environment Variables

Frontend (Vite)
- `VITE_API_BASE_URL` (URL): API base for production, e.g. `https://ahd-api.onrender.com`
- `VITE_APP_BASE_URL` (URL, optional): public site base URL (used by helpers)
- `VITE_APP_TITLE` (string, optional)
- `VITE_OAUTH_PORTAL_URL` (URL, optional)
- `VITE_APP_ID` (string, optional)
- `VITE_CONTACT_PHONE` (string, optional): phone in any format
- `VITE_CTA_HIDE_ROUTES` (CSV, optional)
- `VITE_DISABLE_REVEAL` ("1" to disable animations, optional)

Backend (Express)
- `PORT` (number): provided by Render; app reads `process.env.PORT`
- `ALLOWED_ORIGINS` (CSV): allowed origins for CORS (comma-separated)
- `EMAIL_USER` or `SMTP_USER` (string)
- `EMAIL_PASS` or `SMTP_PASS` (string)
- `SMTP_HOST` (string, default `smtp.gmail.com`)
- `SMTP_PORT` (number, default `465`)
- `SMTP_SECURE` ("true"/"false", default `true`)
- `CONTACT_RECEIVER` (email, optional)

Notes
- In development, the API returns a stub success without real SMTP send.
- Rate limiting is disabled in development.

### .env Examples

Frontend — `.env.development`
```
# Leave VITE_API_BASE_URL empty to use Vite dev proxy to http://localhost:5001
VITE_API_BASE_URL=
VITE_APP_TITLE=AHD (Dev)
VITE_CONTACT_PHONE=+962778050005
VITE_CTA_HIDE_ROUTES=
VITE_DISABLE_REVEAL=
```

Frontend — `.env.production`
```
VITE_API_BASE_URL=https://ahd-api.onrender.com
VITE_APP_TITLE=AHD
VITE_CONTACT_PHONE=+962778050005
VITE_CTA_HIDE_ROUTES=
VITE_DISABLE_REVEAL=
```

Render (Backend) — Environment
```
# PORT is set by Render
ALLOWED_ORIGINS=https://ahd-7xkzg9td0-sinan-zuaiters-projects.vercel.app,https://your-domain.com,https://www.your-domain.com,http://localhost:3000
EMAIL_USER=... (or SMTP_USER)
EMAIL_PASS=... (or SMTP_PASS)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
CONTACT_RECEIVER=info@example.com
```

Vercel (Frontend) — Environment
```
VITE_API_BASE_URL=https://ahd-api.onrender.com
VITE_APP_TITLE=AHD
```

## Backend on Render

Service type: Web Service
- Root Directory: `server`
- Runtime: Node 20 LTS
- Build Command: `pnpm install --frozen-lockfile && pnpm run build`
- Start Command: `pnpm start`

CORS (already implemented)
```ts
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
   .split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
```

Health check
- `GET /api/health` → `{ "status": "ok" }`

Example
- `https://ahd-api.onrender.com/api/health`

## Frontend on Vercel

Project settings
- Root Directory: `client`
- Framework Preset: Vite
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run build:vercel`
- Output Directory: `client/dist`

Env vars
- `VITE_API_BASE_URL=https://ahd-api.onrender.com`

Notes
- All API calls use `VITE_API_BASE_URL` in production. In dev, relative `/api` goes through Vite proxy to `http://localhost:5001`.

## GitHub Actions & Auto-Deploy

Workflows (added under `.github/workflows/`)
- `ci.yml` → PR CI (install, typecheck, lint, build, test)
- `deploy-backend-render.yml` → On push to `main` (server/shared changes), POST to Render Deploy Hook (`RENDER_DEPLOY_HOOK_URL` secret)
- `deploy-frontend-vercel.yml` → On push to `main` (client/shared changes), POST to Vercel Deploy Hook (`VERCEL_DEPLOY_HOOK_URL` secret)

Setup
1) Create a Render Deploy Hook (Service → Settings → Deploy Hooks) and store it in GitHub Secrets as `RENDER_DEPLOY_HOOK_URL`.
2) Create a Vercel Deploy Hook (Project → Settings → Git → Deploy Hooks) and store in GitHub Secrets as `VERCEL_DEPLOY_HOOK_URL`.
3) Push to `main` → hooks trigger production deployments.

## Local Development

```bash
pnpm install
pnpm dev
# Client: http://localhost:3000 (proxied /api → http://localhost:5001)
# Server: binds to an available port (logs assigned port), proxy expects 5001

# Alternatively run independently
pnpm -C client dev
pnpm -C server dev
```

## Verification Checklist

- [ ] Push to `main` triggers CI and both deploy hooks
- [ ] Render updates: `https://ahd-api.onrender.com/api/health` returns `{ status: 'ok' }`
- [ ] Vercel updates: `https://ahd-7xkzg9td0-sinan-zuaiters-projects.vercel.app/` loads successfully
- [ ] Frontend uses `https://ahd-api.onrender.com` in production (no localhost)
- [ ] No console errors; forms submit successfully

## Troubleshooting

Vite dev fails with unknown options
- Use `pnpm -C client dev` (do not pass unsupported flags like `--reporter` to Vite)

Contact form fails in production
- Ensure `VITE_API_BASE_URL` is set on Vercel
- Ensure `ALLOWED_ORIGINS` on Render includes your Vercel URL

Emails not sending
- In development, email send is stubbed. On production, set SMTP credentials

SPA routing
- Vercel handles SPA automatically; for other hosts ensure all routes fall back to `index.html`

---

Last Updated: 2025-12-05
Frontend: React + Vite + TailwindCSS
Backend: Express + TypeScript (Render)
CI/CD: GitHub Actions + Deploy Hooks (Vercel, Render)
