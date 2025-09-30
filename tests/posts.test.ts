import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({}));
vi.mock("@/lib/telemetry/track", () => ({ trackServer: async () => {} }));
vi.mock("@/lib/x/poster", () => ({
  composeMilestoneCopy: () => "",
  deliverMilestonePost: async () => ({ postId: "mock", payload: {} }),
}));

const { createPostIdempotencyKey } = await import("@/lib/services/posts");

describe("createPostIdempotencyKey", () => {
  it("combines round and milestone for idempotency", () => {
    expect(createPostIdempotencyKey("round-1", "t25")).toBe("round-1:t25");
  });
});
