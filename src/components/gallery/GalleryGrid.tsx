"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { getArtworks } from "@/lib/api";
import type { TArtwork } from "@/lib/contracts";
import { useViewTracker } from "@/hooks/useViewTracker";

import "@/app/frames.css";
import ArtCard from "@/components/ArtCard";

type ArtworkWithMeta = TArtwork & {
  image?: { src?: string | null } | null;
  imageUrl?: string | null;
  src?: string | null;
  url?: string | null;
  previewUrl?: string | null;
  media?: { src?: string | null } | null;
  alt?: string | null;
  name?: string | null;
};

function resolveImageSource(artwork: ArtworkWithMeta): string | null {
  const directFields = [artwork.imageUrl, artwork.src, artwork.url, artwork.previewUrl];
  const fromDirect = directFields.find((value) => typeof value === "string" && value.trim().length > 0);
  if (fromDirect) return fromDirect.trim();

  const nestedSources = [artwork.image?.src, artwork.media?.src];
  const fromNested = nestedSources.find((value) => typeof value === "string" && value.trim().length > 0);
  if (fromNested) return fromNested.trim();

  if (artwork.imageBase64) {
    return `data:${artwork.mime};base64,${artwork.imageBase64}`;
  }

  return null;
}

function resolveAltText(artwork: ArtworkWithMeta): string {
  return (
    artwork.alt ??
    artwork.title ??
    artwork.name ??
    artwork.id ??
    "Artwork"
  );
}

export default function GalleryGrid() {
  const [items, setItems] = useState<TArtwork[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useViewTracker("view_gallery");
  const isMounted = useRef(true);
  const loadingRef = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadPage = useCallback(
    async (cursorValue: string | null, append: boolean) => {
      if (!isMounted.current || loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const { items: fetched, nextCursor } = await getArtworks({ limit: 12, cursor: cursorValue });
        if (!isMounted.current) return;
        setItems((prev) => (append ? [...prev, ...fetched] : fetched));
        setCursor(nextCursor ?? null);
        track("gallery_load_success", { count: fetched.length, page: append ? "next" : 1 });
        if (append) {
          track("gallery_load_more_click", { nextCursor });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        if (isMounted.current) {
          setError(message);
        }
        track("gallery_load_error", { message });
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
        loadingRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    void loadPage(null, false);
  }, [loadPage]);

  const canLoadMore = useMemo(() => Boolean(cursor), [cursor]);

  const handleLoadMore = async () => {
    if (!cursor || loading) return;
    await loadPage(cursor, true);
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
              void loadPage(null, false);
            }}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {items.map((item) => {
          const enriched = item as ArtworkWithMeta;
          const src = resolveImageSource(enriched);
          const alt = resolveAltText(enriched);

          if (!src) {
            return (
              <div
                key={item.id}
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
              color="duo"
              tiltDeg={1.6}
              jitter={{ right: "0.4deg", bottom: "-0.3deg" }}
            />
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          disabled={!canLoadMore || loading}
          onClick={() => void handleLoadMore()}
          className="font-comic px-4 py-2 rounded-md border border-bart-gray/40 bg-white hover:bg-bart-pink/10 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-disabled={!canLoadMore || loading}
        >
          {loading ? "Loading…" : canLoadMore ? "Load more" : "No more bad art"}
        </button>
      </div>
    </section>
  );
}
