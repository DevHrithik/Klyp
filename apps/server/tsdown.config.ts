import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./src/index.ts",
	format: "esm",
	outDir: "./dist",
	clean: true,
	// Inline only the @klyp/* workspace packages so the output doesn't need
	// the monorepo structure at runtime. All npm deps stay external and are
	// resolved from node_modules at runtime.
	noExternal: [/^@klyp\//],
});
