import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { approveSubmission } from "@/lib/services/submissions";
import { trackServer } from "@/lib/telemetry/track";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdminSession();
    const submission = await approveSubmission(params.id);
    await trackServer("moderation_approve", {
      userId: session.user.id,
      payload: { submissionId: submission.id },
    });
    return NextResponse.json({ submission });
  } catch (error) {
    if (
      (error as Error).message === "UNAUTHORIZED" ||
      (error as Error).message === "NOT_AUTHORIZED"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[moderation/approve]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
