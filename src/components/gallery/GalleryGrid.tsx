// file: src/components/gallery/GalleryGrid.tsx  (mit Frames)
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

import ArtCard from "@/components/ArtCard";
import "@/app/frames.css";
import { useViewTracker } from "@/hooks/useViewTracker";
import { getArtworks } from "@/lib/api";
import type { TArtwork } from "@/lib/contracts";
import { track } from "@/lib/analytics";

function artworkSrc(item: TArtwork): string {
  return `data:${item.mime};base64,${item.imageBase64}`;
}

function artworkAlt(item: TArtwork): string {
  return item.title || item.id;
}

function jitterValue(min: number, max: number): string {
  const value = Math.random() * (max - min) + min;
  return `${value.toFixed(1)}deg`;
}

export default function GalleryGrid() {
  const [items, setItems] = useState<TArtwork[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useViewTracker("view_gallery");

  const loadArtworks = useCallback(async (requestedCursor: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const { items: nextItems, nextCursor } = await getArtworks({ limit: 12, cursor: requestedCursor ?? undefined });

      if (requestedCursor) {
        setItems((previous) => [...previous, ...nextItems]);
        track("gallery_load_more_click", { nextCursor });
        track("gallery_load_success", { count: nextItems.length, source: "api" });
      } else {
        setItems(nextItems);
        track("gallery_load_success", { count: nextItems.length, page: 1, source: "api" });
      }

      setCursor(nextCursor ?? null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      track("gallery_load_error", { message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArtworks(null);
  }, [loadArtworks]);

  const canLoadMore = useMemo(() => Boolean(cursor), [cursor]);

  const handleLoadMore = () => {
    if (!cursor || loading) {
      return;
    }

    void loadArtworks(cursor);
  };

  return (
    <section ref={ref} id="gallery" className="py-8 sm:py-10 md:py-12">
      <h2 className="font-comic text-2xl mb-4 text-bart-black">Gallery</h2>

      {error ? (
        <div className="border border-red-300 bg-red-50 text-red-700 p-4 rounded mb-4 font-comic">
          Can’t load chaos: {error}{" "}
          <button
            className="underline ml-2"
            onClick={() => {
              void loadArtworks(cursor);
            }}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {items.map((item, index) => (
          <ArtCard
            key={item.id}
            src={artworkSrc(item)}
            alt={artworkAlt(item)}
            color={index % 3 === 0 ? "green" : index % 3 === 1 ? "pink" : "duo"}
            tiltDeg={1.6}
            jitter={{
              left: jitterValue(-2, 2),
              right: jitterValue(-2, 2),
              bottom: jitterValue(-2, 2),
            }}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          disabled={!canLoadMore || loading}
          onClick={handleLoadMore}
          className="font-comic px-4 py-2 rounded-md border border-bart-gray/40 bg-white hover:bg-bart-pink/10 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-disabled={!canLoadMore || loading}
        >
          {loading ? "Loading…" : canLoadMore ? "Load more" : "No more bad art"}
        </button>
      </div>
    </section>
  );
}
