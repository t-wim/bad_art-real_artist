declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL?: string;
      NEXTAUTH_SECRET?: string;
      DATABASE_URL?: string;
      X_CLIENT_ID?: string;
      X_CLIENT_SECRET?: string;
      X_BEARER?: string;
      PRISMA_SKIP_POSTINSTALL?: string;
      PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING?: string;
    }
  }
}

export {};
