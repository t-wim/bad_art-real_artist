import { track as trackClient, type AnalyticsEvent } from "@/lib/analytics";
import { trackServer as persistEvent } from "@/lib/analytics/server";

type TrackContext = {
  userId?: string | null;
  payload?: Record<string, unknown>;
};

export type TelemetryEvent = AnalyticsEvent;

export function track(event: TelemetryEvent, payload?: Record<string, unknown>): void {
  trackClient(event, payload);
}

export async function trackServer(
  event: TelemetryEvent,
  context: TrackContext = {},
): Promise<void> {
  await persistEvent(event, context);
}
