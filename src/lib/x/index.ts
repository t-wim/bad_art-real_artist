export type XCredential = {
  clientId: string;
  clientSecret: string;
  bearerToken: string;
};

export const requiredXCredentialKeys: Array<keyof XCredential> = [
  "clientId",
  "clientSecret",
  "bearerToken",
];

export const resolveXCredentials = (): XCredential | null => {
  const clientId = process.env.X_CLIENT_ID ?? "";
  const clientSecret = process.env.X_CLIENT_SECRET ?? "";
  const bearerToken = process.env.X_BEARER ?? "";

  if (!clientId || !clientSecret || !bearerToken) {
    return null;
  }

  return { clientId, clientSecret, bearerToken };
};

export function requireXCredentials(): XCredential {
  const credentials = resolveXCredentials();
  if (!credentials) {
    throw new Error(
      "Missing X credentials. Please set X_CLIENT_ID, X_CLIENT_SECRET and X_BEARER.",
    );
  }
  return credentials;
}
