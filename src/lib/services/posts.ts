import { findPostLog, logXPost } from "@/lib/db";
import { trackServer } from "@/lib/telemetry/track";
import type { MilestoneKind, PostLogRecord } from "@/types/prisma";
import { composeMilestoneCopy, deliverMilestonePost, type Leader } from "@/lib/x/poster";

export type QueueMilestoneParams = {
  roundId: string;
  milestone: MilestoneKind;
  leaders: Leader[];
};

export function createPostIdempotencyKey(
  roundId: string,
  milestone: MilestoneKind,
): string {
  return `${roundId}:${milestone}`;
}

export async function queueMilestonePost(
  params: QueueMilestoneParams,
): Promise<PostLogRecord> {
  const existing = await findPostLog(params.roundId, params.milestone);
  if (existing) {
    return existing;
  }

  await trackServer("x_post_queued", {
    payload: { roundId: params.roundId, milestone: params.milestone },
  });

  const text = composeMilestoneCopy(params);
  try {
    const { postId, payload } = await deliverMilestonePost(text);
    const log = await logXPost({
      roundId: params.roundId,
      milestoneKind: params.milestone,
      xPostId: postId,
      payload: { ...payload, text, leaders: params.leaders },
    });
    await trackServer("x_post_sent", {
      payload: { roundId: params.roundId, milestone: params.milestone, postId },
    });
    return log;
  } catch (error) {
    await trackServer("x_post_error", {
      payload: {
        roundId: params.roundId,
        milestone: params.milestone,
        error: String(error),
      },
    });
    throw error;
  }
}
