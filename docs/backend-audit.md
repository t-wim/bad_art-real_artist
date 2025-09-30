# Backend Audit – Missing Implementations

## Gallery Feed
- **[UNWIRED] src/lib/api/index.ts → /api/proxy/artworks**  
  Frontend fetches `/api/proxy/artworks`, but App Router only exposes `/api/artworks`; the call falls back to mock data.  
  **Betroffen:** `gallery_load_success`, `gallery_load_error`
- **[PLACEHOLDER] src/app/api/artworks/route.ts**  
  Route returns hard-coded Base64 mocks instead of querying Prisma or an upstream feed.  
  **Betroffen:** `gallery_load_success`

## Authentication (X Login)
- **[MISSING] src/app/api**  
  No NextAuth handler or OAuth routes exist; `src/lib/auth/index.ts` only defines types/utilities without session persistence.  
  **Betroffen:** `auth_login_success`, `auth_logout`

## Submission Intake
- **[MISSING] src/app/submit/page.tsx**  
  Submit page is a placeholder without form, upload, or validation logic.  
  **Betroffen:** `submit`, `toast_success`, `toast_fail`
- **[MISSING] src/app/api**  
  Absent POST endpoint for submissions; no storage adapter beyond the stubbed `lib/upload.ts`.  
  **Betroffen:** `submit`, `toast_success`, `toast_fail`

## Moderation Queue
- **[MISSING] src/app**  
  No admin UI or API routes for approving/rejecting submissions or managing shortlist.  
  **Betroffen:** `moderation_approve`, `moderation_reject`, `shortlist_top3`

## Voting (Site + X Mirror)
- **[MISSING] src/app/api**  
  No voting endpoints; only an in-memory helper `lib/voting.ts` without persistence or guards.  
  **Betroffen:** `vote_cast`
- **[MISSING] jobs/**  
  Mirror sync job absent; no service consumes `Mirror` model to import X poll counts.  
  **Betroffen:** `mirror_update`

## Round Lifecycle & Milestones
- **[MISSING] src/app/api**  
  No controllers for creating/updating rounds or advancing lifecycle states.  
  **Betroffen:** `round_start`, `round_end`
- **[MISSING] cron/**  
  No scheduler to trigger t25/t50/t75/final milestones or write `Milestone` records.  
  **Betroffen:** `t25_trigger`, `t50_trigger`, `t75_trigger`, `final_trigger`

## Automated X Posts
- **[MISSING] src/lib/x**  
  Module only resolves credentials; lacks posting templates, queueing, or PostLog writers.  
  **Betroffen:** `x_post_queued`, `x_post_sent`, `x_post_error`

## Telemetry
- **[INCOMPLETE] src/lib/analytics/index.ts**  
  Event list limited to gallery/view interactions; required backend events for submissions, moderation, voting, rounds, and X posts are absent.  
  **Betroffen:** alle genannten Flow-Events

## Data Access Layer
- **[INCOMPLETE] src/lib/db**  
  Only Prisma client exported; no repositories/services for Submission, Round, Candidate, Vote, Mirror, Milestone, PostLog models defined in `prisma/schema.prisma`.  
  **Betroffen:** submit, moderation, vote, mirror, round, milestone, x_post flows

## Scheduler & Jobs
- **[MISSING] jobs/**  
  Repository lacks background job runners for milestone triggers, poll sync, or automated posts.  
  **Betroffen:** `mirror_update`, `t*_trigger`, `x_post_*`

## Summary
- Gallery Feed: 2 findings  
- Authentication: 1 finding  
- Submission: 2 findings  
- Moderation: 1 finding  
- Voting: 2 findings  
- Round Lifecycle: 2 findings  
- Automated X Posts: 1 finding  
- Telemetry: 1 finding  
- Data Access Layer: 1 finding  
- Scheduler & Jobs: 1 finding
