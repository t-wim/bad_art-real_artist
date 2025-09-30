// file: src/components/TeaserBanner.tsx  (ICONS REMOVED)
"use client";
import Image from "next/image";
import Section from "./Section";
import TeaserBadge from "./TeaserBadge";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { useEffect, useRef } from "react";

type Variant = "hof" | "upload" | "voting" | "bonus";
type TeaserProps = {
  variant: Variant;
  title: string;
  manifest: string;
  microcopy: string;
  backgroundTexture?: string;
};

export function TeaserRow({ items }: { items: TeaserProps[] }) {
  return (
    <Section className="grid grid-cols-1 gap-8 py-6 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
      {items.map((t) => (
        <TeaserBanner key={t.variant} {...t} />
      ))}
    </Section>
  );
}

export default function TeaserBanner({
  variant,
  title,
  manifest,
  microcopy,
  backgroundTexture,
}: TeaserProps) {
  const hoverEvent: AnalyticsEvent =
    variant === "bonus" ? "hover_glitch_bonus" : "hover_wobble_teaser";
  const viewEvent: AnalyticsEvent =
    variant === "hof"
      ? "view_teaser_hof"
      : variant === "upload"
        ? "view_teaser_upload"
        : variant === "voting"
          ? "view_teaser_voting"
          : "view_teaser_bonus";

  const animClass =
    variant === "hof"
      ? "hall-of-fame-poster"
      : variant === "upload"
        ? "upload-card"
        : variant === "voting"
          ? "voting-sticker"
          : "hidden-bonus-poster";

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let seen = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!seen && entry.isIntersecting) {
            seen = true;
            track(viewEvent);
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [viewEvent]);

  return (
    <article
      ref={ref}
      data-variant={variant}
      onMouseEnter={() => track(hoverEvent, { variant })}
      className={`group border-bart-gray/30 relative w-full overflow-hidden rounded-lg border bg-white/90 text-left shadow-sm ${animClass}`}
      aria-label={title}
      role="group"
    >
      {backgroundTexture ? (
        <Image
          src={backgroundTexture}
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover opacity-20"
          priority={variant === "hof"}
        />
      ) : null}

      <div className="relative flex min-h-[180px] flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-comic text-bart-black text-lg">{title}</h3>
          <TeaserBadge
            label={variant === "bonus" ? "SECRET" : "SOON"}
            variant={variant === "bonus" ? "purple" : "pink"}
          />
        </div>

        <p className="font-comic text-bart-gray text-sm">{manifest}</p>
        <p className="font-comic text-bart-black text-sm">{microcopy}</p>

        <div className="mt-auto opacity-80">
          <span className="font-comic text-[12px] select-none">Soon</span>
        </div>
      </div>
    </article>
  );
}
