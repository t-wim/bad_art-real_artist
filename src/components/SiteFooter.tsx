// file: src/components/SiteFooter.tsx  (UPDATE — icons included)
"use client";
import Image from "next/image";
import Section from "./Section";
import { track } from "@/lib/analytics";
import { useViewTracker } from "@/hooks/useViewTracker";

const X_MAIN = process.env.NEXT_PUBLIC_X_MAIN_URL || "#";
const X_COMMUNITY = process.env.NEXT_PUBLIC_X_COMMUNITY_URL || "#";
const DEX = process.env.NEXT_PUBLIC_DEXSCREENER_URL || "#";

export default function SiteFooter() {
  const ref = useViewTracker("view_footer");

  return (
    <footer ref={ref} className="border-bart-gray/20 mt-10 border-t bg-white/90">
      <Section className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-comic text-bart-black">
            Join the chaos, spread the bad art.
          </p>
        </div>

        <nav className="flex items-center gap-4">
          <a
            className="footer-icon font-comic text-bart-pink inline-flex items-center gap-2 transition hover:opacity-80"
            href={X_MAIN}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on X @sleepyofsol"
            onClick={() => track("footer_click_x_main")}
          >
            <Image
              src="/icons/x.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
              className="h-16 w-16 shrink-0"
            />
            <span>Follow @sleepyofsol</span>
          </a>

          <a
            className="footer-icon font-comic text-bart-neon inline-flex items-center gap-2 transition hover:opacity-80"
            href={X_COMMUNITY}
            target="_blank"
            rel="noopener noreferrer"
            title="Join the X Community"
            onClick={() => track("footer_click_x_community")}
          >
            <Image
              src="/icons/c.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
              className="h-16 w-16 shrink-0"
            />
            <span>Join the X Community</span>
          </a>

          <a
            className="footer-icon font-comic text-bart-black inline-flex items-center gap-2 transition hover:opacity-80"
            href={DEX}
            target="_blank"
            rel="noopener noreferrer"
            title="Track on Dexscreener"
            onClick={() => track("footer_click_dex")}
          >
            <Image
              src="/icons/dex.svg"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
              className="h-16 w-16 shrink-0"
            />
            <span>Track the madness on Dexscreener</span>
          </a>
        </nav>
      </Section>
    </footer>
  );
}
