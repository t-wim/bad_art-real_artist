// src/app/layout.tsx
import "./globals.css";
import "./frames.css";
import "./animations.css";

import type { Metadata } from "next";
import { marker, comic, gloria, vt323 } from "./fonts";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "BART — Bad Art, Real Artist.",
  description: "Truth lies in imperfection – Bad Art wins.",
  openGraph: { title: "BART — Bad Art, Real Artist.", description: "Truth lies in imperfection – Bad Art wins.", images: ["/og.png"] },
  twitter:   { card: "summary_large_image", title: "BART — Bad Art, Real Artist.", description: "Truth lies in imperfection – Bad Art wins.", images: ["/og.png"] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={[marker.variable, comic.variable, gloria.variable, vt323.variable].join(" ")}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-white text-black antialiased">
        <Header />
        <main id="page">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
