import { db } from "@klyp/db";
import * as schema from "@klyp/db/schema/auth";
import { browserTrustedOrigins, env } from "@klyp/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const trustedOrigins = browserTrustedOrigins();
const authURL = new URL(env.BETTER_AUTH_URL);
const appURL = new URL(trustedOrigins[0] ?? env.CORS_ORIGIN);
const useSecureCookies = authURL.protocol === "https:";
const isCrossSite = authURL.hostname !== appURL.hostname;

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins,
	emailAndPassword: {
		enabled: true,
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	advanced: {
		useSecureCookies,
		defaultCookieAttributes: {
			sameSite: isCrossSite ? "none" : "lax",
			secure: useSecureCookies,
			httpOnly: true,
		},
	},
	plugins: [],
});
