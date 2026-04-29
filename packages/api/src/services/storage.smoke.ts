/**
 * Phase 2 smoke: run from monorepo root or packages/api with real R2 env.
 *
 *   cd packages/api && bun run src/services/storage.smoke.ts
 */

import { resolve } from "node:path";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config({
	path: resolve(import.meta.dirname, "../../../../apps/server/.env"),
});

const { env } = await import("@klyp/env/server");
const { uploadToR2, getSignedDownloadUrl, r2 } = await import("./storage");

const key = `test/hello-${Date.now()}.txt`;
const body = Buffer.from("hello world", "utf8");

const publicUrl = await uploadToR2(key, body, "text/plain; charset=utf-8");
console.log("Public URL:", publicUrl);

const signed = await getSignedDownloadUrl(key);
console.log("Signed URL:", signed);

const res = await fetch(signed);
if (!res.ok) {
	console.error("Signed GET failed:", res.status);
	process.exit(1);
}
const text = await res.text();
if (text !== "hello world") {
	console.error("Body mismatch");
	process.exit(1);
}
console.log("Signed GET OK");

await r2.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: key }));
console.log("Cleaned up object");
