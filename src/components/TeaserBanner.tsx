// file: src/components/TeaserBanner.tsx  (ICONS REMOVED)
"use client";
import Image from "next/image";
import Section from "./Section";
import TeaserBadge from "./TeaserBadge";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { useEffect, useRef } from "react";

type Variant = "hof" | "upload" | "voting" | "bonus";
export type TeaserProps = {
  variant: Variant;
  title: string;
  manifest: string;
  microcopy: string;
  backgroundTexture?: string;
};

export function TeaserRow({ items }: { items: TeaserProps[] }) {
  return (
    <Section className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
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
    if (!el) return undefined;

    let seen = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!seen && entry.isIntersecting) {
            seen = true;
            track(viewEvent);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [viewEvent]);

  return (
    <article
      ref={ref}
      data-variant={variant}
      onMouseEnter={() => track(hoverEvent, { variant })}
      className={`group relative w-full text-left rounded-lg border border-bart-gray/30 bg-white/90 shadow-sm overflow-hidden ${animClass}`}
      aria-label={title}
      role="group"
    >
      {backgroundTexture ? (
        <Image
          src={backgroundTexture}
          alt=""
          fill
          className="object-cover opacity-20 pointer-events-none"
          priority={variant === "hof"}
        />
      ) : null}

      <div className="relative p-4 flex flex-col gap-2 min-h-[180px]">
        <div className="flex items-center justify-between">
          <h3 className="font-comic text-lg text-bart-black">{title}</h3>
          <TeaserBadge
            label={variant === "bonus" ? "SECRET" : "SOON"}
            variant={variant === "bonus" ? "purple" : "pink"}
          />
        </div>

        <p className="text-sm font-comic text-bart-gray">{manifest}</p>
        <p className="text-sm font-comic text-bart-black">{microcopy}</p>

        <div className="mt-auto opacity-80">
          <span className="text-[12px] font-comic select-none">Soon</span>
        </div>
      </div>
    </article>
  );
}
