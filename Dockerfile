# Build context = monorepo root (this file lives at the repo root).
# Railway: Root Directory = empty, Builder = Dockerfile, Dockerfile Path = Dockerfile

FROM oven/bun:1.3.8-alpine AS builder
WORKDIR /app

# Copy workspace manifests + lockfile first for layer caching
COPY bun.lock package.json tsconfig.json turbo.json ./
COPY packages ./packages
COPY apps/server ./apps/server
COPY apps/web/package.json ./apps/web/package.json

# Install all workspace deps from repo root
RUN bun install --frozen-lockfile

# Bundle the server (inlines @klyp/* packages into a single dist/index.mjs)
RUN bunx turbo build --filter=server

# --- slim runtime image ---
FROM oven/bun:1.3.8-alpine AS runner
WORKDIR /srv

ENV NODE_ENV=production

COPY --from=builder /app/apps/server/dist/index.mjs ./index.mjs

EXPOSE 8080

CMD ["bun", "run", "index.mjs"]
