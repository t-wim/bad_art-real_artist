import { NextResponse } from "next/server";
import { aggregateVotes } from "@/lib/services/votes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roundId = searchParams.get("roundId");
  if (!roundId) {
    return NextResponse.json({ error: "roundId required" }, { status: 400 });
  }

  const aggregates = await aggregateVotes(roundId);
  return NextResponse.json({ results: aggregates });
}
