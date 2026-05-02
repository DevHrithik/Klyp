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
	// Remotion and its transitive deps ship platform-specific native .node
	// binaries that cannot be parsed as JS/UTF-8 — keep them external so
	// rolldown never tries to inline them.
	external: [/^remotion$/, /^@remotion\//, /^@resvg\//, /^@rspack\//],
});
