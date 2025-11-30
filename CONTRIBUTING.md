# Contributing to AHD

Thank you for contributing! Please follow these guidelines:

## Branches & PRs
- Use `main` as the stable branch.
- Create branches `feature/<desc>` or `fix/<desc>`.
- Open a PR with a clear description and link relevant issue(s).

## Commit messages
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

## Code style
- We use ESLint + Prettier. Run `pnpm lint` and `pnpm format` before committing.
- Keep PRs focused and avoid formatting-only changes mixed with functional changes.

## Tests & CI
- Add unit tests with Vitest.
- PRs should pass CI (lint, typecheck, tests) before merging.

## Environment
- Never commit secrets. Add `.env.example` files and store secrets in CI or your deploy provider.
