import {
  castVote,
  countVotesBySource,
  getCandidateById,
  getVoteAggregate,
} from "@/lib/db";
import { VOTE_SOURCE, type VoteRecord } from "@/types/prisma";

export type VoteAggregateEntry = {
  candidateId: string;
  siteCount: number;
  xCount: number;
  total: number;
};

type VoteInput = {
  roundId: string;
  candidateId: string;
  userId: string;
};

export async function recordSiteVote(input: VoteInput): Promise<VoteRecord> {
  const candidate = await getCandidateById(input.candidateId);
  if (!candidate || candidate.roundId !== input.roundId) {
    throw new Error("CANDIDATE_MISMATCH");
  }

  return castVote({
    roundId: input.roundId,
    candidateId: input.candidateId,
    userId: input.userId,
    source: VOTE_SOURCE.site,
  });
}

export async function aggregateVotes(roundId: string): Promise<VoteAggregateEntry[]> {
  const [totals, sources] = await Promise.all([
    getVoteAggregate(roundId),
    countVotesBySource(roundId),
  ]);
  return mergeVoteAggregates(
    totals.map((entry) => ({ candidateId: entry.candidateId, count: entry.count })),
    sources.map((entry) => ({
      candidateId: entry.candidateId,
      source: entry.source,
      count: entry.count,
    })),
  );
}

type Total = { candidateId: string; count: number };

type BySource = { candidateId: string; source: string; count: number };

export function mergeVoteAggregates(
  totals: Total[],
  bySource: BySource[],
): VoteAggregateEntry[] {
  const result = new Map<string, VoteAggregateEntry>();
  for (const total of totals) {
    result.set(total.candidateId, {
      candidateId: total.candidateId,
      siteCount: 0,
      xCount: 0,
      total: total.count,
    });
  }

  for (const entry of bySource) {
    const aggregate = result.get(entry.candidateId) ?? {
      candidateId: entry.candidateId,
      siteCount: 0,
      xCount: 0,
      total: 0,
    };
    if (entry.source === VOTE_SOURCE.site) {
      aggregate.siteCount = entry.count;
    } else if (entry.source === VOTE_SOURCE.x) {
      aggregate.xCount = entry.count;
    }
    aggregate.total = Math.max(aggregate.total, aggregate.siteCount + aggregate.xCount);
    result.set(entry.candidateId, aggregate);
  }

  for (const aggregate of result.values()) {
    aggregate.total = Math.max(aggregate.total, aggregate.siteCount + aggregate.xCount);
  }

  return Array.from(result.values()).sort((a, b) =>
    a.candidateId.localeCompare(b.candidateId),
  );
}
