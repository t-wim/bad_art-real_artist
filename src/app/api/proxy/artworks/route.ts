import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SUBMISSION_STATUS } from "@/types/prisma";
import type { SubmissionRecord } from "@/types/prisma";

const DEFAULT_LIMIT = 12;

type ProxyArtwork = {
  id: string;
  title: string;
  author: string | null;
  mime: "image/png" | "image/jpeg" | "image/webp";
  imageBase64: string;
  createdAt: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(
    1,
    Math.min(Number(searchParams.get("limit") ?? DEFAULT_LIMIT), 50),
  );
  const cursor = searchParams.get("cursor");

  const submissions = await prisma.submission.findMany({
    where: {
      status: { in: [SUBMISSION_STATUS.approved, SUBMISSION_STATUS.shortlisted] },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
  });

  const items = submissions
    .map((submission: SubmissionRecord): ProxyArtwork | null => {
      const match = /^data:(?<mime>[^;]+);base64,(?<data>.+)$/i.exec(submission.imageUrl);
      if (!match?.groups) return null;
      return {
        id: submission.id,
        title: submission.theme ?? submission.handle ?? "Untitled",
        author: submission.handle,
        mime: normalizeMime(match.groups.mime ?? ""),
        imageBase64: match.groups.data,
        createdAt: submission.createdAt.toISOString(),
      };
    })
    .filter((value: ProxyArtwork | null): value is ProxyArtwork => value !== null);

  const nextCursor =
    submissions.length === limit ? submissions[submissions.length - 1].id : null;

  return NextResponse.json({ items, nextCursor });
}

function normalizeMime(raw: string): ProxyArtwork["mime"] {
  const value = raw.toLowerCase();
  if (value.includes("jpeg") || value.includes("jpg")) return "image/jpeg";
  if (value.includes("webp")) return "image/webp";
  return "image/png";
}
