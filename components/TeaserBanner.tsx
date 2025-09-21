import React from "react";
import Link from "next/link";

type Props = {
  eyebrow?: string;
  headline: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function TeaserBanner({ eyebrow, headline, ctaText, ctaHref }: Props) {
  return (
    <section className="rounded-2xl border p-4 md:p-6 text-center">
      {eyebrow && <p className="text-xs md:text-sm uppercase tracking-wide opacity-60">{eyebrow}</p>}
      <h2 className="text-2xl md:text-4xl font-black my-2">{headline}</h2>
      {ctaText && ctaHref && (
        <Link href={ctaHref} className="inline-block mt-2 rounded-xl border px-4 py-2 text-sm md:text-base hover:shadow">
          {ctaText}
        </Link>
      )}
    </section>
  );
}
