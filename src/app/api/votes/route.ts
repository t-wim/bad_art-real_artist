import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { recordSiteVote } from "@/lib/services/votes";
import { trackServer } from "@/lib/telemetry/track";

const voteSchema = z.object({
  roundId: z.string().min(1),
  candidateId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const vote = await recordSiteVote({
      roundId: parsed.data.roundId,
      candidateId: parsed.data.candidateId,
      userId: session.user.id,
    });

    await trackServer("vote_cast", {
      userId: session.user.id,
      payload: { roundId: vote.roundId, candidateId: vote.candidateId },
    });

    return NextResponse.json({ vote }, { status: 201 });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((error as Error).message === "CANDIDATE_MISMATCH") {
      return NextResponse.json({ error: "Candidate mismatch" }, { status: 400 });
    }
    console.error("[votes]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
