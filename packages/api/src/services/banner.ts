import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { Brand } from "./ai";

let _font: Buffer | null = null;

async function getFont(): Promise<Buffer> {
	if (!_font) {
		// woff2 is not supported by satori's opentype parser — use woff instead
		const res = await fetch(
			"https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff",
		);
		_font = Buffer.from(await res.arrayBuffer());
	}
	return _font;
}

export interface BannerOptions {
	brand: Brand;
	screenshotUrl?: string | null;
	format?: "twitter_post" | "linkedin_post";
}

export async function generateBanner(opts: BannerOptions): Promise<Buffer> {
	const { brand, screenshotUrl } = opts;
	const font = await getFont();

	const children = [
		screenshotUrl
			? {
					type: "img",
					props: {
						src: screenshotUrl,
						style: {
							position: "absolute",
							top: 0,
							right: 0,
							width: "55%",
							height: "100%",
							objectFit: "cover",
							opacity: 0.25,
						},
					},
				}
			: null,
		{
			type: "div",
			props: {
				style: {
					fontSize: 48,
					fontWeight: 700,
					lineHeight: 1.1,
					marginBottom: 16,
					maxWidth: "60%",
				},
				children: brand.productName,
			},
		},
		{
			type: "div",
			props: {
				style: {
					fontSize: 22,
					color: "rgba(255,255,255,0.7)",
					maxWidth: "55%",
				},
				children: brand.tagline,
			},
		},
		{
			type: "div",
			props: {
				style: {
					marginTop: 32,
					fontSize: 15,
					color: brand.primaryColor,
					fontWeight: 600,
				},
				children: "Made with Klyp",
			},
		},
	].filter(Boolean);

	const svg = await satori(
		{
			type: "div",
			props: {
				style: {
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					padding: "48px",
					background: `linear-gradient(135deg, ${brand.primaryColor}22 0%, #03000a 60%)`,
					border: `1px solid ${brand.primaryColor}44`,
					fontFamily: "Inter",
					color: "#ffffff",
					position: "relative",
				},
				children,
			},
		},
		{
			width: 1200,
			height: 675,
			fonts: [{ name: "Inter", data: font, weight: 400, style: "normal" }],
		},
	);

	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
	return Buffer.from(resvg.render().asPng());
}
