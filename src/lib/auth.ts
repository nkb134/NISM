import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { db } from './db';
import { users, sessions, accounts, verifications } from './db/schema';
import { sendMagicLink } from './email';

const hasGoogleOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    // Map Better-Auth's internal model names (singular) to our plural table
    // names. Without this, the adapter throws "model 'verification' not
    // found" on the first magic-link POST.
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  // Email/password disabled — we want passwordless only.
  emailAndPassword: { enabled: false },
  socialProviders: hasGoogleOAuth
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  plugins: [
    magicLink({
      // CLAUDE.md spec: 15min expiry, single-use; 3/email/hour rate limit applied at API layer.
      expiresIn: 60 * 15,
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLink(email, url);
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
