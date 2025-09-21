// file: src/components/gallery/ArtworkCard.tsx  (UPDATE – ImageStatus + Fallback)
"use client";
import { useMemo, useState, useEffect } from "react";
import { base64ToObjectUrl } from "@/lib/image";
import { useImageStatus } from "@/hooks/useImageStatus";
import "@/app/frames.css";

type Artwork = {
  id: string; title: string; author?: string;
  mime: "image/png"|"image/jpeg"|"image/webp";
  imageBase64: string; createdAt?: string;
};

export default function ArtworkCard({ item }: { item: Artwork }) {
  const [url, setUrl] = useState<string>("");
  const { failed, onLoad, onError } = useImageStatus(item.id);
  const color = useMemo<"green"|"pink">(() => (Math.random() < 0.5 ? "green" : "pink"), []);
  const jitter = useMemo(() => ({
    "--jitter-bottom": `${rand(-2,2)}deg`,
    "--jitter-left":   `${rand(-2,2)}deg`,
    "--jitter-right":  `${rand(-2,2)}deg`,
  }) as React.CSSProperties, []);

  useEffect(() => {
    const u = base64ToObjectUrl(item.imageBase64);
    setUrl(u);
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [item.imageBase64]);

  return (
    <figure className="crayon-frame group bg-white relative rounded-xl shadow-sm hover:shadow-md transition will-change-transform" data-color={color} style={jitter}>
      <span className="frame-side frame-top" />
      <span className="frame-side frame-right" />
      <span className="frame-side frame-bottom" />
      <span className="frame-side frame-left" />
      <i className="tape tl" aria-hidden />
      <i className="tape tr" aria-hidden />
      <i className="tape bl" aria-hidden />
      <i className="tape br" aria-hidden />

      // relevante Struktur im JSX
<div className="art-card">
  <div
    className={`
      art-card__frame crayon-pink
    `}
    style={{ ['--tilt' as any]: '1.8deg' }} /* pro Karte variiert? dann hier anpassen */
  >
    <div className="art-card__tape">{/* optional: Tape-Dekor */}</div>

    <div className="art-card__inner">
      <img
        className="art-card__img"
        alt={item.title}
        src={`data:${item.mime};base64,${item.imageBase64}`}
      />
    </div>
  </div>
</div>


      <figcaption className="px-4 pb-3 font-comic text-sm text-bart-black">
        {item.title}{item.author ? ` — ${item.author}` : ""}{item.createdAt ? `, ${new Date(item.createdAt).getFullYear()}` : ""}
      </figcaption>
    </figure>
  );
}
function rand(min: number, max: number) { return Math.round((Math.random() * (max - min) + min) * 10) / 10; }
