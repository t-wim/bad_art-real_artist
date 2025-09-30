import { prisma } from "./client";
import type {
  VoteAggregate,
  VoteAggregateBySource,
  VoteRecord,
  VoteSource,
} from "@/types/prisma";

export async function castVote(params: {
  roundId: string;
  candidateId: string;
  userId?: string | null;
  source: VoteSource;
}): Promise<VoteRecord> {
  const { roundId, candidateId, userId, source } = params;
  if (userId) {
    return prisma.vote.upsert({
      where: {
        roundId_userId: {
          roundId,
          userId,
        },
      },
      update: {
        candidateId,
        source,
      },
      create: {
        roundId,
        candidateId,
        userId,
        source,
      },
    });
  }

  return prisma.vote.create({
    data: {
      roundId,
      candidateId,
      userId: null,
      source,
    },
  });
}

export async function getVoteAggregate(roundId: string): Promise<VoteAggregate[]> {
  const votes = (await prisma.vote.groupBy({
    by: ["candidateId"],
    where: { roundId },
    _count: { _all: true },
  })) as Array<{ candidateId: string; _count: { _all: number } }>;

  return votes.map(
    (v: { candidateId: string; _count: { _all: number } }): VoteAggregate => ({
      candidateId: v.candidateId,
      count: v._count._all,
    }),
  );
}

export async function countVotesBySource(
  roundId: string,
): Promise<VoteAggregateBySource[]> {
  const votes = (await prisma.vote.groupBy({
    by: ["candidateId", "source"],
    where: { roundId },
    _count: { _all: true },
  })) as Array<{ candidateId: string; source: VoteSource; _count: { _all: number } }>;

  return votes.map(
    (v: {
      candidateId: string;
      source: VoteSource;
      _count: { _all: number };
    }): VoteAggregateBySource => ({
      candidateId: v.candidateId,
      source: v.source,
      count: v._count._all,
    }),
  );
}
