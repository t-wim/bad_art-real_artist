// file: src/hooks/useViewTracker.ts
"use client";
import { useEffect, useRef } from "react";
import { track, AnalyticsEvent } from "@/lib/analytics";

export function useViewTracker(event: AnalyticsEvent, options: IntersectionObserverInit = { threshold: 0.4 }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    let seen = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!seen && e.isIntersecting) {
          seen = true;
          track(event);
          io.disconnect();
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [event, options.root, options.rootMargin, options.threshold]);
  return ref;
}
