import { prisma } from "@/lib/db";
import type { AnalyticsEvent } from "./index";

type TrackContext = {
  userId?: string | null;
  payload?: Record<string, unknown>;
};

export async function trackServer(
  event: AnalyticsEvent,
  ctx: TrackContext = {},
): Promise<void> {
  try {
    await prisma.eventLog.create({
      data: {
        event,
        userId: ctx.userId ?? null,
        payload: ctx.payload ?? null,
      },
    });
  } catch (error) {
    console.error("[analytics] failed to persist event", event, error);
  }
}
