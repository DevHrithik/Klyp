import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		FIRECRAWL_API_KEY: z.string().min(1),
		OPENAI_API_KEY: z.string().min(1),
		R2_ACCOUNT_ID: z.string().min(1),
		R2_ACCESS_KEY_ID: z.string().min(1),
		R2_SECRET_ACCESS_KEY: z.string().min(1),
		R2_BUCKET: z.string().min(1),
		R2_PUBLIC_URL: z.url(),
		INNGEST_EVENT_KEY: z.string().min(1),
		INNGEST_SIGNING_KEY: z.string().min(1),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		CORS_ORIGIN: process.env.CORS_ORIGIN,
		NODE_ENV: process.env.NODE_ENV,
		FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		R2_ACCOUNT_ID:
			process.env.R2_ACCOUNT_ID ?? process.env.CLOUDFLARE_R2_ACCOUNT_ID,
		R2_ACCESS_KEY_ID:
			process.env.R2_ACCESS_KEY_ID ?? process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
		R2_SECRET_ACCESS_KEY:
			process.env.R2_SECRET_ACCESS_KEY ??
			process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
		R2_BUCKET: process.env.R2_BUCKET ?? process.env.CLOUDFLARE_R2_BUCKET,
		R2_PUBLIC_URL:
			process.env.R2_PUBLIC_URL ?? process.env.CLOUDFLARE_R2_PUBLIC_URL,
		INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
		INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
	},
	emptyStringAsUndefined: true,
});
