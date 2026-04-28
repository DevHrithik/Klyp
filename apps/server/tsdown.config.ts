import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./src/index.ts",
	format: "esm",
	outDir: "./dist",
	clean: true,
	// Bundle everything into a single self-contained file.
	// @klyp/* workspace packages are always inlined.
	// External npm deps (express, better-auth, zod, etc.) are also bundled
	// so the output has zero runtime dependencies — no node_modules needed.
	noExternal: [/.*/],
});
