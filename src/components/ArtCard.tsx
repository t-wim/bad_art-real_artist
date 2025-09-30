// file: src/components/ArtCard.tsx
"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

import type { Artwork } from "@/types/art";

type FrameStyle = CSSProperties & {
  "--tilt"?: string;
  "--jitter-left"?: string;
  "--jitter-right"?: string;
  "--jitter-bottom"?: string;
};

export interface ArtCardProps {
  artwork: Artwork;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function ArtCard({ artwork, onSelect, className = "" }: ArtCardProps) {
  const styleVars = useMemo<FrameStyle>(() => ({
    "--tilt": "1.6deg",
    "--jitter-right": "0.4deg",
    "--jitter-bottom": "-0.3deg",
  }), []);

  const altText = artwork.description ?? artwork.title;
  const width = artwork.width ?? 1024;
  const height = artwork.height ?? 1024;

  const interactiveProps = onSelect
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: () => onSelect(artwork.id),
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(artwork.id);
          }
        },
      }
    : {};

  return (
    <div className={`art-card ${className}`} {...interactiveProps}>
      <div className="art-card__frame" style={styleVars}>
        <div className="crayon-frame" data-color="duo">
          {/* ======= Das eigentliche Markup der vier Rahmen-Seiten ======= */}
          <div className="frame-top frame-side" />
          <div className="frame-right frame-side" />
          <div className="frame-bottom frame-side" />
          <div className="frame-left frame-side" />

          {/* ======= Bild (gegenrotiert) ======= */}
          <div className="art-card__inner">
            <Image
              className="art-card__img"
              src={artwork.imageUrl}
              alt={altText}
              width={width}
              height={height}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
