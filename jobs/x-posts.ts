import { listCandidatesByRound, listMilestones, listPostLogs } from "@/lib/db";
import { listActiveRounds } from "@/lib/services/rounds";
import { queueMilestonePost } from "@/lib/services/posts";
import { aggregateVotes } from "@/lib/services/votes";

export async function runXPostDispatch(): Promise<void> {
  const rounds = await listActiveRounds();
  for (const round of rounds) {
    const milestones = await listMilestones(round.id);
    const logs = await listPostLogs(round.id);
    const posted = new Set(logs.map((log) => log.milestoneKind));

    const aggregates = await aggregateVotes(round.id);
    const votesMap = new Map(aggregates.map((entry) => [entry.candidateId, entry.total]));

    const candidates = await listCandidatesByRound(round.id);
    const leaders = candidates
      .map((candidate) => ({
        handle: candidate.submission.handle,
        imageUrl: candidate.submission.imageUrl,
        score: votesMap.get(candidate.id) ?? 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    for (const milestone of milestones) {
      if (posted.has(milestone.kind)) continue;
      await queueMilestonePost({
        roundId: round.id,
        milestone: milestone.kind,
        leaders,
      });
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runXPostDispatch().catch((error) => {
    console.error("[x-posts] failed", error);
    process.exitCode = 1;
  });
}
