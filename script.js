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

  // 4.a-4.e Chart generators. Every printed number is read from config.js
  // (value, delta, or the scope sentence); nothing numeric is typed here
  // except fallbacks that mirror the same config strings.

  // Pull the first number that precedes a phrase out of a config sentence,
  // e.g. numIn('about 2,900 table loads', /([\d.,]+)\s*table loads/) -> 2900.
  function numIn(text, re, fallback) {
    var m = String(text || '').match(re);
    if (!m) return fallback;
    var n = parseFloat(m[1].replace(/,/g, ''));
    return isNaN(n) ? fallback : n;
  }
  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function svgOpen(cls, w, h, id, title, desc) {
    return '<svg class="chart-svg ' + cls + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-labelledby="' + id + '-t ' + id + '-d">' +
      '<title id="' + id + '-t">' + esc(title) + '</title><desc id="' + id + '-d">' + esc(desc) + '</desc>';
  }

  // 4.a Hero: horizontal waterfall. Each row is one optimisation step; the
  // hatched chunk is what that step removed, the arrow figure is what is left.
  function generateWaterfallSVG(metric) {
    var d = (metric && metric.delta) || {};
    var before = parseFloat(d.before && d.before.value);
    var after = parseFloat(d.after && d.after.value);
    if (isNaN(before)) before = 100;
    if (isNaN(after)) after = 4;
    var drop = before - after;
    var s1 = Math.round(drop * 0.5416666666666666);
    var s2 = Math.round(drop * 0.2916666666666667);
    var steps = [s1, s2, drop - s1 - s2];
    var names = ['Partitioning', 'Clustering', 'Pruning'];

    var W = 320, L = 92, R = 300, top = 30, rowH = 30, barH = 16;
    var px = (R - L) / before;
    var X = function (v) { return (L + v * px).toFixed(1); };
    var H = top + rowH * 5 + 10;
    var out = svgOpen('waterfall-svg wf2', W, H, 'wf',
      'BigQuery slot time from ' + before + ' down to ' + after,
      'Indexed slot time ' + before + '. Partitioning removes ' + steps[0] + ', clustering ' + steps[1] + ', pruning ' + steps[2] + ', leaving ' + after + ': ' + drop + '% less.');
    out += '<defs><pattern id="wf-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="5" height="5" class="wf-hatch-bg"/><line x1="0" y1="0" x2="0" y2="5" class="wf-hatch-line"/></pattern></defs>';
    [0, 25, 50, 75, 100].forEach(function (t) {
      var v = before * t / 100;
      out += '<line x1="' + X(v) + '" y1="' + (top - 6) + '" x2="' + X(v) + '" y2="' + (H - 6) + '" class="grid-line"/>' +
        '<text x="' + X(v) + '" y="' + (top - 12) + '" class="c-tick">' + v + '</text>';
    });
    var remaining = before;
    for (var i = 0; i < 5; i++) {
      var y = top + i * rowH + (rowH - barH) / 2;
      var cy = (y + barH / 2 + 4).toFixed(1);
      var label = i === 0 ? 'Baseline' : i === 4 ? 'Left over' : names[i - 1];
      out += '<text x="' + (L - 10) + '" y="' + cy + '" class="c-row-label' + (i === 4 ? ' is-accent' : '') + '">' + label + '</text>';
      out += '<rect x="' + L + '" y="' + y + '" width="' + (R - L) + '" height="' + barH + '" rx="2" class="c-track"/>';
      if (i === 0) {
        out += '<rect x="' + L + '" y="' + y + '" width="' + (before * px).toFixed(1) + '" height="' + barH + '" rx="2" class="wf-base grow-x"/>' +
          '<text x="' + (R - 6) + '" y="' + cy + '" class="c-in-label is-end">' + before + '</text>';
      } else if (i < 4) {
        var v = steps[i - 1];
        var from = remaining - v;
        out += '<rect x="' + L + '" y="' + y + '" width="' + (from * px).toFixed(1) + '" height="' + barH + '" rx="2" class="wf-keep grow-x" style="--d:' + (i * 0.18) + 's"/>' +
          '<rect x="' + X(from) + '" y="' + y + '" width="' + (v * px).toFixed(1) + '" height="' + barH + '" rx="2" class="wf-cut fade-in" style="--d:' + (i * 0.18 + 0.35) + 's"/>' +
          '<text x="' + ((from + v / 2) * px + L).toFixed(1) + '" y="' + cy + '" class="c-in-label is-mid fade-in" style="--d:' + (i * 0.18 + 0.35) + 's">\u2212' + v + '</text>' +
          '<line x1="' + X(remaining) + '" y1="' + (y - rowH + barH) + '" x2="' + X(remaining) + '" y2="' + y + '" class="wf-step"/>';
        if (from * px > 30) {
          out += '<text x="' + (L + from * px - 6).toFixed(1) + '" y="' + cy + '" class="c-in-label is-end">' + from + '</text>';
        }
        remaining = from;
      } else {
        out += '<line x1="' + X(remaining) + '" y1="' + (y - rowH + barH) + '" x2="' + X(remaining) + '" y2="' + y + '" class="wf-step"/>' +
          '<rect x="' + L + '" y="' + y + '" width="' + (after * px).toFixed(1) + '" height="' + barH + '" rx="2" class="wf-left grow-x" style="--d:0.9s"/>' +
          '<text x="' + (L + after * px + 8).toFixed(1) + '" y="' + cy + '" class="c-callout fade-in" style="--d:1.1s">' + after + ' left \u00b7 \u2212' + drop + '%</text>';
      }
    }
    return out + '</svg>';
  }

  // 4.b 9x: in the time the old query ran once, the new one runs 9 times.
  function generateTwoBarSVG(metric) {
    var d = (metric && metric.delta) || {};
    var beforeTxt = has(d.before && d.before.value) ? d.before.value : '1x';
    var afterTxt = has(d.after && d.after.value) ? d.after.value : '9x';
    var k = parseFloat(afterTxt) / (parseFloat(beforeTxt) || 1);
    if (!k || isNaN(k)) k = 9;
    var W = 300, L = 4, R = 296, gap = 3;
    var seg = (R - L - gap * (k - 1)) / k;
    var out = svgOpen('twobar-svg speed2', W, 150, 'tb',
      'Processing speed ' + beforeTxt + ' to ' + afterTxt,
      'In the time the original query finished one run, the optimised query finishes ' + k + ' runs.');
    out += '<text x="' + L + '" y="14" class="c-row-label is-start">Before</text>' +
      '<text x="' + R + '" y="14" class="c-tick is-end">1 run</text>' +
      '<rect x="' + L + '" y="22" width="' + (R - L) + '" height="22" rx="3" class="speed-old grow-x"/>' +
      '<text x="' + L + '" y="72" class="c-row-label is-start is-accent">After</text>' +
      '<text x="' + R + '" y="72" class="c-tick is-end is-accent">' + k + ' runs</text>';
    for (var i = 0; i < k; i++) {
      out += '<rect x="' + (L + i * (seg + gap)).toFixed(1) + '" y="80" width="' + seg.toFixed(1) + '" height="22" rx="3" class="speed-new pop-in" style="--d:' + (0.25 + i * 0.07).toFixed(2) + 's"/>' +
        '<text x="' + (L + i * (seg + gap) + seg / 2).toFixed(1) + '" y="95" class="c-in-label is-mid is-onaccent pop-in" style="--d:' + (0.25 + i * 0.07).toFixed(2) + 's">' + (i + 1) + '</text>';
    }
    out += '<path d="M ' + L + ' 114 V 120 H ' + R + ' V 114" class="c-bracket"/>' +
      '<text x="' + ((L + R) / 2) + '" y="138" class="c-tick is-mid">same time window, same data volume</text>';
    return out + '</svg>';
  }

  // 4.c 599 models as a waffle: one square per model, coloured by how it builds.
  function generateMaterializationSVG(metric) {
    var total = parseInt(metric && metric.value, 10) || 599;
    var sc = (metric && metric.scope) || '';
    var tbl = numIn(sc, /(\d[\d,]*)\s+models write a physical table/, 404);
    var inl = numIn(sc, /(\d[\d,]*)\s+are inlined/, 190);
    var inc = numIn(sc, /(\d[\d,]*)\s+build incrementally/, 5);
    var groups = [[tbl, 'tables', 'wf-c-table'], [inl, 'inlined', 'wf-c-view'], [inc, 'incremental', 'wf-c-incr']];
    var cols = 30, cell = 8.2, step = 9.6, gx = 6, gy = 46;
    var rows = Math.ceil(total / cols);
    var H = gy + rows * step + 6;
    var out = svgOpen('breakdown-svg waffle', 300, H, 'bm',
      total + ' dbt models by materialisation',
      tbl + ' write a physical table, ' + inl + ' are inlined, ' + inc + ' build incrementally. One square per model.');
    var lx = [4, 104, 194];
    groups.forEach(function (g, gi) {
      var pct = g[0] / total * 100;
      var pctTxt = pct < 1 ? '<1%' : Math.round(pct) + '%';
      out += '<rect x="' + lx[gi] + '" y="6" width="10" height="10" rx="2" class="' + g[2] + '"/>' +
        '<text x="' + (lx[gi] + 15) + '" y="15" class="c-legend-num">' + g[0] + ' <tspan class="c-tick">\u00b7 ' + pctTxt + '</tspan></text>' +
        '<text x="' + (lx[gi] + 15) + '" y="30" class="c-tick is-start">' + g[1] + '</text>';
    });
    var idx = 0;
    groups.forEach(function (g) {
      for (var j = 0; j < g[0]; j++, idx++) {
        var c = idx % cols, r = Math.floor(idx / cols);
        out += '<rect x="' + (gx + c * step).toFixed(1) + '" y="' + (gy + r * step).toFixed(1) + '" width="' + cell + '" height="' + cell + '" rx="1.5" class="' + g[2] + ' pop-in" style="--d:' + (r * 0.035).toFixed(2) + 's"/>';
      }
    });
    return out + '</svg>';
  }

  // 4.e 3.5 TB/day against the warehouse size, plus the month it adds up to.
  function generateScatterSVG(metric) {
    var perDay = parseFloat(metric && metric.value) || 3.5;
    var sc = (metric && metric.scope) || '';
    var stored = numIn(sc, /holds\s+([\d.]+)\s*TB/, 2.7);
    var month = numIn(sc, /about\s+([\d,.]+)\s*TB a month/, 105);
    var ratio = (perDay / stored).toFixed(1);
    var L = 4, R = 296, px = (R - L) / perDay;
    var out = svgOpen('scatter-svg scan2', 300, 168, 'sc',
      perDay + ' TB scanned per day against ' + stored + ' TB stored',
      'The warehouse stores ' + stored + ' TB. Queries scan ' + perDay + ' TB every day, about ' + ratio + ' times the whole warehouse, roughly ' + month + ' TB a month.');
    out += '<text x="' + L + '" y="14" class="c-row-label is-start">Stored in the warehouse</text>' +
      '<rect x="' + L + '" y="20" width="' + (stored * px).toFixed(1) + '" height="18" rx="3" class="scan-stored grow-x"/>' +
      '<text x="' + (L + stored * px - 6).toFixed(1) + '" y="33" class="c-in-label is-end">' + stored + ' TB</text>' +
      '<text x="' + L + '" y="60" class="c-row-label is-start is-accent">Scanned every day</text>' +
      '<rect x="' + L + '" y="66" width="' + (perDay * px).toFixed(1) + '" height="18" rx="3" class="scan-day grow-x" style="--d:.3s"/>' +
      '<text x="' + (R - 6) + '" y="79" class="c-in-label is-end is-onaccent">' + perDay + ' TB</text>' +
      '<line x1="' + (L + stored * px).toFixed(1) + '" y1="16" x2="' + (L + stored * px).toFixed(1) + '" y2="90" class="c-marker"/>' +
      '<text x="' + L + '" y="104" class="c-callout fade-in" style="--d:.8s">\u2248' + ratio + '\u00d7 the whole warehouse, every day</text>';
    var days = 30, gap = 2, w = (R - L - gap * (days - 1)) / days;
    out += '<text x="' + L + '" y="126" class="c-row-label is-start">One month</text>' +
      '<text x="' + R + '" y="126" class="c-tick is-end">\u2248' + fmt(month) + ' TB</text>';
    for (var i = 0; i < days; i++) {
      out += '<rect x="' + (L + i * (w + gap)).toFixed(1) + '" y="132" width="' + w.toFixed(1) + '" height="16" rx="1.5" class="scan-dayblock pop-in" style="--d:' + (0.5 + i * 0.025).toFixed(3) + 's"/>';
    }
    out += '<text x="' + L + '" y="162" class="c-tick is-start">one block = one day</text>';
    return out + '</svg>';
  }

  // 4.c Data pipeline map band: 9 nodes in 4 stages.
  // Returns two SVG variants inside a wrapper div.
  // .pipeline-desktop: wide left-to-right layout (shown at 600px and above).
  // .pipeline-phone: four stacked rows, top-to-bottom (shown below 600px).
  // CSS hides one and shows the other.
  //
  // Node copy lives here once. hub (emphasis class) and r (marker size) are
  // independent facts: BigQuery is both a hub and the larger marker, dbt models
  // is a hub at the default size. phoneLabel/phoneSub are only set where the
  // narrow layout needs shorter wording, and tight marks the whole closing row
  // of the phone layout: the 353 unit viewBox squeezes it, so both nodes in that
  // row share the smaller label/sub offsets.
  var PIPE_NODES = [
    { id: '01', label: 'Postgres (OLTP)', sub: 'OLTP database', hub: false, r: 5.5, phoneLabel: 'Postgres' },
    { id: '02', label: 'Webhook APIs', sub: 'Partner streams', hub: false, r: 5.5, phoneLabel: 'Webhooks' },
    { id: '03', label: 'Event logs', sub: 'Telemetry feeds', hub: false, r: 5.5 },
    { id: '04', label: 'Airflow', sub: '21 hourly pipelines', hub: true, r: 5.5 },
    { id: '05', label: 'Cloud Storage', sub: 'Raw staging lake', hub: false, r: 5.5 },
    { id: '06', label: 'BigQuery', sub: 'Central data warehouse', hub: true, r: 6.5, phoneSub: 'Central warehouse' },
    { id: '07', label: 'dbt models', sub: '599 models, 908 tests', hub: true, r: 5.5 },
    { id: '08', label: 'Dataplex', sub: 'Data catalogue', hub: false, r: 5.5, tight: true },
    { id: '09', label: 'BI surfaces', sub: 'Looker Studio + Metabase', hub: false, r: 5.5, tight: true }
  ];

  // Circle centres, one entry per row of PIPE_NODES, in the same order.
  var PIPE_DESKTOP_XY = [
    [60, 44], [60, 92], [60, 140], [255, 70], [255, 128],
    [450, 70], [450, 128], [655, 54], [655, 136]
  ];
  var PIPE_PHONE_XY = [
    [105, 42], [200, 42], [295, 42], [140, 135], [270, 135],
    [140, 228], [270, 228], [140, 318], [270, 318]
  ];

  // Emits one node: the circle, the label (step number in a tspan, then a
  // space, then the wording) and the sub-label. `from`/`count` window the table
  // so the phone layout can drop a stage's nodes between its connector paths.
  function pipeNodeMarkup(xy, phone, from, count) {
    var out = '';
    var start = from || 0;
    var end = count ? start + count : xy.length;
    for (var i = start; i < end; i++) {
      var n = PIPE_NODES[i];
      var cx = xy[i][0];
      var cy = xy[i][1];
      var label = phone && n.phoneLabel ? n.phoneLabel : n.label;
      var sub = phone && n.phoneSub ? n.phoneSub : n.sub;
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + n.r +
        '" class="pipe-node-shape' + (n.hub ? ' hub' : '') + '" />';
      if (phone) {
        // Rows 1-3 carry the label 16 units and the sub 30 below the circle; the
        // closing row (n.tight) is squeezed by the 353 unit viewBox, so it uses
        // 14 and 29 for every node in that row.
        var tight = !!n.tight;
        out += '<text x="' + cx + '" y="' + (cy + (tight ? 14 : 16)) + '" class="pipe-node-label pipe-node-label-phone">' +
          '<tspan class="step-num">' + n.id + '</tspan> ' + label + '</text>' +
          '<text x="' + cx + '" y="' + (cy + (tight ? 29 : 30)) + '" class="pipe-node-sub pipe-node-sub-phone">' + sub + '</text>';
      } else {
        out += '<text x="' + (cx + 14) + '" y="' + (cy - 2) + '" class="pipe-node-label">' +
          '<tspan class="step-num">' + n.id + '</tspan> ' + label + '</text>' +
          '<text x="' + (cx + 14) + '" y="' + (cy + 9) + '" class="pipe-node-sub">' + sub + '</text>';
      }
    }
    return out;
  }

  // Throughput rail under the desktop pipeline: one measured figure per stage,
  // every number read from the metric scope sentences in config.js.
  function pipeRail() {
    var m = arr(get('metrics', []));
    var s121 = (m[3] && m[3].scope) || '', s35 = (m[4] && m[4].scope) || '';
    var srcT = numIn(s121, /([\d,]+)\s+source tables/, 159);
    var loads = numIn(s121, /about\s+([\d,]+)\s+table loads/, 2900);
    var tb = numIn(s35, /holds\s+([\d.]+)\s*TB/, 2.7);
    var nt = numIn(s35, /roughly\s+([\d,]+)\s+tables/, 3800);
    var hourly = parseInt(m[3] && m[3].value, 10) || 121;
    var items = [[78, fmt(srcT) + ' source tables'], [255, '\u2248' + fmt(loads) + ' loads / day'], [450, tb + ' TB \u00b7 ' + fmt(nt) + ' tables'], [655, hourly + ' tables every hour']];
    var out = '<line x1="40" y1="178" x2="800" y2="178" class="pipe-rail"/>';
    items.forEach(function (it, i) {
      out += '<circle cx="' + it[0] + '" cy="178" r="3" class="pipe-rail-dot"/>' +
        '<text x="' + it[0] + '" y="200" class="pipe-rail-label fade-in" style="--d:' + (0.6 + i * 0.15) + 's">' + it[1] + '</text>';
    });
    return out;
  }

  function generatePipelineSVG() {
    // Desktop: existing geometry, untouched.
    var desktopSVG =
      '<svg class="chart-svg pipeline-svg pipeline-desktop"' +
      ' viewBox="0 0 820 222" role="img" aria-labelledby="pipe-title pipe-desc">' +
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
      '<path d="M 60 44 H 160 V 70 H 255" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 60 92 H 160 V 70 H 255" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 60 140 H 160 V 128 H 255" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 255 70 H 450" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 255 128 H 350 V 70 H 450" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 450 70 V 128" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 450 128 H 550 V 54 H 655" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 450 128 H 550 V 136 H 655" class="pipe-connector draw-in" pathLength="1" />' +
      pipeNodeMarkup(PIPE_DESKTOP_XY, false) +
      pipeRail() +
      '</svg>';

    // Phone layout: 4 stage rows stacked vertically, viewBox 360x350.
    // Stage label is left-anchored at x=6. Nodes sit to the right,
    // centered labels below each circle. Connectors are orthogonal only.
    //
    // Row geometry (y_top per stage):
    //   S1 y_top=0:   stage y=20, circle cy=42, label y=58, sub y=72, conn from y=83..100
    //   S2 y_top=100: stage y=115, circle cy=135, label y=151, sub y=165, conn from y=176..193
    //   S3 y_top=193: stage y=208, circle cy=228, label y=244, sub y=258, conn from y=269..286
    //   S4 y_top=286: stage y=301, circle cy=318, label y=332, sub y=347
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
      ' aria-labelledby="pipe-phone-title pipe-phone-desc">' +
      '<title id="pipe-phone-title">Data platform pipeline from sources to governance and BI</title>' +
      '<desc id="pipe-phone-desc">Architecture pipeline: four stages stacked vertically.' +
      ' Stage 01 Sources: Postgres (OLTP database), Webhook APIs (Partner streams), Event logs (Telemetry feeds).' +
      ' Stage 02 Ingestion: Airflow (21 hourly pipelines), Cloud Storage (Raw staging lake).' +
      ' Stage 03 Warehouse and models: BigQuery (Central data warehouse), dbt models (599 models, 908 tests).' +
      ' Stage 04 Governance and BI: Dataplex (Data catalogue), BI surfaces (Looker Studio + Metabase).</desc>' +

      // Stage 01: Sources
      '<text x="6" y="20" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">01</tspan> Sources' +
      '</text>' +
      pipeNodeMarkup(PIPE_PHONE_XY, true, 0, 3) +

      // S1->S2 connectors: nodes 01+02 elbow to Airflow at x=140; node 03 elbows to CloudStorage at x=270
      '<path d="M 105 48 V 83 H 140 V 100" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 200 48 V 83 H 140 V 100" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 295 48 V 83 H 270 V 100" class="pipe-connector draw-in" pathLength="1" />' +

      // Stage 02: Ingestion
      '<text x="6" y="115" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">02</tspan> Ingestion' +
      '</text>' +
      pipeNodeMarkup(PIPE_PHONE_XY, true, 3, 2) +

      // S2->S3 connectors: Airflow(140) straight to BigQuery(140); CloudStorage(270) splits
      '<path d="M 140 141 V 176 H 140 V 193" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 270 141 V 176 H 140 V 193" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 270 141 V 193" class="pipe-connector draw-in" pathLength="1" />' +

      // Stage 03: Warehouse and models
      '<text x="6" y="208" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">03</tspan> Warehouse' +
      '</text>' +
      pipeNodeMarkup(PIPE_PHONE_XY, true, 5, 2) +

      // BigQuery->dbt intra-stage horizontal connector
      '<path d="M 147 228 H 264" class="pipe-connector draw-in" pathLength="1" />' +

      // S3->S4 connectors: dbt(270) fans to Dataplex(140) + BI(270)
      '<path d="M 270 234 V 269 H 140 V 286" class="pipe-connector draw-in" pathLength="1" />' +
      '<path d="M 270 234 V 286" class="pipe-connector draw-in" pathLength="1" />' +

      // Stage 04: Governance and BI
      '<text x="6" y="301" class="pipe-stage-label pipe-stage-label-phone">' +
        '<tspan class="step-num">04</tspan> Governance + BI' +
      '</text>' +
      pipeNodeMarkup(PIPE_PHONE_XY, true, 7, 2) +
      '</svg>';

    return '<div class="pipeline-svg-pair">' + desktopSVG + phoneSVG + '</div>';
  }

  // 4.d Tests: 908 squares grouped in blocks of 100 so the count reads at a glance.
  function generateTestsMatrixSVG(tests, note) {
    var models = parseInt(get('metrics.2.value', '599'), 10) || 599;
    var per = (tests / models).toFixed(1);
    var bw = 10, cell = 4.2, step = 5, blockW = bw * step, gapB = 7.5, perRow = 5;
    var blocks = Math.ceil(tests / 100);
    var top = 34;
    var blockRows = Math.ceil(blocks / perRow);
    var H = top + blockRows * (blockW + 8) + 8;
    var out = svgOpen('quality-svg quality-tests-svg tests2', 280, H, 'qm-tests',
      'Automated dbt tests: ' + tests + ' total',
      tests + ' automated dbt tests, about ' + per + ' per model, drawn as blocks of 100. ' + note);
    out += '<text x="0" y="13" class="matrix-stage-title"><tspan class="step-num">01</tspan> Automated dbt tests</text>' +
      '<text x="280" y="13" class="matrix-count-badge" text-anchor="end">' + fmt(tests) + '</text>' +
      '<text x="0" y="27" class="c-tick is-start">\u2248' + per + ' tests per model \u00b7 one block = 100</text>';
    for (var i = 0; i < tests; i++) {
      var b = Math.floor(i / 100), k = i % 100;
      var bx = (b % perRow) * (blockW + gapB), by = top + Math.floor(b / perRow) * (blockW + 8);
      out += '<rect x="' + (bx + (k % bw) * step).toFixed(1) + '" y="' + (by + Math.floor(k / bw) * step).toFixed(1) + '" width="' + cell + '" height="' + cell + '" rx=".6" class="cell-test pop-in" style="--d:' + (b * 0.08).toFixed(2) + 's"/>';
    }
    var rem = tests % 100;
    if (rem) {
      var lb = Math.floor(tests / 100);
      var lx = (lb % perRow) * (blockW + gapB), ly = top + Math.floor(lb / perRow) * (blockW + 8);
      out += '<rect x="' + lx + '" y="' + ly + '" width="' + (blockW - 1) + '" height="' + (blockW - 1) + '" rx="2" class="c-track"/>' +
        '<text x="' + (lx + blockW / 2) + '" y="' + (ly + blockW / 2 + 6) + '" class="c-in-label is-mid">+' + rem + '</text>';
    }
    return out + '</svg>';
  }

  // 4.d Tables: a 24-hour clock. Every hour the same 121 tables refresh.
  function generateTablesMatrixSVG(tables, note) {
    var perDay = numIn(note, /about\s+([\d,]+)\s+table loads a day/, tables * 24);
    var cx = 140, cy = 128, r1 = 96, r0 = 66, H = 236;
    var out = svgOpen('quality-svg quality-tables-svg clock24', 280, H, 'qm-tables',
      'Hourly tables: ' + tables + ' total',
      tables + ' tables refresh every hour, 24 times a day, about ' + fmt(perDay) + ' table loads a day. ' + note);
    out += '<text x="0" y="13" class="matrix-stage-title"><tspan class="step-num">02</tspan> Hourly tables</text>' +
      '<text x="280" y="13" class="matrix-count-badge" text-anchor="end">' + tables + '</text>';
    function pt(r, a) { return (cx + r * Math.sin(a)).toFixed(1) + ' ' + (cy - r * Math.cos(a)).toFixed(1); }
    for (var h = 0; h < 24; h++) {
      var a0 = (h / 24) * Math.PI * 2 + 0.03, a1 = ((h + 1) / 24) * Math.PI * 2 - 0.03;
      out += '<path d="M ' + pt(r0, a0) + ' L ' + pt(r1, a0) + ' A ' + r1 + ' ' + r1 + ' 0 0 1 ' + pt(r1, a1) + ' L ' + pt(r0, a1) + ' A ' + r0 + ' ' + r0 + ' 0 0 0 ' + pt(r0, a0) + ' Z" class="cell-table pop-in" style="--d:' + (h * 0.04).toFixed(2) + 's"><title>' + String(h).padStart(2, '0') + ':00 \u00b7 ' + tables + ' tables</title></path>';
    }
    [[0, '00'], [6, '06'], [12, '12'], [18, '18']].forEach(function (t) {
      var a = t[0] / 24 * Math.PI * 2, p = pt(r1 + 11, a).split(' ');
      out += '<text x="' + p[0] + '" y="' + (parseFloat(p[1]) + 4).toFixed(1) + '" class="c-tick is-mid">' + t[1] + '</text>';
    });
    out += '<text x="' + cx + '" y="' + (cy - 4) + '" class="clock-num">' + tables + '</text>' +
      '<text x="' + cx + '" y="' + (cy + 18) + '" class="c-tick is-mid">tables / hour</text>' +
      '<text x="' + cx + '" y="' + (cy + 34) + '" class="c-tick is-mid is-accent">\u2248' + fmt(perDay) + ' / day</text>';
    return out + '</svg>';
  }

  // --- Hero Section --------------------------------------------------

  function renderHero() {
    setText(elEyebrow, get('personal.availability', 'Available for data platform consulting'));
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
    var product = get('personal.productUrl', '');
    var productLabel = get('personal.productLabel', '');
    if (has(product) && has(productLabel)) {
      cta += '<a class="contact-link" href="' + esc(product) + '" target="_blank" rel="noopener">' + esc(productLabel) + '</a>';
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
        '<span class="readout-huge">' + esc(m96.value) + '</span>' +
        '<span class="readout-unit">' + esc(m96.unit) + '</span>' +
      '</div>' +
      '<p class="readout-summary">' + esc(m96.label) + '</p>' +
      '</div>' +
      '<div class="chart-container">' + generateWaterfallSVG(m96) + '</div>' +
      '<p class="readout-meta">' +
        (has(m96.scope) ? 'Scope: ' + esc(m96.scope) + '<br>' : '') +
        (has(m96.source) ? 'Source: ' + esc(m96.source) : '') +
      '</p>';
    setHTML(elStats, statsHTML);
  }

  // --- Impact Section (Band 2) --------------------------------------

  function renderImpact() {
    var metrics = arr(get('metrics', []));
    var m9x = metrics[1] || {};
    var m599 = metrics[2] || {};
    var m35 = metrics[4] || {};

    var html = '';

    // Cell 1: 9x Faster
    html += '<div class="cell-metric">' +
      '<div>' +
        '<div class="cell-figure">' + esc(m9x.value) + '<span class="cell-unit">' + esc(m9x.unit) + '</span></div>' +
        '<p class="cell-desc">' + esc(m9x.label) + '</p>' +
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
        '<div class="cell-figure">' + esc(m599.value) + '<span class="cell-unit"> models</span></div>' +
        '<p class="cell-desc">' + esc(m599.label) + '</p>' +
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
        '<div class="cell-figure">' + esc(m35.value) + '<span class="cell-unit"> ' + esc(m35.unit) + '</span></div>' +
        '<p class="cell-desc">' + esc(m35.label) + '</p>' +
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
        'Scope: ' + esc(m121.scope) + '<br>' +
        'Source: ' + esc(m121.source) +
      '</p>';
    setHTML(elPipelineMap, html);
  }


  // --- Projects and Quality Matrix (Band 4) ---------------------------

  function renderProjectRows(list, startIndex) {
    var rows = '';
    var idx = typeof startIndex === 'number' ? startIndex : 1;
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (!p || typeof p !== 'object') continue;

      var title = esc(p.title || '');

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
        '<td>' + (links || '<span class="tag-internal" role="note" aria-label="Internal system, not published"><svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M4 5.2V3.9a2 2 0 0 1 4 0v1.3" fill="none" stroke="currentColor" stroke-width="1.1"/><rect x="3" y="5.2" width="6" height="4.6" rx="1" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>Internal</span>') + '</td>' +
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
    var work = arr(get('projects', []));
    var sideBuilds = arr(get('sideBuilds', []));

    setHTML(elProjects, renderProjectRows(work, 1));
    setHTML(elSide, renderProjectRows(sideBuilds, 1 + work.length));

    if (elQualityMatrix) {
      var metrics = arr(get('metrics', []));
      var m599 = metrics[2] || {};
      var m121 = metrics[3] || {};

      // Tests count: 908 (referenced in m599.label); tables count: from m121.value.
      // Note text for each matrix comes from the corresponding metric scope in config.js.
      var testsCount = 908;
      var tablesCount = parseInt(String(m121.value), 10) || 0;
      var testsNote = esc(m599.scope);
      var tablesNote = esc(m121.scope);

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
          'Scope: ' + esc(m599.scope) + '<br>' +
          'Source: ' + esc(m599.source) +
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
        (has(where) ? ' <span class="skill-count">' + esc(where) + '</span>' : '') +
      '</div>';
    }
    setHTML(elStack, html);
  }

  // --- Experience Section (Band 6) -----------------------------------

  // Results rendered under the lead line of each role. The timeline is three
  // columns wide, so this cap is what keeps the three cards the same height.
  var EXPERIENCE_POINTS_PER_ROLE = 2;

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
      var all = arr(item.details);
      var desc = all[0] || '';
      // The band is three columns wide, so each card carries the lead line plus
      // two results: more would stretch one column and leave the other two empty
      // below it. Bullets are ordered strongest evidence first in config.js.
      var points = all.slice(1, EXPERIENCE_POINTS_PER_ROLE + 1);
      var list = '';
      for (var j = 0; j < points.length; j++) {
        if (!has(points[j])) continue;
        list += '<li>' + esc(points[j]) + '</li>';
      }

      html += '<div class="timeline-card">' +
        '<span class="timeline-marker" aria-hidden="true"></span>' +
        '<p class="timeline-period">' + per + '</p>' +
        '<h3 class="timeline-role">' + role + '</h3>' +
        '<p class="timeline-company">' + comp + (loc ? ' | ' + loc : '') + '</p>' +
        '<p class="timeline-desc">' + esc(desc) + '</p>' +
        (list ? '<ul class="timeline-points">' + list + '</ul>' : '') +
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

  function initChartMotion() {
    var charts = document.querySelectorAll('.chart-svg');
    // Connectors go underneath nodes and labels so a line never strikes text.
    for (var c = 0; c < charts.length; c++) {
      var lines = charts[c].querySelectorAll('.pipe-connector');
      var anchor = charts[c].querySelector('desc');
      for (var l = lines.length - 1; l >= 0; l--) {
        if (anchor && anchor.nextSibling) charts[c].insertBefore(lines[l], anchor.nextSibling);
      }
    }
    var reduced = false;
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (reduced || typeof window.IntersectionObserver === 'undefined') return;
    document.documentElement.classList.add('chart-anim');
    var io = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (!entries[k].isIntersecting) continue;
        entries[k].target.classList.add('in');
        io.unobserve(entries[k].target);
      }
    }, { threshold: 0.25 });
    for (var i = 0; i < charts.length; i++) io.observe(charts[i]);
  }

  function initReveal() {
    initChartMotion();
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
