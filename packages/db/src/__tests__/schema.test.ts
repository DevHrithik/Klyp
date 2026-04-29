import { describe, expect, it } from "bun:test";
import { getTableColumns, getTableName } from "drizzle-orm";

import { account, session, user, verification } from "../schema/auth";
import { asset, banner, project } from "../schema/project";

/**
 * Schema structure tests — no DB connection required.
 * These verify that Drizzle table definitions have the columns and names that
 * Better Auth (and the rest of the app) expects.
 */

describe("user table", () => {
	it("has the correct table name", () => {
		expect(getTableName(user)).toBe("user");
	});

	it("has all required columns", () => {
		const cols = getTableColumns(user);
		expect(cols).toHaveProperty("id");
		expect(cols).toHaveProperty("name");
		expect(cols).toHaveProperty("email");
		expect(cols).toHaveProperty("emailVerified");
		expect(cols).toHaveProperty("image");
		expect(cols).toHaveProperty("createdAt");
		expect(cols).toHaveProperty("updatedAt");
	});

	it("email column is marked unique", () => {
		const { email } = getTableColumns(user);
		expect(email.isUnique).toBe(true);
	});
});

describe("session table", () => {
	it("has the correct table name", () => {
		expect(getTableName(session)).toBe("session");
	});

	it("has all required columns", () => {
		const cols = getTableColumns(session);
		expect(cols).toHaveProperty("id");
		expect(cols).toHaveProperty("userId");
		expect(cols).toHaveProperty("token");
		expect(cols).toHaveProperty("expiresAt");
		expect(cols).toHaveProperty("ipAddress");
		expect(cols).toHaveProperty("userAgent");
		expect(cols).toHaveProperty("createdAt");
		expect(cols).toHaveProperty("updatedAt");
	});

	it("token column is marked unique", () => {
		const { token } = getTableColumns(session);
		expect(token.isUnique).toBe(true);
	});
});

describe("account table", () => {
	it("has the correct table name", () => {
		expect(getTableName(account)).toBe("account");
	});

	it("has all required columns", () => {
		const cols = getTableColumns(account);
		expect(cols).toHaveProperty("id");
		expect(cols).toHaveProperty("userId");
		expect(cols).toHaveProperty("accountId");
		expect(cols).toHaveProperty("providerId");
		expect(cols).toHaveProperty("accessToken");
		expect(cols).toHaveProperty("refreshToken");
		expect(cols).toHaveProperty("password");
	});
});

describe("verification table", () => {
	it("has the correct table name", () => {
		expect(getTableName(verification)).toBe("verification");
	});

	it("has all required columns", () => {
		const cols = getTableColumns(verification);
		expect(cols).toHaveProperty("id");
		expect(cols).toHaveProperty("identifier");
		expect(cols).toHaveProperty("value");
		expect(cols).toHaveProperty("expiresAt");
		expect(cols).toHaveProperty("createdAt");
		expect(cols).toHaveProperty("updatedAt");
	});
});

describe("project table", () => {
	it("has the correct table name", () => {
		expect(getTableName(project)).toBe("project");
	});

	it("has all required columns", () => {
		const cols = getTableColumns(project);
		expect(cols).toHaveProperty("id");
		expect(cols).toHaveProperty("userId");
		expect(cols).toHaveProperty("url");
		expect(cols).toHaveProperty("status");
		expect(cols).toHaveProperty("progress");
		expect(cols).toHaveProperty("errorMessage");
		expect(cols).toHaveProperty("videoUrl");
		expect(cols).toHaveProperty("screenshotUrl");
		expect(cols).toHaveProperty("scriptJson");
		expect(cols).toHaveProperty("brandJson");
		expect(cols).toHaveProperty("createdAt");
		expect(cols).toHaveProperty("updatedAt");
	});
});

describe("asset table", () => {
	it("has the correct table name", () => {
		expect(getTableName(asset)).toBe("asset");
	});

	it("has all required columns", () => {
		const cols = getTableColumns(asset);
		expect(cols).toHaveProperty("id");
		expect(cols).toHaveProperty("projectId");
		expect(cols).toHaveProperty("type");
		expect(cols).toHaveProperty("url");
		expect(cols).toHaveProperty("mime");
		expect(cols).toHaveProperty("sizeBytes");
		expect(cols).toHaveProperty("createdAt");
	});
});

describe("banner table", () => {
	it("has the correct table name", () => {
		expect(getTableName(banner)).toBe("banner");
	});

	it("has all required columns", () => {
		const cols = getTableColumns(banner);
		expect(cols).toHaveProperty("id");
		expect(cols).toHaveProperty("projectId");
		expect(cols).toHaveProperty("format");
		expect(cols).toHaveProperty("imageUrl");
		expect(cols).toHaveProperty("createdAt");
	});
});
