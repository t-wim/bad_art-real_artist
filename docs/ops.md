# Operations Playbook

## Scheduled Jobs

| Job               | Script                                           | Purpose                                                                               | Trigger Strategy                                                       | Idempotency                                                                                     |
| ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Milestone runner  | `pnpm jobs:dry-run` → `jobs/milestone-runner.ts` | Computes 25/50/75/final checkpoints for active rounds and writes `Milestone` records. | Cron (Vercel / GitHub) every minute; CI runs dry with `JOB_DRY_RUN=1`. | `Milestone` has a unique `(roundId, kind)` pair so repeated executions no-op after first write. |
| Mirror sync       | `jobs/mirror-sync.ts`                            | Reads X poll counts and mirrors them into `Vote` rows with `source = "x"`.            | Cron every few minutes; respects `JOB_DRY_RUN`.                        | Diff-based upsert/delete keeps counts aligned; no double counting.                              |
| X post dispatcher | `jobs/x-posts.ts`                                | Queues milestone posts via `queueMilestonePost` and logs `PostLog` entries.           | Cron every few minutes post-milestone.                                 | `findPostLog` check + milestone key ensures each milestone posts once.                          |

All jobs honour `JOB_DRY_RUN=1`, skipping external writes while still emitting telemetry.

## Environment

- `DATABASE_URL` – SQLite (dev) / Postgres (prod).
- `NEXTAUTH_SECRET`
- `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_BEARER` – optional in dev; enable real X integrations when provided.
- `ADMIN_HANDLES` – comma-separated `@handle` allow-list for auto-admin promotion.

## Deployment Notes

- CI pipeline runs `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm jobs:dry-run` to verify scripts without network I/O.
- Production cron can be wired via Vercel Scheduled Functions or GitHub Actions `schedule` triggers invoking the job scripts with the real environment.
- Prisma migrations remain local-only; CI performs `prisma generate` with checksum override.
