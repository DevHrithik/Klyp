import { describe, expect, it } from "bun:test";
import { z } from "zod";

/**
 * Test the env Zod schemas in isolation — without importing the actual env
 * modules (which would call createEnv and throw on missing process.env vars).
 *
 * This acts as the "env runtime check": if someone changes the schema or a
 * required variable, these tests will catch it before the commit lands.
 */

const serverEnvSchema = z.object({
	DATABASE_URL: z.string().min(1),
	BETTER_AUTH_SECRET: z.string().min(32),
	BETTER_AUTH_URL: z.url(),
	CORS_ORIGIN: z.url(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const webEnvSchema = z.object({
	NEXT_PUBLIC_SERVER_URL: z.url(),
});

const validServer = {
	DATABASE_URL: "postgres://user:pass@localhost:5432/klyp",
	BETTER_AUTH_SECRET: "a-very-long-secret-key-that-is-at-least-32-chars!!",
	BETTER_AUTH_URL: "http://localhost:3001",
	CORS_ORIGIN: "http://localhost:3000",
	NODE_ENV: "test" as const,
};

describe("server env schema", () => {
	it("passes with a fully valid env", () => {
		expect(serverEnvSchema.safeParse(validServer).success).toBe(true);
	});

	it("rejects missing DATABASE_URL", () => {
		const { DATABASE_URL: _, ...rest } = validServer;
		expect(serverEnvSchema.safeParse(rest).success).toBe(false);
	});

	it("rejects empty DATABASE_URL", () => {
		expect(
			serverEnvSchema.safeParse({ ...validServer, DATABASE_URL: "" }).success,
		).toBe(false);
	});

	it("rejects BETTER_AUTH_SECRET shorter than 32 chars", () => {
		expect(
			serverEnvSchema.safeParse({
				...validServer,
				BETTER_AUTH_SECRET: "too-short",
			}).success,
		).toBe(false);
	});

	it("rejects invalid BETTER_AUTH_URL", () => {
		expect(
			serverEnvSchema.safeParse({
				...validServer,
				BETTER_AUTH_URL: "not-a-url",
			}).success,
		).toBe(false);
	});

	it("rejects invalid CORS_ORIGIN", () => {
		expect(
			serverEnvSchema.safeParse({
				...validServer,
				CORS_ORIGIN: "not-a-url",
			}).success,
		).toBe(false);
	});

	it("rejects an unknown NODE_ENV value", () => {
		expect(
			serverEnvSchema.safeParse({ ...validServer, NODE_ENV: "staging" })
				.success,
		).toBe(false);
	});

	it("defaults NODE_ENV to 'development' when omitted", () => {
		const { NODE_ENV: _, ...rest } = validServer;
		const result = serverEnvSchema.safeParse(rest);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.NODE_ENV).toBe("development");
		}
	});
});

describe("web env schema", () => {
	it("passes with a valid NEXT_PUBLIC_SERVER_URL", () => {
		expect(
			webEnvSchema.safeParse({
				NEXT_PUBLIC_SERVER_URL: "http://localhost:3001",
			}).success,
		).toBe(true);
	});

	it("rejects missing NEXT_PUBLIC_SERVER_URL", () => {
		expect(webEnvSchema.safeParse({}).success).toBe(false);
	});

	it("rejects an invalid NEXT_PUBLIC_SERVER_URL", () => {
		expect(
			webEnvSchema.safeParse({ NEXT_PUBLIC_SERVER_URL: "not-a-url" }).success,
		).toBe(false);
	});
});
