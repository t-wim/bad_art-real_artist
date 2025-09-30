import { prisma } from "./client";
import type { MirrorRecord, MirrorWithRoundRecord } from "@/types/prisma";

export async function listMirrors(): Promise<MirrorWithRoundRecord[]> {
  return prisma.mirror.findMany({ include: { round: true } }) as Promise<
    MirrorWithRoundRecord[]
  >;
}

export async function upsertMirror(params: {
  roundId: string;
  xPollId: string;
}): Promise<MirrorRecord> {
  return prisma.mirror.upsert({
    where: { xPollId: params.xPollId },
    create: {
      roundId: params.roundId,
      xPollId: params.xPollId,
    },
    update: {
      roundId: params.roundId,
    },
  });
}

export async function touchMirror(id: string): Promise<MirrorRecord> {
  return prisma.mirror.update({
    where: { id },
    data: { lastSyncAt: new Date() },
  });
}
