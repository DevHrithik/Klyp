import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./src/index.ts",
	format: "esm",
	outDir: "./dist",
	clean: true,
	// Bundle all npm deps into the output so the runner doesn't need most
	// of node_modules. @klyp/* workspace packages are always inlined.
	noExternal: [/.*/],
	// Native .node binaries cannot be parsed as JS — keep them external.
	// The runner installs production deps as a fallback for anything else
	// that rolldown (beta) can't inline.
	external: [/^remotion$/, /^@remotion\//, /^@resvg\//, /^@rspack\//],
});
