# Portfolio v2 — execution spec (direction A: ops console / dashboard-native)

Status: FROZEN CONTRACT. Branch `revamp/v2`. Language: English (Dada, 2026-09-14).
Decisions locked by Dada 2026-09-14: direction **A**, scope **work + side builds**, language **English**,
real numbers **publishable**.

This file is the interface between the writers. `index.html`, `styles.css`, `script.js` and `config.js`
must agree with it exactly. Never invent a class name, id or config key that is not listed here.

---

## 1. Design tokens (`styles.css` `:root`)

```
--bg:        #08090b   page background
--surface:   #0f1115   card / panel
--surface-2: #14171c   nested panel, code block
--line:      #1e232b   1px hairline borders, table rules
--text:      #e6e8ec   primary text
--muted:     #8b929e   secondary text, labels
--muted-2:   #5f6672   footnotes, sources
--accent:    #10b981   primary accent (brand continuity, teal)
--signal:    #f59e0b   "before" / warning side of a delta
--bad:       #ef4444   only for a negative delta that matters
```
No glow shadows, no gradients, no `border-radius` above 8px. Hairlines do the separation work.
Optional hairline grid: `background-image: linear-gradient(...)` at 4% white, 32px pitch, only behind
`.hero` and `.section--grid`; keep it out of text areas.

Type: **Inter** (300/400/500/600/700) for prose/UI, **JetBrains Mono** (400/500/600) for every number,
label, unit, source and code. All numbers: `font-variant-numeric: tabular-nums`.

```
--fs-mono-s: 12px   --fs-mono:  13px
--fs-body:   14px   --fs-lead:  17px
--fs-h3:     20px   --fs-h2:    28px
--fs-h1:     clamp(32px, 5vw, 52px)
```
Letter-spacing: uppercase mono labels `+0.08em`, h1 `-0.02em`, h2 `-0.01em`, body `0`.
Line-height: body 1.6, h1 1.08, h2 1.2, mono labels 1.4.

Spacing scale (px): 4 8 12 16 24 32 48 64 96 128. Section padding `96px 0` desktop, `64px 0` ≤640px.
`.wrap` = max-width 1080px, auto margins, padding `0 24px` (`0 16px` ≤560px).

Motion: only two transitions exist — `120ms ease-out` (hover/focus border & color) and `240ms ease-out`
(section reveal: `opacity 0→1`, `translateY(8px)→0`). Everything animations-off under
`@media (prefers-reduced-motion: reduce)`. No particles, no typing, no counters, no parallax, no glow.

Frozen state contract shared by `styles.css` + `script.js`:
`.reveal` (initial: `opacity:0; transform:translateY(8px)`) → `.reveal.is-visible` (final);
`.site-header.is-scrolled` (stronger header background once `window.scrollY > 8`).

Removed dependencies: Chart.js, Typed.js, particle canvas. No new dependency of any kind (ladder rung 5).

---

## 2. DOM + class contract

Every class name below is frozen. Markup (`index.html`) creates static shells and empty containers;
`script.js` fills the containers listed as JS-filled. Nothing else is generated at runtime.

### Header
```html
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="#top" id="brand-logo">&gt; ih</a>
    <nav class="nav">
      <a class="nav-link" href="#about">About</a>   <!-- Impact, Projects, Experience, Contact -->
    </nav>
  </div>
</header>
```
`.site-header` sticky top, `1px` bottom `--line`, `background: rgba(8,9,11,.85)`, `backdrop-filter: blur(8px)`.
`#brand-logo` text comes from config (`> ` + initials).

### Hero
```html
<section class="hero" id="top">
  <div class="wrap hero-inner">
    <p class="hero-eyebrow" id="hero-eyebrow"></p>      <!-- JS-filled, mono, uppercase -->
    <h1 class="hero-title" id="hero-name"></h1>          <!-- JS-filled -->
    <p class="hero-lead" id="hero-lead"></p>             <!-- JS-filled -->
    <div class="hero-cta" id="hero-cta"></div>           <!-- JS-filled: a.btn -->
    <div class="stack-strip" id="stack-strip"></div>     <!-- JS-filled: span.chip -->
    <div class="hero-stats" id="hero-stats"></div>       <!-- JS-filled: .stat -->
  </div>
</section>
```
`.btn` mono 13px uppercase, 1px `--line`, padding `12px 20px`, radius 4px.
`.btn-primary` accent border + accent text; `.btn-ghost` muted border + text.
`.chip` mono 12px, hairline, radius 4px, padding `4px 8px`.
`.stat` → `.stat-value` (mono 20px accent) + `.stat-label` (12px muted). `.hero-stats` = flex row, wrap, `1px` left hairline per stat, padding-left 16px.

### About
```html
<section class="section" id="about">
  <div class="wrap">
    <div class="section-head">
      <p class="section-label">&gt; about</p>
      <h2 class="section-title">How I work</h2>
    </div>
    <div class="prose" id="about-prose"></div>     <!-- JS-filled: <p> with <mark> -->
    <dl class="about-facts" id="about-facts"></dl> <!-- JS-filled: dt.fact-label + dd.fact-value -->
  </div>
</section>
```
`mark` = accent colour text on transparent background (no highlight fill), weight 500.

### Impact (fixes "numbers without scope")
```html
<section class="section section--grid" id="impact">
  <div class="wrap">
    <div class="section-head">
      <p class="section-label">&gt; impact</p>
      <h2 class="section-title">Measured impact</h2>
      <p class="section-note">Every number below is paired with its scope and source.</p>
    </div>
    <div class="impact-list" id="impact-list"></div>   <!-- JS-filled -->
  </div>
</section>
```
Each `.impact-item` is generated as:
```html
<div class="impact-item">
  <div class="impact-head">
    <span class="impact-value">96%</span>
    <span class="impact-label">BigQuery slot time on the ARPU datamart</span>
  </div>
  <p class="impact-scope">Scope: one datamart model feeding 50+ downstream reports</p>
  <p class="impact-source">Source: BigQuery INFORMATION_SCHEMA.JOBS, Dec 2024</p>
  <div class="delta">                      <!-- only when config carries delta{} -->
    <div class="delta-col delta-before">
      <span class="delta-tag">before</span>
      <span class="delta-value">4h 10m</span>
      <span class="delta-note">wall clock, full refresh</span>
    </div>
    <div class="delta-col delta-after">
      <span class="delta-tag">after</span>
      <span class="delta-value">22m</span>
      <span class="delta-note">same query, same data volume</span>
    </div>
  </div>
</div>
```
`.impact-value` mono 32px; `.impact-label` 14px text; `.impact-scope` 13px muted; `.impact-source` mono 12px muted-2.
`.delta` = 2 columns split by a `1px` hairline; `before` value in `--signal`, `after` in `--accent`.
`.impact-item` separated by `1px` top hairline, `24px 0` padding.

### Projects
```html
<section class="section" id="projects">
  <div class="wrap">
    <div class="section-head">
      <p class="section-label">&gt; work</p>
      <h2 class="section-title">Selected work</h2>
    </div>
    <div class="projects-grid" id="projects-grid"></div>   <!-- JS-filled -->
    <div class="section-head section-head--sub">
      <p class="section-label">&gt; side builds</p>
      <h2 class="section-title">Side builds</h2>
    </div>
    <div class="projects-grid" id="sidebuilds-grid"></div>  <!-- JS-filled, smaller cards -->
  </div>
</section>
```
`.projects-grid` = 2 columns ≥760px, 1 column below; `.project-card.featured` spans 2 columns and its
`.proof` becomes a horizontal row.
Card markup generated by script:
```html
<article class="project-card featured">
  <div class="project-head">
    <h3 class="project-title">BigQuery Pipeline Optimization</h3>
    <span class="project-badge">featured</span>
  </div>
  <p class="project-outcome">One datamart model, 9x faster, 96% less slot time.</p>
  <p class="project-desc">…</p>
  <div class="project-facts">                 <!-- from project.proof[] -->
    <div class="proof">
      <span class="proof-value">4h 10m → 22m</span>
      <span class="proof-label">full-refresh wall clock</span>
      <span class="proof-note">on 180M rows, prod, Dec 2024</span>
    </div>
  </div>
  <div class="project-tech"><span class="tech-chip">BigQuery</span>…</div>
  <figure class="project-figure"><img src="…" alt="…"><figcaption>…</figcaption></figure>
  <div class="project-links"><a class="project-link" href="…">Case study →</a></div>
</article>
```
`.proof-value` mono 18px accent; `.proof-label` 12px muted; `.proof-note` 12px muted-2.
`.tech-chip` mono 12px hairline. `.project-link` mono 13px accent with `→`. `.project-badge` mono 11px uppercase accent.
`figure.project-figure` and every part backed by an absent config field is simply **not emitted** —
never an empty box, never a placeholder.

### Experience
```html
<section class="section" id="experience">
  <div class="wrap">
    <div class="section-head"><p class="section-label">&gt; experience</p><h2 class="section-title">Experience</h2></div>
    <div class="timeline" id="timeline"></div>    <!-- JS-filled -->
  </div>
</section>
```
`.timeline-item` → `.timeline-dot`, `.timeline-body` → `.timeline-role`, `a.company-link` (`.timeline-company`),
`.timeline-meta` (mono 12px muted: location · period), `ul.timeline-details > li`, `.role-tags` → `span.tech-chip`.

### Tech stack
```html
<section class="section" id="skills">
  <div class="wrap">
    <div class="section-head"><p class="section-label">&gt; stack</p><h2 class="section-title">Tech stack</h2>
      <p class="section-note">Each entry names where it is actually used.</p></div>
    <div class="stack-grid" id="stack-grid"></div>   <!-- JS-filled -->
  </div>
</section>
```
Two `.stack-group`s only: `daily driver` and `used in production`; each is `.stack-group-title` (mono uppercase)
plus `ul.stack-items > li.stack-item` → `.stack-name` + `.stack-where`. No skill levels are rendered anywhere.

### Contact + footer
```html
<section class="section" id="contact">
  <div class="wrap">
    <div class="section-head"><p class="section-label">&gt; contact</p>
      <h2 class="section-title" id="contact-heading"></h2></div>
    <p class="contact-lead" id="contact-lead"></p>            <!-- JS-filled -->
    <div class="contact-links" id="contact-links"></div>      <!-- JS-filled: a.contact-card -->
    <p class="citation" id="contact-citation"></p>            <!-- JS-filled, hidden when empty -->
  </div>
</section>
<footer class="site-footer"><div class="wrap"><p class="footer-text" id="footer-text"></p></div></footer>
```
`.contact-card` mono 13px hairline box, hover accent border. `.citation` mono 12px muted-2.

### JS-filled element ids — the complete list
`page-title`, `page-meta`, `brand-logo`, `hero-eyebrow`, `hero-name`, `hero-lead`, `hero-cta`,
`stack-strip`, `hero-stats`, `about-prose`, `about-facts`, `impact-list`, `projects-grid`,
`sidebuilds-grid`, `timeline`, `stack-grid`, `contact-heading`, `contact-lead`, `contact-links`,
`contact-citation`, `footer-text`.

Rule: `index.html` contains every id in this list and no other id; `script.js` queries exactly these ids
and adds no id of its own. No modal. No `particle-canvas`.

---

## 3. `config.js` schema v2 (frozen keys)

```js
const PORTFOLIO = {
  personal: {
    name, initials, title, email, linkedin, github, location,
    headline,        // NEW string — the one positioning line, used as the hero h1
    availability,    // NEW string — mono eyebrow, e.g. "Open to senior data roles — Jakarta or remote"
    resumeUrl,       // NEW string, "" until a real PDF exists (CTA is skipped when empty)
    tagline,         // keep — hero lead
    bio,             // keep — [{text, highlights}]
    roles            // keep — unused by v2, kept so old configs still parse
  },
  metrics: [ { value, unit, label, scope, source, delta: {before:{value,note}, after:{value,note}} | null } ],
  projects: [ {
    title, slug, description, outcome, tech: [], featured: true|false,
    kind: "work" | "side",          // NEW — splits the two grids
    githubUrl, detailUrl,           // detailUrl "" until the detail page exists
    proof: [ {value, label, note} ],// NEW
    archDiagram,                    // NEW path under assets/ or ""
    codeSnippet,                    // NEW {lang, caption, before, after} or null
    caseStudy,                      // keep {problem, approach, result} or null
    metrics                         // keep — legacy cards, unused by v2 renderer
  } ],
  sideBuilds: [],                   // NEW — same object shape as projects[]; may be empty
  experience: [ { role, company, companyUrl, location, period, details: [], techTags: [] } ],
  skills: {                         // CHANGED from array to object
    daily:      [ {name, where} ],
    production: [ {name, where} ]
  },
  contact: { heading, description, links: [{type,label,href}], citation: {text, href} | null },
  settings: { revealThreshold: 0.12 }   // particle/typed/counter keys deleted
};
```

Content rules (hard):
1. **Never invent a number.** Every figure must already exist in the old `config.js`, the audit plan, or be
   supplied in the writer's brief. If a measurement is unknown, omit the field — the renderer hides it.
2. No placeholder text, no `TODO`, no lorem, no `{…}`, no sample values.
3. English only, sentence case, no emoji anywhere (not in the title, not in labels).
4. Scope lines must answer "how big was this": table/row counts, report counts, team size, stakeholders,
   cadence, environment.
5. Source lines name the artifact the number came from (tool + table/view + period), never "internal data".

---

## 4. Constraints (ponytail ladder — travels with the task)

```text
LADDER — before writing any code, stop at the first rung that holds:
1. Does this need to exist?      -> no: skip it (YAGNI), say so in one line.
2. Already in this codebase?     -> reuse the helper/util/pattern that already lives here. Look before writing.
3. Stdlib does it?               -> use it.
4. Native platform feature?      -> use it (input type=date over a picker lib, CSS over JS, DB constraint over app code).
5. Already-installed dependency? -> use it. Never add a new one for what a few lines can do.
6. Can it be one line?           -> one line.
7. Only then: the minimum code that works.

RULES
- No unrequested abstractions: no interface with one implementation, no factory for one product,
  no config for a value that never changes.
- No boilerplate, no scaffolding "for later".
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins — but only after understanding the problem.
- Two stdlib options the same size -> take the edge-case-correct one. Less code, not a flimsier algorithm.
- Mark a deliberate short-cut that has a real ceiling with a ponytail: comment naming the ceiling and the upgrade path.

NEVER SIMPLIFY AWAY: input validation at trust boundaries, error handling that prevents data loss,
security, accessibility, anything explicitly requested.
NEVER LAZY ABOUT UNDERSTANDING: read the code the change touches, trace the real flow end to end, then climb.
LEAVE ONE RUNNABLE CHECK: non-trivial logic leaves one small runnable check behind. No frameworks, no fixtures.
```

Hard constraints for every writer:
- **This is plain static HTML/CSS/JS, ES5-safe in `script.js`** (the repo uses `var`/string concat; keep that
  style — no build step, no modules, no bundler).
- Do NOT touch any file outside your assignment. Other writers are working in this repo at the same time.
- Do NOT commit, do NOT push, leave changes in the working tree.
- Keep the existing SEO/meta behaviour: `page-title` and `page-meta` are still filled from config.
- Every interactive element must have a visible `:focus-visible` outline (2px accent offset 2px).
- Text contrast ≥ 4.5:1 against its background (`--muted` on `--bg` passes; do not go darker).

---

## 5. Per-section spec (what each section must say)

**Hero.** Eyebrow = availability. h1 = `personal.headline` (positioning, not a job title salad).
Lead = tagline, ≤2 lines. CTAs: Email (`mailto:`) primary, GitHub ghost; Resume button only when
`resumeUrl` is non-empty. Stack strip = 6 daily-driver tools. Hero stats = 3 short facts (years in data,
production pipelines, stakeholders served) taken from config, no invented precision.

**About.** `bio` paragraphs as prose with accent `mark`s, then a `dl` of facts: location, focus, current
role, timezone. Add one paragraph of engineering philosophy (headless delivery, cost-aware engineering,
self-serve at scale) — the 2026-05-11 audit's "positioning is missing" finding.

**Impact.** 4 rows max, each number + scope + source, delta strip where a before/after exists. The two
hardcoded fake charts are DELETED, not restyled.

**Projects.** Featured card first (BigQuery optimization), then the rest of work projects, then the
`> side builds` grid (RaschLab, Pregnancy Journey Tracker, one Apps Script dashboard) using the same card
component, no badges. Metrics appear only as `proof[]` with scope notes.

**Experience.** Timeline kept; each role gets `techTags`; the first bullet of Rey.id links to the BigQuery
case study when `detailUrl` exists.

**Tech stack.** Two groups, each item with `where` (one concrete instance of use). No level borders.

**Contact.** Value line + Email / LinkedIn / GitHub + the telehealth paper citation as a real reference.

---

## 6. Execution order (this batch = B1)

| Writer | Files (disjoint) |
|---|---|
| W1 | `styles.css` (full rewrite to §1 + §2) |
| W2 | `index.html` (shells + head/SEO tags, ids per §2) |
| W3 | `script.js` (renderer for §2 + §3, ES5 style) |
| W4 | `config.js` (schema v2 + content per §3 rules) |
| W5 | `README.md`, `robots.txt`, `sitemap.xml`, `favicon.svg` |

Next batches (not this one): detail pages `/projects/<slug>.html` + renderer, arch diagram SVGs,
`assets/og-card.png` + `og:image` (deliberately deferred so the tag never points at a missing file —
W2 ships every other OG/Twitter tag), mobile/a11y pass, PR to `main`.

## 7. Numbers Dada cannot supply (answered 2026-09-14)

Asked for the missing measurements; **Dada's answer 2026-09-14: "itu udah lama banget aku gapunya lagi
historynya"** — the BigQuery history (bytes, slot hours, wall clock) is gone. Closed as unavailable, not
as forgotten: nothing is invented, and `delta` / `proof[].note` stay `null` for those items so the renderer
hides them.

What the site uses instead (all pre-existing, from Dada's own resume/config, so still his claims to stand by):
the 82% → 95% accuracy pair, daily → hourly report cadence, 1x → 9x datamart runtime, 96% slot-time
reduction, 40+ stakeholders, 50+ reports migrated, 15 analysts × 2h/day.

Reopen condition: if he ever restores the query history, the fields are data-only edits — no code change.
