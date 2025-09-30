import { prisma } from "./client";
import type { RoundRecord } from "@/types/prisma";
import { ROUND_STATUS } from "@/types/prisma";

export async function createRound(params: {
  startsAt: Date;
  endsAt: Date;
}): Promise<RoundRecord> {
  return prisma.round.create({
    data: {
      startsAt: params.startsAt,
      endsAt: params.endsAt,
      status: ROUND_STATUS.draft,
    },
  });
}

export async function getRoundById(id: string): Promise<RoundRecord | null> {
  return prisma.round.findUnique({ where: { id } });
}

export async function startRound(id: string): Promise<RoundRecord> {
  const now = new Date();
  return prisma.round.update({
    where: { id },
    data: { status: ROUND_STATUS.active, startsAt: now },
  });
}

export async function endRound(id: string): Promise<RoundRecord> {
  const now = new Date();
  return prisma.round.update({
    where: { id },
    data: { status: ROUND_STATUS.ended, endsAt: now },
  });
}

export async function listActiveRounds(): Promise<RoundRecord[]> {
  return prisma.round.findMany({ where: { status: ROUND_STATUS.active } });
}

export async function listDraftRounds(): Promise<RoundRecord[]> {
  return prisma.round.findMany({ where: { status: ROUND_STATUS.draft } });
}
