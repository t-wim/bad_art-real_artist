import { prisma } from "./client";
import type { CandidateRecord } from "@/types/prisma";

export async function listCandidatesByRound(roundId: string): Promise<CandidateRecord[]> {
  return prisma.candidate.findMany({
    where: { roundId },
    include: { submission: true },
    orderBy: [{ rankHint: "asc" }],
  }) as Promise<CandidateRecord[]>;
}

export async function clearCandidatesForRound(roundId: string) {
  await prisma.candidate.deleteMany({ where: { roundId } });
}

export async function getCandidateById(id: string): Promise<CandidateRecord | null> {
  return prisma.candidate.findUnique({
    where: { id },
    include: { submission: true },
  }) as Promise<CandidateRecord | null>;
}
