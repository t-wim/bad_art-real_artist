// src/lib/analytics/index.ts
export type GalleryEvent =
  | "gallery_load_success"
  | "gallery_load_error"
  | "gallery_load_more_click"
  | "image_render_success"
  | "image_render_error";

export type NavigationEvent =
  | "view_home"
  | "view_about"
  | "view_footer"
  | "view_gallery"
  | "view_teaser_hof"
  | "view_teaser_upload"
  | "view_teaser_voting"
  | "view_teaser_bonus"
  | "teaser_click_hof"
  | "teaser_click_upload"
  | "teaser_click_voting"
  | "teaser_click_bonus"
  | "tooltip_seen_soon"
  | "hover_wobble_teaser"
  | "hover_glitch_bonus"
  | "footer_click_x_main"
  | "footer_click_x_community"
  | "footer_click_dex";

export type AuthEvent = "auth_login_success" | "auth_logout";

export type SubmissionEvent = "submit" | "toast_success" | "toast_fail";

export type ModerationEvent =
  | "moderation_approve"
  | "moderation_reject"
  | "shortlist_top3";

export type VotingEvent = "vote_cast" | "mirror_update";

export type RoundEvent =
  | "round_start"
  | "t25_trigger"
  | "t50_trigger"
  | "t75_trigger"
  | "final_trigger"
  | "round_end";

export type XPostEvent = "x_post_queued" | "x_post_sent" | "x_post_error";

export type AnalyticsEvent =
  | GalleryEvent
  | NavigationEvent
  | AuthEvent
  | SubmissionEvent
  | ModerationEvent
  | VotingEvent
  | RoundEvent
  | XPostEvent;

type Listener = (e: {
  type: AnalyticsEvent;
  payload?: Record<string, unknown>;
  ts: number;
}) => void;
const listeners = new Set<Listener>();

export function track(type: AnalyticsEvent, payload?: Record<string, unknown>) {
  const evt = { type, payload, ts: Date.now() };
  try {
    console.log(`[track] ${type}`, payload ?? {});
  } catch {}
  listeners.forEach((l) => l(evt));
}
export function onTrack(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
