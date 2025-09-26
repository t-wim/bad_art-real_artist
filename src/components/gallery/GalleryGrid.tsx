"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { track } from "@/lib/analytics";

type ImageItem = {
  id: string;
  src: string;
  alt?: string | null;
  title?: string | null;
  handle?: string | null;
  createdAt?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataURL?: string | null;
  meta?: Record<string, unknown> | null;
};

type GalleryResponse = {
  items: ImageItem[];
  nextCursor: string | null;
};

const PAGE_LIMIT = 24;

const emit = track as (type: string, payload?: Record<string, unknown>) => void;

async function fetchGalleryPage(cursor: string | null, limit: number): Promise<GalleryResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`/api/gallery?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const json = (await res.json()) as Partial<GalleryResponse> & {
    items?: Array<Partial<ImageItem> & Record<string, unknown>>;
    nextCursor?: string | null;
  };

  const rawItems = Array.isArray(json?.items) ? json.items : [];
  const safeItems = rawItems
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const id = "id" in raw ? String(raw.id ?? "") : "";
      const src = "src" in raw ? String(raw.src ?? "") : "";
      if (!id || !src) return null;
      return {
        id,
        src,
        alt: raw.alt ?? null,
        title: raw.title ?? null,
        handle: raw.handle ?? null,
        createdAt: raw.createdAt ?? null,
        width: raw.width ?? null,
        height: raw.height ?? null,
        blurDataURL: raw.blurDataURL ?? null,
        meta: raw.meta ?? null,
      } satisfies ImageItem;
    })
    .filter((item): item is ImageItem => Boolean(item));

  const safeCursor = json?.nextCursor == null ? null : String(json.nextCursor);

  return { items: safeItems, nextCursor: safeCursor };
}

function formatHandle(handle?: string | null): string | null {
  if (!handle) return null;
  const trimmed = handle.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function fallbackAlt(item: ImageItem): string {
  const alt = item.alt?.trim();
  if (alt) return alt;
  const title = item.title?.trim();
  if (title) return title;
  return "User uploaded image";
}

type TileProps = {
  item: ImageItem;
  index: number;
  onSelect: (item: ImageItem, node: HTMLButtonElement | null) => void;
  onHover: (id: string) => void;
};

function GalleryTile({ item, index, onSelect, onHover }: TileProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hasError = status === "error" || !item.src;
  const formattedHandle = formatHandle(item.handle);
  const titleText = item.title?.trim() || "Untitled";
  const ariaLabel = formattedHandle
    ? `Open ${titleText} by ${formattedHandle}`
    : `Open ${titleText} by unknown artist`;
  const aspectRatio = useMemo(() => {
    if (item.width && item.height && item.width > 0 && item.height > 0) {
      return `${item.width} / ${item.height}`;
    }
    return "3 / 4";
  }, [item.height, item.width]);

  return (
    <button
      type="button"
      ref={buttonRef}
      className="group relative flex w-full overflow-hidden rounded-2xl border border-black/10 bg-white transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 hover:scale-[1.02]"
      style={{ aspectRatio }}
      onMouseEnter={() => onHover(item.id)}
      onFocus={() => onHover(item.id)}
      onClick={() => onSelect(item, buttonRef.current)}
      aria-label={ariaLabel}
    >
      <div className="relative h-full w-full overflow-hidden bg-white">
        {hasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black/5 p-4 text-center text-xs text-black/60">
            <span>Image unavailable</span>
            {item.src ? (
              <a
                href={item.src}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/10 px-3 py-1 text-[11px] text-black/60 transition hover:bg-black/5"
              >
                Open in new tab ↗
              </a>
            ) : null}
          </div>
        ) : (
          <Image
            src={item.src}
            alt={fallbackAlt(item)}
            fill
            sizes="(max-width: 640px) calc((100vw - 16px) / 2), (max-width: 768px) calc((100vw - 24px) / 3), (max-width: 1024px) calc((100vw - 36px) / 4), (max-width: 1280px) calc((100vw - 60px) / 6), calc((1280px - 84px) / 8)"
            className="h-full w-full object-cover transition-opacity duration-300"
            onLoadingComplete={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            placeholder={item.blurDataURL ? "blur" : undefined}
            blurDataURL={item.blurDataURL ?? undefined}
            priority={index < 8}
          />
        )}

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-white/0 p-3 text-xs text-black/80 opacity-0 backdrop-blur-sm transition group-hover:bg-white/80 group-hover:opacity-100 group-focus-visible:bg-white/80 group-focus-visible:opacity-100">
          <div className="text-sm font-medium text-black/90">{titleText}</div>
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-black/60">
            <span>{formattedHandle ?? "—"}</span>
            <span>Open ↗</span>
          </div>
        </div>
      </div>
    </button>
  );
}

type LightboxProps = {
  item: ImageItem;
  onClose: () => void;
};

function LightboxModal({ item, onClose }: LightboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const formattedHandle = formatHandle(item.handle);
  const titleText = item.title?.trim() || "Untitled";

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab") {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) {
          event.preventDefault();
          closeRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const content = (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 text-black"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="minimal-grid-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
      >
        <div className="relative flex-1 bg-black/5">
          <Image
            src={item.src}
            alt={fallbackAlt(item)}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="h-full w-full object-contain bg-white"
            priority
            placeholder={item.blurDataURL ? "blur" : undefined}
            blurDataURL={item.blurDataURL ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-2 border-t border-black/10 bg-white p-6 text-sm text-black/80">
          <h2 id="minimal-grid-modal-title" className="text-lg font-semibold text-black/90">
            {titleText}
          </h2>
          <p className="text-black/60">{formattedHandle ?? "Unknown artist"}</p>
        </div>
        <div className="absolute right-4 top-4">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

export default function GalleryGrid() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState<ImageItem | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const hoveredRef = useRef(new Set<string>());

  const loadInitial = useCallback(async () => {
    try {
      setInitialLoading(true);
      setGlobalError(null);
      const page = await fetchGalleryPage(null, PAGE_LIMIT);
      setItems(page.items);
      setCursor(page.nextCursor);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load gallery";
      setGlobalError(message);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const handleSelect = useCallback((item: ImageItem, node: HTMLButtonElement | null) => {
    emit("image_click", { id: item.id, context: "grid" });
    returnFocusRef.current = node;
    setSelected(item);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    queueMicrotask(() => {
      returnFocusRef.current?.focus();
    });
  }, []);

  const handleHover = useCallback((id: string) => {
    if (hoveredRef.current.has(id)) return;
    hoveredRef.current.add(id);
    emit("image_hover", { id });
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    const cursorToUse = cursor;
    try {
      setLoadingMore(true);
      setPaginationError(null);
      const page = await fetchGalleryPage(cursorToUse, PAGE_LIMIT);
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
      emit("grid_paginate", { count: page.items.length, cursor: cursorToUse });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load more";
      setPaginationError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore]);

  const showEmptyState = !initialLoading && !globalError && items.length === 0;

  return (
    <section className="flex flex-col gap-6 text-black" style={{ contentVisibility: "auto" }}>
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-black/90">Minimal Grid Gallery</h2>
        <p className="text-sm text-black/60">Curated black & white showcase</p>
      </header>

      {globalError ? (
        <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/80">
          <span>Unable to load the gallery. {globalError}</span>
          <button
            type="button"
            onClick={() => void loadInitial()}
            className="rounded-full border border-black/10 px-3 py-1 text-sm font-medium text-black/80 transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            Retry
          </button>
        </div>
      ) : null}

      {initialLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-6 xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-black/10 bg-black/5 md:h-36 lg:h-40"
            />
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="flex items-center justify-center rounded-2xl border border-black/10 bg-white py-16 text-sm text-black/60">
          No images yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-6 xl:grid-cols-8">
          {items.map((item, index) => (
            <GalleryTile
              key={item.id ?? `${item.src}-${index}`}
              item={item}
              index={index}
              onSelect={handleSelect}
              onHover={handleHover}
            />
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          {paginationError ? (
            <div className="text-xs text-black/60">{paginationError}</div>
          ) : null}
          {cursor ? (
            <button
              type="button"
              onClick={() => void handleLoadMore()}
              disabled={loadingMore}
              className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          ) : (
            <span className="text-xs text-black/40">End of gallery</span>
          )}
        </div>
      ) : null}

      {selected ? <LightboxModal item={selected} onClose={handleClose} /> : null}
    </section>
  );
}
