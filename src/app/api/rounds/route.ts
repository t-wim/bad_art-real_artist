import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { createDraftRound } from "@/lib/services/rounds";

const roundSchema = z.object({
  startsAt: z.string().transform((v) => new Date(v)),
  endsAt: z.string().transform((v) => new Date(v)),
});

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parsed = roundSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const round = await createDraftRound({
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
    });

    return NextResponse.json({ round }, { status: 201 });
  } catch (error) {
    if (
      (error as Error).message === "UNAUTHORIZED" ||
      (error as Error).message === "NOT_AUTHORIZED"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[rounds] create", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
