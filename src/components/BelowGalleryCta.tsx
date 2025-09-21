// file: src/components/BelowGalleryCta.tsx
"use client";

import { track } from "@/lib/analytics";

export default function BelowGalleryCta() {
  const onHover = () => track?.("tooltip_seen_soon", { source: "home_cta_below_gallery" });

  return (
    <section className="px-4 sm:px-6 md:px-8 mt-6 mb-10">
      <div className="flex justify-center">
        <button
          onMouseEnter={onHover}
          disabled
          aria-disabled="true"
          className="cta-button inline-flex items-center justify-center rounded-[10px] border-2 border-bart-neon bg-bart-pink/90 text-bart-black font-comic px-5 py-2 opacity-50 cursor-not-allowed select-none"
        >
          Upload your masterpiece
          <span className="tooltip">Soon</span>
        </button>
      </div>
    </section>
  );
}
