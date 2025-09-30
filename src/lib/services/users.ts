import { ensureAdmin, getUserById, updateUserRole, upsertUserFromX } from "@/lib/db";
import type { UserRecord } from "@/types/prisma";
import type { UserRole } from "@/types/prisma";

const ADMIN_HANDLE_ALLOWLIST = new Set(
  (process.env.ADMIN_HANDLES ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeHandle),
);

function normalizeHandle(handle: string): string {
  return handle.replace(/^@+/, "").toLowerCase();
}

export async function syncUserFromX(params: {
  xId: string;
  handle: string;
}): Promise<UserRecord> {
  const normalizedHandle = normalizeHandle(params.handle);
  const user = await upsertUserFromX({ xId: params.xId, handle: normalizedHandle });
  if (ADMIN_HANDLE_ALLOWLIST.has(normalizedHandle) && user.role !== "admin") {
    return promoteUser(user.id, "admin");
  }
  return user;
}

export async function promoteUser(userId: string, role: UserRole): Promise<UserRecord> {
  return updateUserRole(userId, role);
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  return getUserById(id);
}

export async function requireAdmin(userId: string): Promise<UserRecord> {
  return ensureAdmin(userId);
}

export function deriveMockXId(handle: string): string {
  return `mock-${normalizeHandle(handle)}`;
}

export function isAdminHandle(handle: string): boolean {
  return ADMIN_HANDLE_ALLOWLIST.has(normalizeHandle(handle));
}
