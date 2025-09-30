import { prisma, listCandidatesByRound, listMirrors, touchMirror } from "@/lib/db";
import { trackServer } from "@/lib/telemetry/track";
import { VOTE_SOURCE, type MirrorWithRoundRecord, type VoteRecord } from "@/types/prisma";

type PollOption = {
  position: number;
  votes: number;
};

type PollFetcher = (pollId: string) => Promise<PollOption[]>;

const isDryRun = process.env.JOB_DRY_RUN === "1";

async function defaultPollFetcher(pollId: string): Promise<PollOption[]> {
  const bearer = process.env.X_BEARER;
  if (!bearer || isDryRun) {
    return [];
  }
  const response = await fetch(
    `https://api.twitter.com/2/tweets/${pollId}?expansions=attachments.poll_ids&poll.fields=options,voting_status,end_datetime`,
    {
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(`X API error ${response.status}`);
  }
  const json = await response.json();
  const poll = json?.includes?.polls?.[0];
  if (!poll) {
    return [];
  }
  return (poll.options ?? []).map(
    (option: { position: number; votes: number | string }) => ({
      position: option.position,
      votes:
        typeof option.votes === "string" ? parseInt(option.votes, 10) || 0 : option.votes,
    }),
  );
}

async function alignVotes(
  candidateId: string,
  roundId: string,
  desired: number,
): Promise<void> {
  const existing = (await prisma.vote.findMany({
    where: { candidateId, roundId, source: VOTE_SOURCE.x, userId: null },
    orderBy: { createdAt: "asc" },
  })) as VoteRecord[];
  const diff = desired - existing.length;
  if (diff > 0) {
    await prisma.vote.createMany({
      data: Array.from({ length: diff }).map(() => ({
        candidateId,
        roundId,
        source: VOTE_SOURCE.x,
        userId: null,
      })),
    });
  } else if (diff < 0) {
    const toRemove = existing.slice(0, Math.abs(diff)).map((vote) => vote.id);
    await prisma.vote.deleteMany({ where: { id: { in: toRemove } } });
  }
}

function inferPosition(index: number, rankHint: number | null): number {
  if (typeof rankHint === "number" && rankHint > 0) {
    return rankHint;
  }
  return index + 1;
}

export async function syncMirrors(
  fetcher: PollFetcher = defaultPollFetcher,
): Promise<void> {
  const mirrors = await listMirrors();
  for (const mirror of mirrors) {
    await syncSingleMirror(mirror, fetcher);
  }
}

async function syncSingleMirror(
  mirror: MirrorWithRoundRecord,
  fetcher: PollFetcher,
): Promise<void> {
  try {
    const options = await fetcher(mirror.xPollId);
    const optionMap = new Map(options.map((option) => [option.position, option.votes]));
    const candidates = await listCandidatesByRound(mirror.roundId);
    for (const [index, candidate] of candidates.entries()) {
      const position = inferPosition(index, candidate.rankHint);
      const votes = optionMap.get(position) ?? 0;
      if (isDryRun) continue;
      await alignVotes(candidate.id, candidate.roundId, votes);
    }
    if (!isDryRun) {
      await touchMirror(mirror.id);
    }
    await trackServer("mirror_update", {
      payload: { roundId: mirror.roundId, mirrorId: mirror.id, dryRun: isDryRun },
    });
  } catch (error) {
    console.error("[mirror-sync]", mirror.xPollId, error);
  }
}
