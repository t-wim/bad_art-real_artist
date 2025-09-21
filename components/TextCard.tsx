import React from "react";

type Props = {
  title: string;
  text: string;
  className?: string;
};

/** Chalkboard-like card for short copy blocks */
export default function TextCard({ title, text, className }: Props) {
  return (
    <article
      className={
        "rounded-2xl border p-4 md:p-6 shadow-sm bg-[radial-gradient(transparent,_transparent)_0_0/16px_16px] " +
        (className ?? "")
      }
      aria-label={title}
    >
      <h3 className="font-bold text-lg md:text-xl mb-2">{title}</h3>
      <p className="leading-relaxed opacity-90 text-sm md:text-base">{text}</p>
    </article>
  );
}
