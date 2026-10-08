import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

async function refreshIdToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const body = await res.json();
  if (!res.ok || !body.id_token) throw new Error("refresh failed");
  return {
    idToken: body.id_token as string,
    expiresAt: Math.floor(Date.now() / 1000) + (body.expires_in as number),
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        // offline + consent: Google returns a refresh token on sign-in
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      return !!(profile as { email_verified?: boolean } | undefined)
        ?.email_verified;
    },
    async jwt({ token, account }) {
      if (account) {
        // first sign-in
        return {
          ...token,
          idToken: account.id_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
        };
      }
      // still valid for more than a minute: keep it
      if (token.expiresAt && Date.now() < (token.expiresAt - 60) * 1000)
        return token;
      if (!token.refreshToken)
        return { ...token, error: "RefreshTokenError" as const };
      try {
        return {
          ...token,
          ...(await refreshIdToken(token.refreshToken)),
          error: undefined,
        };
      } catch {
        return { ...token, error: "RefreshTokenError" as const };
      }
    },
    async session({ session, token }) {
      session.idToken = token.idToken;
      session.error = token.error;
      return session;
    },
  },
};
