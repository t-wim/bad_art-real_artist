// file: src/components/gallery/GalleryGrid.tsx  (mit Frames)
"use client";
import { useEffect, useMemo, useState } from "react";
// ❌ Alte Card nicht mehr nötig (wir rahmen direkt)
// import ArtworkCard from "./ArtworkCard";
import { track } from "@/lib/analytics";
import { getArtworks } from "@/lib/api";
import type { TArtwork } from "@/lib/contracts";
import { useViewTracker } from "@/hooks/useViewTracker";

// Frames
import "@/app/frames.css";
import ArtCard from "@/components/ArtCard";

type ArtworkRecord = TArtwork & Record<string, unknown>;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function readString(source: UnknownRecord, key: string): string | null {
  const value = source[key];
  return typeof value === "string" && value.trim() ? value : null;
}

function pickImageSrc(artwork: ArtworkRecord): string | null {
  const nestedImage = artwork["image"];
  if (isRecord(nestedImage)) {
    const nestedSrc = readString(nestedImage, "src");
    if (nestedSrc) return nestedSrc;
  }

  const directKeys = ["imageUrl", "image", "src", "url", "previewUrl"];
  for (const key of directKeys) {
    const value = readString(artwork, key);
    if (value) return value;
  }

  const media = artwork["media"];
  if (isRecord(media)) {
    const mediaSrc = readString(media, "src");
    if (mediaSrc) return mediaSrc;
  }

  if (artwork.imageBase64 && artwork.imageBase64.trim()) {
    return `data:${artwork.mime};base64,${artwork.imageBase64}`;
  }

  return null;
}

function pickAlt(artwork: ArtworkRecord): string {
  const candidates: Array<string | null> = [
    readString(artwork, "alt"),
    artwork.title,
    readString(artwork, "name"),
    artwork.id,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return "";
}

function toArtworkRecord(item: TArtwork): ArtworkRecord {
  return { ...item } as ArtworkRecord;
}

export default function GalleryGrid() {
  const [items, setItems] = useState<ArtworkRecord[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useViewTracker("view_gallery");

  // Initial load
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { items: fetched, nextCursor } = await getArtworks({ limit: 12, cursor: null });
        if (!alive) return;
        setItems(fetched.map(toArtworkRecord));
        setCursor(nextCursor ?? null);
        track("gallery_load_success", { count: fetched.length, page: 1, source: "api" });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setErr(message);
        track("gallery_load_error", { message });
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const canMore = useMemo<boolean>(() => Boolean(cursor), [cursor]);

  async function onMore() {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const { items: more, nextCursor } = await getArtworks({ limit: 12, cursor });
      setItems((prev) => [...prev, ...more.map(toArtworkRecord)]);
      setCursor(nextCursor ?? null);
      track("gallery_load_more_click", { nextCursor });
      track("gallery_load_success", { count: more.length, source: "api" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setErr(message);
      track("gallery_load_error", { message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section ref={ref} id="gallery" className="py-8 sm:py-10 md:py-12">
      <h2 className="font-comic text-2xl mb-4 text-bart-black">Gallery</h2>

      {err ? (
        <div className="border border-red-300 bg-red-50 text-red-700 p-4 rounded mb-4 font-comic">
          Can’t load chaos: {err}{" "}
          <button
            className="underline ml-2"
            onClick={() => {
              setErr(null);
              void onMore();
            }}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {items.map((item) => {
          const src = pickImageSrc(item);
          const alt = pickAlt(item);

          // Wenn kein Bild ermittelbar ist, rendern wir nichts (oder einen Fallback)
          if (!src) {
            return (
              <div
                key={`missing-${item.id}`}
                className="border border-bart-gray/30 rounded-lg p-6 text-sm text-bart-gray"
              >
                No image for this artwork.
              </div>
            );
          }

          return (
            <ArtCard
              key={item.id}
              src={src}
              alt={alt}
              color="duo" // alternativ: aus item.category ableiten
              tiltDeg={1.6} // optional: z. B. item.tiltDeg
              jitter={{ right: "0.4deg", bottom: "-0.3deg" }} // optional
            />
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          disabled={!canMore || loading}
          onClick={onMore}
          className="font-comic px-4 py-2 rounded-md border border-bart-gray/40 bg-white hover:bg-bart-pink/10 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-disabled={!canMore || loading}
        >
          {loading ? "Loading…" : canMore ? "Load more" : "No more bad art"}
        </button>
      </div>
    </section>
  );
}
