/**
 * Edge middleware — protects app routes and redirects authed users away from /login.
 *
 * Calls the backend directly (BACKEND_URL) to validate the session cookie.
 * This runs before any server component renders, so the 307 → /login
 * never reaches a page that tries to render protected content.
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND = (
	process.env.BACKEND_URL ??
	process.env.NEXT_PUBLIC_SERVER_URL ??
	""
).replace(/\/$/, "");

const PROTECTED_PREFIXES = ["/dashboard", "/projects"];
const AUTH_PREFIXES = ["/login"];

async function getSessionFromBackend(req: NextRequest): Promise<boolean> {
	try {
		const res = await fetch(`${BACKEND}/api/auth/get-session`, {
			headers: {
				cookie: req.headers.get("cookie") ?? "",
			},
		});

		if (!res.ok) return false;

		const session = (await res.json()) as { user?: unknown } | null;
		return !!session?.user;
	} catch {
		return false;
	}
}

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const isProtected = PROTECTED_PREFIXES.some(
		(p) => pathname === p || pathname.startsWith(`${p}/`),
	);
	const isAuthRoute = AUTH_PREFIXES.some(
		(p) => pathname === p || pathname.startsWith(`${p}/`),
	);

	if (!isProtected && !isAuthRoute) return NextResponse.next();

	const isAuthed = await getSessionFromBackend(req);

	if (isProtected && !isAuthed) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (isAuthRoute && isAuthed) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/projects/:path*", "/login"],
};
