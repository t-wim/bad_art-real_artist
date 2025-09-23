// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true }, // Lint ignorieren beim build

  // ggf. weitere Optionen hier (images, redirects, etc.)
};

export default nextConfig;
