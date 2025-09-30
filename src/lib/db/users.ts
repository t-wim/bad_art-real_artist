import { prisma } from "./client";
import type { UserRecord, UserRole } from "@/types/prisma";
import { USER_ROLES } from "@/types/prisma";

const ADMIN_ROLE: UserRole = USER_ROLES[1];

export type XProfile = {
  xId: string;
  handle: string;
};

export async function upsertUserFromX(profile: XProfile): Promise<UserRecord> {
  const handle = await ensureHandle(profile.xId, profile.handle);
  return prisma.user.upsert({
    where: { xId: profile.xId },
    create: {
      xId: profile.xId,
      handle,
    },
    update: {
      handle,
    },
  });
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByHandle(handle: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { handle } });
}

export async function ensureAdmin(userId: string): Promise<UserRecord> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== ADMIN_ROLE) {
    throw new Error("NOT_AUTHORIZED");
  }
  return user;
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<UserRecord> {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

async function ensureHandle(xId: string, rawHandle: string) {
  const base = rawHandle.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || `user-${xId}`;
  let candidate = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.user.findUnique({ where: { handle: candidate } });
    if (!existing || existing.xId === xId) return candidate;
    candidate = `${base}-${counter++}`;
  }
}

export async function listAdmins(): Promise<UserRecord[]> {
  return prisma.user.findMany({ where: { role: ADMIN_ROLE } });
}
