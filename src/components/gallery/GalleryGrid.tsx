// file: src/components/gallery/GalleryGrid.tsx  (mit Frames)
"use client";
import { useEffect, useMemo, useState } from "react";
// ❌ Alte Card nicht mehr nötig (wir rahmen direkt)
// import ArtworkCard from "./ArtworkCard";
import { track } from "@/lib/analytics";
import { getArtworks } from "@/lib/api";
import type { TArtwork } from "@/lib/utils/contracts";
import type { Artwork } from "@/types/art";
import { useViewTracker } from "@/hooks/useViewTracker";

// Frames
import "@/app/frames.css";
import ArtCard from "@/components/ArtCard";

function toArtwork(item: TArtwork): Artwork | null {
  if (!item.imageBase64) return null;

  return {
    id: item.id,
    title: item.title,
    imageUrl: `data:${item.mime};base64,${item.imageBase64}`,
    authorHandle: item.author,
    description: item.title,
  };
}

function isArtwork(value: Artwork | null): value is Artwork {
  return value !== null;
}

export default function GalleryGrid() {
  const [items, setItems] = useState<Artwork[]>([]);
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
        const { items, nextCursor } = await getArtworks({ limit: 12, cursor: null });
        const mapped = items.map(toArtwork).filter(isArtwork);
        if (!alive) return;
        setItems(mapped);
        setCursor(nextCursor ?? null);
        track("gallery_load_success", { count: items.length, page: 1, source: "api" });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setErr(msg);
        track("gallery_load_error", { message: msg });
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
      const mapped = more.map(toArtwork).filter(isArtwork);
      setItems((prev) => [...prev, ...mapped]);
      setCursor(nextCursor ?? null);
      track("gallery_load_more_click", { nextCursor });
      track("gallery_load_success", { count: more.length, source: "api" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg);
      track("gallery_load_error", { message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section ref={ref} id="gallery" className="py-8 sm:py-10 md:py-12">
      <h2 className="font-comic text-bart-black mb-4 text-2xl">Gallery</h2>

      {err ? (
        <div className="font-comic mb-4 rounded border border-red-300 bg-red-50 p-4 text-red-700">
          Can’t load chaos: {err}{" "}
          <button
            className="ml-2 underline"
            onClick={() => {
              setErr(null);
              void onMore();
            }}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="gallery-grid grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {items.map((it) => (
          <ArtCard key={it.id} artwork={it} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          disabled={!canMore || loading}
          onClick={onMore}
          className="font-comic border-bart-gray/40 hover:bg-bart-pink/10 rounded-md border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          aria-disabled={!canMore || loading}
        >
          {loading ? "Loading…" : canMore ? "Load more" : "No more bad art"}
        </button>
      </div>
    </section>
  );
}
