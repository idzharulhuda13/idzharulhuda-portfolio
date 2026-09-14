# Portfolio Revamp Plan — idzharulhuda-portfolio v2

Status: **PROPOSAL — awaiting Dada's picks** (see "Decisions pending" at the end)
Date: 2026-09-13 · Repo: `github.com/idzharulhuda13/idzharulhuda-portfolio` (public, GitHub Pages, auto-deploy on push to `main`)
Local clone used for the audit: `/root/projects/portofolio`
Owner of the artifact: Dada. Arc plans + verifies, agy writes the code (agy-build-pipeline, threshold 0).

---

## 1. Current state (measured, not remembered)

| Item | Fact |
|---|---|
| Stack | vanilla HTML/CSS/JS, no build step; Chart.js 4.4 + Typed.js from CDN |
| Size | `index.html` 105 L, `config.js` 262 L (all content), `script.js` 461 L, `styles.css` 793 L |
| Last commit | 2026-05-11 — 4 months stale |
| Live | https://idzharulhuda13.github.io/idzharulhuda-portfolio/ (Pages build_type=workflow) |
| Design language | near-black `#0a0a0f` + teal `#10b981`, Inter + JetBrains Mono, `> ih` logo |
| Hero | particle-network `<canvas>` + Typed.js rotating 5 role strings |
| Sections | hero, about, impact (4 counter cards + 2 Chart.js bars), projects (6 cards, 2 with modal case study), experience (timeline), tech stack (pills), contact |
| SEO / share | `<title>` = "🐴 Idzharul Huda | Data Infrastructure Engineer"; no favicon; no `og:*` / `twitter:*`; `meta description` is filled by JS (empty for crawlers) |

## 2. Findings (each one is a revamp item)

Reproduced on the live site (screenshots + section offsets captured 2026-09-13); the section
offsets confirm the content loads lazily via IntersectionObserver, so a naive "screenshot the page"
audit sees an empty page — the audit below scrolled every section.

**F1 — No visual evidence anywhere.** Every project is a text card. No screenshot, no architecture
diagram, no code, no dbt DAG, no query plan. For a data-infra hire this is the single biggest gap
(same conclusion the 2026-05-11 audit reached; still open).

**F2 — The hero is the template trope.** Particle network + typing animation + "View My Work / Get In
Touch" is the highest-frequency portfolio pattern in the field. It costs CPU on mobile and says
nothing about the work. The horse emoji in the browser tab (🐴) is almost certainly an accident.

**F3 — Numbers without scope.** "30% pipeline efficiency", "9x query speed", "191 commits shipped",
"5 specialist agents". No table size, no wall-clock before/after, no cost in USD, no team/stakeholder
count per item. The two charts plot two hardcoded points (1x vs 9x, 96/58) with no units, no time
range, no environment — they read as decoration, not measurement.

**F4 — Skill pills encode a hidden scale.** `config.js` carries `level: expert|advanced|intermediate`
and the CSS renders it as green vs white borders. Nothing on the page explains the difference, so it
reads as a design bug (and it is the "skill bar" problem in disguise).

**F5 — Sharing is broken.** No OG/Twitter tags and no favicon: pasting the link into LinkedIn or
WhatsApp yields no preview card, and the tab shows an emoji.

**F6 — Zero depth layer.** Only 2 of 6 projects have a case study and it is a modal
(problem/approach/result text) — no URLs, so nothing is linkable or indexable per project.
No resume/CV download, no "what I'm looking for" line, no testimonials, no publication link
(the telehealth paper is mentioned but not cited).

**F7 — README contradicts the code.** It documents the pre-`config.js` era in one place and
`config.js` in another; also fine to drop the "how I built it" section entirely — recruiters read the
site, the README is for Dada.

**F8 — Motion is decorative, not purposeful.** Particles, typed roles, glow-on-hover borders,
fade-in on every section. Anti-slop's liveliness rule wants motion that carries information.

## 3. Direction options (pick one — this decides the whole visual language)

**A. Ops console / dashboard-native** *(Arc's recommendation)*
The site itself is the evidence: monospace data labels, tabular numbers, hairline grid, one accent +
one signal color, real charts with axes/units, "before → after" strips instead of counter cards.
Matches Dada's own positioning ("still build dashboards, not anti-dashboard"). Risks: must not look
like every dark-mode Grafana clone — the differentiation comes from the real artifacts (F1).

**B. Blueprint / engineering notebook**
Light-neutral paper, visible grid, annotated diagrams, numbered figures ("Fig. 2 — partition pruning"),
serif display + mono annotations. Reads senior and unusual; the artifact must be genuinely
diagram-heavy or it looks like a documentation skeleton.

**C. Editorial data journal**
Big typographic hierarchy, generous white space, one accent, case studies as long-form articles,
charts inline. Best for "I can write and think", weakest for "I ship pipelines".

## 4. Scope of work (independent of the direction)

### P0 — Foundations (no design dependency)
1. `og:*` + `twitter:card` + real `<meta description>` + favicon + `robots.txt`/`sitemap.xml`;
   title without the emoji.
2. README rewritten to match the code; keep the run-locally recipe only.
3. Content model additions in `config.js` (backwards compatible):
   - `project.slug`, `project.detailUrl`, `project.proof[]` (`{label, value, unit, note, source}`),
   - `project.archDiagram` (SVG file path), `project.codeSnippet` (`{lang, caption, before, after}`),
   - `impact[].scope` (the context line every number is missing today),
   - `personal.resumeUrl`, `personal.availability`, `experience[].techTags[]`.
4. Delete dead weight: Typed.js dependency, particle canvas, `.hermes/plans` stays (it is history).

### P1 — Depth pages (the actual fix for F1/F6)
`/projects/<slug>.html` for 3 projects, generated from `config.js` by a small render module so content
stays in one file: **BigQuery optimization**, **Dataverse**, **Data quality framework**.
Each page: problem + constraints → architecture diagram → the diff that mattered (before/after SQL or
dbt model) → measured result table with real numbers and their scope → what I would do differently.
The other 3 projects stay as compact cards that link to whichever artifact exists.

### P2 — Section redesign
- Hero: one positioning line + availability + 2 CTAs (Resume / Email) + a "current stack" strip.
  No typing animation. Motion only where it communicates.
- Impact: counter cards → "number + scope + source" rows; the two charts rewritten from real
  measurements with units and time range (or removed if the data does not exist — no decoration).
- Projects: hierarchy by outcome, tech tags normalised, metrics with context, featured = one, not two.
- Experience: keep the timeline (it survives critique) but add tech tags per role + a link from the
  top bullet to its artifact.
- Tech stack: drop the level-encoded borders; split "daily driver" vs "used in production", each with
  one concrete instance of use.
- Contact: value line + resume + email + LinkedIn + GitHub; add the telehealth citation.

### P3 — Mobile + accessibility pass
390×844 review of every section (agy-build-pipeline + antislop-layoutmobile), contrast checked with
`antislop-human/contrast-check.py`, keyboard focus states, reduced-motion media query, tap targets.

## 5. Execution (agy-build-pipeline)

- **Phase 1 (Arc, done here):** this plan; the picked direction is expanded into a token sheet
  (color/type/spacing/one motion rule) + a per-section spec before any run.
- **Phase 2 (agy):** one file per run, mechanical prompts, `--mode accept-edits --dangerously-skip-permissions`,
  background + notify. Order: (1) token sheet into `styles.css`, (2) hero, (3) impact, (4) projects grid,
  (5) experience + tech stack, (6) project detail template + 3 pages, (7) OG/SEO/README, (8) mobile pass.
  agy now carries the `antislop-design` plugin (antislop ×6 + claude-design) — the plan does NOT re-paste
  design rules into prompts; the plugin rule makes it read them.
- **Phase 3 (Arc):** `node --check` on JS, every `getElementById` id present, screenshot desktop + 390px
  per section, contrast script, no console errors, then diff review against "minimal change".
- **Delivery:** branch `revamp/v2` → PR with side-by-side screenshots (before/after) for Dada's eyeball →
  he merges → Pages auto-deploys. Nothing is pushed to `main` directly.
- **Batch economy:** runs are batched per file, not per fix; a run that no-ops goes through the guard
  ladder without asking (Dada, 2026-09-13).

## 6. Decisions pending from Dada

1. **Direction A / B / C** (Arc recommends A).
2. **Scope of content:** job-hunting portfolio only, or also show side builds as products
   (RaschLab, Pregnancy Journey Tracker, klinik/Apps Script dashboards)? Recommend: work experience
   first, plus a separate "Side builds" strip — they prove the same skills and they are real.
3. **Language:** keep English (current). Confirm.
4. **Numbers:** which claims may be published with real figures (bytes processed, cost in USD,
   table sizes)? Anything not publishable will be shown as a relative/ratio number instead.
