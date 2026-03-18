# Klyp — Landing Page Sections

> **Design System Reminder**
> - Primary: `#7b39fc` (Purple)
> - Secondary / Dark: `#2b2344` (Dark Purple)
> - Fonts: `Manrope` (nav/ui), `Cabin` (buttons/tags), `Instrument Serif` (headlines), `Inter` (body)
> - Background: Full-screen video (Hero only), then dark `#2b2344` with subtle section breaks

---

## 0. Navbar `[DONE]`

**Component:** `components/landing/navbar.tsx`

| Element | Content |
|---------|---------|
| Logo | SVG mark + "Klyp" in Instrument Serif |
| Nav Links | Home · Features · Pricing · FAQ |
| CTA Buttons | "Sign In" (white) · "Join Waitlist" (purple) |
| Mobile | Hamburger menu icon |

---

## 1. Hero Section `[DONE]`

**Component:** `components/landing/hero.tsx`

| Element | Content |
|---------|---------|
| Badge | `Beta` pill + "Meet Klyp: The AI Launch Team" |
| Headline | "Everything you need to launch your product *instantly*" |
| Subtext | "Klyp converts any website URL into a launch-ready marketing kit. Get product videos, social banners, and marketing copy generated in seconds." |
| CTA | Email input + "Join Waitlist" button |
| Background | HTML5 video, autoplaying, looped, muted |

---

## 2. Social Proof / Stats Bar

**Component:** `components/landing/stats-bar.tsx`
**Anchor:** `#stats`

A slim horizontal strip beneath the hero (no video bg) showing trust signals.

| Stat | Value |
|------|-------|
| Products Launched | `2,400+` |
| Videos Generated | `18,000+` |
| Avg. Generation Time | `< 60 sec` |
| Founders Trust | `⭐ 4.9 / 5` |

**Copy:**
> _"Trusted by indie hackers, dev founders, and SaaS teams shipping fast."_

---

## 3. How It Works `[DONE]`

**Component:** `components/landing/how-it-works.tsx`
**Anchor:** `#how-it-works`

**Section Label:** `How It Works`
**Headline:** "From URL to full launch kit in *3 steps*"
**Subtext:** "No design skills. No copywriting. No video editing. Just paste your product URL."

**Steps:**

| Step | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | 🔗 | Paste your URL | Drop in your product or landing page URL. Klyp scrapes and understands everything about your product. |
| 2 | ⚡ | AI generates everything | Klyp's AI engine creates a launch video, social banners, and platform-ready marketing copy — all in under 60 seconds. |
| 3 | 🚀 | Download & launch | Preview your assets, download in HD, and hit publish. Your launch is ready. |

---

## 4. Features / What You Get

**Component:** `components/landing/features.tsx`
**Anchor:** `#features`

**Section Label:** `Features`
**Headline:** "Your complete AI-powered *launch kit*"
**Subtext:** "Everything a founder needs to go from product to audience — in one place."

**Feature Cards:**

| Icon | Title | Description |
|------|-------|-------------|
| 🎬 | AI Product Videos | Short-form 10–60 sec videos in 9:16 and 1:1 formats. Script, scenes, transitions, and optional voiceover — all auto-generated. |
| 🖼️ | Social Banners | Brand-aware banners for Twitter/X, LinkedIn, Product Hunt, and ad creatives, rendered pixel-perfect. |
| ✍️ | Marketing Copy | Launch tweets, LinkedIn posts, ad copy, and tagline suggestions crafted to convert—personalized to your product's tone and audience. |
| 🎨 | Brand Extraction | Klyp reads your URL and extracts your brand colors, logo, and product tone to keep all assets on-brand. |
| 📦 | Marketing Kit Export | Receive everything in a structured kit: video, banners, copy — ready to download or share. |
| 📊 | Project Dashboard | Track all your generated assets, check job status, and manage downloads from one clean dashboard. |

---

## 5. Demo / Preview

**Component:** `components/landing/demo.tsx`
**Anchor:** `#demo`

**Section Label:** `See It In Action`
**Headline:** "Watch Klyp build a launch kit *live*"
**Subtext:** "Paste in any product URL and watch in real-time as Klyp builds your video, banners, and copy."

**Visual:** Embedded demo video or animated product screenshot carousel showing:
1. URL input field
2. Processing animation (progress bar)
3. Generated video preview
4. Generated banner grid
5. Copy output panel

**CTA:** "Try it now →" (links to waitlist / signup)

---

## 6. Pricing

**Component:** `components/landing/pricing.tsx`
**Anchor:** `#pricing`

**Section Label:** `Pricing`
**Headline:** "Simple, honest *pricing*"
**Subtext:** "Start free, upgrade when you're ready to scale."

**Plans:**

| Plan | Price | Limits | Highlights |
|------|-------|--------|------------|
| **Free** | $0 / mo | 1 project | Watermarked assets, 1 video template, basic banner |
| **Pro** | $29 / mo | Unlimited projects | HD exports, no watermark, all templates, priority queue |
| **Team** | $79 / mo | 5 seats | Everything in Pro + team sharing, API access |

**CTA:** "Join the waitlist to lock in early pricing →"

---

## 7. Testimonials / Social Proof

**Component:** `components/landing/testimonials.tsx`
**Anchor:** `#testimonials`

**Section Label:** `What Founders Say`
**Headline:** "Loved by the builders *shipping fast*"

**Sample Testimonials:**

> _"I launched my SaaS in a weekend. Klyp handled all the marketing content while I focused on the product."_
> — **@devfounder**, Indie Hacker

> _"I used to spend 3 hours making a launch tweet thread. Klyp nails it in 30 seconds."_
> — **@sarahmakes**, Product Designer

> _"Generated a Product Hunt banner and launch video in under a minute. Insane tool."_
> — **@marketo_builder**, SaaS Founder

---

## 8. FAQ

**Component:** `components/landing/faq.tsx`
**Anchor:** `#faq`

**Section Label:** `FAQ`
**Headline:** "Got questions? *We've got answers.*"

| Question | Answer |
|----------|--------|
| What types of products work with Klyp? | Any product with a public URL — SaaS tools, apps, browser extensions, newsletters, and more. |
| How long does generation take? | Under 60 seconds for a full marketing kit. |
| Can I customize the outputs? | Currently you can regenerate with tweaked prompts. Full editing UI is coming soon. |
| Do I need design or video experience? | Zero. Klyp is built for founders, not designers. |
| What formats are supported for export? | MP4 for videos, PNG/JPG for banners, and plain text/Markdown for copy. |
| Is my product data stored? | We only cache scraped data temporarily for generation. Nothing is stored long-term. |
| When does Klyp launch publicly? | We're in beta. Join the waitlist to get early access. |

---

## 9. Final CTA / Waitlist

**Component:** `components/landing/waitlist-cta.tsx`
**Anchor:** `#waitlist`

**Section Label:** `Early Access`
**Headline:** "Be the first to launch with *Klyp*"
**Subtext:** "Join hundreds of founders on the waitlist. Early members get lifetime discounted pricing and priority access."

| Element | Content |
|---------|---------|
| Input | Email address |
| Button | "Join the Waitlist" (purple) |
| Social Proof | "🔒 No spam. Unsubscribe anytime." |

---

## 10. Footer

**Component:** `components/landing/footer.tsx`

| Column | Links |
|--------|-------|
| Product | Features · Pricing · Changelog · Roadmap |
| Company | About · Blog · Press · Careers |
| Legal | Privacy Policy · Terms of Service |
| Social | Twitter/X · LinkedIn · GitHub |

**Copyright:** `© 2025 Klyp. All rights reserved.`
**Tagline:** `The AI Launch Team for every founder.`

---

## Implementation Order

1. [x] Navbar
2. [x] Hero Section
3. [ ] Stats Bar
4. [x] How It Works
5. [x] Features
6. [x] Demo / Preview
7. [x] Pricing
8. [ ] Testimonials
9. [ ] FAQ
10. [ ] Final CTA / Waitlist
11. [ ] Footer
