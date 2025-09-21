// file: src/components/ArtCard.tsx
"use client";

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
  const styleVars = {
    // CSS-Variablen für Rotation/Jitter
    // werden auf dem Frame-Wrapper gesetzt
    ...(tiltDeg !== undefined ? { ["--tilt" as any]: `${tiltDeg}deg` } : {}),
    ...(jitter?.left   ? { ["--jitter-left" as any]: jitter.left }   : {}),
    ...(jitter?.right  ? { ["--jitter-right" as any]: jitter.right } : {}),
    ...(jitter?.bottom ? { ["--jitter-bottom" as any]: jitter.bottom } : {}),
  };

  const frameClass =
    color === "duo"
      ? "crayon-frame duo"
      : "crayon-frame";

  const dataColor =
    color === "duo" ? {} : { "data-color": color };

  return (
    <div className={`art-card ${className}`}>
      <div className="art-card__frame" style={styleVars as React.CSSProperties}>
        <div className={frameClass} {...dataColor}>
          {/* ======= Das eigentliche Markup der vier Rahmen-Seiten ======= */}
          <div className="frame-top frame-side" />
          <div className="frame-right frame-side" />
          <div className="frame-bottom frame-side" />
          <div className="frame-left frame-side" />

          {/* ======= Bild (gegenrotiert) ======= */}
          <div className="art-card__inner">
            <img className="art-card__img" src={src} alt={alt} />
          </div>
        </div>
      </div>
    </div>
  );
}
