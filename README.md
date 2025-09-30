## $BART – Bad Art / Real Artist Platform

This repository hosts the Next.js 15 + TailwindCSS v4 application that powers **$BART** – the tongue-in-cheek meme/meta-art arena for chaotic artists. The stack embraces the App Router, shadcn/ui primitives, Prisma for data, and X (Twitter) OAuth for authentication.

The implementation roadmap follows the requirements captured in `/docs/moodboard-check.md` and the subsequent architecture briefs inside `agents/`.

## Tooling Overview

- **Next.js 15** with the App Router and React 19.
- **TailwindCSS v4** with custom theming that mirrors the $BART palette.
- **shadcn/ui** component primitives (via `@radix-ui/react-slot`, `class-variance-authority`, `tailwind-merge`, etc.).
- **Prisma** with SQLite for local development and Postgres planned for production deployments.
- **NextAuth (Auth.js v5 beta)** for X login (scaffolding in progress).
- **Husky + lint-staged** to enforce linting & formatting before every commit.

## Prerequisites

- Node.js 20+
- pnpm 10.5 (the repo is configured for pnpm; other package managers are not supported).

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy and adjust environment variables
cp .env.example .env

# (Optional) Allow Prisma to skip checksum validation when running offline
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Run the initial database migration (generates prisma/migrations and dev.db)
pnpm prisma:migrate --name init

# Launch the development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the current build.

## Scripts

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `pnpm dev`             | Start the Next.js development server.           |
| `pnpm build`           | Build the production bundle.                    |
| `pnpm start`           | Serve the production build.                     |
| `pnpm lint`            | Run ESLint (Next.js rules).                     |
| `pnpm typecheck`       | Validate TypeScript types.                      |
| `pnpm format`          | Check formatting with Prettier.                 |
| `pnpm format:write`    | Apply Prettier formatting fixes.                |
| `pnpm prisma:migrate`  | Run `prisma migrate dev` (accepts `--name`).    |
| `pnpm prisma:generate` | Regenerate the Prisma Client.                   |
| `pnpm prisma:studio`   | Open Prisma Studio against the local SQLite DB. |

## Environment Variables

Environment keys are documented in `.env.example`:

```
NEXTAUTH_SECRET=replace-me-with-32chars
DATABASE_URL=file:./prisma/dev.db
X_CLIENT_ID=...
X_CLIENT_SECRET=...
X_BEARER=...
NEXTAUTH_URL=http://localhost:3000
```

The default development profile uses SQLite (`file:./prisma/dev.db`). Configure a Postgres connection string for production deployments.

## Continuous Integration

GitHub Actions (`.github/workflows/ci.yml`) installs dependencies, runs Prisma client generation, and executes linting and type checks for every push and pull request.

## Notes on Local Prisma Usage

- The environment used to author this commit blocks direct downloads of Prisma engines, which may require setting `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` before running `pnpm prisma:*` commands.
- The initial migration SQL can be found under `prisma/migrations/20241011000000_init/`.

## Project Status

Implementation work has just started. Follow-up tasks include wiring up Auth.js for X OAuth, the submission & voting flows, telemetry, and automated X-posting per milestone.
