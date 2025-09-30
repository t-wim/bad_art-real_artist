# Core Backend Flows

## X Login → Session

1. User clicks “Log in with X”.
2. NextAuth either:
   - Uses the real X OAuth flow (when `X_CLIENT_*` + `X_BEARER` are present), or
   - Falls back to the mock credential flow for local testing.
3. `syncUserFromX` persists/updates the user, applies admin allow-listing, emits `auth_login_success`.
4. Session JWT is enriched with `user.id`, `user.handle`, `user.role` for guards across the app.

## Submission Intake

1. Authenticated user uploads artwork (PNG/JPG data URL) via `/api/submissions`.
2. Zod validates payload → `submitArtwork` writes `Submission(pending)`.
3. Telemetry fires `submit` + `toast_success`/`toast_fail`.
4. Admins fetch pending submissions via `GET /api/submissions?status=pending`.

## Moderation & Shortlist

1. Admin approves/rejects submissions through moderation endpoints.
2. Shortlisting a round resets previous picks and creates up to three `Candidate` records.
3. Events: `moderation_approve`, `moderation_reject`, `shortlist_top3`.

## Voting (Site + X Mirror)

1. Authenticated users vote with `POST /api/votes` (idempotent per round/user).
2. Mirror job (`runMirrorSync`) aligns X poll counts with the database, storing X votes as `source = "x"`.
3. Aggregation endpoint merges site + X counts for live leaderboards.

## Round Lifecycle & Milestones

1. Admin creates draft rounds → activates via `/api/rounds/:id/start` (stamps `startsAt`).
2. Milestone cron (`runMilestoneCron`) computes 25/50/75/final thresholds, writing `Milestone` entries once per checkpoint and emitting `round_*` + `t*_trigger` events.
3. Rounds end via `/api/rounds/:id/end`, stamping `endsAt` and emitting `round_end`.

## Automated X Posts

1. `runXPostDispatch` inspects recent milestones and existing `PostLog` entries.
2. For unposted milestones, `queueMilestonePost` composes copy, posts to X (or logs a mock) and records idempotent `PostLog` rows.
3. Events: `x_post_queued`, `x_post_sent`, `x_post_error`.

## Telemetry Backbone

- Client-side `track` logs to console & listeners.
- Server-side `trackServer` persists events to `EventLog` with optional `userId` + payload.
- All flows emit their respective events to support analytics dashboards.
