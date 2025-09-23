"use client";

import { motion } from "framer-motion";

const stickers = [
  { id: 1, src: "/stickers/+1.svg", x: "10%", y: "20%", rotate: "5deg" },
  { id: 2, src: "/stickers/pink-glow.svg", x: "30%", y: "50%", rotate: "-3deg" },
  { id: 3, src: "/stickers/holo-glitch.svg", x: "60%", y: "30%", rotate: "2deg" },
];

export default function StickerSheet({ className }: { className?: string }) {
  return (
    <div
      className={`relative w-full h-64 bg-[var(--bart-secondary-gray)]/10 rounded-lg overflow-hidden ${className ?? ""}`}
    >
      {stickers.map((sticker) => (
        <motion.img
          key={sticker.id}
          src={sticker.src}
          alt={`Sticker ${sticker.id}`}
          className="absolute w-16 h-16 opacity-75"
          style={{ left: sticker.x, top: sticker.y, transform: `rotate(${sticker.rotate})` }}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ))}
      <div className="absolute inset-0 bg-[url('/textures/crayon_scribble.png')] opacity-30 mix-blend-multiply" />
    </div>
  );
}
