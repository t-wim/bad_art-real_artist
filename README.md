# Bad Art – Real Artist Frontend

Frontend for the Bad Art community experience. The app is built with Next.js 15 (App Router), React 19, Tailwind CSS v4, and strict TypeScript. This document outlines how to set up the project locally and how to work with the integration scaffolding that prepares the UI for a production backend.

## Requirements

- Node.js 18+
- [pnpm](https://pnpm.io/) 8+
- Vercel account (for `vercel env pull`)

Install dependencies with:

```bash
pnpm install
```

## Development workflow

Start the local dev server:

```bash
pnpm dev
```

Build and run locally:

```bash
pnpm build
pnpm start
```

## Project scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Next.js in development mode. |
| `pnpm build` | Create an optimized production build. |
| `pnpm start` | Run the production build locally. |
| `pnpm lint` | Run ESLint with the Next.js configuration. |
| `pnpm typecheck` | Execute `tsc --noEmit` to validate TypeScript types. |
| `pnpm test` | Execute the Vitest test suite (MSW-powered). |
| `pnpm format` | Format source files with Prettier. |

## Environment variables

The application reads its configuration from environment variables. Copy the provided example file and adjust values as needed:

```bash
cp .env.example .env.local
```

To sync environment variables from Vercel into your local `.env.local`:

```bash
vercel env pull .env.local
```

Defined variables:

- `NEXT_PUBLIC_API_BASE` – Base URL for browser-side requests (safe to expose).
- `API_SERVER_BASE` – Base URL for server-side proxy requests (never exposed to clients).
- `API_KEY` – Upstream secret used by the proxy for authenticated calls.

## API integration toolkit

- `src/lib/api/types.ts` – Shared TypeScript types for API responses and errors.
- `src/lib/api/client.ts` – Fetch wrapper with retries, timeouts, and helper methods (`apiGet`, `apiPost`, etc.).
- `src/app/api/proxy/[...path]/route.ts` – Server-side proxy that forwards requests to `API_SERVER_BASE`, adding authorization headers if `API_KEY` is present.
- `src/hooks/useHealthcheck.ts` – Client hook that polls `/api/proxy/health` with reusable loading, error, and retry logic.
- `src/app/healthcheck/page.tsx` – Demo page that surfaces the proxy healthcheck and uses the shared UI components in `src/components/system`.

## Upload helpers

Use `src/lib/upload.ts` for preparing uploads:

- `uploadAsBase64` encodes files and sends them through a provided callback.
- `uploadViaSignedUrl` handles chunked uploads against a signed URL.
- `validateFileSize` and `createChunkIterator` offer reusable validation and chunking utilities.

These functions are endpoint-agnostic; integrate them with real services when backend contracts are finalized.

## Feature flags

`src/lib/flags.ts` centralizes feature toggles. Flags can be overridden with environment variables (`NEXT_PUBLIC_FLAG_<NAME>`). The healthcheck feature defaults to enabled.

## Testing

The project uses [Vitest](https://vitest.dev/) with [MSW](https://mswjs.io/) to mock network interactions.

```bash
pnpm test
```

## Proxy healthcheck

The `/healthcheck` route is a lightweight diagnostic screen powered by the proxy route and API client. Use it to verify upstream availability during integration testing.
