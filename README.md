# Naveen B — Portfolio

An interactive 3D portfolio built around one idea: **Naveen's AI system**. A single persistent WebGL scene sits behind the page and changes shape as you move through it: a core on the hero, a security graph for CyberSentinel, a knowledge graph for IntelliCourse, a contribution constellation for open source, a spatial timeline for experience, and finally a single core at contact.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Three.js · React Three Fiber · drei · Framer Motion · Lenis

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Structure

```
app/                 layout (SEO, JSON-LD), page, sitemap, robots, OG/Twitter images, icon
components/3d/       layouts.ts (per-section node topologies), engine.ts (imperative WebGL),
                     SystemScene / SceneCanvas (R3F boundary), SceneLoader (lazy + quality tiers), StaticCore (fallback)
components/sections/ Hero, Intro, Work, CyberSentinel, IntelliCourse, DailyDocs, OpenSource, Experience, Skills, About, Contact, Footer
components/ui/       Reveal (masked text), Magnetic, Button, Cursor, SmoothScroll, SectionObserver, Icons
lib/                 content.ts (every claim on the site), scene-store.ts (DOM ↔ 3D state), github.ts, scroll.ts, og.tsx
styles/globals.css   design tokens and component styles
```

**Editing content:** everything visible lives in `lib/content.ts`. Counts in the 3D layouts (agents, tools, LLMs, PRs, roles) are derived from it.

## How the 3D works

- One pool of 56 nodes. Each section is a different target arrangement of the same pool, so transitions morph instead of swap (`components/3d/layouts.ts`).
- Sections declare `data-scene="…"`; `SectionObserver` reports the one crossing the viewport's centre. Hovering a project, pipeline stage, repository, role or skill category sets a highlight key that lights the matching nodes.
- The per-frame loop lives in `engine.ts`, outside React, so scrolling and pointer movement never trigger re-renders.

## Performance and accessibility

- The WebGL bundle is dynamically imported (`ssr: false`) and mounted on `requestIdleCallback`. A CSS/SVG core paints first and stays as the fallback when WebGL or Save-Data rules the scene out.
- Quality tiers: **high** (desktop), **medium** (≤1200px or ≤4 cores), **low** (<768px: fewer particles, no pulses, DPR 1). drei's `PerformanceMonitor` lowers DPR if the frame rate drops.
- `prefers-reduced-motion`: Lenis is skipped, CSS and Framer motion are removed, and the 3D system holds still (it still changes layout per section).
- Semantic landmarks, a skip link, visible focus, keyboard-operable tabs, pipeline, timeline and repository list. Everything shown in 3D is also present as text.
- The hero uses CSS animations so the name and headline paint without waiting for hydration.

## GitHub data

`lib/github.ts` fetches public profile stats on the server with ISR (every 6h) and a 5s timeout. On any failure the section falls back to a plain CTA. To raise the rate limit, set `GITHUB_TOKEN` (server-only, never `NEXT_PUBLIC_`).

## Placeholders to replace

| What | Where |
| --- | --- |
| Production domain for metadata, sitemap and robots | `NEXT_PUBLIC_SITE_URL` (see `.env.example`) |
| IntelliCourse AI repository or live link (none supplied) | `projects[1].github` in `lib/content.ts` |
| Merged-PR counts for Kubernetes, GitHub Docs and Agones (not supplied, so shown as "Merged contribution") | `openSource.repos[].prs` in `lib/content.ts` |
