import { prisma } from "./client";
import type { MilestoneKind, PostLogRecord } from "@/types/prisma";

export async function logXPost(params: {
  roundId: string;
  milestoneKind: MilestoneKind;
  xPostId: string;
  payload: Record<string, unknown>;
}): Promise<PostLogRecord> {
  return prisma.postLog.create({
    data: {
      roundId: params.roundId,
      milestoneKind: params.milestoneKind,
      xPostId: params.xPostId,
      payloadJson: params.payload,
    },
  });
}

export async function listPostLogs(roundId: string): Promise<PostLogRecord[]> {
  return prisma.postLog.findMany({
    where: { roundId },
    orderBy: { createdAt: "asc" },
  });
}

export async function findPostLog(
  roundId: string,
  milestoneKind: MilestoneKind,
): Promise<PostLogRecord | null> {
  return prisma.postLog.findFirst({
    where: { roundId, milestoneKind },
    orderBy: { createdAt: "desc" },
  });
}
