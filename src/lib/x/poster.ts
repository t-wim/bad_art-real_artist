import { resolveXCredentials } from "./index";

type Leader = {
  handle: string;
  imageUrl?: string | null;
  score?: number;
};

type MilestonePostParams = {
  roundId: string;
  milestone: string;
  leaders: Leader[];
};

const DRY_RUN = process.env.JOB_DRY_RUN === "1";

export function composeMilestoneCopy(params: MilestonePostParams): string {
  const prefixMap: Record<string, string> = {
    t25: "⚡ 25% chaos achieved!",
    t50: "🚀 Halfway through the artpocalypse!",
    t75: "🔥 75% meltdown in progress!",
    final: "👑 FINAL COUNTDOWN!",
  };
  const prefix = prefixMap[params.milestone] ?? "🌀 Bad Art status update";
  const leaderLines = params.leaders
    .slice(0, 3)
    .map((leader, index) => `${index + 1}. @${leader.handle}`)
    .join(" | ");
  return `${prefix}\n${leaderLines}\n#BadArtRealArtist`;
}

export async function deliverMilestonePost(
  text: string,
): Promise<{ postId: string; payload: Record<string, unknown> }> {
  const credentials = resolveXCredentials();
  if (!credentials || DRY_RUN) {
    return {
      postId: `mock-${Date.now()}`,
      payload: { text, dryRun: true },
    };
  }

  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`X API responded with ${response.status}`);
  }

  const payload = await response.json();
  const postId = payload?.data?.id ?? `pending-${Date.now()}`;
  return { postId, payload };
}

export type { Leader, MilestonePostParams };
