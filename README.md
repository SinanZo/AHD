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

## Contributing
- Branching: use `main` for production, `feature/*` or `fix/*` for work
- Tests: add/maintain tests (Vitest)
- Format & lint before submit: `pnpm format` and `pnpm lint`

## Next steps
- Add GitHub Actions for CI (install, lint, test, typecheck)
- Add ESLint/Husky/lint-staged for pre-commit checks
- Move shared types into `shared/types` and export them for stable API contracts
