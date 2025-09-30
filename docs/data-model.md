# Data Model – $BART Platform

This document captures the Prisma schema introduced in `prisma/schema.prisma`.

## Entities

### User

- `id` – cuid primary key.
- `xId` – unique identifier from X (Twitter).
- `handle` – latest @handle (unique).
- `role` – `user` or `admin`, defaults to `user`.
- `createdAt` – audit timestamp.
- Relationships: `submissions`, `votes`.

### Submission

- References the submitting `User`.
- Stores `imageUrl`, `handle`, optional `theme` & `context`.
- Lifecycle tracked via `status` (`pending` → `approved`/`rejected`/`shortlisted`).
- Auto timestamp `createdAt`.

### Round

- Governs competitions with `status` (`draft`, `active`, `ended`).
- Defines schedule using `startsAt` and `endsAt`.
- Owns `candidates`, `votes`, `mirrors`, `milestones`, and `postLogs`.

### Candidate

- Join table between `Round` and `Submission`.
- Optional `rankHint` for editorial ordering (e.g., Top-3).
- Enforces uniqueness of `submissionId` within a `roundId`.

### Vote

- Tracks `source` (`site` vs `x`) and optional `userId` for anonymous votes.
- Enforces one site vote per authenticated user per round via unique index (`roundId`, `userId`).
- `createdAt` timestamp + indexes for analytics.

### Mirror

- Stores `xPollId` for mirrored polls on X.
- `lastSyncAt` records the most recent sync time.

### Milestone

- Flags timeline checkpoints at 25/50/75/final.
- Unique per `roundId + kind`.
- Drives outbound X posts via relation to `PostLog`.

### PostLog

- Persists payloads sent to X for each milestone.
- Composite relation back to `Milestone` (`roundId`, `milestoneKind`).
- `payloadJson` stores rendered template metadata.

### EventLog

- Captures every tracked analytics event for auditing.
- Stores optional `userId` plus JSON payload for downstream sinks.
- Indexed by `createdAt` and `event` for fast filtering.

## Enumerations

- `UserRole` – `user`, `admin`.
- `SubmissionStatus` – `pending`, `approved`, `rejected`, `shortlisted`.
- `RoundStatus` – `draft`, `active`, `ended`.
- `VoteSource` – `site`, `x`.
- `MilestoneKind` – `t25`, `t50`, `t75`, `final`.

## Development Database

- SQLite file lives at `prisma/dev.db` (ignored by git).
- Initial migration: `prisma/migrations/20241011000000_init/migration.sql`.
- Event telemetry extension: `prisma/migrations/20241012000100_event_log/migration.sql`.
- Prisma Client generation requires Prisma CLI binaries. When offline, set `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` before running migrations or generation commands.
