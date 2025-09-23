// file: src/hooks/useViewTracker.ts
"use client";
import { useEffect, useMemo, useRef } from "react";

import { track, type AnalyticsEvent } from "@/lib/analytics";

const DEFAULT_OPTIONS: IntersectionObserverInit = { threshold: 0.4 };

export function useViewTracker(event: AnalyticsEvent, options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);
  const observerOptions = useMemo<IntersectionObserverInit>(() => ({
    ...DEFAULT_OPTIONS,
    ...options,
  }), [options]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") {
      return;
    }

    let seen = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!seen && entry.isIntersecting) {
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
