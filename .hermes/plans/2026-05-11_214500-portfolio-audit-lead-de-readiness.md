# Portfolio Audit: Idzharul Huda — Lead Data Engineer / AI Solutions Architect Readiness

**Auditor persona:** Senior Technical Recruiter + Engineering Manager (15 yrs, Snowflake/Databricks/hypergrowth B2B)
**Date:** 2026-05-11
**Scope:** Portfolio site (idzharulhuda-portfolio), GitHub profile (26 repos), dataverse repo, Analytics-Engineering-Portfolio repo

---

## Executive Summary

**Verdict:** You are **not yet ready for Lead Data Engineer or AI Solutions Architect roles**, but you ARE competitive for **Senior Analytics Engineer / Staff Data Engineer** roles at mid-market companies. The gap is not in your production experience — your metrics (9x query speedup, 96% slot reduction, $1M+ sale contribution) are genuinely strong. The gap is in **how you present technical depth** and **architectural storytelling**.

Right now your portfolio reads like a **senior individual contributor** who can execute, not a **lead** who designs systems. That's fixable with targeted improvements.

---

## The "Red Flag" List

### 1. No Code Evidence of Technical Depth
Your portfolio is a marketing page, not a technical showcase. It lists "dbt, BigQuery, SQL" but shows **zero code**. A hiring manager for a Lead DE role wants to see:
- A complex SQL transformation (window functions, CTEs, partitioning strategy)
- A dbt model graph or DAG screenshot
- Airflow DAG structure
- A before/after query plan (EXPLAIN output)

**Impact:** Without code samples, your 96% BigQuery slot reduction claim looks like a resume bullet, not an engineering achievement. Anyone can write "96% reduction." Showing the `PARTITION BY`, the clustering key, the before/after `bytes_processed` from `INFORMATION_SCHEMA.JOBS` — that's proof.

### 2. Dataverse Project is the Most Interesting Thing and It's Buried
Your `dataverse` repo (191 commits, LLM agents, dbt, DevContainer, tests) is the single strongest signal for an AI Solutions Architect role. It's a **conversational analytics platform with agentic workflows**. Yet:
- On the portfolio site, it's card #5 out of 6 with an empty metrics section
- No link to the GitHub repo from the card
- No architecture diagram or demo GIF
- No description of the agent architecture, MCP usage, or how it handles SQL generation

**Impact:** Your best work is invisible to anyone who doesn't already know to look at your GitHub.

### 3. GitHub Profile is a Resume Graveyard
26 repositories but:
- No pinned repos (the most important GitHub profile real estate is empty)
- Repos have no READMEs or generic READMEs (the `dataverse` repo has 191 commits but the README is barely visible in the snapshot)
- Many repos are clearly class projects / tutorials: `CRUD-Laravel-jetstream`, `PythonOOP`, `BI---KNN`, `BI---ANN`, `login-app`, `PHP8-basic`, `Slicing-WhoknowsWhatId`
- 3 followers — this doesn't look bad per se, but combined with 26 unmaintained repos, it signals "student / tutorial collector" not "active engineer"

**Impact:** A hiring manager clicking your GitHub from the portfolio will see tutorial repos and assume your engineering depth is academic, not production.

### 4. "Headless B2B" Value Proposition is Nowhere
You mentioned specializing in headless B2B products. This is **not communicated anywhere** in the portfolio. The site reads like a generic analytics engineer portfolio — the kind you see from hundreds of bootcamp grads. There's nothing that says "I build invisible data infrastructure that powers business outcomes without anyone needing a dashboard."

**Impact:** You sound like every other analytics engineer. Your differentiation (headless, spreadsheet-delivered, API-first) is your actual competitive advantage and it's missing entirely.

### 5. No Architecture / System Design Signal
Lead Data Engineers get hired for their ability to design data architectures, not just write SQL. Your portfolio shows:
- Zero architecture diagrams
- No data flow descriptions
- No mention of data modeling approaches (Kimball, Data Vault, OBT)
- No discussion of data quality frameworks (what tests? what freshness checks? what anomaly detection?)
- No mention of cost optimization methodology (how did you know to optimize slot time?)

**Impact:** You look like an executor of data models designed by someone else, not an architect.

### 6. README is Outdated
The portfolio README says:
```
- **Content:** Edit `index.html` directly -- all text is inline
```
This is wrong since the config.js refactor. The README has not been updated to reflect the modular architecture. It also describes technical implementation (HTML/CSS/JS structure) that nobody cares about — a recruiter doesn't need to know you used vanilla JS.

### 7. Missing Social Proof / Validation
- No recommendations or testimonials
- No conference talks, blog posts, or technical writing
- No open-source contributions outside your own repos
- The published telehealth paper has no link or citation

---

## The "Golden Nuggets"

These are what separate you from the 500 other applicants. Lean into these HARD:

### 1. Your BigQuery Optimization Story is Gold
96% slot time reduction is not a normal achievement. Most analytics engineers never touch the cost layer. This signals:
- You understand BigQuery's execution model, not just how to write queries
- You think about compute economics (essential for Lead DE)
- You can quantify engineering work in business terms (cost savings)

**This is your #1 differentiator.** Most candidates say "I wrote SQL." You said "I reduced compute cost by 96%."

### 2. Olvo.ai: OCR + YOLO + LLM Production Pipeline
Digitizing hardcopy documents at scale with YOLO + GPT-4 and contributing to a $1M+ sale is a real AI engineering achievement. It shows:
- You can productionize ML models (not just train them in notebooks)
- You understand document AI pipelines (OCR -> detection -> LLM extraction -> structured output)
- You build demos that close deals (the Streamlit app)

### 3. Self-Serve Analytics at 40+ Stakeholders
Going from Google Sheets to BigQuery + dbt + Metabase with 40+ self-serve users shows:
- You can build systems that scale beyond the analyst
- You understand the organizational impact of data engineering
- You can drive adoption (getting 40 people to actually use your dashboards)

### 4. You Have Actual Production Code
Your `dataverse` repo has 191 commits, DevContainer, tests, dbt models, and agent architecture. This is real engineering work, not a tutorial. Your `Analytics-Engineering-Portfolio` repo has dbt_project.yml, Makefile, pyproject.toml, uv.lock — you know modern Python tooling.

### 5. ISO 27001:2022 Experience
Most analytics engineers have never touched compliance. You enforced data handling standards aligned with ISO 27001. This is relevant for any Lead role at a regulated company (healthcare, fintech, insurance).

---

## The Action Plan

### Step 1: Add a "Deep Dive" Page for Your Top 3 Projects (Priority: CRITICAL)

**Why:** Your current project cards are billboard ads — catchy but shallow. Lead roles require proof of depth.

**What to build:**
Add a `#projects-modal` or separate project detail pages that show:
- **Architecture diagram** (simple SVG or Mermaid) — data sources -> transformations -> outputs
- **Before/after code** — a snippet of the slow query vs the optimized query
- **BigQuery cost data** — actual bytes_processed before/after (even approximate)
- **The problem statement** — "Reports took 4 hours to run, blocking 3 teams from morning standup decisions"
- **The technical approach** — partitioning strategy, clustering keys, model refactoring

**How:** Add a `detail_url` or `detail_html` field to each project in `config.js`. The modal renders on click.

**Time estimate:** 2-3 hours

---

### Step 2: Pin Your Best Repos and Clean Up GitHub (Priority: CRITICAL)

**Why:** Your GitHub profile is your second landing page after the portfolio. It currently undermines your brand.

**Actions:**
1. **Pin 4-6 repos** in this order:
   - `dataverse` (AI analytics platform)
   - `Analytics-Engineering-Portfolio` (dbt + Streamlit showcase)
   - `idzharulhuda-portfolio` (this site)
   - One more production-relevant repo
   
2. **Archive or make private** the tutorial repos: `CRUD-Laravel-jetstream`, `PythonOOP`, `BI---KNN`, `BI---ANN`, `login-app`, `PHP8-basic`, `Slicing-WhoknowsWhatId`, `Flutter-UI-*`, `MAD_nfc`

3. **Write proper READMEs** for `dataverse` and `Analytics-Engineering-Portfolio`:
   - Architecture diagram
   - Tech stack
   - How to run locally
   - Screenshots/GIFs of the app in action
   - Key technical decisions (and why)

**Time estimate:** 1-2 hours

---

### Step 3: Rewrite Your "Headless B2B" Narrative (Priority: HIGH)

**Why:** This is your differentiator. Most data engineers build dashboards. You build invisible systems that deliver results via spreadsheets, APIs, and automated reports.

**Changes to `config.js`:**

```js
// personal.tagline — replace with:
tagline: "I build headless data infrastructure — pipelines that deliver insights via spreadsheets, APIs, and automated reports. No dashboard required."

// personal.bio[0] — replace with something that leads with your philosophy
{
  text: "I specialize in headless B2B data products. Instead of building more dashboards, I engineer pipelines that deliver the right data to the right people via the tools they already use — spreadsheets, email, APIs, and chat.",
  highlights: ["headless B2B data products", "spreadsheets, email, APIs, and chat"]
}

// Add a new section between About and Impact:
// "How I Work" or "Engineering Philosophy"
// With 3 pillars: Headless Delivery, Cost-Aware Engineering, Self-Serve at Scale
```

**Time estimate:** 30 minutes

---

### Step 4: Add Technical Proof Artifacts (Priority: HIGH)

**Why:** Claims need evidence. These artifacts cost nothing to create but dramatically increase credibility.

**Create these artifacts:**

1. **SQL Optimization Case Study** (a new project card or detail page):
   - Show the EXPLAIN ANALYZE output before/after
   - Explain the partitioning strategy
   - Quantify cost savings in USD (not just percentages)
   - This should be your NEW featured project, replacing the current DBT + Metabase one

2. **Data Quality Framework Deep Dive**:
   - Show an example of a dbt test you wrote
   - Show how the automated discrepancy detection works
   - Show a before/after: manual process vs automated pipeline

3. **Architecture Diagram for Dataverse**:
   - Simple diagram: User -> LLM Agent -> SQL Generator -> BigQuery -> Results -> User
   - Show the agentic workflow, not just the tech stack

**Time estimate:** 3-4 hours (writing + diagramming)

---

### Step 5: Add a "Case Studies" Section (Priority: MEDIUM)

**Why:** Lead/Senior roles are hired on demonstrated problem-solving, not feature lists. Case studies show how you think.

**Format for each case study (1-2 paragraphs):**

```
### From Daily to Hourly: Migrating Rey.id's Data Infrastructure
**Problem:** 15 analysts spending 2 hours/day manually running reports from Google Sheets.
Stakeholders couldn't make decisions until afternoon.

**Approach:** Migrated 50+ reports to BigQuery with dbt transformations. Built automated
data quality checks. Deployed Metabase for self-serve.

**Result:** Reports run hourly instead of daily. 40+ stakeholders self-serve. Analyst time
freed for higher-value work. 30% overall pipeline efficiency gain.
```

**Add 2-3 of these** as a new section in the portfolio. They're text-only (fast to create) but they show your thinking process.

**Time estimate:** 1-2 hours

---

## Summary: What Changes Between "Good" and "Hire"

| Current State | Target State |
|--------------|-------------|
| Portfolio says "I did X, got Y%" | Portfolio **shows** the SQL, the architecture, the cost data |
| GitHub has 26 repos including tutorials | GitHub has 6 pinned repos, all production-quality |
| "Analytics Engineer" positioning | "Headless Data Infrastructure Engineer" positioning |
| Project cards with metrics | Case studies with problem/approach/result |
| No code evidence | SQL snippets, dbt models, architecture diagrams |
| "Let's build something great together" CTA | "Here's how I think about data engineering" content |

---

## Scoring (1-10)

| Dimension | Score | Notes |
|-----------|-------|-------|
| Business impact communication | 8 | Your metrics are strong and quantified |
| Technical depth visibility | 3 | No code, no architecture, no proof artifacts |
| Headless B2B positioning | 2 | Not communicated at all |
| GitHub profile quality | 4 | Good repos exist but buried under tutorial noise |
| Information architecture | 6 | Clean nav, good sections, but no depth layers |
| "Lead" signaling | 4 | Shows execution competence, not design/architecture |
| Overall readiness for Lead DE | **5/10** | Good foundation, needs 10-15 hours of targeted work |
| Overall readiness for Senior AE | **7/10** | Already competitive with minor improvements |
