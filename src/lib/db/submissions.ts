import { prisma } from "./client";
import type { PrismaDbClient } from "./client";
import type { CandidateRecord, SubmissionRecord, SubmissionStatus } from "@/types/prisma";
import { SUBMISSION_STATUS } from "@/types/prisma";

export type SubmissionCreateInput = {
  userId: string;
  imageUrl: string;
  handle: string;
  theme?: string | null;
  context?: string | null;
};

export async function createSubmission(
  input: SubmissionCreateInput,
): Promise<SubmissionRecord> {
  return prisma.submission.create({
    data: {
      userId: input.userId,
      imageUrl: input.imageUrl,
      handle: input.handle,
      theme: input.theme ?? null,
      context: input.context ?? null,
    },
  });
}

export async function listSubmissions(params: {
  status?: SubmissionStatus;
  take?: number;
  cursor?: string | null;
}): Promise<SubmissionRecord[]> {
  const { status, take = 20, cursor } = params;
  return prisma.submission.findMany({
    where: status ? { status } : undefined,
    take,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubmissionById(id: string): Promise<SubmissionRecord | null> {
  return prisma.submission.findUnique({ where: { id } });
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<SubmissionRecord> {
  return prisma.submission.update({
    where: { id },
    data: { status },
  });
}

export async function shortlistSubmission(
  id: string,
  roundId: string,
  rankHint?: number | null,
): Promise<CandidateRecord> {
  return prisma.$transaction(async (tx: PrismaDbClient) => {
    const candidate = await tx.candidate.create({
      data: {
        submissionId: id,
        roundId,
        rankHint: rankHint ?? null,
      },
    });

    await tx.submission.update({
      where: { id },
      data: { status: SUBMISSION_STATUS.shortlisted },
    });

    return candidate;
  });
}

export async function resetShortlist(roundId: string): Promise<void> {
  await prisma.$transaction(async (tx: PrismaDbClient) => {
    const candidates = (await tx.candidate.findMany({
      where: { roundId },
      select: { submissionId: true },
    })) as Array<{ submissionId: string }>;
    await tx.candidate.deleteMany({ where: { roundId } });
    if (candidates.length) {
      await tx.submission.updateMany({
        where: {
          id: {
            in: candidates.map(
              (candidate: { submissionId: string }): string => candidate.submissionId,
            ),
          },
        },
        data: { status: SUBMISSION_STATUS.approved },
      });
    }
  });
}
