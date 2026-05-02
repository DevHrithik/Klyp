# Build context = monorepo root (this file lives at the repo root).
# Railway: Root Directory = empty, Builder = Dockerfile, Dockerfile Path = Dockerfile

FROM oven/bun:1.3.8-alpine AS builder
WORKDIR /app

# Copy workspace manifests first for layer caching (no bun.lock — not committed)
COPY package.json tsconfig.json turbo.json ./
COPY packages ./packages
COPY apps/server ./apps/server
COPY apps/web/package.json ./apps/web/package.json

# Install all workspace deps (dev included — tsdown is a devDep)
RUN NODE_ENV=development bun install

# Bundle the server (inlines @klyp/* packages into a single dist/index.mjs)
RUN bunx turbo build --filter=server \
    && test -f apps/server/dist/index.mjs \
    || (echo "ERROR: build did not produce apps/server/dist/index.mjs" && exit 1)

# --- slim runtime image ---
FROM oven/bun:1.3.8-alpine AS runner
WORKDIR /srv

ENV NODE_ENV=production

# Copy the bundle
COPY --from=builder /app/apps/server/dist ./dist

# Remotion and its transitive deps (resvg, rspack) ship native .node binaries
# and are kept external in the bundle — they must be resolvable at runtime.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/package.json ./package.json

EXPOSE 8080

CMD ["bun", "run", "dist/index.mjs"]
