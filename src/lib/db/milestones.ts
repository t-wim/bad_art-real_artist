import { prisma } from "./client";
import type { MilestoneKind, MilestoneRecord } from "@/types/prisma";

export async function triggerMilestone(params: {
  roundId: string;
  kind: MilestoneKind;
}): Promise<MilestoneRecord> {
  return prisma.milestone.upsert({
    where: {
      roundId_kind: {
        roundId: params.roundId,
        kind: params.kind,
      },
    },
    create: {
      roundId: params.roundId,
      kind: params.kind,
    },
    update: {},
  });
}

export async function listMilestones(roundId: string): Promise<MilestoneRecord[]> {
  return prisma.milestone.findMany({
    where: { roundId },
    orderBy: { triggeredAt: "asc" },
  });
}
