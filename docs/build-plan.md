# Klyp MVP — Detailed Step-by-Step Build Plan

> **Convention:** Each step has a `TEST` block describing exactly how to verify it works before moving on.  
> Stack recap: Next.js · Express + oRPC · Drizzle + Neon · Better Auth · Inngest · Firecrawl · Vercel AI SDK (OpenAI) · Cloudflare R2 · Remotion · Satori

---

## Legend

- `[DB]` — Drizzle schema / migration work  
- `[ENV]` — Environment / config work  
- `[SVC]` — Service/library code inside `packages/`  
- `[API]` — oRPC router/procedure work inside `packages/api`  
- `[JOB]` — Inngest job function work  
- `[WEB]` — Next.js frontend work inside `apps/web`  
- `[INF]` — Infrastructure / deployment  

---

## Phase 0 — Repo Housekeeping (prerequisite, ~30 min)

### Step 0.1 `[ENV]` — Add all new env vars to the server env schema

**File:** `packages/env/src/server.ts`

Add to the `server` block:

```ts
FIRECRAWL_API_KEY: z.string().min(1),
OPENAI_API_KEY: z.string().min(1),
R2_ACCOUNT_ID: z.string().min(1),
R2_ACCESS_KEY_ID: z.string().min(1),
R2_SECRET_ACCESS_KEY: z.string().min(1),
R2_BUCKET: z.string().min(1),
R2_PUBLIC_URL: z.url(),           // e.g. https://pub-xxx.r2.dev
INNGEST_EVENT_KEY: z.string().min(1),
INNGEST_SIGNING_KEY: z.string().min(1),
```

Then add all values to `apps/server/.env`.

**TEST:** Run `bun run check-types` — no type errors in `@klyp/env`.

---

### Step 0.2 `[ENV]` — Create R2 bucket + get credentials

1. Go to Cloudflare dashboard → R2 → Create bucket `klyp-assets`.
2. Create an API token with `Object Read & Write` on that bucket.
3. Copy `Account ID`, `Access Key ID`, `Secret Access Key`.
4. (Optional) Enable public access to get `R2_PUBLIC_URL` — or skip and always use signed URLs.

**TEST:** `aws s3 ls s3://klyp-assets --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com` returns empty listing with no error.

---

### Step 0.3 `[ENV]` — Inngest account setup

1. Create account at [inngest.com](https://inngest.com).
2. Create an app → copy `Event Key` and `Signing Key`.
3. Add to `apps/server/.env`.

**TEST:** Values exist in env. Actual connectivity tested in Step 3.2.

---

## Phase 1 — Database Schema (1–2 hours)

### Step 1.1 `[DB]` — Add `project` table

**File:** `packages/db/src/schema/project.ts` (new file)

```ts
import { relations } from "drizzle-orm";
import {
  index, integer, pgEnum, pgTable, text, timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const projectStatusEnum = pgEnum("project_status", [
  "pending",
  "extracting",
  "analyzing",
  "rendering_video",
  "rendering_banner",
  "done",
  "failed",
]);

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    status: projectStatusEnum("status").default("pending").notNull(),
    progress: integer("progress").default(0).notNull(),     // 0-100
    errorMessage: text("error_message"),
    videoUrl: text("video_url"),
    screenshotUrl: text("screenshot_url"),
    scriptJson: text("script_json"),   // JSON stringified
    brandJson: text("brand_json"),     // JSON stringified
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (t) => [index("project_userId_idx").on(t.userId)],
);

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, { fields: [project.userId], references: [user.id] }),
  assets: many(asset),
  banners: many(banner),
}));
```

---

### Step 1.2 `[DB]` — Add `asset` + `banner` tables (same file)

Append to `packages/db/src/schema/project.ts`:

```ts
export const asset = pgTable("asset", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").notNull().references(() => project.id, { onDelete: "cascade" }),
  type: text("type").notNull(),        // e.g. "screenshot", "raw"
  url: text("url").notNull(),
  mime: text("mime"),
  sizeBytes: integer("size_bytes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const banner = pgTable("banner", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").notNull().references(() => project.id, { onDelete: "cascade" }),
  format: text("format").notNull(),   // e.g. "twitter_post", "linkedin_post"
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assetRelations = relations(asset, ({ one }) => ({
  project: one(project, { fields: [asset.projectId], references: [project.id] }),
}));

export const bannerRelations = relations(banner, ({ one }) => ({
  project: one(project, { fields: [banner.projectId], references: [project.id] }),
}));
```

---

### Step 1.3 `[DB]` — Export from schema index + push migration

**File:** `packages/db/src/schema/index.ts` — add:

```ts
export * from "./project";
```

**Run:**

```bash
bun run db:push
```

**TEST:** Open Drizzle Studio (`bun run db:studio`) — confirm `project`, `asset`, `banner` tables appear with correct columns. Insert + delete a test row in `project` via the studio UI.

---

## Phase 2 — Storage Service (R2) (~1 hour)

### Step 2.1 `[SVC]` — Install AWS S3 client (R2 is S3-compatible)

```bash
bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner -w packages/api
```

---

### Step 2.2 `[SVC]` — Create `packages/api/src/services/storage.ts`

```ts
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@klyp/env/server";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string,
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return `${env.R2_PUBLIC_URL}/${key}`;
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: key }),
    { expiresIn },
  );
}
```

**TEST:** Write a throwaway test script (delete after):

```ts
// packages/api/src/services/storage.test.ts (delete after testing)
import { uploadToR2, getSignedDownloadUrl } from "./storage";
const url = await uploadToR2("test/hello.txt", Buffer.from("hello world"), "text/plain");
console.log("Uploaded:", url);
const signed = await getSignedDownloadUrl("test/hello.txt");
console.log("Signed URL:", signed);
```

Run `bun run packages/api/src/services/storage.test.ts` — verify both URLs are valid and the file is accessible.

---

## Phase 3 — Extraction Service (Firecrawl + Screenshot) (~2 hours)

### Step 3.1 `[SVC]` — Install Firecrawl SDK

```bash
bun add @mendable/firecrawl-js -w packages/api
```

---

### Step 3.2 `[SVC]` — Create `packages/api/src/services/extract.ts`

```ts
import FirecrawlApp from "@mendable/firecrawl-js";
import { env } from "@klyp/env/server";

const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

export interface ExtractResult {
  markdown: string;
  title: string;
  description: string;
  ogImage: string | null;
}

export async function extractFromUrl(url: string): Promise<ExtractResult> {
  const response = await firecrawl.scrapeUrl(url, {
    formats: ["markdown"],
    onlyMainContent: true,
  });

  if (!response.success) {
    throw new Error(`Firecrawl failed: ${response.error ?? "unknown"}`);
  }

  return {
    markdown: response.markdown ?? "",
    title: response.metadata?.title ?? "",
    description: response.metadata?.description ?? "",
    ogImage: response.metadata?.ogImage ?? null,
  };
}
```

**TEST:** Manually call `extractFromUrl("https://vercel.com")` and log output. Confirm `markdown` is non-empty and `title` is "Vercel".

---

### Step 3.3 `[SVC]` — Screenshot via Firecrawl (skip Playwright for MVP)

Firecrawl supports `formats: ["screenshot"]` — use it instead of spinning up Playwright, which avoids a heavy dependency.

Update `extract.ts` to also grab a screenshot URL when available:

```ts
export async function extractWithScreenshot(url: string): Promise<ExtractResult & { screenshotUrl: string | null }> {
  const response = await firecrawl.scrapeUrl(url, {
    formats: ["markdown", "screenshot"],
    onlyMainContent: true,
  });

  if (!response.success) throw new Error(`Firecrawl failed: ${response.error ?? "unknown"}`);

  return {
    markdown: response.markdown ?? "",
    title: response.metadata?.title ?? "",
    description: response.metadata?.description ?? "",
    ogImage: response.metadata?.ogImage ?? null,
    screenshotUrl: response.screenshot ?? null,
  };
}
```

**TEST:** Call `extractWithScreenshot("https://linear.app")` — verify `screenshotUrl` is a valid image URL.

---

## Phase 4 — AI Service (Brand Analysis + Script Gen) (~2 hours)

### Step 4.1 `[SVC]` — Install Vercel AI SDK

```bash
bun add ai @ai-sdk/openai -w packages/api
```

---

### Step 4.2 `[SVC]` — Create `packages/api/src/services/ai.ts`

```ts
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const BrandSchema = z.object({
  productName: z.string(),
  tagline: z.string(),
  features: z.array(z.string()).max(5),
  targetAudience: z.string(),
  tone: z.enum(["professional", "playful", "bold", "minimal", "technical"]),
  primaryColor: z.string().describe("hex color e.g. #7b39fc"),
  secondaryColor: z.string().describe("hex color"),
});

export type Brand = z.infer<typeof BrandSchema>;

const ScriptSchema = z.object({
  hook: z.string().describe("opening line, max 15 words, attention-grabbing"),
  scenes: z.array(
    z.object({
      text: z.string().describe("on-screen text, max 12 words"),
      narration: z.string().describe("voiceover text for this scene"),
      durationSeconds: z.number().int().min(3).max(10),
    }),
  ).min(3).max(5),
  cta: z.string().describe("call-to-action text, max 8 words"),
});

export type Script = z.infer<typeof ScriptSchema>;

export async function analyzeBrand(markdown: string, url: string): Promise<Brand> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: BrandSchema,
    prompt: `Analyze this product website and extract brand information.
URL: ${url}
Content:
${markdown.slice(0, 8000)}`,
  });
  return object;
}

export async function generateScript(brand: Brand): Promise<Script> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: ScriptSchema,
    prompt: `Generate a short-form product launch video script (15-30 seconds total) for:
Product: ${brand.productName}
Tagline: ${brand.tagline}
Features: ${brand.features.join(", ")}
Audience: ${brand.targetAudience}
Tone: ${brand.tone}

Make it punchy, founder-friendly, and optimized for social media.`,
  });
  return object;
}
```

**TEST:** Call `analyzeBrand` with any scraped markdown. Log the output JSON — verify all fields have plausible values. Then pass the result to `generateScript` and confirm `scenes` array has 3–5 items.

---

## Phase 5 — Banner Renderer (Satori + resvg) (~2 hours)

### Step 5.1 `[SVC]` — Install dependencies

```bash
bun add satori @resvg/resvg-js sharp -w packages/api
```

---

### Step 5.2 `[SVC]` — Create `packages/api/src/services/banner.ts`

This generates a 1200×675 Twitter/OG banner PNG from brand data and an optional screenshot URL.

```ts
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Brand } from "./ai";

// Load a font for Satori (bundled Inter)
async function loadFont() {
  // Download Inter from jsDelivr or bundle it — for MVP grab at runtime once
  const res = await fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2");
  return Buffer.from(await res.arrayBuffer());
}

let _font: Buffer | null = null;
async function getFont() {
  if (!_font) _font = await loadFont();
  return _font;
}

export interface BannerOptions {
  brand: Brand;
  screenshotUrl?: string | null;
  format?: "twitter_post" | "linkedin_post";
}

export async function generateBanner(opts: BannerOptions): Promise<Buffer> {
  const { brand, screenshotUrl } = opts;
  const font = await getFont();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "48px",
          background: `linear-gradient(135deg, ${brand.primaryColor}22 0%, #03000a 60%)`,
          border: `1px solid ${brand.primaryColor}44`,
          fontFamily: "Inter",
          color: "#ffffff",
          position: "relative",
        },
        children: [
          screenshotUrl && {
            type: "img",
            props: {
              src: screenshotUrl,
              style: {
                position: "absolute",
                top: 0,
                right: 0,
                width: "55%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.25,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 16,
                maxWidth: "60%",
              },
              children: brand.productName,
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: 22,
                color: "rgba(255,255,255,0.7)",
                maxWidth: "55%",
              },
              children: brand.tagline,
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: 32,
                fontSize: 15,
                color: brand.primaryColor,
                fontWeight: 600,
              },
              children: "Made with Klyp",
            },
          },
        ].filter(Boolean),
      },
    },
    {
      width: 1200,
      height: 675,
      fonts: [{ name: "Inter", data: font, weight: 400, style: "normal" }],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}
```

**TEST:** Run `generateBanner` with mock brand data → write output to `/tmp/test-banner.png` → open and inspect visually.

```ts
// quick test
import { generateBanner } from "./banner";
import { writeFile } from "node:fs/promises";
const png = await generateBanner({
  brand: { productName: "Klyp", tagline: "AI Launch Engine", features: [], targetAudience: "founders", tone: "bold", primaryColor: "#7b39fc", secondaryColor: "#c4a1ff" },
});
await writeFile("/tmp/test-banner.png", png);
```

---

## Phase 6 — Video Renderer (Remotion) (~3 hours)

### Step 6.1 `[SVC]` — Create Remotion composition

```bash
# Add remotion to the server app (rendering happens server-side)
bun add remotion @remotion/renderer @remotion/media-utils -w apps/server
```

Create `apps/server/src/remotion/LaunchVideo.tsx`:

```tsx
import { AbsoluteFill, Sequence, useVideoConfig, interpolate, useCurrentFrame } from "remotion";
import type { Script, Brand } from "@klyp/api/services/ai";

interface Props {
  brand: Brand;
  script: Script;
  screenshotUrl?: string;
}

function Scene({ text, color }: { text: string; color: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "#03000a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 56,
          fontWeight: 800,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
          opacity,
          borderBottom: `4px solid ${color}`,
          paddingBottom: 8,
        }}
      >
        {text}
      </p>
    </AbsoluteFill>
  );
}

export function LaunchVideo({ brand, script }: Props) {
  const { fps } = useVideoConfig();
  let offset = 0;

  const hookDuration = 3 * fps;

  return (
    <AbsoluteFill style={{ background: "#03000a" }}>
      {/* Hook */}
      <Sequence from={0} durationInFrames={hookDuration}>
        <Scene text={script.hook} color={brand.primaryColor} />
      </Sequence>

      {/* Scenes */}
      {script.scenes.map((scene, i) => {
        const start = hookDuration + offset;
        const dur = scene.durationSeconds * fps;
        offset += dur;
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <Scene text={scene.text} color={brand.primaryColor} />
          </Sequence>
        );
      })}

      {/* CTA */}
      <Sequence from={hookDuration + offset} durationInFrames={3 * fps}>
        <AbsoluteFill
          style={{
            background: brand.primaryColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ fontFamily: "Inter", fontSize: 64, fontWeight: 900, color: "#fff" }}>
            {script.cta}
          </p>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
```

Create `apps/server/src/remotion/index.ts`:

```ts
import { registerRoot, Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo";

export function RemotionRoot() {
  return (
    <Composition
      id="LaunchVideo"
      component={LaunchVideo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        brand: { productName: "Demo", tagline: "Tagline", features: [], targetAudience: "all", tone: "bold", primaryColor: "#7b39fc", secondaryColor: "#c4a1ff" },
        script: { hook: "The future is here", scenes: [{ text: "Fast", narration: "", durationSeconds: 3 }], cta: "Try now" },
      }}
    />
  );
}

registerRoot(RemotionRoot);
```

---

### Step 6.2 `[SVC]` — Video render function

Create `apps/server/src/services/video.ts`:

```ts
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { tmpdir } from "node:os";
import { readFile } from "node:fs/promises";
import type { Brand, Script } from "@klyp/api/services/ai";

const BUNDLE_LOCATION = path.join(process.cwd(), "src/remotion/index.ts");

export async function renderVideo(brand: Brand, script: Script): Promise<Buffer> {
  // Calculate duration dynamically from script
  const fps = 30;
  const hookFrames = 3 * fps;
  const sceneFrames = script.scenes.reduce((s, sc) => s + sc.durationSeconds * fps, 0);
  const ctaFrames = 3 * fps;
  const totalFrames = hookFrames + sceneFrames + ctaFrames;

  const composition = await selectComposition({
    serveUrl: BUNDLE_LOCATION,
    id: "LaunchVideo",
    inputProps: { brand, script },
  });

  const outPath = path.join(tmpdir(), `klyp-video-${Date.now()}.mp4`);

  await renderMedia({
    composition: { ...composition, durationInFrames: totalFrames },
    serveUrl: BUNDLE_LOCATION,
    codec: "h264",
    outputLocation: outPath,
    inputProps: { brand, script },
    logLevel: "warn",
  });

  const buffer = await readFile(outPath);
  return buffer;
}
```

**TEST:** Call `renderVideo` with mock brand + script. Should produce an mp4 buffer. Write to `/tmp/test.mp4` and play it. This will take ~30–60s on first run (Remotion bundles via esbuild).

---

## Phase 7 — Inngest Job Pipeline (~3 hours)

### Step 7.1 `[JOB]` — Install Inngest

```bash
bun add inngest -w apps/server
```

---

### Step 7.2 `[JOB]` — Create Inngest client

Create `apps/server/src/inngest/client.ts`:

```ts
import { Inngest } from "inngest";
import { env } from "@klyp/env/server";

export const inngest = new Inngest({
  id: "klyp",
  eventKey: env.INNGEST_EVENT_KEY,
});
```

---

### Step 7.3 `[JOB]` — Create `processProject` function

Create `apps/server/src/inngest/processProject.ts`:

```ts
import { inngest } from "./client";
import { db } from "@klyp/db";
import { project as projectTable, asset as assetTable, banner as bannerTable } from "@klyp/db/schema";
import { eq } from "drizzle-orm";
import { extractWithScreenshot } from "@klyp/api/services/extract";
import { analyzeBrand, generateScript } from "@klyp/api/services/ai";
import { generateBanner } from "@klyp/api/services/banner";
import { renderVideo } from "../services/video";
import { uploadToR2 } from "@klyp/api/services/storage";

async function updateProject(id: string, data: Partial<typeof projectTable.$inferInsert>) {
  await db.update(projectTable).set(data).where(eq(projectTable.id, id));
}

export const processProject = inngest.createFunction(
  {
    id: "process-project",
    retries: 2,
    timeouts: { finish: "5m" },
  },
  { event: "project/created" },
  async ({ event, step }) => {
    const { projectId, url } = event.data as { projectId: string; url: string };

    // Step 1: Extract
    const extracted = await step.run("extract", async () => {
      await updateProject(projectId, { status: "extracting", progress: 10 });
      const result = await extractWithScreenshot(url);
      await updateProject(projectId, {
        screenshotUrl: result.screenshotUrl ?? undefined,
        progress: 25,
      });
      return result;
    });

    // Step 2: Analyze
    const { brand, script } = await step.run("analyze", async () => {
      await updateProject(projectId, { status: "analyzing", progress: 30 });
      const b = await analyzeBrand(extracted.markdown, url);
      const s = await generateScript(b);
      await updateProject(projectId, {
        brandJson: JSON.stringify(b),
        scriptJson: JSON.stringify(s),
        progress: 50,
      });
      return { brand: b, script: s };
    });

    // Step 3: Render Video
    const videoUrl = await step.run("render-video", async () => {
      await updateProject(projectId, { status: "rendering_video", progress: 55 });
      const buffer = await renderVideo(brand, script);
      const key = `projects/${projectId}/video.mp4`;
      const url = await uploadToR2(key, buffer, "video/mp4");
      await updateProject(projectId, { videoUrl: url, progress: 80 });
      return url;
    });

    // Step 4: Render Banner
    await step.run("render-banner", async () => {
      await updateProject(projectId, { status: "rendering_banner", progress: 82 });
      const png = await generateBanner({ brand, screenshotUrl: extracted.screenshotUrl });
      const key = `projects/${projectId}/banner-twitter.png`;
      const bannerUrl = await uploadToR2(key, png, "image/png");

      await db.insert(bannerTable).values({
        projectId,
        format: "twitter_post",
        imageUrl: bannerUrl,
      });

      await updateProject(projectId, { status: "done", progress: 100 });
      return bannerUrl;
    });

    return { projectId, videoUrl };
  },
);
```

---

### Step 7.4 `[JOB]` — Mount Inngest on Express

Update `apps/server/src/index.ts`:

```ts
import { serve } from "inngest/express";
import { inngest } from "./inngest/client";
import { processProject } from "./inngest/processProject";

// After existing route mounts:
app.use("/api/inngest", serve({ client: inngest, functions: [processProject] }));
```

**TEST (local):**

```bash
# Terminal 1 - start server
bun run dev:server

# Terminal 2 - start Inngest dev server
bunx inngest-cli@latest dev -u http://localhost:3001/api/inngest
```

Open Inngest Dev UI at `http://localhost:8288`. You should see "klyp" app registered with `process-project` function.

---

## Phase 8 — oRPC Project Router (~2 hours)

### Step 8.1 `[API]` — Add projects router

Create `packages/api/src/routers/projects.ts`:

```ts
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { db } from "@klyp/db";
import { project, banner, asset } from "@klyp/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { protectedProcedure } from "../index";
import { inngest } from "../../apps/server/src/inngest/client"; // re-exported below
import { getSignedDownloadUrl } from "../services/storage";

const FREE_PROJECT_LIMIT = 1;

export const projectsRouter = {
  create: protectedProcedure
    .input(z.object({ url: z.url() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Free plan guard
      const existing = await db
        .select({ id: project.id })
        .from(project)
        .where(eq(project.userId, userId));

      if (existing.length >= FREE_PROJECT_LIMIT) {
        throw new ORPCError("FORBIDDEN", {
          message: "Free plan is limited to 1 project.",
        });
      }

      const [created] = await db
        .insert(project)
        .values({ userId, url: input.url, status: "pending", progress: 0 })
        .returning();

      await inngest.send({
        name: "project/created",
        data: { projectId: created.id, url: input.url },
      });

      return { id: created.id };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const [p] = await db
        .select()
        .from(project)
        .where(and(eq(project.id, input.id), eq(project.userId, userId)));

      if (!p) throw new ORPCError("NOT_FOUND");

      const banners = await db.select().from(banner).where(eq(banner.projectId, p.id));
      const assets = await db.select().from(asset).where(eq(asset.projectId, p.id));

      return {
        ...p,
        brand: p.brandJson ? JSON.parse(p.brandJson) : null,
        script: p.scriptJson ? JSON.parse(p.scriptJson) : null,
        banners,
        assets,
      };
    }),

  list: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;
    return db
      .select()
      .from(project)
      .where(eq(project.userId, userId))
      .orderBy(desc(project.createdAt));
  }),

  getDownloadUrl: protectedProcedure
    .input(z.object({ projectId: z.string(), kind: z.enum(["video", "banner"]) }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const [p] = await db
        .select()
        .from(project)
        .where(and(eq(project.id, input.projectId), eq(project.userId, userId)));

      if (!p) throw new ORPCError("NOT_FOUND");

      let key: string;
      if (input.kind === "video") {
        if (!p.videoUrl) throw new ORPCError("NOT_FOUND", { message: "Video not ready" });
        key = `projects/${p.id}/video.mp4`;
      } else {
        key = `projects/${p.id}/banner-twitter.png`;
      }

      return { url: await getSignedDownloadUrl(key) };
    }),
};
```

> **Note:** The `inngest` import path will be from a shared client. We'll extract the Inngest client to `packages/api/src/services/inngest.ts` and import it from both server and this router.

---

### Step 8.2 `[API]` — Wire into app router

Update `packages/api/src/routers/index.ts`:

```ts
import { projectsRouter } from "./projects";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: "This is private",
    user: context.session?.user,
  })),
  projects: projectsRouter,
};
```

**TEST:** Start server + Inngest dev server. Use the OpenAPI reference UI at `http://localhost:3001/api-reference` to:
1. Call `POST /rpc/projects.create` with `{ "url": "https://vercel.com" }` (authenticated).
2. Get back a `{ id: "..." }`.
3. Call `GET /rpc/projects.get` with that id.
4. Verify `status` transitions in Inngest Dev UI.

---

## Phase 9 — Frontend Wiring (~3 hours)

### Step 9.1 `[WEB]` — Wire dashboard URL form to `projects.create`

Update `apps/web/src/app/(app)/dashboard/page.tsx`:

Convert the static form to a client island `UrlInputForm`. Create `apps/web/src/components/url-input-form.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { orpc } from "@/utils/orpc";
import { LinkIcon } from "lucide-react";

export function UrlInputForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { id } = await orpc.projects.create.call({ url });
      router.push(`/projects/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl rounded-2xl border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.2)] p-2 backdrop-blur-md transition-all focus-within:border-[#7b39fc] focus-within:shadow-[0_0_30px_rgba(123,57,252,0.2)]"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center">
          <LinkIcon className="h-5 w-5 text-[#c4a1ff]" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-product.com"
          required
          className="h-12 flex-1 bg-transparent font-inter text-[16px] text-white placeholder-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 items-center gap-2 rounded-xl bg-[#7b39fc] px-6 font-cabin text-[16px] font-medium text-white shadow-sm transition-colors hover:bg-[#682edf] disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Kit"}
        </button>
      </div>
      {error && <p className="mt-2 px-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
```

Use `<UrlInputForm />` in `dashboard/page.tsx` replacing the static form.

**TEST:** Submit a valid URL in the dashboard → browser navigates to `/projects/<id>` (will 404 until Step 9.2 but the navigation proves the API call works).

---

### Step 9.2 `[WEB]` — Create `/projects/[id]` page

Create `apps/web/src/app/(app)/projects/[id]/page.tsx` (server component for initial render):

```tsx
import { requireSession } from "@/lib/auth-server";
import { ProjectDetail } from "./project-detail";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;
  return <ProjectDetail projectId={id} session={session} />;
}
```

Create `apps/web/src/app/(app)/projects/[id]/project-detail.tsx`:

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import type { authClient } from "@/lib/auth-client";

const STATUS_LABELS: Record<string, string> = {
  pending: "Queued…",
  extracting: "Scraping website…",
  analyzing: "Analyzing with AI…",
  rendering_video: "Rendering video…",
  rendering_banner: "Creating banner…",
  done: "Done!",
  failed: "Failed",
};

export function ProjectDetail({
  projectId,
}: {
  projectId: string;
  session: typeof authClient.$Infer.Session;
}) {
  const { data, isLoading } = useQuery({
    ...orpc.projects.get.queryOptions({ id: projectId }),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "done" || status === "failed" ? false : 2000;
    },
  });

  if (isLoading) return <div className="p-8 text-white/50">Loading…</div>;
  if (!data) return <div className="p-8 text-red-400">Project not found.</div>;

  const isDone = data.status === "done";
  const isFailed = data.status === "failed";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-2 font-instrument-serif text-4xl text-white">{data.url}</h1>

      {/* Progress bar */}
      {!isDone && !isFailed && (
        <div className="mb-8">
          <p className="mb-2 font-inter text-sm text-[#c4a1ff]">
            {STATUS_LABELS[data.status] ?? data.status}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#7b39fc] transition-all duration-700"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      )}

      {isFailed && (
        <div className="mb-8 rounded-xl bg-red-900/30 p-4 text-red-400">
          Generation failed: {data.errorMessage ?? "Unknown error"}
        </div>
      )}

      {isDone && (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Video */}
          {data.videoUrl && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="mb-3 font-instrument-serif text-2xl text-white">Product Video</h2>
              <video
                src={data.videoUrl}
                controls
                className="w-full rounded-xl"
                style={{ aspectRatio: "9/16", maxHeight: 480 }}
              />
              <a
                href={data.videoUrl}
                download
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#7b39fc] px-4 py-2 font-cabin text-sm font-medium text-white hover:bg-[#682edf]"
              >
                Download Video
              </a>
            </div>
          )}

          {/* Banners */}
          {data.banners?.map((b) => (
            <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="mb-3 font-instrument-serif text-2xl text-white">
                {b.format === "twitter_post" ? "Twitter Banner" : "Banner"}
              </h2>
              <img src={b.imageUrl} alt="banner" className="w-full rounded-xl" />
              <a
                href={b.imageUrl}
                download
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-cabin text-sm font-medium text-white hover:bg-white/20"
              >
                Download Banner
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**TEST:**
1. Submit a URL from the dashboard.
2. Watch `/projects/<id>` — progress bar should update every 2s.
3. After ~60s: video player + banner image appear.
4. Clicking download works.

---

### Step 9.3 `[WEB]` — Wire dashboard project list

Update `dashboard/page.tsx` to fetch and display real projects using `orpc.projects.list`:

Create `apps/web/src/components/project-list.tsx`:

```tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  extracting: "bg-blue-500/20 text-blue-300",
  analyzing: "bg-purple-500/20 text-purple-300",
  rendering_video: "bg-indigo-500/20 text-indigo-300",
  rendering_banner: "bg-indigo-500/20 text-indigo-300",
  done: "bg-green-500/20 text-green-300",
  failed: "bg-red-500/20 text-red-300",
};

export function ProjectList() {
  const { data: projects, isLoading } = useQuery(orpc.projects.list.queryOptions());

  if (isLoading) return <div className="text-white/40">Loading projects…</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects?.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          className="group relative flex h-[280px] w-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 transition-all hover:border-[#7b39fc]/50 hover:shadow-[0_0_40px_rgba(123,57,252,0.1)]"
        >
          <div>
            <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status] ?? ""}`}>
              {p.status}
            </span>
            <p className="mt-3 font-inter text-sm text-white/60 line-clamp-2 break-all">{p.url}</p>
          </div>
          <p className="font-inter text-xs text-white/30">
            {new Date(p.createdAt).toLocaleDateString()}
          </p>
        </Link>
      ))}

      {/* New project card */}
      <button className="group relative flex h-[280px] w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-white/20 bg-white/5 transition-all hover:border-[#7b39fc]/50">
        <PlusIcon className="h-8 w-8 text-white/30 group-hover:text-[#c4a1ff]" />
        <p className="mt-2 font-inter text-sm text-white/40 group-hover:text-white/70">
          New project
        </p>
      </button>
    </div>
  );
}
```

**TEST:** After generating a project, refresh dashboard — project card appears with status chip. Clicking it navigates to detail page.

---

## Phase 10 — End-to-End Verification (~1 hour)

### Step 10.1 — Full E2E run

```bash
bun run dev           # all apps
bunx inngest-cli@latest dev -u http://localhost:3001/api/inngest
```

1. Sign up for a new account at `http://localhost:3000`.
2. On dashboard, paste `https://linear.app` → click **Generate Kit**.
3. Watch progress bar on `/projects/<id>` update through each status.
4. Confirm Inngest Dev UI shows all 4 steps completing successfully.
5. Confirm video + banner render and are downloadable.

### Step 10.2 — Free plan guard

1. Try to create a second project with the same user — should get `"Free plan is limited to 1 project."` error toast.

### Step 10.3 — Error case

1. Paste an invalid/blocked URL (e.g. `https://localhost:9999`) → project should transition to `failed` with an `errorMessage`. UI should show red error block.

---

## Phase 11 — Deployment (~2 hours)

### Step 11.1 `[INF]` — Vercel (web)

```bash
vercel --cwd apps/web
```

Set env vars in Vercel project settings:
- `NEXT_PUBLIC_SERVER_URL=https://<your-server>.railway.app`

### Step 11.2 `[INF]` — Railway (server)

```bash
railway up --service server
```

Set all `apps/server/.env` vars in Railway environment settings. Expose port `3001`.

### Step 11.3 `[INF]` — Inngest Cloud

1. Create production app in Inngest Cloud.
2. Add `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` to Railway env.
3. Register endpoint: `https://<server>.railway.app/api/inngest` in Inngest Cloud.

### Step 11.4 `[INF]` — Smoke test production

Repeat Step 10.1 against the production URLs.

---

## Quick Reference: Package Install Commands

```bash
# Phase 2 — R2
bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner -w packages/api

# Phase 3 — Firecrawl
bun add @mendable/firecrawl-js -w packages/api

# Phase 4 — AI SDK
bun add ai @ai-sdk/openai -w packages/api

# Phase 5 — Banner
bun add satori @resvg/resvg-js sharp -w packages/api

# Phase 6 — Remotion
bun add remotion @remotion/renderer -w apps/server

# Phase 7 — Inngest
bun add inngest -w apps/server
```

---

## Status Checklist

| Phase | Task | Done |
|-------|------|------|
| 0.1 | Env schema extended | ✅ |
| 0.2 | R2 bucket created + credentials | ✅ |
| 0.3 | Inngest account + keys | ✅ |
| 1.1–1.3 | DB schema: project/asset/banner pushed | ✅ |
| 2 | R2 upload + signed URL service | ✅ |
| 3 | Firecrawl extract + screenshot | ✅ |
| 4 | AI brand analysis + script gen | ✅ |
| 5 | Banner renderer (Satori) | ✅ |
| 6 | Remotion video template + render fn | ☐ |
| 7 | Inngest pipeline (4 steps) | ☐ |
| 8 | oRPC projects router | ☐ |
| 9.1 | Dashboard form → create project | ☐ |
| 9.2 | `/projects/[id]` detail + polling | ☐ |
| 9.3 | Dashboard project list | ☐ |
| 10 | E2E test + error cases | ☐ |
| 11 | Deploy web + server + Inngest | ☐ |
