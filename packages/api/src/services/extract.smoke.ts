/**
 * Phase 3 smoke: run from packages/api.
 *
 *   bun run src/services/extract.smoke.ts
 */

import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(import.meta.dirname, "../../../../apps/server/.env") });

const { extractFromUrl, extractWithScreenshot } = await import("./extract");

// Step 3.2 test
console.log("--- extractFromUrl(vercel.com) ---");
const basic = await extractFromUrl("https://vercel.com");
console.log("title:", basic.title);
console.log("description:", basic.description.slice(0, 80));
console.log("ogImage:", basic.ogImage);
console.log("markdown length:", basic.markdown.length);

if (!basic.markdown.length) {
	console.error("FAIL: markdown is empty");
	process.exit(1);
}
if (!basic.title.toLowerCase().includes("vercel")) {
	console.warn("WARN: title doesn't contain 'vercel':", basic.title);
}
console.log("extractFromUrl OK\n");

// Step 3.3 test
console.log("--- extractWithScreenshot(linear.app) ---");
const withShot = await extractWithScreenshot("https://linear.app");
console.log("title:", withShot.title);
console.log("screenshotUrl:", withShot.screenshotUrl);

if (!withShot.screenshotUrl) {
	console.warn(
		"WARN: screenshotUrl is null — Firecrawl may have not returned a screenshot",
	);
} else {
	console.log("screenshotUrl OK");
}
console.log("extractWithScreenshot OK");
