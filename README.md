# idzharulhuda-portfolio

Analytics Engineer portfolio site built with vanilla HTML, CSS, and JavaScript. No build step, no dependencies -- just static files deployed to GitHub Pages.

**Live:** [idzharulhuda13.github.io/idzharulhuda-portfolio](https://idzharulhuda13.github.io/idzharulhuda-portfolio)

## Tech

- HTML + CSS + vanilla JS
- Chart.js (CDN) for data visualizations
- Typed.js (CDN) for hero typing animation
- Particle network canvas background

## Structure

```
.
├── config.js               # ALL CONTENT -- edit this to update the site
├── index.html              # Clean template, zero content
├── styles.css              # Dark theme, responsive layout
├── script.js               # Reads config.js, renders everything dynamically
└── .github/workflows/
    └── deploy.yml          # GitHub Pages auto-deploy on push to main
```

## Updating Content

**Edit `config.js` only.** The entire site is driven by the `PORTFOLIO` object:

```js
PORTFOLIO.personal     // name, email, bio, typing roles
PORTFOLIO.metrics       // impact cards
PORTFOLIO.charts        // chart data, titles, colors
PORTFOLIO.projects      // project cards with case studies and GitHub links
PORTFOLIO.experience    // job history
PORTFOLIO.skills        // tech stack categories
PORTFOLIO.contact       // contact links
PORTFOLIO.settings      // animation timings, particle config
```

Each project supports:
- `githubUrl` - link to the source code repo
- `caseStudy` - problem/approach/result modal content (set to `null` if no case study)

## Run Locally

```bash
cd idzharulhuda-portfolio
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Push to `main` -- the GitHub Actions workflow automatically deploys to GitHub Pages.

```bash
git add -A
git commit -m "update: ..."
git push
```

Site will be live at `https://idzharulhuda13.github.io/idzharulhuda-portfolio/` within ~1 minute.
