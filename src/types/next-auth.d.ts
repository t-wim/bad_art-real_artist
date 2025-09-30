import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types/prisma";

type BartSessionUser = DefaultSession["user"] & {
  id: string;
  handle: string;
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: BartSessionUser;
  }

  interface User {
    id: string;
    handle: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    handle?: string;
  }
}
