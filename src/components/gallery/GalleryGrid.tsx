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

function pickImageSrc(a: TArtwork): string | null {
  // Versucht gängige Felder in sinnvoller Reihenfolge
  // Passe ggf. an deine API an.
  return (
    (a as any).image?.src ??
    (a as any).imageUrl ??
    (a as any).image ??
    (a as any).src ??
    (a as any).url ??
    (a as any).previewUrl ??
    (a as any).media?.src ??
    null
  );
}

function pickAlt(a: TArtwork): string {
  return (
    (a as any).alt ??
    (a as any).title ??
    (a as any).name ??
    (a as any).id ??
    ""
  );
}

export default function GalleryGrid() {
  const [items, setItems] = useState<TArtwork[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useViewTracker("view_gallery");

  // Initial load
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setErr(null);
      try {
        const { items, nextCursor } = await getArtworks({ limit: 12, cursor: null });
        if (!alive) return;
        setItems(items);
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
    return () => { alive = false; };
  }, []);

  const canMore = useMemo<boolean>(() => Boolean(cursor), [cursor]);

  async function onMore() {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const { items: more, nextCursor } = await getArtworks({ limit: 12, cursor });
      setItems((prev: TArtwork[]) => [...prev, ...more]);
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
    <section ref={ref as any} id="gallery" className="py-8 sm:py-10 md:py-12">
      <h2 className="font-comic text-2xl mb-4 text-bart-black">Gallery</h2>

      {err ? (
        <div className="border border-red-300 bg-red-50 text-red-700 p-4 rounded mb-4 font-comic">
          Can’t load chaos: {err}{" "}
          <button
            className="underline ml-2"
            onClick={() => { setErr(null); void onMore(); }}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {items.map((it: TArtwork) => {
          const src = pickImageSrc(it);
          const alt = pickAlt(it);

          // Wenn kein Bild ermittelbar ist, rendern wir nichts (oder einen Fallback)
          if (!src) {
            return (
              <div
                key={(it as any).id ?? Math.random().toString(36)}
                className="border border-bart-gray/30 rounded-lg p-6 text-sm text-bart-gray"
              >
                No image for this artwork.
              </div>
            );
          }

          return (
            <ArtCard
              key={(it as any).id ?? src}
              src={src}
              alt={alt}
              color="duo"                           // alternativ: aus it.category ableiten
              tiltDeg={1.6}                         // optional: z. B. (it as any).tiltDeg
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
