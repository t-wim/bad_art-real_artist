// src/lib/analytics.ts
export type AnalyticsEvent =
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
  | "gallery_load_success"
  | "gallery_load_error"
  | "gallery_load_more_click"
  | "image_render_success"
  | "image_render_error"
  | "footer_click_x_main"
  | "footer_click_x_community"
  | "footer_click_dex";

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
