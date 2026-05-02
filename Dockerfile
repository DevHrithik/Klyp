# Single-stage image: Bun runs TypeScript directly in production.
# No bundler = no native-module footguns (sharp, remotion, etc).
#
# Railway settings:
#   Root Directory: (empty)
#   Builder: DOCKERFILE
#   Dockerfile Path: Dockerfile
FROM oven/bun:1.3.8-alpine
WORKDIR /app

ENV NODE_ENV=production \
    HUSKY=0 \
    PORT=8080

# Workspace manifests + lockfile first (better layer caching).
COPY package.json bun.lock turbo.json tsconfig.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY apps/inngest/package.json ./apps/inngest/
COPY packages ./packages

# Deterministic install. --production drops devDeps. We DO NOT pass
# --ignore-scripts so sharp's prebuilt binary postinstall runs correctly.
RUN bun install --frozen-lockfile --production

# Now copy the server source. Web/inngest aren't needed at runtime.
COPY apps/server ./apps/server

EXPOSE 8080
WORKDIR /app/apps/server
CMD ["bun", "run", "src/index.ts"]
