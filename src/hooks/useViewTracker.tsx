// file: src/hooks/useViewTracker.ts
"use client";
import { useEffect, useRef } from "react";
import { track, AnalyticsEvent } from "@/lib/analytics";

export function useViewTracker(
  event: AnalyticsEvent,
  options: IntersectionObserverInit = { threshold: 0.4 },
) {
  const ref = useRef<HTMLElement | null>(null);
  const { root, rootMargin, threshold } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    let seen = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!seen && e.isIntersecting) {
            seen = true;
            track(event);
            io.disconnect();
          }
        });
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [event, root, rootMargin, threshold]);
  return ref;
}
