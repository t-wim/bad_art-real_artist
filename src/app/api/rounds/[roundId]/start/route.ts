import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { activateRound, getRoundWithMilestones } from "@/lib/services/rounds";
import { trackServer } from "@/lib/telemetry/track";

export async function POST(
  _request: Request,
  { params }: { params: { roundId: string } },
) {
  try {
    const session = await requireAdminSession();
    const { round } = await getRoundWithMilestones(params.roundId);
    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (round.status === "active") {
      return NextResponse.json({ round }, { status: 200 });
    }

    const updated = await activateRound(params.roundId);
    await trackServer("round_start", {
      userId: session.user.id,
      payload: { roundId: updated.id },
    });
    return NextResponse.json({ round: updated });
  } catch (error) {
    if (
      (error as Error).message === "UNAUTHORIZED" ||
      (error as Error).message === "NOT_AUTHORIZED"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[round/start]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
