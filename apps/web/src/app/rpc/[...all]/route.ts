/**
 * Runtime proxy for all /rpc/** requests → backend (Railway).
 * Same reasoning as /api/auth proxy: runtime env var, no build-time dependency,
 * and cookies set on this Vercel domain are forwarded correctly.
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
	const url = `${BACKEND}/rpc/${path}${search}`;

	const proxyHeaders = new Headers();
	const cookie = req.headers.get("cookie");
	if (cookie) proxyHeaders.set("cookie", cookie);
	const ct = req.headers.get("content-type");
	if (ct) proxyHeaders.set("content-type", ct);
	const auth = req.headers.get("authorization");
	if (auth) proxyHeaders.set("authorization", auth);
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
