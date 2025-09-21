"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { onTrack } from "@/lib/analytics";

type Row = { type: string; payload?: Record<string, unknown>; ts: number };

export default function EventHud() {
  const [rows, setRows] = useState<Row[]>([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onTrack((e) => {
      if (paused) return;
      setRows((r) => [...r, e].slice(-200));
    });
  }, [paused]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [rows.length]);

  const filtered = useMemo(
    () => rows.filter((r) => (filter ? r.type.includes(filter) : true)),
    [rows, filter]
  );

  return (
    <div className="fixed bottom-3 right-3 z-[50] w-[min(90vw,420px)] bg-white/95 border border-bart-gray/30 rounded-xl shadow-lg">
      <div className="px-3 py-2 flex items-center gap-2 border-b border-bart-gray/20">
        <strong className="font-comic text-sm">Event HUD</strong>
        <input
          placeholder="filter (e.g. view_, teaser_click)"
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          className="flex-1 text-xs px-2 py-1 border rounded"
        />
        <button className="text-xs font-comic px-2 py-1 border rounded" onClick={() => setPaused((p: boolean) => !p)}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button className="text-xs font-comic px-2 py-1 border rounded" onClick={() => setRows([])}>Clear</button>
        <button
          className="text-xs font-comic px-2 py-1 border rounded"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(filtered, null, 2))}
        >
          Copy
        </button>
      </div>
      <div className="max-h-[40vh] overflow-auto text-xs font-mono p-2 leading-relaxed">
        {filtered.map((r, i) => (
          <div key={i} className="border-b border-bart-gray/10 py-1">
            <span className="font-bold">{r.type}</span>
            <span className="opacity-60"> · {new Date(r.ts).toLocaleTimeString()}</span>
            {r.payload ? <pre className="whitespace-pre-wrap">{JSON.stringify(r.payload)}</pre> : null}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
