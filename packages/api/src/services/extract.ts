import { env } from "@klyp/env/server";
import Firecrawl from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl({ apiKey: env.FIRECRAWL_API_KEY });

export interface ExtractResult {
	markdown: string;
	title: string;
	description: string;
	ogImage: string | null;
}

export async function extractFromUrl(url: string): Promise<ExtractResult> {
	const doc = await firecrawl.scrape(url, {
		formats: ["markdown"],
		onlyMainContent: true,
	});

	if (!doc.markdown && !doc.metadata) {
		throw new Error(`Firecrawl returned empty document for ${url}`);
	}

	return {
		markdown: doc.markdown ?? "",
		title: doc.metadata?.title ?? "",
		description: doc.metadata?.description ?? "",
		ogImage: doc.metadata?.ogImage ?? null,
	};
}

export async function extractWithScreenshot(
	url: string,
): Promise<ExtractResult & { screenshotUrl: string | null }> {
	const doc = await firecrawl.scrape(url, {
		formats: ["markdown", "screenshot"],
		onlyMainContent: true,
	});

	if (!doc.markdown && !doc.metadata) {
		throw new Error(`Firecrawl returned empty document for ${url}`);
	}

	return {
		markdown: doc.markdown ?? "",
		title: doc.metadata?.title ?? "",
		description: doc.metadata?.description ?? "",
		ogImage: doc.metadata?.ogImage ?? null,
		screenshotUrl: doc.screenshot ?? null,
	};
}
