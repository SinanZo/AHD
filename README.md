# AHD  Monorepo

AHD is a full-stack monorepo with a Vite + React TypeScript client, a Node/Express TypeScript server, and a `shared/` folder for common types and utilities.

## Tech stack
- Monorepo (pnpm + workspaces)
- Client: Vite, React, TypeScript, Tailwind
- Server: Node, TypeScript, Express (esbuild for server bundling)
- Shared: TypeScript types and utilities

## Quick start
1. Install dependencies
```powershell
pnpm install
```

2. Run development (both)
```powershell
pnpm run dev
```
Run separately:
```powershell
pnpm --filter @ahd/client dev
pnpm --filter @ahd/server dev
```

3. Build
```powershell
pnpm --filter @ahd/client build
pnpm --filter @ahd/server build
```

4. Start server (production)
```powershell
pnpm --filter @ahd/server start
```

## Environment variables
Create `.env` locally for server and `.env.local` for client. Use `.env.example` in each folder to document required keys.

## Production Email Setup

- Configure environment in `server/.env` (see `server/.env.example`):
	- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
	- `SMTP_USER`, `SMTP_PASS`
	- `CONTACT_RECEIVER` (who receives contact form emails)
	- `NODE_ENV=production` (enables real SMTP send)

- Build + run server:

```powershell
cd "C:\Users\Sinan Zuaiter\Documents\GitHub\AHD\server"
pnpm build
# Ensure .env is set; Windows PowerShell loads it via dotenv
node dist/index.js
```

- Client proxy in dev maps `/api` to `http://localhost:5001` (see `client/vite.config.ts`). For production deployments, configure your hosting to route `/api/*` to the server.

## Contributing

## Next steps
- Add GitHub Actions for CI (install, lint, test, typecheck)
- Add ESLint/Husky/lint-staged for pre-commit checks
- Move shared types into `shared/types` and export them for stable API contracts

---

Commit: trigger CI prebuilt deploy (timestamp)

Timestamp: 2025-12-06T00:00:00Z
