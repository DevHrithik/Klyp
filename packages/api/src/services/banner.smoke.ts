import { writeFile } from "node:fs/promises";
import { generateBanner } from "./banner";

console.log("Generating banner (fetching font on first run)...");

const png = await generateBanner({
	brand: {
		productName: "Klyp",
		tagline: "AI Launch Engine",
		features: ["Video generation", "Banner creation", "Brand analysis"],
		targetAudience: "Founders",
		tone: "bold",
		primaryColor: "#7b39fc",
		secondaryColor: "#c4a1ff",
	},
});

const outPath = "/tmp/test-banner.png";
await writeFile(outPath, png);
console.log(`Banner written to ${outPath} (${png.length} bytes)`);
console.log("Open it to verify visually.");
