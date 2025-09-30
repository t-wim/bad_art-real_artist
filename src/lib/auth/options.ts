import NextAuth, { type NextAuthConfig } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import type { AdapterUser } from "next-auth/adapters";

import { findUserById, deriveMockXId, syncUserFromX } from "@/lib/services/users";
import { trackServer } from "@/lib/telemetry/track";
import type { UserRole } from "@/types/prisma";
import { resolveXCredentials } from "@/lib/x";

const DEFAULT_ROLE: UserRole = "user";

type TwitterOAuthProfile = {
  data?: { username?: string | null } | null;
  screen_name?: string | null;
  name?: string | null;
};

type CallbackMap = NonNullable<NextAuthConfig["callbacks"]>;
type EventMap = NonNullable<NextAuthConfig["events"]>;

type SignInParams = Parameters<NonNullable<CallbackMap["signIn"]>>[0];
type SessionParams = Parameters<NonNullable<CallbackMap["session"]>>[0];
type JwtParams = Parameters<NonNullable<CallbackMap["jwt"]>>[0];
type SignOutParams = Parameters<NonNullable<EventMap["signOut"]>>[0];

type CredentialsAuthorizeParams = {
  handle?: string;
};

function extractHandle(options: {
  profile?: TwitterOAuthProfile | null;
  credentials?: CredentialsAuthorizeParams | null;
  fallback: string;
}): string {
  if (options.credentials?.handle) {
    return options.credentials.handle.trim().replace(/^@+/, "");
  }
  const profileHandle =
    options.profile?.data?.username ??
    options.profile?.screen_name ??
    options.profile?.name ??
    options.fallback;
  return profileHandle.toString().replace(/^@+/, "");
}

const xCredentials = resolveXCredentials();

const providers: NextAuthConfig["providers"] = xCredentials
  ? [
      Twitter({
        clientId: xCredentials.clientId,
        clientSecret: xCredentials.clientSecret,
      }),
    ]
  : [
      Credentials({
        id: "mock-x",
        name: "Mock X",
        credentials: {
          handle: { label: "@handle", type: "text" },
        },
        async authorize(credentials) {
          const rawHandle =
            typeof credentials?.handle === "string" ? credentials.handle : undefined;
          const handle = rawHandle?.trim().replace(/^@+/, "");
          if (!handle) return null;
          return {
            id: deriveMockXId(handle),
            name: `@${handle}`,
            handle,
          } as AdapterUser & { handle: string };
        },
      }),
    ];

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile, credentials }: SignInParams) {
      if (!account) return false;
      const handle = extractHandle({
        profile: (profile as TwitterOAuthProfile | null) ?? null,
        credentials: (credentials as CredentialsAuthorizeParams | null) ?? null,
        fallback: user?.name ?? `artist-${Date.now()}`,
      });
      const providerAccountId =
        account.provider === "twitter" && account.providerAccountId
          ? account.providerAccountId
          : deriveMockXId(handle);
      const dbUser = await syncUserFromX({ xId: providerAccountId, handle });

      const adapterUser = user as AdapterUser & { handle?: string; role?: UserRole };
      adapterUser.id = dbUser.id;
      adapterUser.email = "";
      adapterUser.emailVerified = null;
      adapterUser.name = `@${dbUser.handle}`;
      adapterUser.handle = dbUser.handle;
      adapterUser.role = dbUser.role;

      await trackServer("auth_login_success", { userId: dbUser.id });
      return true;
    },
    async session({ session, token }: SessionParams) {
      const normalized: AdapterUser & { handle: string; role: UserRole } = {
        id: "",
        email: "",
        emailVerified: null,
        handle: "",
        role: DEFAULT_ROLE,
        name: null,
      };
      if (token.sub) {
        const dbUser = await findUserById(String(token.sub));
        if (dbUser) {
          normalized.id = dbUser.id;
          normalized.handle = dbUser.handle;
          normalized.role = dbUser.role;
          normalized.name = `@${dbUser.handle}`;
        }
      }
      session.user = normalized;
      return session;
    },
    async jwt({ token, user }: JwtParams) {
      if (user) {
        const enriched = user as AdapterUser & { handle?: string; role?: UserRole };
        token.sub = enriched.id;
        token.role = enriched.role ?? DEFAULT_ROLE;
        token.handle = enriched.handle ?? enriched.name?.toString().replace(/^@+/, "");
        return token;
      }
      if (token.sub) {
        const dbUser = await findUserById(String(token.sub));
        if (dbUser) {
          token.role = dbUser.role;
          token.handle = dbUser.handle;
        }
      }
      return token;
    },
  },
  events: {
    async signOut(message: SignOutParams) {
      if ("token" in message && message.token?.sub) {
        await trackServer("auth_logout", { userId: String(message.token.sub) });
      }
    },
  },
};

export const { handlers, auth } = NextAuth(authConfig);
