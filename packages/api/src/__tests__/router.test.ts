import { describe, expect, it } from "bun:test";
import { createRouterClient, ORPCError, os } from "@orpc/server";

/**
 * Unit tests for the API layer.
 *
 * We rebuild the procedures here (no imports from @klyp/auth / @klyp/env) so
 * the suite runs without any real environment variables.
 */

type MockUser = { id: string; email: string; name: string };
type MockSession = { user: MockUser } | null;
type TestContext = { session: MockSession };

const o = os.$context<TestContext>();

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({ context: { session: context.session } });
});

const testRouter = {
	healthCheck: o.handler(() => "OK" as const),
	privateData: o.use(requireAuth).handler(({ context }) => ({
		message: "This is private",
		user: context.session?.user,
	})),
};

const mockUser: MockUser = {
	id: "1",
	email: "test@klyp.com",
	name: "Test User",
};

const anonCaller = createRouterClient(testRouter, {
	context: async () => ({ session: null }),
});

const authCaller = createRouterClient(testRouter, {
	context: async () => ({ session: { user: mockUser } }),
});

describe("healthCheck", () => {
	it("returns 'OK' without authentication", async () => {
		const result = await anonCaller.healthCheck();
		expect(result).toBe("OK");
	});

	it("returns 'OK' when authenticated too", async () => {
		const result = await authCaller.healthCheck();
		expect(result).toBe("OK");
	});
});

describe("privateData", () => {
	it("throws UNAUTHORIZED when called without a session", async () => {
		await expect(anonCaller.privateData()).rejects.toBeInstanceOf(ORPCError);
		try {
			await anonCaller.privateData();
		} catch (e) {
			expect((e as ORPCError).code).toBe("UNAUTHORIZED");
		}
	});

	it("returns data with the authenticated user when session is valid", async () => {
		const result = await authCaller.privateData();
		expect(result.message).toBe("This is private");
		expect(result.user).toEqual(mockUser);
	});
});
