import {
  createRound,
  endRound,
  getRoundById,
  listActiveRounds as dbListActiveRounds,
  listMilestones,
  startRound,
  triggerMilestone,
} from "@/lib/db";
import {
  MILESTONE_KIND,
  type MilestoneKind,
  type MilestoneRecord,
  type RoundRecord,
} from "@/types/prisma";

type CreateRoundInput = {
  startsAt: Date;
  endsAt: Date;
};

type MilestoneThreshold = {
  kind: MilestoneKind;
  ratio: number;
  event: "t25_trigger" | "t50_trigger" | "t75_trigger" | "final_trigger";
};

export const MILESTONE_THRESHOLDS: MilestoneThreshold[] = [
  { kind: MILESTONE_KIND.t25, ratio: 0.25, event: "t25_trigger" },
  { kind: MILESTONE_KIND.t50, ratio: 0.5, event: "t50_trigger" },
  { kind: MILESTONE_KIND.t75, ratio: 0.75, event: "t75_trigger" },
  { kind: MILESTONE_KIND.final, ratio: 1, event: "final_trigger" },
];

export const MILESTONE_EVENT_BY_KIND: Record<MilestoneKind, MilestoneThreshold["event"]> =
  MILESTONE_THRESHOLDS.reduce(
    (acc, item) => {
      acc[item.kind] = item.event;
      return acc;
    },
    {} as Record<MilestoneKind, MilestoneThreshold["event"]>,
  );

export async function createDraftRound(input: CreateRoundInput): Promise<RoundRecord> {
  return createRound(input);
}

export async function activateRound(roundId: string): Promise<RoundRecord> {
  return startRound(roundId);
}

export async function concludeRound(roundId: string): Promise<RoundRecord> {
  return endRound(roundId);
}

export async function listActiveRounds(): Promise<RoundRecord[]> {
  return dbListActiveRounds();
}

export function computeMilestoneTimestamps(round: RoundRecord): Map<MilestoneKind, Date> {
  const startsAt = new Date(round.startsAt).getTime();
  const endsAt = new Date(round.endsAt).getTime();
  const duration = Math.max(endsAt - startsAt, 0);
  const map = new Map<MilestoneKind, Date>();
  for (const threshold of MILESTONE_THRESHOLDS) {
    const offset = Math.round(duration * threshold.ratio);
    map.set(threshold.kind, new Date(startsAt + offset));
  }
  return map;
}

export function determinePendingMilestones(
  round: RoundRecord,
  existing: MilestoneRecord[],
  now: Date = new Date(),
): MilestoneKind[] {
  const triggered = new Set(existing.map((record) => record.kind));
  const schedule = computeMilestoneTimestamps(round);
  const due: MilestoneKind[] = [];
  for (const threshold of MILESTONE_THRESHOLDS) {
    if (triggered.has(threshold.kind)) continue;
    const target = schedule.get(threshold.kind);
    if (!target) continue;
    if (target.getTime() <= now.getTime()) {
      due.push(threshold.kind);
    }
  }
  return due;
}

export async function triggerPendingMilestones(
  roundId: string,
  kinds: MilestoneKind[],
): Promise<void> {
  for (const kind of kinds) {
    await triggerMilestone({ roundId, kind });
  }
}

export async function getRoundWithMilestones(
  roundId: string,
): Promise<{ round: RoundRecord | null; milestones: MilestoneRecord[] }> {
  const [round, milestones] = await Promise.all([
    getRoundById(roundId),
    listMilestones(roundId),
  ]);
  return { round, milestones };
}
