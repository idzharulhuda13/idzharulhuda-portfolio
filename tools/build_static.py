#!/usr/bin/env python3
"""Bake the JS-rendered landing-page content into index.html and regenerate llms.txt.

Why: most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) and some search crawlers do not run
JavaScript, so the bands that script.js builds from config.js (work, experience, stack, about,
contact) were empty for them. This script renders the page in headless Chromium, copies each
container's markup between its <!-- prerender:ID --> markers, and writes it back. At runtime
script.js replaces the same containers with identical markup, so visitors see no change.

Run after every config.js edit:
    python3 tools/build_static.py          # rewrite index.html + llms.txt
    python3 tools/build_static.py --check  # exit 1 if either file is stale
"""
from __future__ import annotations

import functools
import html
import http.server
import re
import sys
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://idzharulhuda.com"
IDS = [
    "impact-list", "projects-grid", "sidebuilds-grid", "stack-grid", "timeline",
    "about-prose", "about-facts", "contact-heading", "contact-lead", "contact-links",
    "footer-text",
]
# Runtime-only state that must not be frozen into the static copy.
RUNTIME_CLASSES = re.compile(r"\s*\b(is-visible|is-active|is-open)\b")


def strip_markers(src: str) -> str:
    return re.sub(r"(<!-- prerender:([\w-]+) -->).*?(<!-- /prerender:\2 -->)", r"\1\3", src, flags=re.S)


def render(src: str) -> dict[str, str]:
    from playwright.sync_api import sync_playwright

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k):
            pass

    handler = functools.partial(Quiet, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    tmp = ROOT / ".prerender-src.html"
    tmp.write_text(strip_markers(src))
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page(viewport={"width": 1440, "height": 900})
            pg.route("**/*", lambda r: r.abort() if not r.request.url.startswith("http://127.0.0.1") else r.continue_())
            pg.goto(f"http://127.0.0.1:{srv.server_port}/{tmp.name}", wait_until="load")
            pg.wait_for_function("document.getElementById('projects-grid').children.length > 0")
            out = pg.evaluate(
                """ids => Object.fromEntries(ids.map(i => {
                    const el = document.getElementById(i);
                    const c = el.cloneNode(true);
                    [...c.childNodes].forEach(n => { if (n.nodeType === 8) n.remove(); });
                    return [i, c.innerHTML];
                }))""",
                IDS,
            )
            b.close()
    finally:
        srv.shutdown()
        tmp.unlink(missing_ok=True)
    return {k: RUNTIME_CLASSES.sub("", v) for k, v in out.items()}


def bake(src: str, parts: dict[str, str]) -> str:
    for i, markup in parts.items():
        if not markup.strip():
            raise SystemExit(f"FAIL: #{i} rendered empty")
        pat = re.compile(r"(<!-- prerender:%s -->).*?(<!-- /prerender:%s -->)" % (i, i), re.S)
        if not pat.search(src):
            raise SystemExit(f"FAIL: markers for #{i} missing in index.html")
        src = pat.sub(lambda m: m.group(1) + markup + m.group(2), src)
    return src


def meta(path: Path) -> tuple[str, str]:
    s = path.read_text()
    t = re.search(r"<title[^>]*>(.*?)</title>", s, re.S).group(1)
    d = re.search(r'name="description"[^>]*content="([^"]*)"', s).group(1)
    return html.unescape(t.split(" | ")[0].strip()), html.unescape(d.strip())


def visible_text(fragment: str) -> str:
    fragment = re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", " ", fragment, flags=re.S | re.I)
    text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()
    return re.sub(r"\s+([.,:;!?)])", r"\1", text)


def llms_txt(parts: dict[str, str]) -> str:
    about = (ROOT / "about.html").read_text()
    facts = re.findall(r"<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>", about, re.S)
    main = re.search(r"<main.*?</main>", about, re.S).group(0)
    prose = [visible_text(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", main, re.S)]
    prose = [p for p in prose if len(p) > 120 and not p.startswith("The services and")]
    _, home_desc = meta(ROOT / "index.html")
    lines = [
        "# Idzharul Huda",
        "",
        f"> {home_desc}",
        "",
        *[x for p in prose for x in (p, "")],
        "## Facts",
        "",
    ]
    lines += [f"- {visible_text(k)}: {visible_text(v)}" for k, v in facts]
    lines += ["", "## Pages", ""]
    for name in ("index.html", "about.html", "changelog.html"):
        t, d = meta(ROOT / name)
        url = SITE + "/" + ("" if name == "index.html" else name)
        lines.append(f"- [{t}]({url}): {d}")
    lines += ["", "## Case studies", ""]
    for p in sorted((ROOT / "projects").glob("*.html")):
        t, d = meta(p)
        lines.append(f"- [{t}]({SITE}/projects/{p.name}): {d}")
    lines += [
        "",
        "## Optional",
        "",
        f"- [Resume (PDF)]({SITE}/resume.pdf)",
        "- [GitHub](https://github.com/idzharulhuda13)",
        "- [LinkedIn](https://id.linkedin.com/in/idzharulhuda)",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    check = "--check" in sys.argv
    index = ROOT / "index.html"
    src = index.read_text()
    parts = render(src)
    new_index = bake(strip_markers(src), parts)
    new_llms = llms_txt(parts)
    stale = [n for n, new in (("index.html", new_index), ("llms.txt", new_llms))
             if not (ROOT / n).exists() or (ROOT / n).read_text() != new]
    if check:
        print("stale: " + ", ".join(stale) if stale else "ok: static copy matches config.js")
        return 1 if stale else 0
    index.write_text(new_index)
    (ROOT / "llms.txt").write_text(new_llms)
    for i in IDS:
        print(f"{i:16s} {len(visible_text(parts[i])):5d} chars")
    print("wrote index.html, llms.txt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
