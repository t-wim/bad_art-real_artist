// file: src/hooks/useViewTracker.ts
"use client";
import { useEffect, useMemo, useRef } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

export function useViewTracker(event: AnalyticsEvent, options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const observerOptions = useMemo<IntersectionObserverInit>(
    () => options ?? { threshold: 0.4 },
    [options],
  );
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
    }, observerOptions);
    io.observe(el);
    return () => io.disconnect();
  }, [event, observerOptions]);
  return ref;
}
