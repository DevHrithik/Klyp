import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { authClient } from "@/lib/auth-client";

export type AuthSession = typeof authClient.$Infer.Session;

const BACKEND = (
	process.env.BACKEND_URL ??
	process.env.NEXT_PUBLIC_SERVER_URL ??
	""
).replace(/\/$/, "");

/**
 * Server-side session fetch — calls the backend directly (server-to-server),
 * forwarding the incoming request cookies so Better Auth can validate the token.
 * Avoids the loopback overhead of going through the Next.js proxy route.
 */
export async function getSession(): Promise<AuthSession | null> {
	try {
		const requestHeaders = await headers();
		const res = await fetch(`${BACKEND}/api/auth/get-session`, {
			headers: {
				cookie: requestHeaders.get("cookie") ?? "",
			},
			cache: "no-store",
		});

		if (!res.ok) return null;

		const data = await res.json();
		return (data as AuthSession) ?? null;
	} catch {
		return null;
	}
}

export async function requireSession(): Promise<AuthSession> {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	return session;
}
