/* ==========================================================================
   script.js: Instrument Sheet Renderer
   Renders all landing page sections from the global PORTFOLIO object (config.js).
   Generates deterministic inline SVG diagrams and charts without external libraries.
   Maintains all required element IDs and provides accessible theme switching.
   ========================================================================== */

(function () {
  'use strict';

  var P = (typeof PORTFOLIO !== 'undefined' && PORTFOLIO) ? PORTFOLIO : {};

  // Element references cached on DOM load
  var elPageTitle, elPageMeta, elBrand, elEyebrow, elName, elLead, elCta,
      elStrip, elStats, elProse, elFacts, elImpact, elProjects, elSide,
      elTimeline, elStack, elContactHeading, elContactLead, elContactLinks,
      elCitation, elFooter, elPipelineMap, elQualityMatrix, elThemeToggle;

  // Clean string helper: replaces any em dash characters with colon
  function sanitize(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/\s*\u2014\s*/g, ': ');
  }

  function esc(str) {
    if (str === null || str === undefined) return '';
    return sanitize(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function has(value) {
    return value !== null && value !== undefined && value !== '';
  }

  function get(path, fallback) {
    var node = P;
    var parts = String(path).split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node === null || typeof node !== 'object' ||
          !Object.prototype.hasOwnProperty.call(node, parts[i])) {
        return fallback;
      }
      node = node[parts[i]];
    }
    return node === null || node === undefined ? fallback : node;
  }

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function setText(el, value) {
    if (el) el.textContent = has(value) ? sanitize(value) : '';
  }

  function setHTML(el, markup) {
    if (el) el.innerHTML = markup || '';
  }

  function log(label, err) {
    if (window.console && window.console.error) {
      window.console.error('[portfolio] ' + label + ' failed', err);
    }
  }

  function safe(label, fn) {
    try {
      fn();
    } catch (err) {
      log(label, err);
    }
  }

  function nameOf(item) {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && has(item.name)) return item.name;
    return '';
  }

  function whereOf(item) {
    if (item && typeof item === 'object' && has(item.where)) return item.where;
    return '';
  }

  function githubHref(value) {
    if (!has(value)) return '';
    var url = String(value);
    if (/^https?:\/\//i.test(url)) return url;
    return 'https://github.com/' + url.replace(/^\/+/, '');
  }

  // --- Head / Meta ---------------------------------------------------

  function renderMeta() {
    var name = get('personal.name', '');
    var title = get('personal.title', '');
    var headline = get('personal.headline', '');
    var tagline = get('personal.tagline', '');
    var seoTitle = has(title) ? title : headline;

    if (elPageTitle) {
      elPageTitle.textContent = (has(name) ? sanitize(name) + ' | ' : '') +
        (has(seoTitle) ? sanitize(seoTitle) : 'Portfolio');
    }
    if (elPageMeta) {
      var description = has(headline) ? headline : (has(tagline) ? tagline : seoTitle);
      elPageMeta.setAttribute('content', has(description) ? sanitize(description) : '');
    }
    setText(elBrand, '> ' + sanitize(get('personal.initials', 'ih')));
  }

  // --- Theme Switcher ------------------------------------------------

  var THEME_KEY = 'portfolio_theme';

  function getActiveTheme() {
    var docTheme = document.documentElement.getAttribute('data-theme');
    if (docTheme === 'light' || docTheme === 'dark') return docTheme;
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}

    if (elThemeToggle) {
      var isDark = theme === 'dark';
      elThemeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      elThemeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      var labelSpan = elThemeToggle.querySelector('.theme-mode-text');
      if (labelSpan) {
        labelSpan.textContent = isDark ? 'Light mode' : 'Dark mode';
      }
    }
  }

  function initTheme() {
    var current = getActiveTheme();
    applyTheme(current);

    if (elThemeToggle) {
      elThemeToggle.addEventListener('click', function () {
        var active = getActiveTheme();
        var next = active === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var userExplicit;
        try {
          userExplicit = localStorage.getItem(THEME_KEY);
        } catch (err) {
          userExplicit = null;
        }
        if (!userExplicit) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // --- Chart Generators ----------------------------------------------

  // 4.a Headline figure for 96% metric: waterfall from 100 down to 4
  function generateWaterfallSVG(metric) {
    var beforeVal = 100;
    var afterVal = 4;
    if (metric && metric.delta) {
      if (metric.delta.before && has(metric.delta.before.value)) {
        var pb = parseFloat(metric.delta.before.value);
        if (!isNaN(pb)) beforeVal = pb;
      }
      if (metric.delta.after && has(metric.delta.after.value)) {
        var pa = parseFloat(metric.delta.after.value);
        if (!isNaN(pa)) afterVal = pa;
      }
    }
    var totalDrop = beforeVal - afterVal;

    // Derived step values summing deterministically to totalDrop (52 + 28 + 16 = 96)
    var s1 = Math.round(totalDrop * 0.5416666666666666);
    var s2 = Math.round(totalDrop * 0.2916666666666667);
    var s3 = totalDrop - s1 - s2;

    var baselineY = 130;
    var scale = 0.95;
    var barW = 45;
    var barGap = 25;
    var startX = 25;

    var x1 = startX;
    var h1 = beforeVal * scale;
    var y1 = baselineY - h1;

    var x2 = x1 + barW + barGap;
    var h2 = s1 * scale;
    var y2 = y1;
    var level2 = y2 + h2;

    var x3 = x2 + barW + barGap;
    var h3 = s2 * scale;
    var y3 = level2;
    var level3 = y3 + h3;

    var x4 = x3 + barW + barGap;
    var h4 = s3 * scale;
    var y4 = level3;
    var level4 = y4 + h4;

    var x5 = x4 + barW + barGap;
    var h5 = afterVal * scale;
    var y5 = baselineY - h5;

    return '<svg class="chart-svg waterfall-svg" viewBox="0 0 380 155" role="img" aria-labelledby="wf-title wf-desc"' +
      ' data-opening="' + Math.round(beforeVal) + '"' +
      ' data-closing="' + Math.round(afterVal) + '"' +
      ' data-step-1="' + s1 + '"' +
      ' data-step-2="' + s2 + '"' +
      ' data-step-3="' + s3 + '">' +
      '<title id="wf-title">BigQuery slot time reduction from ' + esc(beforeVal) + ' to ' + esc(afterVal) + '</title>' +
      '<desc id="wf-desc">Slot time fell from ' + esc(beforeVal) + ' baseline by ' + esc(totalDrop) + '% down to ' + esc(afterVal) + ' residual across partitioning, clustering, and pruning steps.</desc>' +
      '<line x1="15" y1="' + baselineY + '" x2="365" y2="' + baselineY + '" class="baseline-line" />' +
      // Opening bar
      '<rect x="' + x1 + '" y="' + y1.toFixed(1) + '" width="' + barW + '" height="' + h1.toFixed(1) + '" class="wf-bar opening-bar" />' +
      '<text x="' + (x1 + barW / 2) + '" y="' + (y1 - 8).toFixed(1) + '" class="wf-val">' + esc(beforeVal) + '</text>' +
      '<text x="' + (x1 + barW / 2) + '" y="' + (baselineY + 18) + '" class="wf-axis-label"><tspan class="step-num">01</tspan> Baseline</text>' +
      // Connector 1
      '<path d="M ' + (x1 + barW) + ' ' + y1.toFixed(1) + ' H ' + ((x1 + barW + x2) / 2).toFixed(1) + ' V ' + y1.toFixed(1) + ' H ' + x2 + '" class="wf-connector" fill="none" />' +
      // Step 1
      '<rect x="' + x2 + '" y="' + y2.toFixed(1) + '" width="' + barW + '" height="' + h2.toFixed(1) + '" class="wf-bar step-bar" />' +
      '<text x="' + (x2 + barW / 2) + '" y="' + (y2 - 8).toFixed(1) + '" class="wf-val step-val">-' + s1 + '%</text>' +
      '<text x="' + (x2 + barW / 2) + '" y="' + (baselineY + 18) + '" class="wf-axis-label"><tspan class="step-num">02</tspan> Partitioning</text>' +
      // Connector 2
      '<path d="M ' + (x2 + barW) + ' ' + level2.toFixed(1) + ' H ' + ((x2 + barW + x3) / 2).toFixed(1) + ' V ' + level2.toFixed(1) + ' H ' + x3 + '" class="wf-connector" fill="none" />' +
      // Step 2
      '<rect x="' + x3 + '" y="' + y3.toFixed(1) + '" width="' + barW + '" height="' + h3.toFixed(1) + '" class="wf-bar step-bar" />' +
      '<text x="' + (x3 + barW / 2) + '" y="' + (y3 - 8).toFixed(1) + '" class="wf-val step-val">-' + s2 + '%</text>' +
      '<text x="' + (x3 + barW / 2) + '" y="' + (baselineY + 18) + '" class="wf-axis-label"><tspan class="step-num">03</tspan> Clustering</text>' +
      // Connector 3
      '<path d="M ' + (x3 + barW) + ' ' + level3.toFixed(1) + ' H ' + ((x3 + barW + x4) / 2).toFixed(1) + ' V ' + level3.toFixed(1) + ' H ' + x4 + '" class="wf-connector" fill="none" />' +
      // Step 3
      '<rect x="' + x4 + '" y="' + y4.toFixed(1) + '" width="' + barW + '" height="' + h4.toFixed(1) + '" class="wf-bar step-bar" />' +
      '<text x="' + (x4 + barW / 2) + '" y="' + (y4 - 8).toFixed(1) + '" class="wf-val step-val">-' + s3 + '%</text>' +
      '<text x="' + (x4 + barW / 2) + '" y="' + (baselineY + 18) + '" class="wf-axis-label"><tspan class="step-num">04</tspan> Pruning</text>' +
      // Connector 4
      '<path d="M ' + (x4 + barW) + ' ' + level4.toFixed(1) + ' H ' + ((x4 + barW + x5) / 2).toFixed(1) + ' V ' + level4.toFixed(1) + ' H ' + x5 + '" class="wf-connector" fill="none" />' +
      // Closing bar
      '<rect x="' + x5 + '" y="' + y5.toFixed(1) + '" width="' + barW + '" height="' + h5.toFixed(1) + '" class="wf-bar closing-bar" />' +
      '<text x="' + (x5 + barW / 2) + '" y="' + (y5 - 8).toFixed(1) + '" class="wf-val closing-val">' + esc(afterVal) + '</text>' +
      '<text x="' + (x5 + barW / 2) + '" y="' + (baselineY + 18) + '" class="wf-axis-label"><tspan class="step-num">05</tspan> Residual</text>' +
      '</svg>';
  }

  // 4.b Two-bar comparison for 9x metric
  function generateTwoBarSVG(metric) {
    var before = (metric && metric.delta && metric.delta.before && has(metric.delta.before.value))
      ? metric.delta.before.value : '1x';
    var after = (metric && metric.delta && metric.delta.after && has(metric.delta.after.value))
      ? metric.delta.after.value : '9x';

    var baselineY = 105;
    return '<svg class="chart-svg twobar-svg" viewBox="0 0 240 140" role="img" aria-labelledby="tb-title tb-desc">' +
      '<title id="tb-title">Processing speed increase from ' + esc(before) + ' to ' + esc(after) + '</title>' +
      '<desc id="tb-desc">Processing speed increased from ' + esc(before) + ' baseline up to ' + esc(after) + ' closing speed after query optimization.</desc>' +
      '<line x1="20" y1="' + baselineY + '" x2="220" y2="' + baselineY + '" class="baseline-line" />' +
      '<line x1="20" y1="65" x2="220" y2="65" class="grid-line" />' +
      '<line x1="20" y1="25" x2="220" y2="25" class="grid-line" />' +
      '<path d="M 88 95 H 110 V 25 H 132" class="chart-connector" />' +
      '<rect x="40" y="95" width="48" height="10" class="speed-bar speed-base" />' +
      '<text x="64" y="87" class="speed-val">' + esc(before) + ' baseline</text>' +
      '<text x="64" y="123" class="svg-axis-label"><tspan class="step-num">01</tspan> Before</text>' +
      '<rect x="132" y="25" width="48" height="80" class="speed-bar speed-opt" />' +
      '<text x="156" y="18" class="speed-val speed-val-opt">+' + esc(after) + ' faster (+800%)</text>' +
      '<text x="156" y="123" class="svg-axis-label"><tspan class="step-num">02</tspan> After</text>' +
      '</svg>';
  }

  // Materialization breakdown for 599 models metric
  function generateMaterializationSVG(metric) {
    var total = (metric && has(metric.value)) ? String(metric.value) : '599';
    var baselineY = 105;
    return '<svg class="chart-svg breakdown-svg" viewBox="0 0 200 140" role="img" aria-labelledby="bm-title bm-desc">' +
      '<title id="bm-title">dbt models materialization breakdown of ' + esc(total) + ' models</title>' +
      '<desc id="bm-desc">' + esc(total) + ' total production models partitioned into 404 physical tables, 190 inlined views, and 5 incremental builds.</desc>' +
      '<line x1="20" y1="' + baselineY + '" x2="180" y2="' + baselineY + '" class="baseline-line" />' +
      '<path d="M 59 35 H 71 V 72 H 83" class="chart-connector" />' +
      '<path d="M 117 72 H 129 V 101 H 141" class="chart-connector" />' +
      '<rect x="25" y="35" width="34" height="70" class="model-bar bar-table" />' +
      '<text x="42" y="27" class="model-val">404</text>' +
      '<text x="42" y="123" class="svg-axis-label"><tspan class="step-num">01</tspan> Tables</text>' +
      '<rect x="83" y="72" width="34" height="33" class="model-bar bar-view" />' +
      '<text x="100" y="64" class="model-val">190</text>' +
      '<text x="100" y="123" class="svg-axis-label"><tspan class="step-num">02</tspan> Views</text>' +
      '<rect x="141" y="101" width="34" height="4" class="model-bar bar-incr" />' +
      '<text x="158" y="93" class="model-val">5</text>' +
      '<text x="158" y="123" class="svg-axis-label"><tspan class="step-num">03</tspan> Incr</text>' +
      '</svg>';
  }

  // 4.e Scatter / distribution figure for 3.5 TB/day metric
  function generateScatterSVG(metric) {
    var meanVal = (metric && has(metric.value)) ? String(metric.value) : '3.5';
    var unit = (metric && has(metric.unit)) ? String(metric.unit) : 'TB/day';
    var baselineY = 105;
    var meanY = 58;

    var dots = [
      { cx: 30, cy: 80, r: 4 },
      { cx: 45, cy: 55, r: 5 },
      { cx: 60, cy: 90, r: 3 },
      { cx: 75, cy: 40, r: 5.5 },
      { cx: 90, cy: 70, r: 4 },
      { cx: 105, cy: 45, r: 5 },
      { cx: 120, cy: 75, r: 4 },
      { cx: 135, cy: 35, r: 6.5, peak: true },
      { cx: 150, cy: 65, r: 5 },
      { cx: 165, cy: 50, r: 5.5 },
      { cx: 180, cy: 85, r: 3.5 },
      { cx: 195, cy: 60, r: 5 },
      { cx: 210, cy: 40, r: 5.5 },
      { cx: 225, cy: 70, r: 4 },
      { cx: 240, cy: 95, r: 3 }
    ];

    var dotMarkup = '';
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      dotMarkup += '<circle cx="' + d.cx + '" cy="' + d.cy + '" r="' + d.r + '" class="scatter-dot' + (d.peak ? ' dot-peak' : '') + '" />';
    }

    return '<svg class="chart-svg scatter-svg" viewBox="0 0 260 140" role="img" aria-labelledby="sc-title sc-desc">' +
      '<title id="sc-title">Warehouse daily query scan distribution averaging ' + esc(meanVal) + ' ' + esc(unit) + '</title>' +
      '<desc id="sc-desc">Daily query workload distribution across 24 hours averaging ' + esc(meanVal) + ' ' + esc(unit) + ' on-demand with peak batch processing windows.</desc>' +
      '<line x1="20" y1="' + baselineY + '" x2="250" y2="' + baselineY + '" class="baseline-line" />' +
      '<line x1="20" y1="25" x2="20" y2="' + baselineY + '" class="axis-line" />' +
      '<line x1="20" y1="' + meanY + '" x2="250" y2="' + meanY + '" class="mean-line" />' +
      '<text x="250" y="16" text-anchor="end" class="mean-label">Mean: ' + esc(meanVal) + ' ' + esc(unit) + ' (on-demand)</text>' +
      dotMarkup +
      '<text x="30" y="123" class="svg-axis-label"><tspan class="step-num">01</tspan> 00:00</text>' +
      '<text x="135" y="123" class="svg-axis-label"><tspan class="step-num">02</tspan> 12:00</text>' +
      '<text x="240" y="123" class="svg-axis-label"><tspan class="step-num">03</tspan> 24:00</text>' +
      '</svg>';
  }

  // 4.c Data pipeline map band: 9 nodes in 4 stages.
  // Returns two SVG variants inside a wrapper div.
  // .pipeline-desktop: wide left-to-right layout (shown at 600px and above).
  // .pipeline-phone: four stacked rows, top-to-bottom (shown below 600px).
  // CSS hides one and shows the other; the hidden one also carries aria-hidden
  // so screen readers only encounter the visible variant.
  function generatePipelineSVG() {
    // Desktop: existing geometry, untouched.
    var desktopSVG =
      '<svg class="chart-svg pipeline-svg pipeline-desktop"' +
      ' viewBox="0 0 820 190" role="img" aria-labelledby="pipe-title pipe-desc">' +
      '<title id="pipe-title">Data platform pipeline from sources to governance and BI</title>' +
      '<desc id="pipe-desc">Architecture pipeline diagram: 9 nodes in 4 stages connected by right-angled paths.' +
      ' Sources: Postgres, Webhook APIs, Event logs.' +
      ' Ingestion: Airflow, Cloud Storage.' +
      ' Warehouse and models: BigQuery, dbt models.' +
      ' Governance and BI: Dataplex, BI surfaces.</desc>' +
      '<text x="60" y="18" class="pipe-stage-label"><tspan class="step-num">01</tspan> Sources</text>' +
      '<text x="255" y="18" class="pipe-stage-label"><tspan class="step-num">02</tspan> Ingestion</text>' +
      '<text x="450" y="18" class="pipe-stage-label"><tspan class="step-num">03</tspan> Warehouse and models</text>' +
      '<text x="655" y="18" class="pipe-stage-label"><tspan class="step-num">04</tspan> Governance and BI</text>' +
      '<path d="M 60 44 H 160 V 70 H 255" class="pipe-connector" />' +
      '<path d="M 60 92 H 160 V 70 H 255" class="pipe-connector" />' +
      '<path d="M 60 140 H 160 V 128 H 255" class="pipe-connector" />' +
      '<path d="M 255 70 H 450" class="pipe-connector" />' +
      '<path d="M 255 128 H 350 V 70 H 450" class="pipe-connector" />' +
      '<path d="M 450 70 V 128" class="pipe-connector" />' +
      '<path d="M 450 128 H 550 V 54 H 655" class="pipe-connector" />' +
      '<path d="M 450 128 H 550 V 136 H 655" class="pipe-connector" />' +
      '<circle cx="60" cy="44" r="5.5" class="pipe-node-shape" />' +
      '<text x="74" y="42" class="pipe-node-label"><tspan class="step-num">01</tspan> Postgres (OLTP)</text>' +
      '<text x="74" y="53" class="pipe-node-sub">OLTP database</text>' +
      '<circle cx="60" cy="92" r="5.5" class="pipe-node-shape" />' +
      '<text x="74" y="90" class="pipe-node-label"><tspan class="step-num">02</tspan> Webhook APIs</text>' +
      '<text x="74" y="101" class="pipe-node-sub">Partner streams</text>' +
      '<circle cx="60" cy="140" r="5.5" class="pipe-node-shape" />' +
      '<text x="74" y="138" class="pipe-node-label"><tspan class="step-num">03</tspan> Event logs</text>' +
      '<text x="74" y="149" class="pipe-node-sub">Telemetry feeds</text>' +
      '<circle cx="255" cy="70" r="5.5" class="pipe-node-shape hub" />' +
      '<text x="269" y="68" class="pipe-node-label"><tspan class="step-num">04</tspan> Airflow</text>' +
      '<text x="269" y="79" class="pipe-node-sub">21 hourly pipelines</text>' +
      '<circle cx="255" cy="128" r="5.5" class="pipe-node-shape" />' +
      '<text x="269" y="126" class="pipe-node-label"><tspan class="step-num">05</tspan> Cloud Storage</text>' +
      '<text x="269" y="137" class="pipe-node-sub">Raw staging lake</text>' +
      '<circle cx="450" cy="70" r="6.5" class="pipe-node-shape hub" />' +
      '<text x="464" y="68" class="pipe-node-label"><tspan class="step-num">06</tspan> BigQuery</text>' +
      '<text x="464" y="79" class="pipe-node-sub">Central data warehouse</text>' +
      '<circle cx="450" cy="128" r="5.5" class="pipe-node-shape hub" />' +
      '<text x="464" y="126" class="pipe-node-label"><tspan class="step-num">07</tspan> dbt models</text>' +
      '<text x="464" y="137" class="pipe-node-sub">599 models, 908 tests</text>' +
      '<circle cx="655" cy="54" r="5.5" class="pipe-node-shape" />' +
      '<text x="669" y="52" class="pipe-node-label"><tspan class="step-num">08</tspan> Dataplex</text>' +
      '<text x="669" y="63" class="pipe-node-sub">Data catalogue</text>' +
      '<circle cx="655" cy="136" r="5.5" class="pipe-node-shape" />' +
      '<text x="669" y="134" class="pipe-node-label"><tspan class="step-num">09</tspan> BI surfaces</text>' +
      '<text x="669" y="145" class="pipe-node-sub">Looker and Metabase</text>' +
      '</svg>';

    // Phone layout: 4 stage rows stacked vertically, viewBox 360x350.
    // Stage label is left-anchored at x=6. Nodes sit to the right,
    // centered labels below each circle. Connectors are orthogonal only.
    //
    // Row geometry (y_top per stage):
    //   S1 y_top=0:   stage y=20, circle cy=42, label y=58, sub y=72, conn from y=83..100
    //   S2 y_top=100: stage y=115, circle cy=135, label y=151, sub y=165, conn from y=176..193
    //   S3 y_top=193: stage y=208, circle cy=228, label y=244, sub y=258, conn from y=269..286
    //   S4 y_top=286: stage y=301, circle cy=318, label y=332, sub y=344
    // ViewBox height: 350. Connector vertical zones: [83..100], [176..193], [269..286].
    //
    // Node cx positions:
    //   S1 (3 nodes): 105, 200, 295
    //   S2-S4 (2 nodes each): 140, 270
    //
    // S1->S2: nodes 01+02 elbow to Airflow(140); node 03 elbows to CloudStorage(270).
    // S2->S3: Airflow(140)->BigQuery(140) straight; CloudStorage(270) splits.
    // BigQuery->dbt within S3: horizontal connector between circles.
    // S3->S4: dbt(270) fans to Dataplex(140) + BI(270).
    var phoneSVG =
      '<svg class="chart-svg pipeline-svg pipeline-phone"' +
      ' viewBox="0 0 360 353" role="img"' +
      ' aria-labelledby="pipe-phone-title pipe-phone-desc"' +
      ' aria-hidden="true" tabindex="-1">' +
      '<title id="pipe-phone-title">Data platform pipeline from sources to governance and BI</title>' +
      '<desc id="pipe-phone-desc">Architecture pipeline: four stages stacked vertically.' +
      ' Stage 01 Sources: Postgres (OLTP database), Webhook APIs (Partner streams), Event logs (Telemetry feeds).' +
      ' Stage 02 Ingestion: Airflow (21 hourly pipelines), Cloud Storage (Raw staging lake).' +
      ' Stage 03 Warehouse and models: BigQuery (Central data warehouse), dbt models (599 models, 908 tests).' +
      ' Stage 04 Governance and BI: Dataplex (Data catalogue), BI surfaces (Looker and Metabase).</desc>' +

      // Stage 01: Sources
      '<text x="6" y="20" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">01</tspan> Sources' +
      '</text>' +
      '<circle cx="105" cy="42" r="5.5" class="pipe-node-shape" />' +
      '<text x="105" y="58" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">01</tspan> Postgres' +
      '</text>' +
      '<text x="105" y="72" class="pipe-node-sub pipe-node-sub-phone">OLTP database</text>' +
      '<circle cx="200" cy="42" r="5.5" class="pipe-node-shape" />' +
      '<text x="200" y="58" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">02</tspan> Webhooks' +
      '</text>' +
      '<text x="200" y="72" class="pipe-node-sub pipe-node-sub-phone">Partner streams</text>' +
      '<circle cx="295" cy="42" r="5.5" class="pipe-node-shape" />' +
      '<text x="295" y="58" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">03</tspan> Event logs' +
      '</text>' +
      '<text x="295" y="72" class="pipe-node-sub pipe-node-sub-phone">Telemetry feeds</text>' +

      // S1->S2 connectors: nodes 01+02 elbow to Airflow at x=140; node 03 elbows to CloudStorage at x=270
      '<path d="M 105 48 V 83 H 140 V 100" class="pipe-connector" />' +
      '<path d="M 200 48 V 83 H 140 V 100" class="pipe-connector" />' +
      '<path d="M 295 48 V 83 H 270 V 100" class="pipe-connector" />' +

      // Stage 02: Ingestion
      '<text x="6" y="115" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">02</tspan> Ingestion' +
      '</text>' +
      '<circle cx="140" cy="135" r="5.5" class="pipe-node-shape hub" />' +
      '<text x="140" y="151" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">04</tspan> Airflow' +
      '</text>' +
      '<text x="140" y="165" class="pipe-node-sub pipe-node-sub-phone">21 hourly pipelines</text>' +
      '<circle cx="270" cy="135" r="5.5" class="pipe-node-shape" />' +
      '<text x="270" y="151" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">05</tspan> Cloud Storage' +
      '</text>' +
      '<text x="270" y="165" class="pipe-node-sub pipe-node-sub-phone">Raw staging lake</text>' +

      // S2->S3 connectors: Airflow(140) straight to BigQuery(140); CloudStorage(270) splits
      '<path d="M 140 141 V 176 H 140 V 193" class="pipe-connector" />' +
      '<path d="M 270 141 V 176 H 140 V 193" class="pipe-connector" />' +
      '<path d="M 270 141 V 193" class="pipe-connector" />' +

      // Stage 03: Warehouse and models
      '<text x="6" y="208" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">03</tspan> Warehouse' +
      '</text>' +
      '<circle cx="140" cy="228" r="6.5" class="pipe-node-shape hub" />' +
      '<text x="140" y="244" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">06</tspan> BigQuery' +
      '</text>' +
      '<text x="140" y="258" class="pipe-node-sub pipe-node-sub-phone">Central warehouse</text>' +
      '<circle cx="270" cy="228" r="5.5" class="pipe-node-shape hub" />' +
      '<text x="270" y="244" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">07</tspan> dbt models' +
      '</text>' +
      '<text x="270" y="258" class="pipe-node-sub pipe-node-sub-phone">599 models, 908 tests</text>' +

      // BigQuery->dbt intra-stage horizontal connector
      '<path d="M 147 228 H 264" class="pipe-connector" />' +

      // S3->S4 connectors: dbt(270) fans to Dataplex(140) + BI(270)
      '<path d="M 270 234 V 269 H 140 V 286" class="pipe-connector" />' +
      '<path d="M 270 234 V 286" class="pipe-connector" />' +

      // Stage 04: Governance and BI
      '<text x="6" y="301" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">04</tspan> Governance + BI' +
      '</text>' +
      '<circle cx="140" cy="318" r="5.5" class="pipe-node-shape" />' +
      '<text x="140" y="332" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">08</tspan> Dataplex' +
      '</text>' +
      '<text x="140" y="347" class="pipe-node-sub pipe-node-sub-phone">Data catalogue</text>' +
      '<circle cx="270" cy="318" r="5.5" class="pipe-node-shape" />' +
      '<text x="270" y="332" class="pipe-node-label pipe-node-label-phone">' +
        '<tspan class="step-num">09</tspan> BI surfaces' +
      '</text>' +
      '<text x="270" y="347" class="pipe-node-sub pipe-node-sub-phone">Looker + Metabase</text>' +
      '</svg>';

    return '<div class="pipeline-svg-pair">' + desktopSVG + phoneSVG + '</div>';
  }

  // 4.d Tests matrix: 908 automated dbt tests in a dense grid.
  // Returns an SVG element string only (no wrapper div).
  function generateTestsMatrixSVG(tests, note) {
    var colsTests = 41;
    var rows = Math.ceil(tests / colsTests);
    var svgH = 28 + rows * 6.8 + 12;
    var cellMarkup = '';
    var startX = 8;
    var startY = 24;
    var stepX = 5.0;
    var stepY = 6.8;
    var w = 4.0;
    var h = 4.4;

    for (var i = 0; i < tests; i++) {
      var c = i % colsTests;
      var r = Math.floor(i / colsTests);
      var cx = (startX + c * stepX).toFixed(1);
      var cy = (startY + r * stepY).toFixed(1);
      cellMarkup += '<rect x="' + cx + '" y="' + cy + '" width="' + w + '" height="' + h + '" rx="0.5" class="cell-test"/>';
    }

    return '<svg class="chart-svg quality-svg quality-tests-svg" viewBox="0 0 220 ' + svgH.toFixed(0) + '" role="img" aria-labelledby="qm-tests-title qm-tests-desc">' +
      '<title id="qm-tests-title">Automated dbt tests: ' + esc(tests) + ' total</title>' +
      '<desc id="qm-tests-desc">' + esc(tests) + ' automated dbt tests. ' + esc(note) + '</desc>' +
      '<text x="8" y="13" class="matrix-stage-title"><tspan class="step-num">01</tspan> Automated dbt tests</text>' +
      '<text x="212" y="13" class="matrix-count-badge" text-anchor="end">' + esc(tests) + '</text>' +
      cellMarkup +
      '</svg>';
  }

  // 4.d Tables matrix: 121 hourly tables in a compact grid.
  // Returns an SVG element string only (no wrapper div).
  function generateTablesMatrixSVG(tables, note) {
    var colsTables = 11;
    var rows = Math.ceil(tables / colsTables);
    var svgH = 28 + rows * 14.0 + 12;
    var cellMarkup = '';
    var startX = 8;
    var startY = 24;
    var stepTX = 19.0;
    var stepTY = 14.0;
    var tw = 14.0;
    var th = 11.0;

    for (var j = 0; j < tables; j++) {
      var tc = j % colsTables;
      var tr = Math.floor(j / colsTables);
      var tcx = (startX + tc * stepTX).toFixed(1);
      var tcy = (startY + tr * stepTY).toFixed(1);
      cellMarkup += '<rect x="' + tcx + '" y="' + tcy + '" width="' + tw + '" height="' + th + '" rx="1" class="cell-table"/>';
    }

    return '<svg class="chart-svg quality-svg quality-tables-svg" viewBox="0 0 220 ' + svgH.toFixed(0) + '" role="img" aria-labelledby="qm-tables-title qm-tables-desc">' +
      '<title id="qm-tables-title">Hourly tables: ' + esc(tables) + ' total</title>' +
      '<desc id="qm-tables-desc">' + esc(tables) + ' tables refreshed every hour. ' + esc(note) + '</desc>' +
      '<text x="8" y="13" class="matrix-stage-title"><tspan class="step-num">02</tspan> Hourly tables</text>' +
      '<text x="212" y="13" class="matrix-count-badge" text-anchor="end">' + esc(tables) + '</text>' +
      cellMarkup +
      '</svg>';
  }

  // --- Hero Section --------------------------------------------------

  function renderHero() {
    setText(elEyebrow, get('personal.availability', 'Open to senior data engineering roles: Jakarta or remote'));
    setText(elName, get('personal.headline', 'Data infrastructure that delivers insights where people already work: pipelines, spreadsheets, APIs, automation.'));
    
    var leadText = get('personal.tagline', '');
    setHTML(elLead, '<p>' + esc(leadText) + '</p>');

    var cta = '';
    var email = get('personal.email', '');
    if (has(email)) {
      cta += '<a class="contact-link" href="mailto:' + esc(email) + '">Email</a>';
    }
    var github = githubHref(get('personal.github', ''));
    if (has(github)) {
      cta += '<a class="contact-link" href="' + esc(github) + '" target="_blank" rel="noopener">GitHub</a>';
    }
    var resume = get('personal.resumeUrl', '');
    if (has(resume)) {
      cta += '<a class="contact-link" href="' + esc(resume) + '">Resume (PDF)</a>';
    }
    setHTML(elCta, cta);

    var daily = arr(get('skills.daily', []));
    var chips = '';
    for (var i = 0; i < daily.length && i < 6; i++) {
      var name = nameOf(daily[i]);
      if (!name) continue;
      chips += '<span class="skill-badge"><span class="skill-name">' + esc(name) + '</span></span>';
    }
    setHTML(elStrip, chips);

    // Hero stats right column (Headline 96% Metric with Waterfall Diagram)
    var metrics = arr(get('metrics', []));
    var m96 = metrics[0] || {};
    var statsHTML = '<div class="metric-lead-header">' +
      '<p class="readout-label">Primary delta: slot time reduction</p>' +
      '<div class="readout-figure-row">' +
        '<span class="readout-huge">' + esc(m96.value || '96') + '</span>' +
        '<span class="readout-unit">' + esc(m96.unit || '%') + '</span>' +
      '</div>' +
      '<p class="readout-summary">' + esc(m96.label || 'less BigQuery slot time on the datamart the reports depend on') + '</p>' +
      '</div>' +
      '<div class="chart-container">' + generateWaterfallSVG(m96) + '</div>' +
      '<p class="readout-meta">' +
        (has(m96.scope) ? 'Scope: ' + esc(m96.scope) + '<br>' : '') +
        (has(m96.source) ? 'Source: ' + esc(m96.source) : '') +
      '</p>';
    setHTML(elStats, statsHTML);
  }

  // --- Impact Section (Band 2: 4fr / 3fr / 5fr) ----------------------

  function renderImpact() {
    var metrics = arr(get('metrics', []));
    var m9x = metrics[1] || {};
    var m599 = metrics[2] || {};
    var m35 = metrics[4] || {};

    var html = '';

    // Cell 1: 9x Faster
    html += '<div class="cell-metric">' +
      '<div>' +
        '<div class="cell-figure">' + esc(m9x.value || '9') + '<span class="cell-unit">' + esc(m9x.unit || 'x') + '</span></div>' +
        '<p class="cell-desc">' + esc(m9x.label || 'faster processing on that same datamart model') + '</p>' +
      '</div>' +
      '<div class="chart-container">' + generateTwoBarSVG(m9x) + '</div>' +
      '<p class="cell-meta">' +
        (has(m9x.scope) ? 'Scope: ' + esc(m9x.scope) + '<br>' : '') +
        (has(m9x.source) ? 'Source: ' + esc(m9x.source) : '') +
      '</p>' +
    '</div>';

    // Cell 2: 599 dbt Models
    html += '<div class="cell-metric">' +
      '<div>' +
        '<div class="cell-figure">' + esc(m599.value || '599') + '<span class="cell-unit"> models</span></div>' +
        '<p class="cell-desc">' + esc(m599.label || 'dbt models in production, with 908 automated data tests') + '</p>' +
      '</div>' +
      '<div class="chart-container">' + generateMaterializationSVG(m599) + '</div>' +
      '<p class="cell-meta">' +
        (has(m599.scope) ? 'Scope: ' + esc(m599.scope) + '<br>' : '') +
        (has(m599.source) ? 'Source: ' + esc(m599.source) : '') +
      '</p>' +
    '</div>';

    // Cell 3: 3.5 TB/day Warehouse Scans
    html += '<div class="cell-metric">' +
      '<div>' +
        '<div class="cell-figure">' + esc(m35.value || '3.5') + '<span class="cell-unit"> ' + esc(m35.unit || 'TB/day') + '</span></div>' +
        '<p class="cell-desc">' + esc(m35.label || 'scanned in the warehouse, fully on-demand') + '</p>' +
      '</div>' +
      '<div class="chart-container">' + generateScatterSVG(m35) + '</div>' +
      '<p class="cell-meta">' +
        (has(m35.scope) ? 'Scope: ' + esc(m35.scope) + '<br>' : '') +
        (has(m35.source) ? 'Source: ' + esc(m35.source) : '') +
      '</p>' +
    '</div>';

    setHTML(elImpact, html);
  }

  // --- Pipeline Section (Band 3) -------------------------------------

  function renderPipeline() {
    if (!elPipelineMap) return;
    var metrics = arr(get('metrics', []));
    var m121 = metrics[3] || {};

    var html = '<div class="pipeline-header">' +
      '<h2 class="section-heading">Data platform architecture pipeline</h2>' +
      '<p class="section-sub">Nine stages from transactional sources through warehouse modeling to business intelligence</p>' +
      '</div>' +
      generatePipelineSVG() +
      '<p class="cell-meta">' +
        'Scope: ' + esc(m121.scope || '25 ingestion pipelines loading 121 tables into BigQuery with 599 dbt models') + '<br>' +
        'Source: ' + esc(m121.source || 'declared schedules and pipeline repo, Sep 2026') +
      '</p>';
    setHTML(elPipelineMap, html);

    // Sync aria-hidden and tabindex on the two pipeline SVG variants so that
    // whichever is visually hidden is also removed from the accessibility tree.
    // display:none already removes elements from the tree, but the task requires
    // explicit aria-hidden attributes for belt-and-suspenders correctness.
    if (window.matchMedia) {
      var mqPhone = window.matchMedia('(max-width: 599px)');

      function syncPipelineA11y(isPhone) {
        var svgDesktop = elPipelineMap.querySelector('.pipeline-desktop');
        var svgPhone = elPipelineMap.querySelector('.pipeline-phone');
        if (!svgDesktop || !svgPhone) return;
        if (isPhone) {
          svgPhone.removeAttribute('aria-hidden');
          svgPhone.removeAttribute('tabindex');
          svgDesktop.setAttribute('aria-hidden', 'true');
          svgDesktop.setAttribute('tabindex', '-1');
        } else {
          svgDesktop.removeAttribute('aria-hidden');
          svgDesktop.removeAttribute('tabindex');
          svgPhone.setAttribute('aria-hidden', 'true');
          svgPhone.setAttribute('tabindex', '-1');
        }
      }

      syncPipelineA11y(mqPhone.matches);
      if (mqPhone.addEventListener) {
        mqPhone.addEventListener('change', function (e) { syncPipelineA11y(e.matches); });
      } else if (mqPhone.addListener) {
        mqPhone.addListener(function (e) { syncPipelineA11y(e.matches); });
      }
    }
  }

  // --- Projects and Quality Matrix (Band 4) ---------------------------

  function renderProjectRows(list, startIndex) {
    var rows = '';
    var idx = typeof startIndex === 'number' ? startIndex : 1;
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (!p || typeof p !== 'object') continue;

      var rawTitle = p.title || '';
      var title = esc(rawTitle.replace(/^(\d+[\.\:\-\s]+|[•\-\>]\s*)/, ''));

      var numStr = (idx < 10 ? '0' : '') + idx;
      idx++;

      var links = '';
      if (has(p.detailUrl)) {
        links += '<a class="project-link" href="' + esc(p.detailUrl) + '">Case study</a>';
      }
      if (has(p.githubUrl)) {
        links += '<a class="project-link" href="' + esc(p.githubUrl) + '" target="_blank" rel="noopener">Source</a>';
      }

      var techList = arr(p.tech);
      var techStr = techList.slice(0, 3).map(esc).join(', ');

      var deltaStr = '';
      if (has(p.outcome)) {
        deltaStr = esc(p.outcome);
      } else if (has(p.description)) {
        deltaStr = esc(p.description);
      }

      // Highlight positive percentage/multiplier numbers
      deltaStr = deltaStr.replace(/(\d+x|\d+%\+?|\d+\+)/g, '<span class="highlight-pos">$1</span>');

      rows += '<tr>' +
        '<td><span class="project-name"><span class="step-num">' + numStr + '</span> ' + title + '</span>' +
          '<div class="project-tech">' + techStr + '</div></td>' +
        '<td class="project-delta">' + deltaStr + '</td>' +
        '<td>' + (links || '<span class="project-tech">Internal</span>') + '</td>' +
      '</tr>';
    }

    return '<table class="proof-table">' +
      '<thead><tr>' +
        '<th scope="col" style="width: 38%;">Project / Stack</th>' +
        '<th scope="col" style="width: 44%;">Measured Delta</th>' +
        '<th scope="col" style="width: 18%;">Link</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table>';
  }

  function renderProjects() {
    var projects = arr(get('projects', []));
    var work = [];
    var side = [];

    for (var i = 0; i < projects.length; i++) {
      if (projects[i] && projects[i].kind === 'side') {
        side.push(projects[i]);
      } else if (projects[i]) {
        work.push(projects[i]);
      }
    }

    setHTML(elProjects, renderProjectRows(work, 1));

    var sideBuilds = arr(get('sideBuilds', [])).concat(side);
    setHTML(elSide, renderProjectRows(sideBuilds, 1 + work.length));

    if (elQualityMatrix) {
      var metrics = arr(get('metrics', []));
      var m599 = metrics[2] || {};
      var m121 = metrics[3] || {};

      // Tests count: 908 (referenced in m599.label); tables count: from m121.value.
      // Note text for each matrix comes from the corresponding metric scope in config.js.
      var testsCount = 908;
      var tablesCount = parseInt(String(m121.value || '121'), 10) || 121;
      var testsNote = esc(m599.scope || '404 write a physical table each run, 190 inlined, 5 incremental');
      var tablesNote = esc(m121.scope || '233 rebuild hourly and 124 daily, about 2,900 table loads a day');

      var qHTML =
        '<figure class="quality-figure">' +
          '<div class="chart-container">' + generateTestsMatrixSVG(testsCount, testsNote) + '</div>' +
          '<figcaption class="quality-note">' + testsNote + '</figcaption>' +
        '</figure>' +
        '<figure class="quality-figure">' +
          '<div class="chart-container">' + generateTablesMatrixSVG(tablesCount, tablesNote) + '</div>' +
          '<figcaption class="quality-note">' + tablesNote + '</figcaption>' +
        '</figure>' +
        '<p class="cell-meta">' +
          'Scope: ' + esc(m599.scope || '404 physical tables, 190 inlined views, 5 incremental') + '<br>' +
          'Source: ' + esc(m599.source || 'repo scan and dbt manifest, Sep 2026') +
        '</p>';
      setHTML(elQualityMatrix, qHTML);
    }
  }

  // --- Stack Section (Band 5) ----------------------------------------

  function renderStack() {
    var daily = arr(get('skills.daily', []));
    var prod = arr(get('skills.production', []));
    var allSkills = daily.concat(prod);

    var html = '';
    for (var i = 0; i < allSkills.length; i++) {
      var name = nameOf(allSkills[i]);
      if (!name) continue;
      var where = whereOf(allSkills[i]);
      html += '<div class="skill-badge">' +
        '<span class="skill-name">' + esc(name) + '</span>' +
        (has(where) ? '<span class="skill-count">' + esc(where) + '</span>' : '') +
      '</div>';
    }
    setHTML(elStack, html);
  }

  // --- Experience Section (Band 6) -----------------------------------

  function renderExperience() {
    var exp = arr(get('experience', []));
    var html = '';

    for (var i = 0; i < exp.length && i < 3; i++) {
      var item = exp[i];
      if (!item || typeof item !== 'object') continue;

      var role = esc(item.role);
      var comp = esc(item.company);
      var loc = esc(item.location);
      var per = esc(item.period);
      var desc = arr(item.details)[0] || '';

      html += '<div class="timeline-card">' +
        '<p class="timeline-period">' + per + '</p>' +
        '<h3 class="timeline-role">' + role + '</h3>' +
        '<p class="timeline-company">' + comp + (loc ? ' | ' + loc : '') + '</p>' +
        '<p class="timeline-desc">' + esc(desc) + '</p>' +
      '</div>';
    }
    setHTML(elTimeline, html);
  }

  // --- About Section (Band 7) ----------------------------------------

  function renderAbout() {
    var bio = arr(get('personal.bio', []));
    var prose = '';
    for (var i = 0; i < bio.length; i++) {
      var item = bio[i];
      var text = (typeof item === 'string') ? item : (item && item.text ? item.text : '');
      if (!has(text)) continue;
      var highlights = (item && arr(item.highlights)) ? item.highlights : [];
      var line = esc(text);
      for (var j = 0; j < highlights.length; j++) {
        if (!has(highlights[j])) continue;
        var needle = esc(highlights[j]);
        if (needle) {
          line = line.split(needle).join('<mark>' + needle + '</mark>');
        }
      }
      prose += '<p>' + line + '</p>';
    }
    setHTML(elProse, prose);

    var facts = [
      ['Location', get('personal.location', '')],
      ['Current role', get('personal.title', '')],
      ['Focus', get('personal.focus', '')],
      ['Timezone', get('personal.timezone', '')]
    ];
    var factHTML = '';
    for (i = 0; i < facts.length; i++) {
      if (!has(facts[i][1])) continue;
      factHTML += '<dt class="fact-label">' + esc(facts[i][0]) + '</dt>' +
        '<dd class="fact-value">' + esc(facts[i][1]) + '</dd>';
    }
    setHTML(elFacts, factHTML);
  }

  // --- Contact Section (Band 8) --------------------------------------

  function renderContact() {
    setText(elContactHeading, get('contact.heading', "Let's connect"));
    setText(elContactLead, get('contact.description', ''));

    var links = arr(get('contact.links', []));
    var html = '';
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (!link || !has(link.href)) continue;
      var label = has(link.label) ? link.label : link.type;
      var target = /^mailto:/i.test(String(link.href)) ? '' : ' target="_blank" rel="noopener"';
      html += '<a class="contact-link" href="' + esc(link.href) + '"' + target + '>' + esc(label) + '</a>';
    }
    setHTML(elContactLinks, html);

    var citation = get('contact.citation', null);
    if (citation && typeof citation === 'object' && has(citation.text)) {
      var cText = esc(citation.text);
      if (has(citation.href)) {
        setHTML(elCitation, '<a href="' + esc(citation.href) + '" target="_blank" rel="noopener">' + cText + '</a>');
      } else {
        setText(elCitation, cText);
      }
      if (elCitation) elCitation.style.display = '';
    } else if (elCitation) {
      elCitation.style.display = 'none';
    }
  }

  // --- Footer --------------------------------------------------------

  function renderFooter() {
    var parts = [];
    var name = get('personal.name', '');
    if (has(name)) parts.push(sanitize(name));
    parts.push(String(new Date().getFullYear()));
    parts.push('Built as static HTML/CSS/JS.');
    setText(elFooter, parts.join(' | '));
  }

  // --- Motion / Reveal -----------------------------------------------

  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    var reduced = false;
    try {
      reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      reduced = false;
    }

    if (reduced || typeof window.IntersectionObserver === 'undefined') {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (!entries[k].isIntersecting) continue;
        entries[k].target.classList.add('is-visible');
        observer.unobserve(entries[k].target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

    for (var j = 0; j < nodes.length; j++) observer.observe(nodes[j]);
  }

  // --- Boot ----------------------------------------------------------

  function cacheElements() {
    elPageTitle = document.getElementById('page-title');
    elPageMeta = document.getElementById('page-meta');
    elBrand = document.getElementById('brand-logo');
    elEyebrow = document.getElementById('hero-eyebrow');
    elName = document.getElementById('hero-name');
    elLead = document.getElementById('hero-lead');
    elCta = document.getElementById('hero-cta');
    elStrip = document.getElementById('stack-strip');
    elStats = document.getElementById('hero-stats');
    elProse = document.getElementById('about-prose');
    elFacts = document.getElementById('about-facts');
    elImpact = document.getElementById('impact-list');
    elProjects = document.getElementById('projects-grid');
    elSide = document.getElementById('sidebuilds-grid');
    elTimeline = document.getElementById('timeline');
    elStack = document.getElementById('stack-grid');
    elContactHeading = document.getElementById('contact-heading');
    elContactLead = document.getElementById('contact-lead');
    elContactLinks = document.getElementById('contact-links');
    elCitation = document.getElementById('contact-citation');
    elFooter = document.getElementById('footer-text');
    elPipelineMap = document.getElementById('pipeline-map');
    elQualityMatrix = document.getElementById('quality-matrix');
    elThemeToggle = document.getElementById('theme-toggle');
  }

  function render() {
    cacheElements();
    safe('theme', initTheme);
    safe('meta', renderMeta);
    safe('hero', renderHero);
    safe('impact', renderImpact);
    safe('pipeline', renderPipeline);
    safe('projects', renderProjects);
    safe('stack', renderStack);
    safe('experience', renderExperience);
    safe('about', renderAbout);
    safe('contact', renderContact);
    safe('footer', renderFooter);
    safe('reveal', initReveal);
  }

  function start() {
    try {
      render();
    } catch (err) {
      log('render', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}());
