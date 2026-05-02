/**
 * Runtime proxy for all /api/auth/** requests → backend (Railway).
 *
 * Why a route handler instead of next.config rewrites:
 * - Rewrites are evaluated at BUILD time; BACKEND_URL may not be set yet.
 * - Route handlers run at REQUEST time — always picks up the env var.
 * - Cookies in Set-Cookie responses are forwarded intact, scoping them to
 *   this Vercel domain so SSR can read them via headers().
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND = (
	process.env.BACKEND_URL ??
	process.env.NEXT_PUBLIC_SERVER_URL ??
	""
).replace(/\/$/, "");

async function handler(
	req: NextRequest,
	{ params }: { params: Promise<{ all: string[] }> },
) {
	const { all } = await params;
	const path = all.join("/");
	const search = req.nextUrl.search;
	const url = `${BACKEND}/api/auth/${path}${search}`;

	const proxyHeaders = new Headers();
	const cookie = req.headers.get("cookie");
	if (cookie) proxyHeaders.set("cookie", cookie);
	const ct = req.headers.get("content-type");
	if (ct) proxyHeaders.set("content-type", ct);
	// Better Auth CSRF checks Origin against trustedOrigins. Prefer real
	// Origin; when missing (same-origin fetch), rebuild from Host + forwarded
	// proto so Vercel’s internal URL scheme is not wrong.
	const host = req.headers.get("host");
	const fromForwarded = req.headers
		.get("x-forwarded-proto")
		?.split(",")[0]
		?.trim();
	const fallbackOrigin = host
		? `${fromForwarded ?? req.nextUrl.protocol.replace(":", "")}://${host}`
		: "";
	const origin = req.headers.get("origin") ?? fallbackOrigin;
	if (origin) proxyHeaders.set("origin", origin);
	proxyHeaders.set("x-forwarded-host", req.headers.get("host") ?? "");
	proxyHeaders.set("x-forwarded-for", req.headers.get("x-forwarded-for") ?? "");

	const hasBody = req.method !== "GET" && req.method !== "HEAD";

	const upstream = await fetch(url, {
		method: req.method,
		headers: proxyHeaders,
		body: hasBody ? req.body : null,
		// @ts-expect-error – duplex is needed for streaming request bodies
		duplex: "half",
	});

	const responseHeaders = new Headers();
	upstream.headers.forEach((value, key) => {
		responseHeaders.append(key, value);
	});

	return new NextResponse(upstream.body, {
		status: upstream.status,
		headers: responseHeaders,
	});
}

export const GET = handler;
export const POST = handler;
