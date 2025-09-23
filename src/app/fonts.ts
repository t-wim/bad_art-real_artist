// src/app/fonts.ts
import {
  Permanent_Marker,
  Comic_Neue,
  Gloria_Hallelujah,
  VT323,
} from "next/font/google";

export const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marker",
  display: "swap",
});

export const comic = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic",
  display: "swap",
});

export const gloria = Gloria_Hallelujah({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloria",
  display: "swap",
});

export const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
});

// Lokale Fonts — reaktivieren, sobald sie produktiv genutzt werden.
