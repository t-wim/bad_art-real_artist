"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const STICKER_SIZE = 64;

const stickers = [
  { id: 1, src: "/stickers/+1.svg", x: "10%", y: "20%", rotate: "5deg" },
  { id: 2, src: "/stickers/pink-glow.svg", x: "30%", y: "50%", rotate: "-3deg" },
  { id: 3, src: "/stickers/holo-glitch.svg", x: "60%", y: "30%", rotate: "2deg" },
] as const;

export default function StickerSheet({ className }: { className?: string }) {
  return (
    <div
      className={`relative h-64 w-full overflow-hidden rounded-lg bg-[var(--bart-secondary-gray)]/10 ${className ?? ""}`}
    >
      {stickers.map((sticker) => (
        <motion.div
          key={sticker.id}
          className="absolute opacity-75"
          style={{
            left: sticker.x,
            top: sticker.y,
            transform: `rotate(${sticker.rotate})`,
          }}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={sticker.src}
            alt={`Sticker ${sticker.id}`}
            width={STICKER_SIZE}
            height={STICKER_SIZE}
            className="h-16 w-16 select-none"
            draggable={false}
            sizes="64px"
          />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[url('/textures/crayon_scribble.png')] opacity-30 mix-blend-multiply" />
    </div>
  );
}
