// file: src/hooks/useImageStatus.ts
"use client";
import { useState, useCallback } from "react";
import { track } from "@/lib/analytics";

export function useImageStatus(id: string) {
  const [failed, setFailed] = useState(false);
  const onLoad = useCallback(() => track("image_render_success", { id }), [id]);
  const onError = useCallback(() => { setFailed(true); track("image_render_error", { id }); }, [id]);
  return { failed, onLoad, onError };
}
