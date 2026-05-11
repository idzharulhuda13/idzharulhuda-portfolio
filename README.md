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
├── index.html              # Single-page portfolio
├── styles.css              # Dark theme, responsive layout
├── script.js               # Particles, charts, animations, interactivity
└── .github/workflows/
    └── deploy.yml          # GitHub Pages auto-deploy on push to main
```

## Sections

| Section | What It Shows |
|---------|--------------|
| **Hero** | Animated role cycling, particle network background, CTA buttons |
| **About** | Bio, key achievements, contact info |
| **Impact** | 4 animated metric cards + 2 data charts (BigQuery optimization results) |
| **Projects** | 6 project cards with tech tags and impact metrics |
| **Experience** | Timeline of roles at Rey.id and Olvo.ai |
| **Tech Stack** | Skills organized by category with proficiency levels |
| **Contact** | Email, LinkedIn, GitHub links |

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

## Customization

- **Content:** Edit `index.html` directly -- all text is inline
- **Colors:** Change CSS variables at the top of `styles.css` (`--accent`, `--bg-primary`, etc.)
- **Charts:** Update data in `script.js` -- look for `Chart()` constructor calls
- **Typed.js roles:** Edit the `strings` array in `script.js`
- **Particles:** Adjust count, speed, and connection distance in `script.js`
