import { describe, expect, it, vi } from "vitest";

import { MILESTONE_KIND, type MilestoneRecord, type RoundRecord } from "@/types/prisma";

vi.mock("@/lib/db", () => ({}));

const { determinePendingMilestones, computeMilestoneTimestamps } = await import(
  "@/lib/services/rounds"
);

describe("determinePendingMilestones", () => {
  const round: RoundRecord = {
    id: "round-1",
    status: "active",
    startsAt: new Date("2024-01-01T00:00:00Z"),
    endsAt: new Date("2024-01-02T00:00:00Z"),
  };

  it("returns milestones that are due and not yet triggered", () => {
    const milestones: MilestoneRecord[] = [
      {
        id: "m1",
        roundId: round.id,
        kind: MILESTONE_KIND.t25,
        triggeredAt: new Date("2024-01-01T06:00:00Z"),
      },
    ];
    const now = new Date("2024-01-01T18:00:00Z");

    const due = determinePendingMilestones(round, milestones, now);

    expect(due).toEqual([MILESTONE_KIND.t50, MILESTONE_KIND.t75]);
  });

  it("yields nothing when progress hasn't reached thresholds", () => {
    const due = determinePendingMilestones(round, [], new Date("2024-01-01T01:00:00Z"));
    expect(due).toEqual([]);
  });

  it("produces consistent timestamp schedule", () => {
    const schedule = computeMilestoneTimestamps(round);
    expect(schedule.get(MILESTONE_KIND.t25)?.toISOString()).toBe(
      "2024-01-01T06:00:00.000Z",
    );
    expect(schedule.get(MILESTONE_KIND.final)?.toISOString()).toBe(
      "2024-01-02T00:00:00.000Z",
    );
  });
});
