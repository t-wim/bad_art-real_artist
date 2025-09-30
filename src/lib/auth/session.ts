import { auth } from "./options";
import { requireAdmin } from "@/lib/services/users";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdminSession() {
  const session = await requireSession();
  await requireAdmin(session.user.id);
  return session;
}
