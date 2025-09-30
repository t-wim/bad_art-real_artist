import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { shortlistRound } from "@/lib/services/submissions";
import { trackServer } from "@/lib/telemetry/track";

const shortlistSchema = z.object({
  submissions: z
    .array(
      z.object({
        id: z.string().min(1),
        rankHint: z.number().int().min(1).max(3).optional(),
      }),
    )
    .min(1)
    .max(3),
});

export async function POST(
  request: Request,
  { params }: { params: { roundId: string } },
) {
  try {
    const session = await requireAdminSession();
    const body = await request.json();
    const parsed = shortlistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const created = await shortlistRound(params.roundId, parsed.data.submissions);

    await trackServer("shortlist_top3", {
      userId: session.user.id,
      payload: {
        roundId: params.roundId,
        submissions: parsed.data.submissions.map((s) => s.id),
      },
    });

    return NextResponse.json({ candidates: created });
  } catch (error) {
    if (
      (error as Error).message === "UNAUTHORIZED" ||
      (error as Error).message === "NOT_AUTHORIZED"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[rounds/shortlist]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
