# Tech Baseline Checklist

## Prisma Client

- Run `pnpm prisma:generate` to refresh the Prisma Client. The script automatically applies `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` so it succeeds even when the Prisma engine checksum cannot be fetched (e.g. offline mode).
- If you are offline and already have a generated client under `node_modules/.prisma/client`, the command will no-op with the existing assets.
- Skip Prisma's postinstall hook when needed by exporting `PRISMA_SKIP_POSTINSTALL=1` (for example in CI or constrained sandboxes).

## Continuous Integration

- The GitHub Actions workflow exports:
  - `PRISMA_SKIP_POSTINSTALL=1` before dependency installation.
  - `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` before running `pnpm prisma:generate`.
- Prisma engine folders under `node_modules/.prisma` and `node_modules/.pnpm/@prisma+*/node_modules/.prisma` are cached between runs to minimise fresh downloads.

## Remote Image Domains

- Current data sources serve inline `data:` URLs and local `public/*` assets.
- No remote domains are required today, so `next.config.ts` keeps `images.remotePatterns` empty. Update the list when external hosts are introduced.

## Environment Variables

- Required secrets: `NEXTAUTH_SECRET`, `DATABASE_URL`, `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_BEARER`.
- Operational toggles: `PRISMA_SKIP_POSTINSTALL` (optional), `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING` (optional).
