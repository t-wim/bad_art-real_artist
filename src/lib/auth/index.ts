export type UserRole = "user" | "admin";

export type SessionUser = {
  id: string;
  handle: string;
  role: UserRole;
};

export const isAdmin = (user: SessionUser | null | undefined): boolean =>
  user?.role === "admin";

export const displayHandle = (user: SessionUser | null | undefined): string =>
  user?.handle ? `@${user.handle.replace(/^@+/, "")}` : "@mystery-artist";
