"use client";

import { useRef, useState } from "react";
import { applyCaption } from "@/lib/meme";

type Props = {
  onExport?: (blob: Blob) => void;
};

export default function MemeEditor({ onExport }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [caption, setCaption] = useState("");

  async function handleExport() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((value) => resolve(value), "image/png");
    });
    if (blob) onExport?.(blob);
  }

  return (
    <div className="grid gap-3">
      <canvas ref={canvasRef} className="w-full rounded-xl border aspect-square" aria-label="Meme canvas" />
      <input
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        placeholder="Your caption…"
        className="rounded-lg border px-3 py-2 text-sm md:text-base"
      />
      <div className="flex gap-2">
        <button onClick={() => applyCaption(canvasRef.current, caption)} className="rounded-xl border px-3 py-2 text-sm md:text-base">
          Apply Caption
        </button>
        <button onClick={handleExport} className="rounded-xl border px-3 py-2 text-sm md:text-base">
          Export PNG
        </button>
      </div>
    </div>
  );
}
