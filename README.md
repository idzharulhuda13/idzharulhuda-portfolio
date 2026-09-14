# idzharulhuda-portfolio

Analytics Engineer portfolio: static HTML, CSS and JavaScript, no build step and no dependencies, deployed to GitHub Pages.

Live: https://idzharulhuda13.github.io/idzharulhuda-portfolio/

## Content

All site content lives in `config.js`, in the single `PORTFOLIO` object. `index.html`,
`styles.css` and `script.js` are presentation only; editing `config.js` is enough to change
what the site says. Top-level keys:

- `personal` — name, initials, headline, availability, title, email, LinkedIn, GitHub, location, resume URL, tagline and bio paragraphs.
- `metrics` — the impact rows: one value per row, each with its scope and source, plus an optional before/after delta.
- `projects` — work projects: title, description, outcome, tech, featured flag, proof points, links, optional architecture diagram, code snippet and case study.
- `sideBuilds` — side projects, same object shape as `projects`; may be empty.
- `experience` — roles with company, company URL, location, period, detail bullets and tech tags.
- `skills` — the tech stack, split into `daily` and `production` groups; each item carries the place it is actually used.
- `contact` — contact section heading, description, links and the optional citation.
- `settings` — `revealThreshold`, the scroll-reveal trigger point.

Rules the content follows: every figure is traceable to a real measurement and paired with
its scope and source, no placeholder text, English only, no emoji.

## Structure

```
.
├── config.js                      # all site content (the PORTFOLIO object)
├── index.html                     # page shell and empty containers
├── styles.css                     # design tokens and layout
├── script.js                      # reads config.js, renders the containers
├── favicon.svg                    # site icon
├── robots.txt                     # crawler rules and sitemap pointer
├── sitemap.xml                    # single-URL sitemap
└── .github/workflows/deploy.yml   # GitHub Pages deploy on push to main
```

`.hermes/plans/` holds the working history: the 2026-05-11 audit that set the v2 direction
and the frozen v2 execution spec the design and content follow.

## Run locally

```bash
cd portofolio
python3 -m http.server 8080
```

Then open http://localhost:8080. Serving over HTTP is required — opening `index.html`
directly with `file://` blocks the script that loads `config.js`.

## Deploy

Push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) uploads the repository root
as the Pages artifact and deploys it.

```bash
git add -A
git commit -m "update: ..."
git push
```

The site is live at https://idzharulhuda13.github.io/idzharulhuda-portfolio/ about a minute later.
