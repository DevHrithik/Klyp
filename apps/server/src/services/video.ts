import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Brand, Script } from "@klyp/api/services/ai";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const ENTRY_POINT = path.join(import.meta.dirname, "../remotion/index.tsx");

// Bundle once per process and reuse — bundling takes ~20–30s on first call
let _bundleUrl: string | null = null;

async function getBundleUrl(): Promise<string> {
	if (!_bundleUrl) {
		console.log("[video] Bundling Remotion composition (first run)…");
		_bundleUrl = await bundle({ entryPoint: ENTRY_POINT });
		console.log("[video] Bundle ready:", _bundleUrl);
	}
	return _bundleUrl;
}

export async function renderVideo(
	brand: Brand,
	script: Script,
): Promise<Buffer> {
	const fps = 30;
	const hookFrames = 3 * fps;
	const sceneFrames = script.scenes.reduce(
		(sum, sc) => sum + sc.durationSeconds * fps,
		0,
	);
	const ctaFrames = 3 * fps;
	const totalFrames = hookFrames + sceneFrames + ctaFrames;

	const serveUrl = await getBundleUrl();
	const inputProps = { brand, script };

	const composition = await selectComposition({
		serveUrl,
		id: "LaunchVideo",
		inputProps,
	});

	const outPath = path.join(tmpdir(), `klyp-video-${Date.now()}.mp4`);

	await renderMedia({
		composition: { ...composition, durationInFrames: totalFrames },
		serveUrl,
		codec: "h264",
		outputLocation: outPath,
		inputProps,
		logLevel: "warn",
	});

	return readFile(outPath);
}
