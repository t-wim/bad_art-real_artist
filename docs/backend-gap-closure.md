# Backend Gap Closure – $BART Core Flows

## Gallery Feed
- Implemented `/api/proxy/artworks` to serve approved & shortlisted submissions from Prisma instead of static mocks.
- Synced frontend data source (`src/lib/api/index.ts`) with the live route, removing the missing proxy mismatch.

## Authentication (X Login)
- Added NextAuth handler with X provider (`src/app/api/auth/[...nextauth]/route.ts`) and JWT strategy to persist sessions.
- Persist/refresh X profiles via Prisma-backed helpers and emitted telemetry for login/logout events.

## Submission Intake
- Replaced stub submission page backend with REST endpoint `/api/submissions` featuring validation and telemetry hooks.
- Stored drag & drop payloads as data URLs tied to the submitting user, ready for moderation workflow.

## Moderation Queue
- Added admin-protected approve/reject endpoints with event tracking and status transitions to `approved`/`rejected`.
- Shortlist endpoint writes candidate rows and updates submission status to `shortlisted` for live rounds.

## Voting (Mirrored)
- Implemented authenticated vote casting (`POST /api/votes`) with candidate guard rails and idempotent upsert.
- Added aggregate endpoint plus background mirror sync job to ingest X poll counts into Vote records.

## Round Lifecycle & Milestones
- Scaffolded round create/start/end APIs with admin gating and milestone cron evaluating t25/t50/t75/final triggers.
- Persisted each milestone trigger and surfaced telemetry for downstream automation.

## Automated X Posts
- Built milestone poster service & dispatcher job that composes copy, posts via X API, logs payloads, and tracks queue/send/error events.

## Telemetry
- Expanded analytics event catalog to cover all flows and added `EventLog` persistence with server-side tracker.

## Data Access Layer
- Introduced Prisma-backed repositories per entity (`src/lib/db/*`) supplying submissions, rounds, votes, mirrors, milestones, post logs, and user helpers.

## Scheduler & Jobs
- Added job runners for poll mirroring, milestone evaluation, and automated X posts, ready for cron wiring (Vercel/GitHub Actions).
