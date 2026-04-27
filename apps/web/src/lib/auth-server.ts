import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { authClient } from "@/lib/auth-client";

import { authClient as client } from "./auth-client";

export async function getSession() {
	const { data: session } = await client.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	return session;
}

export async function requireSession() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	return session;
}

export type AuthSession = typeof authClient.$Infer.Session;
