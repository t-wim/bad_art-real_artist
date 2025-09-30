import {
  MILESTONE_EVENT_BY_KIND,
  determinePendingMilestones,
  getRoundWithMilestones,
  listActiveRounds,
  triggerPendingMilestones,
} from "@/lib/services/rounds";
import { trackServer } from "@/lib/telemetry/track";

const DRY_RUN = process.env.JOB_DRY_RUN === "1";

export async function runMilestoneCron(now: Date = new Date()): Promise<void> {
  const rounds = await listActiveRounds();
  for (const round of rounds) {
    const { milestones } = await getRoundWithMilestones(round.id);
    const due = determinePendingMilestones(round, milestones, now);
    if (!due.length) continue;
    if (!DRY_RUN) {
      await triggerPendingMilestones(round.id, due);
    }
    for (const kind of due) {
      const event = MILESTONE_EVENT_BY_KIND[kind];
      await trackServer(event, {
        payload: {
          roundId: round.id,
          dryRun: DRY_RUN,
        },
      });
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMilestoneCron().catch((error) => {
    console.error("[milestone-runner] failed", error);
    process.exitCode = 1;
  });
}
