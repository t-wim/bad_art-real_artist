// file: src/components/ArtCard.tsx
"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

type Color = "duo" | "pink" | "green";

export type ArtCardProps = {
  src: string;
  alt?: string;
  color?: Color;          // "duo" | "pink" | "green"
  tiltDeg?: number;       // überschreibt --frame-tilt
  className?: string;     // zusätzliche Wrapper-Klassen
  jitter?: {
    left?: string;        // z.B. "0.6deg"
    right?: string;
    bottom?: string;
  };
};

export default function ArtCard({
  src,
  alt = "",
  color = "duo",
  tiltDeg,
  className = "",
  jitter,
}: ArtCardProps) {
  type StyleVars = CSSProperties &
    Partial<
      Record<"--tilt" | "--jitter-left" | "--jitter-right" | "--jitter-bottom", string>
    >;

  const styleVars: StyleVars = {
    // CSS-Variablen für Rotation/Jitter
    // werden auf dem Frame-Wrapper gesetzt
    ...(tiltDeg !== undefined ? { "--tilt": `${tiltDeg}deg` } : {}),
    ...(jitter?.left ? { "--jitter-left": jitter.left } : {}),
    ...(jitter?.right ? { "--jitter-right": jitter.right } : {}),
    ...(jitter?.bottom ? { "--jitter-bottom": jitter.bottom } : {}),
  };

  const frameClass =
    color === "duo"
      ? "crayon-frame duo"
      : "crayon-frame";

  const dataColor =
    color === "duo" ? {} : { "data-color": color };

  return (
    <div className={`art-card ${className}`}>
      <div className="art-card__frame" style={styleVars}>
        <div className={frameClass} {...dataColor}>
          {/* ======= Das eigentliche Markup der vier Rahmen-Seiten ======= */}
          <div className="frame-top frame-side" />
          <div className="frame-right frame-side" />
          <div className="frame-bottom frame-side" />
          <div className="frame-left frame-side" />

          {/* ======= Bild (gegenrotiert) ======= */}
          <div className="art-card__inner">
            <Image
              className="art-card__img"
              src={src}
              alt={alt}
              width={1200}
              height={1200}
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
