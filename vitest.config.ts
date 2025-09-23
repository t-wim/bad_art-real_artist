import { defineConfig } from "vitest/config";
import type { CoverageV8Options } from "vitest";

const coverage = {
  provider: "v8" as const,
  reports: ["text", "html"],
  exclude: ["**/node_modules/**", "**/.next/**"],
} as unknown as { provider: "v8" } & CoverageV8Options;

export default defineConfig({
  test: {
    passWithNoTests: true,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage,
  },
});
