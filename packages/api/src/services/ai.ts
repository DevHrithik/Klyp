import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const BrandSchema = z.object({
	productName: z.string(),
	tagline: z.string(),
	features: z.array(z.string()).max(5),
	targetAudience: z.string(),
	tone: z.enum(["professional", "playful", "bold", "minimal", "technical"]),
	primaryColor: z.string().describe("hex color e.g. #7b39fc"),
	secondaryColor: z.string().describe("hex color"),
});

export type Brand = z.infer<typeof BrandSchema>;

const ScriptSchema = z.object({
	hook: z.string().describe("opening line, max 15 words, attention-grabbing"),
	scenes: z
		.array(
			z.object({
				text: z.string().describe("on-screen text, max 12 words"),
				narration: z.string().describe("voiceover text for this scene"),
				durationSeconds: z.number().int().min(3).max(10),
			}),
		)
		.min(3)
		.max(5),
	cta: z.string().describe("call-to-action text, max 8 words"),
});

export type Script = z.infer<typeof ScriptSchema>;

export async function analyzeBrand(
	markdown: string,
	url: string,
): Promise<Brand> {
	const { object } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: BrandSchema,
		prompt: `Analyze this product website and extract brand information.
URL: ${url}
Content:
${markdown.slice(0, 8000)}`,
	});
	return object;
}

export async function generateScript(brand: Brand): Promise<Script> {
	const { object } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: ScriptSchema,
		prompt: `Generate a short-form product launch video script (15-30 seconds total) for:
Product: ${brand.productName}
Tagline: ${brand.tagline}
Features: ${brand.features.join(", ")}
Audience: ${brand.targetAudience}
Tone: ${brand.tone}

Make it punchy, founder-friendly, and optimized for social media.`,
	});
	return object;
}
