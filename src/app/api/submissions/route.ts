import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession, requireSession } from "@/lib/auth/session";
import { listSubmissionsByStatus, submitArtwork } from "@/lib/services/submissions";
import { trackServer } from "@/lib/telemetry/track";
import { type SubmissionStatus, isSubmissionStatus } from "@/types/prisma";

const submissionSchema = z.object({
  imageDataUrl: z
    .string()
    .min(1)
    .regex(/^data:(image\/(png|jpeg|jpg|webp));base64,/i, "Invalid image payload"),
  theme: z.string().max(80).optional().nullable(),
  context: z.string().max(280).optional().nullable(),
});

export async function GET(request: Request) {
  try {
    await requireAdminSession();
  } catch (error) {
    if (
      (error as Error).message === "UNAUTHORIZED" ||
      (error as Error).message === "NOT_AUTHORIZED"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const cursor = searchParams.get("cursor");
  const take = Number(searchParams.get("take") ?? "20");

  const status: SubmissionStatus | undefined =
    statusParam && isSubmissionStatus(statusParam) ? statusParam : undefined;
  if (statusParam && !status) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const limit = Math.min(Math.max(take, 1), 50);
  const { items, nextCursor } = await listSubmissionsByStatus({
    status,
    cursor,
    take: limit,
  });

  return NextResponse.json({ items, nextCursor });
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const raw = await request.json();
    const parsed = submissionSchema.safeParse(raw);
    if (!parsed.success) {
      await trackServer("toast_fail", {
        userId: session.user.id,
        payload: { reason: parsed.error.flatten() },
      });
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const submission = await submitArtwork({
      userId: session.user.id,
      imageUrl: parsed.data.imageDataUrl,
      handle: session.user.handle,
      theme: parsed.data.theme,
      context: parsed.data.context,
    });

    await trackServer("submit", {
      userId: session.user.id,
      payload: { submissionId: submission.id },
    });
    await trackServer("toast_success", {
      userId: session.user.id,
      payload: { submissionId: submission.id },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/submissions] failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
