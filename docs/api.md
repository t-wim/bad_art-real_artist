# Backend API Surface

_All routes use the Next.js App Router (`app/api/**`). Authentication relies on NextAuth sessions; endpoints marked with 🔒 require a valid session._

## Authentication

- `GET /api/auth/[...nextauth]`
- `POST /api/auth/[...nextauth]`

Handled by NextAuth. Supports real X OAuth when credentials are present or a mock credential flow during local development. Emits `auth_login_success` and `auth_logout` events.

## Submissions

- `GET /api/submissions?status=pending&take=20&cursor=...` 🔒 (admin)
  - Lists submissions filtered by status with cursor pagination.
  - Response: `{ items: Submission[], nextCursor: string | null }`
- `POST /api/submissions` 🔒
  - Body: `{ imageDataUrl: string, theme?: string, context?: string }`
  - Persists a `pending` submission for the authenticated user and emits `submit` + `toast_*` events.

## Moderation

- `POST /api/moderation/:id/approve` 🔒 (admin)
- `POST /api/moderation/:id/reject` 🔒 (admin)
  - Transition submissions to `approved`/`rejected` and emit `moderation_*` events.
- `POST /api/rounds/:roundId/shortlist` 🔒 (admin)
  - Body: `{ submissions: [{ id: string, rankHint?: number }] }`
  - Resets and rebuilds the round shortlist; emits `shortlist_top3`.

## Rounds

- `POST /api/rounds` 🔒 (admin)
  - Body: `{ startsAt: string, endsAt: string }`
  - Creates a draft round.
- `POST /api/rounds/:id/start` 🔒 (admin)
  - Activates the round, stamps `startsAt`, emits `round_start`.
- `POST /api/rounds/:id/end` 🔒 (admin)
  - Concludes the round, stamps `endsAt`, emits `round_end`.

## Voting

- `POST /api/votes` 🔒
  - Body: `{ roundId: string, candidateId: string }`
  - Idempotent per user/round; emits `vote_cast`.
- `GET /api/votes/aggregate?roundId=...`
  - Response: `{ results: [{ candidateId, siteCount, xCount, total }] }`
  - Combines site votes and X mirror tallies.

## Gallery Proxy

- `GET /api/proxy/artworks`
  - Fetches remote artworks or falls back to the curated mock dataset for empty feeds.

_All admin-locked endpoints rely on the session role (`session.user.role === "admin"`)._
