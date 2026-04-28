# Klyp

> *Everything you need to launch your product — instantly.*

Klyp is an AI-powered SaaS platform that converts any website URL into a **launch-ready marketing kit**: product videos, social banners, and marketing copy. Paste a URL → get everything needed to promote and launch your product.

**Vision:** *The AI Launch Team for every founder.*

---

## Features

| Output | Description |
|-------|-------------|
| **Product videos** | Short-form (10–60 sec), 9:16 & 1:1 formats |
| **Social banners** | Twitter, LinkedIn, Product Hunt, ad creatives |
| **Marketing copy** | Tweet, LinkedIn post, ad copy, taglines |

**Flow:** URL → Content extraction → AI understanding → Content generation → Download kit

See [docs/prd.md](./docs/prd.md) for the full product spec.

Backend deployment (Railway monorepo): [docs/railway-backend.md](./docs/railway-backend.md).

---

## Tech Stack

Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack):

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js, React, Tailwind, shadcn/ui |
| **Backend** | Express, oRPC (type-safe APIs) |
| **Database** | PostgreSQL (Neon), Drizzle ORM |
| **Auth** | Better Auth |
| **Tooling** | Bun, Turborepo, Biome, Husky |

---

## Prerequisites

- **Node.js** 22.14+ (see [.nvmrc](./.nvmrc))
- **Bun** 1.3.8+

```bash
nvm use    # uses .nvmrc
```

---

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Database setup

Uses PostgreSQL (Neon). Configure `packages/db/.env` or root `.env` with your connection string.

```bash
bun run db:push
```

### 3. Run development

```bash
bun run dev
```

| App | URL |
|-----|-----|
| Web | [http://localhost:3001](http://localhost:3001) |
| API | [http://localhost:3000](http://localhost:3000) |

---

## Project Structure

```
klyp/
├── apps/
│   ├── web/         # Next.js frontend
│   └── server/     # Express + oRPC API
├── packages/
│   ├── ui/         # Shared shadcn/ui components
│   ├── api/        # API layer / business logic
│   ├── auth/       # Better Auth config
│   ├── db/         # Drizzle schema & queries
│   └── env/        # Shared env validation
└── docs/
    └── prd.md      # Product requirements
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps |
| `bun run dev:web` | Web only |
| `bun run dev:server` | Server only |
| `bun run build` | Build all |
| `bun run check-types` | TypeScript check |
| `bun run check` | Biome lint + format |
| `bun run db:push` | Push schema to DB |
| `bun run db:generate` | Generate Drizzle client |
| `bun run db:migrate` | Run migrations |
| `bun run db:studio` | Open Drizzle Studio |

---

## UI Customization

Shared shadcn/ui primitives live in `packages/ui`:

- **Global styles:** `packages/ui/src/styles/globals.css`
- **Components:** `packages/ui/src/components/*`
- **Config:** `packages/ui/components.json`

Add shared components:

```bash
npx shadcn@latest add accordion dialog popover -c packages/ui
```

Import:

```tsx
import { Button } from "@klyp/ui/components/button";
```

---

## Git Hooks

- **Husky** runs on commit via `prepare`
- **lint-staged** runs Biome on staged `.ts`, `.tsx`, `.json` files
- Format/lint fix: `bun run check`
