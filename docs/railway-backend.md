# Deploy `apps/server` to Railway

This repo is a **Bun + Turborepo** monorepo. The API lives under `apps/server` and depends on workspace packages (`@klyp/api`, `@klyp/auth`, `@klyp/db`, `@klyp/env`). **Only the server is deployed** as this service; the Next app is not started here. The catch is *where* Railway runs `bun install` — it must see the **workspace root**, not `apps/server` alone.

## Why “Root Directory = `apps/server`” fails

If you set Railway’s **Root Directory** to `apps/server`, the platform still clones the full repo, but the **install step** runs as if `apps/server` were a standalone app. That `package.json` depends on `"@klyp/*": "workspace:*"`, which only resolve after `bun install` at the **monorepo root** (where `workspaces` and `bun.lock` live). You get missing package / resolution errors.

**You are not wrong to want “only server”** — you just need one of the patterns below so the **build** still runs from the root (or uses a Dockerfile whose **context** is the root), while the **running process** is only the API bundle.

## Three working patterns (pick one)

### 1) Railpack (Railway default) — [`railpack.json`](../railpack.json)

Railway builds with **Railpack**, which can fall back to **`npm install`**. NPM does **not** understand Bun’s `"workspace:*"` dependencies, which causes:

`Unsupported URL Type "workspace:": workspace:*`

This repo configures Railpack explicitly:

- **Root Directory:** leave **empty** (repository root) so **`bun.lock`** is visible to the builder. If the root dir is something like `apps/server`, Railpack won’t see the lockfile and may default to npm + fail.
- **Install/build/start** are pinned in **`railpack.json`** (Bun install + `turbo build --filter=server` + running the bundled API).
- **Optional:** Root [`package.json`](../package.json) sets `"engines"."bun"` so Railpack is more likely to pick Bun even when inference is flaky.
- **Watch paths** (optional): `apps/server`, `packages`, `turbo.json`, `bun.lock`, `package.json`.

### 2) Dockerfile — “server-only” image, root context

Use [`apps/server/Dockerfile`](../apps/server/Dockerfile). The **build context must be the repo root**:

```bash
docker build -f apps/server/Dockerfile .
```

On Railway: **Root Directory** empty, **Builder** = Dockerfile, **Dockerfile path** = `apps/server/Dockerfile`. The final image only contains the bundled `index.mjs` + Bun (no `apps/web` runtime).

### 3) Root Directory `apps/server` + custom install (fragile)

Only if you must use a subdirectory as cwd: override install so `bun install` runs from the monorepo root (often via `railpack.json` **`RAILPACK_CONFIG_FILE`** or copying `bun.lock`). Prefer **pattern 1** or **2**.

---

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
2. **Settings → Root Directory** → leave **empty** (repo root — **`railpack.json`**, **`bun.lock`**, workspaces).
3. **Deploy:** Install/build/start are driven by **[`railpack.json`](../railpack.json)**. You normally **do not** override install with npm in the UI.
4. **Networking** → **Generate domain** (HTTPS). Use that URL as `BETTER_AUTH_URL`.
5. **Variables** → add the env table below. Redeploy after changing env.
6. **Health check** (if offered): path `/health`, expect **200** when DB is up.

If Railpack keeps using npm despite `railpack.json`, switch **Builder** to **Dockerfile**, path **`apps/server/Dockerfile`** (see pattern 2 above).

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

## Repo config files

- **[`railway.toml`](../railway.toml)** — optional deploy/start hint; **`railpack.json`** is authoritative for Railpack installs and builds when present.

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `npm error EUNSUPPORTEDPROTOCOL` / `workspace:*` during install | Railpack used **npm** instead of **Bun**. Use repo-root **`railpack.json`**, clear **Root Directory**, commit **`bun.lock`**, or use **Dockerfile** (`apps/server/Dockerfile`). |
| Boot loop / “address already in use” | Wrong `PORT` handling (we use `process.env.PORT` — don’t hardcode 3001 in prod). |
| CORS errors from web | `CORS_ORIGIN` must exactly match the browser origin (scheme + host + port). |
| Auth redirect / cookie issues | `BETTER_AUTH_URL` must match the API public URL; `trustedOrigins` in auth uses `CORS_ORIGIN`. |
| `/health` 503 | Database URL wrong, DB down, or IP allowlist blocking Railway. |
