export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SUBMISSION_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "shortlisted",
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
export const SUBMISSION_STATUS = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  shortlisted: "shortlisted",
} as const satisfies Record<string, SubmissionStatus>;

export const ROUND_STATUSES = ["draft", "active", "ended"] as const;
export type RoundStatus = (typeof ROUND_STATUSES)[number];
export const ROUND_STATUS = {
  draft: "draft",
  active: "active",
  ended: "ended",
} as const satisfies Record<string, RoundStatus>;

export const VOTE_SOURCES = ["site", "x"] as const;
export type VoteSource = (typeof VOTE_SOURCES)[number];
export const VOTE_SOURCE = {
  site: "site",
  x: "x",
} as const satisfies Record<string, VoteSource>;

export const MILESTONE_KINDS = ["t25", "t50", "t75", "final"] as const;
export type MilestoneKind = (typeof MILESTONE_KINDS)[number];
export const MILESTONE_KIND = {
  t25: "t25",
  t50: "t50",
  t75: "t75",
  final: "final",
} as const satisfies Record<string, MilestoneKind>;

export interface UserRecord {
  id: string;
  xId: string;
  handle: string;
  role: UserRole;
  createdAt: Date;
}

export interface SubmissionRecord {
  id: string;
  userId: string;
  imageUrl: string;
  handle: string;
  theme: string | null;
  context: string | null;
  status: SubmissionStatus;
  createdAt: Date;
}

export interface RoundRecord {
  id: string;
  status: RoundStatus;
  startsAt: Date;
  endsAt: Date;
}

export interface CandidateRecord {
  id: string;
  roundId: string;
  submissionId: string;
  rankHint: number | null;
  submission: SubmissionRecord;
}

export interface VoteRecord {
  id: string;
  roundId: string;
  candidateId: string;
  userId: string | null;
  source: VoteSource;
  createdAt: Date;
}

export interface MirrorRecord {
  id: string;
  roundId: string;
  xPollId: string;
  lastSyncAt: Date;
}

export interface MirrorWithRoundRecord extends MirrorRecord {
  round: RoundRecord;
}

export interface MilestoneRecord {
  id: string;
  roundId: string;
  kind: MilestoneKind;
  triggeredAt: Date;
}

export interface PostLogRecord {
  id: string;
  roundId: string;
  milestoneKind: MilestoneKind;
  xPostId: string;
  payloadJson: Record<string, unknown>;
  createdAt: Date;
}

export interface VoteAggregate {
  candidateId: string;
  count: number;
}

export interface VoteAggregateBySource extends VoteAggregate {
  source: VoteSource;
}

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(value);
}
