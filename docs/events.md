# Event Catalogue

| Event                | Trigger                     | Payload Keys                         |
| -------------------- | --------------------------- | ------------------------------------ |
| `auth_login_success` | Successful NextAuth sign-in | `userId`                             |
| `auth_logout`        | NextAuth sign-out           | `userId`                             |
| `submit`             | Submission created          | `userId`, `submissionId`             |
| `toast_success`      | Submission success toast    | `userId`, `submissionId`             |
| `toast_fail`         | Submission validation fail  | `userId`, `reason`                   |
| `moderation_approve` | Admin approves submission   | `userId`, `submissionId`             |
| `moderation_reject`  | Admin rejects submission    | `userId`, `submissionId`             |
| `shortlist_top3`     | Admin shortlists round      | `userId`, `roundId`, `submissions[]` |
| `vote_cast`          | Site vote recorded          | `userId`, `roundId`, `candidateId`   |
| `mirror_update`      | Mirror sync job completes   | `roundId`, `mirrorId`, `dryRun?`     |
| `round_start`        | Round activation            | `userId`, `roundId`                  |
| `t25_trigger`        | 25% milestone fired         | `roundId`, `dryRun?`                 |
| `t50_trigger`        | 50% milestone fired         | `roundId`, `dryRun?`                 |
| `t75_trigger`        | 75% milestone fired         | `roundId`, `dryRun?`                 |
| `final_trigger`      | Final milestone fired       | `roundId`, `dryRun?`                 |
| `round_end`          | Round completion            | `userId`, `roundId`                  |
| `x_post_queued`      | Post queued                 | `roundId`, `milestone`               |
| `x_post_sent`        | Post succeeded              | `roundId`, `milestone`, `postId`     |
| `x_post_error`       | Post failed                 | `roundId`, `milestone`, `error`      |

All events persist in `EventLog` via `trackServer` and appear in server logs for quick auditing.
