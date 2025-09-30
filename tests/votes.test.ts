import { describe, expect, it, vi } from "vitest";

import { VOTE_SOURCE } from "@/types/prisma";

vi.mock("@/lib/db", () => ({}));

const { mergeVoteAggregates } = await import("@/lib/services/votes");

describe("mergeVoteAggregates", () => {
  it("combines total counts with per-source breakdown", () => {
    const totals: Array<{ candidateId: string; count: number }> = [
      { candidateId: "cand-1", count: 5 },
      { candidateId: "cand-2", count: 2 },
    ];
    const bySource: Array<{ candidateId: string; source: string; count: number }> = [
      { candidateId: "cand-1", source: VOTE_SOURCE.site, count: 3 },
      { candidateId: "cand-1", source: VOTE_SOURCE.x, count: 4 },
      { candidateId: "cand-2", source: VOTE_SOURCE.site, count: 2 },
    ];

    const result = mergeVoteAggregates(totals, bySource);

    expect(result).toEqual([
      { candidateId: "cand-1", siteCount: 3, xCount: 4, total: 7 },
      { candidateId: "cand-2", siteCount: 2, xCount: 0, total: 2 },
    ]);
  });

  it("falls back to per-source totals when aggregate is missing", () => {
    const totals: Array<{ candidateId: string; count: number }> = [];
    const bySource: Array<{ candidateId: string; source: string; count: number }> = [
      { candidateId: "cand-42", source: VOTE_SOURCE.x, count: 9 },
    ];

    const result = mergeVoteAggregates(totals, bySource);

    expect(result).toEqual([
      { candidateId: "cand-42", siteCount: 0, xCount: 9, total: 9 },
    ]);
  });
});
