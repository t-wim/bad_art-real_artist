// =============================
// File pack: Playground chat UI + proxy route
// Next.js (App Router), React 18/19 compatible, Tailwind CSS
// Drop the snippets into their respective paths.
// =============================

// --- file: app/playground/page.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// Types
type Role = "user" | "assistant" | "system" | "tool";
export type ChatMessage = { id: string; role: Role; content: string };

function uid() {
  return Math.random().toString(36).slice(2);
}

function classNames(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

// Chat bubble component (mirrors the project chat style: rounded, compact, left/right aligned)
function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const isAssistant = msg.role === "assistant";
  const isSystem = msg.role === "system";
  return (
    <div className={classNames("flex w-full gap-3", isUser && "justify-end")}
      data-role={msg.role}
    >
      {!isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
          {isSystem ? "SYS" : "AI"}
        </div>
      )}
      <div
        className={classNames(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
          isUser && "bg-blue-600 text-white rounded-br-md",
          isAssistant && "bg-white text-gray-900 border border-gray-200",
          isSystem && "bg-amber-50 text-amber-900 border border-amber-200"
        )}
      >
        <pre className="whitespace-pre-wrap break-words font-sans leading-relaxed">{msg.content}</pre>
      </div>
      {isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
          DU
        </div>
      )}
    </div>
  );
}

function ChatComposer({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [val, setVal] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  function submit() {
    const text = val.trim();
    if (!text) return;
    onSend(text);
    setVal("");
    taRef.current?.focus();
  }

  return (
    <div className="border-t border-gray-200 p-3">
      <div className="flex gap-2">
        <textarea
          ref={taRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Frage eingeben … (Senden: Ctrl/⌘ + Enter)"
          rows={3}
          className="flex-1 resize-none rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={submit}
          disabled={disabled || !val.trim()}
          className={classNames(
            "h-[3.75rem] rounded-xl px-4 font-medium shadow-sm",
            disabled || !val.trim() ? "bg-gray-200 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          Senden
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">Tip: Mit <kbd className="rounded border border-gray-300 bg-gray-50 px-1">Ctrl</kbd> + <kbd className="rounded border border-gray-300 bg-gray-50 px-1">Enter</kbd> senden.</p>
    </div>
  );
}

async function callPlayground(messages: ChatMessage[]) {
  const res = await fetch("/api/playground", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Playground ${res.status}: ${t}`);
  }
  // Supports two shapes: {reply} or {message}
  const data = await res.json();
  if (typeof data?.reply === "string") {
    return { id: uid(), role: "assistant" as const, content: data.reply };
  }
  if (data?.message?.content) return data.message as ChatMessage;
  return { id: uid(), role: "assistant" as const, content: JSON.stringify(data, null, 2) };
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: uid(), role: "system", content: "Du bist ein hilfreicher Assistent im Bart-Workflow Playground." },
  ]);
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(text: string) {
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setPending(true);
    try {
      const aiMsg = await callPlayground([...messages, userMsg]);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: `Fehler: ${err?.message ?? err}` },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col rounded-2xl border border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold">Playground</h1>
        <div className="text-xs text-gray-500">Status: {pending ? "sendet…" : "bereit"}</div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatComposer onSend={handleSend} disabled={pending} />
    </div>
  );
}

// --- file: app/api/playground/route.ts
// Proxied API endpoint so der Browser keine CORS-/Origin-Probleme mit dem Backend hat.
import { NextRequest } from "next/server";

function strim(s: string) { return s.replace(/\/+$/, ""); }

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const base = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4400/v1";
  const path = process.env.PLAYGROUND_PATH || "/playground"; // passe an: z.B. "/chat" oder "/chat/completions"
  const url = strim(base) + path;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Forward auth headers if present
      Authorization: req.headers.get("authorization") || "",
    },
    body: JSON.stringify(body),
  });

  // Transparente Durchleitung
  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}

export async function GET() {
  // Optional: Health-Check → leitet zu /health des Backends weiter, falls vorhanden
  const base = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4400/v1";
  const health = process.env.HEALTH_PATH || "/health";
  const url = strim(base) + health;
  try {
    const r = await fetch(url, { cache: "no-store" });
    const ok = r.ok;
    return Response.json({ ok, upstream: url }, { status: ok ? 200 : 502 });
  } catch (e: any) {
    return Response.json({ ok: false, upstream: url, error: String(e?.message || e) }, { status: 502 });
  }
}

//