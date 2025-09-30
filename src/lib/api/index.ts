// src/lib/api/index.ts
import { ArtworkList, TArtworkList, TArtwork } from "../utils/contracts";

export type DataSource = "mock" | "api";

const DEFAULT_LIMIT = 12;

function envSource(): DataSource {
  const v = String(process.env.NEXT_PUBLIC_DATASOURCE || "mock").toLowerCase();
  return v === "api" ? "api" : "mock";
}

export async function getArtworks(params?: {
  limit?: number;
  cursor?: string | null;
  source?: DataSource;
}): Promise<TArtworkList> {
  const limit = params?.limit ?? DEFAULT_LIMIT;
  const cursor = params?.cursor ?? null;
  const source = params?.source ?? envSource();

  if (source === "mock") return fromMock(limit, cursor ?? undefined);
  return fromApi(limit, cursor ?? undefined);
}

/** ---- API (Proxy) – robust gegen Timeouts & leicht tolerant beim Shape ---- */
async function fromApi(limit = DEFAULT_LIMIT, cursor?: string): Promise<TArtworkList> {
  const url = `/api/proxy/artworks?limit=${encodeURIComponent(limit)}${
    cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""
  }`;

  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), 8000);

  try {
    const res = await fetch(url, { method: "GET", cache: "no-store", signal: ac.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
    const json = await res.json();

    const safeItems = Array.isArray(json?.items)
      ? json.items
          .map((value: unknown): TArtwork | null => normalizeRawArtwork(value))
          .filter((item: TArtwork | null): item is TArtwork => item !== null)
      : [];

    const safe: TArtworkList = {
      items: safeItems,
      nextCursor: json?.nextCursor == null ? null : String(json.nextCursor),
    };

    return ArtworkList.parse(safe);
  } catch (err: unknown) {
    console.warn("[lib/api] failed to fetch artworks", err);
    // Fallback: leere Liste statt Hard-Crash – UI bleibt renderbar
    const fallback: TArtworkList = { items: [], nextCursor: null };
    return ArtworkList.parse(fallback);
  } finally {
    clearTimeout(to);
  }
}

/** ---- MOCK (lokal) – cursor = "page-N" (N ab 1); 3 farbige Platzhalter ---- */
async function fromMock(limit = DEFAULT_LIMIT, cursor?: string): Promise<TArtworkList> {
  // Mini-Dataset (Base64 Tiny PNGs)
  const pool: TArtwork[] = [
    {
      id: "m1",
      title: "Neon Doodle",
      author: "Mock Artist",
      mime: "image/png",
      imageBase64:
        "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAI0lEQVQoU2NkYGBg+M8ABYwMjIwgFoYmBqYGigBkA1OwEAwAwZgswM6AQBwAAAABJRU5ErkJggg==",
      createdAt: new Date().toISOString(),
    },
    {
      id: "m2",
      title: "Green Glitch",
      author: "Mock User",
      mime: "image/png",
      imageBase64:
        "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIklEQVQoU2NkYGBg+A8EwDiQYGBg+M/AwPCfgYGB4T8DAwMAAAxRAwFVrD3RAAAAAElFTkSuQmCC",
      createdAt: new Date().toISOString(),
    },
    {
      id: "m3",
      title: "Blue Tape",
      author: "Anonymous",
      mime: "image/png",
      imageBase64:
        "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQoU2NkQAP///8/AwPDfwYGBgYGBob///8ZGBgYAwCGEA0r6r3xNwAAAABJRU5ErkJggg==",
      createdAt: new Date().toISOString(),
    },
  ];

  // simple paging über cursor "page-N"
  const page = parseCursor(cursor);
  const start = (page - 1) * limit;
  const slice = cycle(pool, limit, start);

  const nextCursor = start + limit >= start + slice.length ? `page-${page + 1}` : null;

  return ArtworkList.parse({ items: slice, nextCursor });
}

function parseCursor(cursor?: string): number {
  if (!cursor) return 1;
  const m = /^page-(\d+)$/.exec(cursor);
  const n = m ? parseInt(m[1], 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function cycle<T>(arr: T[], count: number, offset = 0): T[] {
  const out: T[] = [];
  for (let i = 0; i < count; i++) out.push(arr[(offset + i) % arr.length]);
  return out;
}

/** ---- Normalizer: gleicht key-casing & values an den Contract an ---- */
function normalizeRawArtwork(x: unknown): TArtwork | null {
  if (!x || typeof x !== "object" || x === null) return null;

  const raw = x as Record<string, unknown>;

  const id = raw["id"] != null ? String(raw["id"]) : "";
  const title = raw["title"] != null ? String(raw["title"]) : "Untitled";
  const author = raw["author"] != null ? String(raw["author"]) : undefined;

  const mimeCandidate = raw["mime"] ?? raw["MIME"] ?? raw["contentType"] ?? "image/png";
  const rawMime = String(mimeCandidate).toLowerCase();
  const mime: TArtwork["mime"] = rawMime.includes("jpeg")
    ? "image/jpeg"
    : rawMime.includes("webp")
      ? "image/webp"
      : "image/png";

  const base64Candidate =
    raw["imageBase64"] ?? raw["imagebase64"] ?? raw["data"] ?? raw["base64"] ?? "";
  const imageBase64 = String(base64Candidate);

  const createdAt = raw["createdAt"] ? String(raw["createdAt"]) : undefined;

  if (!id || !imageBase64) return null;
  return { id, title, author, mime, imageBase64, createdAt };
}
