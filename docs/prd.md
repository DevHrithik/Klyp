# Product Requirements Document

**Product:** Klyp

---

## 1. Product Overview

Klyp is an AI-powered SaaS platform that converts any website URL into a **launch-ready marketing kit**:

| Output Type | Description |
|-------------|-------------|
| Product videos | Short-form (10–60 sec) |
| Social banners | Platform-ready assets |
| Marketing copy | Tweet, LinkedIn, ads |

**Flow:** User pastes URL → Klyp generates everything needed to promote and launch their product.

---

## 2. Vision

> Build the fastest way for founders to create and distribute launch content.

**Positioning:** *"The AI Launch Team for every founder."*

---

## 3. Problem Statement

### Current Challenges

- **Content creation is:**
  - Time-consuming
  - Expensive
  - Fragmented across multiple tools (Canva, Premiere Pro, copywriting tools)

- **Founders struggle with:**
  - Writing scripts
  - Designing banners
  - Creating videos
  - Maintaining brand consistency

- **Existing tools:**
  - Are fragmented
  - Lack product-specific storytelling
  - Require significant manual effort

---

## 4. Solution

**Automated workflow:**

```
URL → Content Extraction → AI Understanding → Content Generation → Output Kit
```

**Outputs:** Video · Banners · Copy

---

## 5. Target Users

| Segment | Examples |
|---------|----------|
| **Primary** | Indie hackers, SaaS founders, developers launching products |
| **Secondary** | Marketing teams, agencies, content creators |

---

## 6. Core Value Proposition

> *"Everything you need to launch your product — instantly."*

---

## 7. Key Features (MVP Scope)

### 7.1 AI Video Generator

- Short-form product videos (10–60 sec)
- **Formats:** 9:16 (Reels/TikTok), 1:1 (Social)
- **Includes:** Script, scenes, transitions, optional voiceover

### 7.2 Banner Generator

Ready-to-use visual assets with template-based rendering and brand-aware styling.

| Format | Dimensions |
|--------|------------|
| Twitter/X post | 1200×675 |
| LinkedIn post | Standard |
| Product Hunt thumbnail | Standard |
| Ad creatives | Various |

### 7.3 Copy Generator

- Tweet (launch post)
- LinkedIn post
- Ad copy
- Tagline suggestions

### 7.4 Brand Extraction

Extracts from URL:

- Primary & secondary colors
- Logo (if available)
- Product tone

### 7.5 Marketing Kit Output

Structured output format:

```json
{
  "videoUrl": "...",
  "banners": ["..."],
  "copy": {
    "tweet": "...",
    "linkedin": "...",
    "ad": "..."
  }
}
```

### 7.6 Project Dashboard

- View generated assets
- Download content
- Track status

---

## 8. User Flow

```
Landing Page
    ↓
Paste URL
    ↓
Select Mode (Video / Full Kit)
    ↓
Click "Generate"
    ↓
Processing (Progress UI)
    ↓
Preview Results
    ↓
Download / Share
```

---

## 9. Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR1 | URL Input & Validation | Accept valid URLs, handle invalid/blocked sites |
| FR2 | Website Content Extraction | Extract text, metadata, images via structured scraping |
| FR3 | AI Content Understanding | Identify product name, features, target audience, tone |
| FR4 | Script Generation | Generate hook, feature highlights, CTA |
| FR5 | Scene Generation | Convert script into timed scenes |
| FR6 | Video Rendering | Render using templates, apply animations and transitions |
| FR7 | Banner Rendering | Generate images via HTML → image pipeline, apply brand styles |
| FR8 | Copy Generation | Generate platform-specific marketing text |
| FR9 | Job Processing System | Async processing via queue, status tracking |
| FR10 | Asset Storage | Store screenshots, videos, banners |

---

## 10. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Target generation time: < 60 seconds |
| **Scalability** | Queue-based processing system |
| **Reliability** | Retry failed jobs, graceful fallbacks |
| **Security** | Secure asset storage (signed URLs) |

---

## 11. System Architecture

```
Frontend (Next.js)
    ↓
API Layer
    ↓
Job Queue (Inngest)
    ↓
Content Engine
    ├── Extraction Layer
    │   ├── Firecrawl (text)
    │   └── Playwright (screenshots)
    │
    ├── AI Layer (LLM)
    │   ├── Script Generator
    │   ├── Copy Generator
    │   └── Brand Analyzer
    │
    ├── Rendering Layer
    │   ├── Video (Remotion)
    │   └── Banners (HTML → Image)
    ↓
Storage (S3 / UploadThing)
    ↓
Database (Postgres + Prisma)
```

---

## 12. Scraping Strategy

| Tool | Purpose |
|------|---------|
| **Firecrawl** | Structured content extraction, clean markdown for AI |
| **Playwright** | Screenshots, visual assets |

---

## 13. Data Model (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  projects  Project[]
  createdAt DateTime @default(now())
}

model Project {
  id        String   @id @default(cuid())
  userId    String
  url       String
  status    String
  progress  Int
  videoUrl  String?
  createdAt DateTime @default(now())

  user    User     @relation(fields: [userId], references: [id])
  assets  Asset[]
  banners Banner[]
  copy    Copy?
}

model Asset {
  id        String   @id @default(cuid())
  projectId String
  type      String
  url       String

  project Project @relation(fields: [projectId], references: [id])
}

model Banner {
  id        String   @id @default(cuid())
  projectId String
  type      String
  imageUrl  String

  project Project @relation(fields: [projectId], references: [id])
}

model Copy {
  id        String   @id @default(cuid())
  projectId String
  tweet     String?
  linkedin  String?
  ad        String?

  project Project @relation(fields: [projectId], references: [id])
}
```

---

## 14. Success Metrics

| Category | Metrics |
|----------|---------|
| **Product** | Video generation success rate, avg generation time, completion rate |
| **Growth** | Videos per user, banner downloads, shares |
| **Revenue** | Free → paid conversion, revenue per user |

---

## 15. Monetization

| Plan | Limits |
|------|--------|
| **Free** | 1 project, watermarked assets |
| **Paid** | Unlimited/credits, HD exports, no watermark |

---

## 16. Risks & Challenges

| Category | Risks |
|----------|-------|
| **Technical** | Rendering performance, scraping failures |
| **Product** | High user expectations, competitive space |

---

## 17. Future Scope

- Template marketplace
- API access
- Direct social posting
- Advanced customization
- AI brand kit generator

---

## 18. MVP Scope (Strict)

### Must Have

- [ ] URL input
- [ ] Firecrawl integration
- [ ] Script generation
- [ ] 1 video template
- [ ] 1–2 banner templates

### Nice to Have

- [ ] Copy generation
- [ ] Voiceover

### Avoid

- Editing UI
- Too many templates

---

## 19. Execution Plan

| Week | Focus |
|------|-------|
| **Week 1** | Scraping + AI pipeline |
| **Week 2** | Video + banner rendering |
| **Week 3** | UI + deployment |

---

## 20. Positioning

| Klyp is NOT | Klyp IS |
|-------------|---------|
| "An AI video tool" | "An AI Launch Engine for founders" |
