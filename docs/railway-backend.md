# Deploy `apps/server` to Railway

This repo is a **Bun + Turborepo** monorepo. The API lives under `apps/server` and depends on workspace packages (`@klyp/api`, `@klyp/auth`, `@klyp/db`, `@klyp/env`). Deploy from the **repository root** so `bun install` can link workspaces and `turbo build` can bundle `@klyp/*` into `apps/server/dist`.

## Pre-flight: are we good to deploy?

| Check | Notes |
|-------|--------|
| **Build** | `bun install && bunx turbo build --filter=server` completes; output is `apps/server/dist/index.mjs`. |
| **Runtime** | Server uses `PORT` (Railway sets this); binds to `0.0.0.0`; `trust proxy` enabled for HTTPS behind Railway. |
| **Health** | `GET /health` returns JSON (200 if DB ok, 503 if DB unreachable). Point Railway health checks here. |
| **Secrets** | Set all env vars below in Railway (no secrets in git). |
| **Auth URLs** | `BETTER_AUTH_URL` must be your **Railway public HTTPS URL** for the API (e.g. `https://your-service.up.railway.app`). `CORS_ORIGIN` must be your **Next.js app origin** (e.g. `https://app.yourdomain.com`). Mismatch breaks cookies / CORS. |

## Environment variables (Railway)

Copy from local `apps/server/.env` and adjust for production:

| Variable | Required | Example |
|----------|-----------|---------|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | Yes | Long random string (≥ 32 chars), **new secret for prod** OK |
| `BETTER_AUTH_URL` | Yes | `https://<your-railway-subdomain>.up.railway.app` (no trailing slash) |
| `CORS_ORIGIN` | Yes | `https://your-frontend-domain.com` or Vercel preview URL |
| `NODE_ENV` | Recommended | `production` |

Railway injects **`PORT`** automatically — do not set it manually unless you know what you’re doing.

Optional keys from your local `.env` (future features) can be added later (`FIRECRAWL_API_KEY`, etc.).

## Railway setup (GUI)

1. **[railway.app](https://railway.app)** → **New project** → **Deploy from GitHub** → select this repo.
2. **Settings → Root Directory** → leave **empty** (repo root).
3. **Settings → Build**:
   - **Custom build command:**  
     `bun install --frozen-lockfile && bunx turbo build --filter=server`
   - Railway’s default install may already run `bun install`; keeping one explicit install + turbo build avoids partial installs.
4. **Settings → Deploy → Custom start command:**  
   `bun run apps/server/dist/index.mjs`
5. **Networking** → **Generate domain** (HTTPS). Use that URL as `BETTER_AUTH_URL`.
6. **Variables** → add the table above. Redeploy after changing env.
7. **Health check** (if Railway offers HTTP health path): path `/health`, expect **200** when DB is up.

## Verify after deploy

```bash
curl -sS https://<your-railway-host>/health | jq
```

Example 200 body:

```json
{
  "status": "ok",
  "database": "ok",
  "env": "production",
  "uptimeMs": 1234,
  "timestamp": "2026-04-28T12:00:00.000Z"
}
```

Also:

```bash
curl -sS -o /dev/null -w "%{http_code}" https://<your-railway-host>/
# expect 200 and body OK
```

## Frontend

Set **`NEXT_PUBLIC_SERVER_URL`** (e.g. in Vercel) to the same Railway HTTPS base URL the browser will call for `/rpc` and `/api/auth`.

## Optional: `railway.toml` at repo root

You can pin build/start in-repo (Railway picks it up when present):

```toml
[build]
builder = "nixpacks"
buildCommand = "bun install --frozen-lockfile && bunx turbo build --filter=server"

[deploy]
startCommand = "bun run apps/server/dist/index.mjs"
```

Confirm Railway’s UI doesn’t override these if you use both.

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Boot loop / “address already in use” | Wrong `PORT` handling (we use `process.env.PORT` — don’t hardcode 3001 in prod). |
| CORS errors from web | `CORS_ORIGIN` must exactly match the browser origin (scheme + host + port). |
| Auth redirect / cookie issues | `BETTER_AUTH_URL` must match the API public URL; `trustedOrigins` in auth uses `CORS_ORIGIN`. |
| `/health` 503 | Database URL wrong, DB down, or IP allowlist blocking Railway. |
