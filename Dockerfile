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

# Bundle the server (inlines most deps; native .node packages stay external)
RUN bunx turbo build --filter=server \
    && test -f apps/server/dist/index.mjs \
    || (echo "ERROR: build did not produce apps/server/dist/index.mjs" && exit 1)

# --- slim runtime image ---
FROM oven/bun:1.3.8-alpine AS runner
WORKDIR /srv

ENV NODE_ENV=production

# Copy the bundle
COPY --from=builder /app/apps/server/dist ./dist

# Copy workspace manifests so bun can resolve external npm deps at runtime
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/packages ./packages

# Install production deps only (HUSKY=0 prevents the prepare script from
# failing when husky isn't installed as a devDep)
RUN HUSKY=0 NODE_ENV=production bun install --production

EXPOSE 8080

CMD ["bun", "run", "dist/index.mjs"]
