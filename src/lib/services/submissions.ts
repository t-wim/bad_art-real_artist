import {
  createSubmission,
  listSubmissions,
  resetShortlist,
  shortlistSubmission,
  updateSubmissionStatus,
} from "@/lib/db";
import {
  SUBMISSION_STATUS,
  type CandidateRecord,
  type SubmissionRecord,
  type SubmissionStatus,
} from "@/types/prisma";

type SubmissionInput = {
  userId: string;
  handle: string;
  imageUrl: string;
  theme?: string | null;
  context?: string | null;
};

type Pagination = {
  status?: SubmissionStatus;
  cursor?: string | null;
  take?: number;
};

type ShortlistItem = {
  id: string;
  rankHint?: number | null;
};

export async function submitArtwork(input: SubmissionInput): Promise<SubmissionRecord> {
  return createSubmission({
    userId: input.userId,
    handle: input.handle,
    imageUrl: input.imageUrl,
    theme: input.theme ?? null,
    context: input.context ?? null,
  });
}

export async function listSubmissionsByStatus(
  params: Pagination,
): Promise<{ items: SubmissionRecord[]; nextCursor: string | null }> {
  const submissions = await listSubmissions(params);
  const limit = params.take ?? submissions.length;
  const nextCursor =
    submissions.length === limit && submissions.length > 0
      ? submissions[submissions.length - 1].id
      : null;
  return { items: submissions, nextCursor };
}

export async function approveSubmission(id: string): Promise<SubmissionRecord> {
  return updateSubmissionStatus(id, SUBMISSION_STATUS.approved);
}

export async function rejectSubmission(id: string): Promise<SubmissionRecord> {
  return updateSubmissionStatus(id, SUBMISSION_STATUS.rejected);
}

export async function shortlistRound(
  roundId: string,
  submissions: ShortlistItem[],
): Promise<CandidateRecord[]> {
  await resetShortlist(roundId);
  const created: CandidateRecord[] = [];
  for (const entry of submissions) {
    const candidate = await shortlistSubmission(entry.id, roundId, entry.rankHint);
    created.push(candidate);
  }
  return created;
}
