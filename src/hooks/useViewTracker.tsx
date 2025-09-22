// file: src/hooks/useViewTracker.ts
"use client";
import { useEffect, useRef } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

const DEFAULT_OPTIONS: IntersectionObserverInit = { threshold: 0.4 };

export function useViewTracker(
  event: AnalyticsEvent,
  options: IntersectionObserverInit = DEFAULT_OPTIONS
) {
  const ref = useRef<HTMLElement | null>(null);
  const optionsRef = useRef<IntersectionObserverInit>(DEFAULT_OPTIONS);

  useEffect(() => {
    optionsRef.current = {
      ...DEFAULT_OPTIONS,
      ...options,
      threshold: Array.isArray(options.threshold)
        ? options.threshold.map((value) => Number(value))
        : options.threshold ?? DEFAULT_OPTIONS.threshold,
    };
  }, [options]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return undefined;

    let seen = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!seen && entry.isIntersecting) {
          seen = true;
          track(event);
          observer.disconnect();
        }
      });
    }, optionsRef.current);

    observer.observe(el);
    return () => observer.disconnect();
  }, [event]);

  return ref;
}
