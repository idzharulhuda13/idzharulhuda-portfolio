// ============================================================
// script.js -- v2 renderer.
// Renders every section from the global PORTFOLIO object (config.js)
// into the containers declared in index.html.
// Frozen contract: .hermes/plans/2026-09-14_portfolio-v2-exec-spec.md (sections 2 and 3).
// ES5 only: no modules, no build step, no external dependency.
// Ids written here: only the frozen JS-filled list -- nothing else.
// ============================================================

(function () {
  'use strict';

  var P = (typeof PORTFOLIO !== 'undefined' && PORTFOLIO) ? PORTFOLIO : {};

  // --- element slots (filled by cacheElements) -----------------------
  var elPageTitle, elPageMeta, elBrand, elEyebrow, elName, elLead, elCta,
      elStrip, elStats, elProse, elFacts, elImpact, elProjects, elSide,
      elTimeline, elStack, elContactHeading, elContactLead, elContactLinks,
      elCitation, elFooter;

  // --- helpers -------------------------------------------------------

  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function has(value) {
    return value !== null && value !== undefined && value !== '';
  }

  // Tolerant reader: a missing key or an old config.js shape returns the fallback.
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
    if (el) el.textContent = has(value) ? String(value) : '';
  }

  function setHTML(el, markup) {
    if (el) el.innerHTML = markup || '';
  }

  function log(label, err) {
    if (window.console && window.console.error) {
      window.console.error('[portfolio] ' + label + ' failed', err);
    }
  }

  // One section throwing must not stop the rest of the render.
  function safe(label, fn) {
    try {
      fn();
    } catch (err) {
      log(label, err);
    }
  }

  // Skills entries are { name, where }; plain strings are tolerated.
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

  function chip(text) {
    return '<span class="chip">' + esc(text) + '</span>';
  }

  function techChip(text) {
    return '<span class="tech-chip">' + esc(text) + '</span>';
  }

  // --- head / brand --------------------------------------------------

  function renderMeta() {
    var name = get('personal.name', '');
    var title = get('personal.title', '');
    var headline = get('personal.headline', '');
    var tagline = get('personal.tagline', '');
    var seoTitle = has(title) ? title : headline;

    if (elPageTitle) {
      elPageTitle.textContent = (has(name) ? name + ' | ' : '') +
        (has(seoTitle) ? String(seoTitle) : 'Portfolio');
    }
    if (elPageMeta) {
      var description = has(headline) ? headline : (has(tagline) ? tagline : seoTitle);
      elPageMeta.setAttribute('content', has(description) ? String(description) : '');
    }
    setText(elBrand, '> ' + String(get('personal.initials', '')));
  }

  // --- hero ----------------------------------------------------------

  function yearsOfExperience() {
    var experience = arr(get('experience', []));
    var earliest = null;
    for (var i = 0; i < experience.length; i++) {
      var item = experience[i];
      if (!item || !has(item.period)) continue;
      var match = String(item.period).match(/(19|20)\d{2}/);
      if (!match) continue;
      var year = parseInt(match[0], 10);
      if (earliest === null || year < earliest) earliest = year;
    }
    if (earliest === null) return 0;
    var now = new Date().getFullYear();
    return now > earliest ? now - earliest : 0;
  }

  function productionProjectCount() {
    var projects = arr(get('projects', []));
    var count = 0;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i] && projects[i].kind !== 'side') count++;
    }
    return count;
  }

  // Stakeholder figure, read from config only: first a metric labelled
  // "stakeholder", otherwise the "<n>+ stakeholders" figure written in a
  // metric's own text. No figure here is invented; no match means no stat.
  function stakeholderFigure() {
    var metrics = arr(get('metrics', []));
    var written = '';
    for (var i = 0; i < metrics.length; i++) {
      var metric = metrics[i];
      if (!metric || !has(metric.value)) continue;
      var figure = String(metric.value) + (has(metric.unit) ? String(metric.unit) : '');
      var label = String(has(metric.label) ? metric.label : '');
      if (label.toLowerCase().indexOf('stakeholder') !== -1) return figure;

      var prose = label + ' ' + String(has(metric.scope) ? metric.scope : '') +
        ' ' + String(has(metric.source) ? metric.source : '');
      var match = prose.match(/(\d[\d,]*\s*\+?)\s*stakeholders/i);
      if (match && !written) written = match[1].replace(/\s+/g, '');
    }
    return written;
  }

  function statHTML(value, label) {
    return '<div class="stat"><span class="stat-value">' + esc(value) + '</span>' +
      '<span class="stat-label">' + esc(label) + '</span></div>';
  }

  function renderHero() {
    setText(elEyebrow, get('personal.availability', ''));
    setText(elName, get('personal.headline', ''));
    setText(elLead, get('personal.tagline', ''));

    var cta = '';
    var email = get('personal.email', '');
    if (has(email)) {
      cta += '<a class="btn btn-primary" href="mailto:' + esc(email) + '">Email</a>';
    }
    var github = githubHref(get('personal.github', ''));
    if (has(github)) {
      cta += '<a class="btn btn-ghost" href="' + esc(github) + '" target="_blank" rel="noopener">GitHub</a>';
    }
    var resume = get('personal.resumeUrl', '');
    if (typeof resume === 'string' && resume !== '') {
      cta += '<a class="btn btn-ghost" href="' + esc(resume) + '">Resume</a>';
    }
    setHTML(elCta, cta);

    var daily = arr(get('skills.daily', []));
    var chips = '';
    var chipCount = 0;
    for (var i = 0; i < daily.length && chipCount < 6; i++) {
      var name = nameOf(daily[i]);
      if (!name) continue;
      chips += chip(name);
      chipCount++;
    }
    setHTML(elStrip, chips);

    var stats = '';
    var years = yearsOfExperience();
    if (years > 0) stats += statHTML(years, 'years in data');
    var production = productionProjectCount();
    if (production > 0) stats += statHTML(production, 'production projects');
    var stakeholders = stakeholderFigure();
    if (has(stakeholders)) stats += statHTML(stakeholders, 'stakeholders served');
    setHTML(elStats, stats);
  }

  // --- about ---------------------------------------------------------

  function renderAbout() {
    var bio = arr(get('personal.bio', []));
    var prose = '';
    for (var i = 0; i < bio.length; i++) {
      var para = bio[i];
      var body = '';
      var highlights = [];
      if (typeof para === 'string') {
        body = para;
      } else if (para && typeof para === 'object') {
        body = has(para.text) ? String(para.text) : '';
        highlights = arr(para.highlights);
      }
      if (!has(body)) continue;

      // Escape first, then wrap the (escaped) highlight phrase: config text can
      // never inject markup, only receive the <mark> wrapper.
      var out = esc(body);
      for (var j = 0; j < highlights.length; j++) {
        if (!has(highlights[j])) continue;
        var needle = esc(highlights[j]);
        if (!needle) continue;
        out = out.split(needle).join('<mark>' + needle + '</mark>');
      }
      prose += '<p>' + out + '</p>';
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

  // --- impact --------------------------------------------------------

  function deltaColHTML(tag, col, modifier) {
    col = (col && typeof col === 'object') ? col : {};
    var inner = '';
    if (has(col.value)) inner += '<span class="delta-value">' + esc(col.value) + '</span>';
    if (has(col.note)) inner += '<span class="delta-note">' + esc(col.note) + '</span>';
    if (!inner) return '';
    return '<div class="delta-col ' + modifier + '">' +
      '<span class="delta-tag">' + esc(tag) + '</span>' + inner + '</div>';
  }

  function deltaHTML(delta) {
    var before = deltaColHTML('before', delta.before, 'delta-before');
    var after = deltaColHTML('after', delta.after, 'delta-after');
    if (!before && !after) return '';
    return '<div class="delta">' + before + after + '</div>';
  }

  function renderImpact() {
    var metrics = arr(get('metrics', []));
    var html = '';
    for (var i = 0; i < metrics.length; i++) {
      var metric = metrics[i];
      if (!metric || typeof metric !== 'object') continue;
      if (!has(metric.value) || !has(metric.label)) continue;

      html += '<div class="impact-item">' +
        '<div class="impact-head">' +
          '<span class="impact-value">' +
            esc(String(metric.value) + (has(metric.unit) ? String(metric.unit) : '')) +
          '</span>' +
          '<span class="impact-label">' + esc(metric.label) + '</span>' +
        '</div>';
      if (has(metric.scope)) {
        html += '<p class="impact-scope">Scope: ' + esc(metric.scope) + '</p>';
      }
      if (has(metric.source)) {
        html += '<p class="impact-source">Source: ' + esc(metric.source) + '</p>';
      }
      if (metric.delta && typeof metric.delta === 'object') {
        html += deltaHTML(metric.delta);
      }
      html += '</div>';
    }
    setHTML(elImpact, html);
  }

  // --- projects ------------------------------------------------------

  function projectCard(project, allowBadge) {
    var featured = allowBadge === true && project.featured === true;
    var html = '<article class="project-card' + (featured ? ' featured' : '') + '">';

    var head = has(project.title)
      ? '<h3 class="project-title">' + esc(project.title) + '</h3>' : '';
    if (featured) head += '<span class="project-badge">featured</span>';
    if (head) html += '<div class="project-head">' + head + '</div>';

    if (has(project.outcome)) {
      html += '<p class="project-outcome">' + esc(project.outcome) + '</p>';
    }
    if (has(project.description)) {
      html += '<p class="project-desc">' + esc(project.description) + '</p>';
    }

    var proof = arr(project.proof);
    var proofHTML = '';
    for (var i = 0; i < proof.length; i++) {
      var fact = proof[i];
      if (!fact || typeof fact !== 'object') continue;
      var inner = '';
      if (has(fact.value)) inner += '<span class="proof-value">' + esc(fact.value) + '</span>';
      if (has(fact.label)) inner += '<span class="proof-label">' + esc(fact.label) + '</span>';
      if (has(fact.note)) inner += '<span class="proof-note">' + esc(fact.note) + '</span>';
      if (inner) proofHTML += '<div class="proof">' + inner + '</div>';
    }
    if (proofHTML) html += '<div class="project-facts">' + proofHTML + '</div>';

    var tech = arr(project.tech);
    var techHTML = '';
    for (i = 0; i < tech.length; i++) {
      if (has(tech[i])) techHTML += techChip(tech[i]);
    }
    if (techHTML) html += '<div class="project-tech">' + techHTML + '</div>';

    if (typeof project.archDiagram === 'string' &&
        project.archDiagram.replace(/\s/g, '') !== '') {
      html += '<figure class="project-figure">' +
        '<img src="' + esc(project.archDiagram) + '" alt="' +
        esc(project.title) + ' architecture diagram"></figure>';
    }

    var links = '';
    if (has(project.detailUrl)) {
      links += '<a class="project-link" href="' + esc(project.detailUrl) + '">Case study →</a>';
    }
    if (has(project.githubUrl)) {
      links += '<a class="project-link" href="' + esc(project.githubUrl) + '">Source →</a>';
    }
    if (links) html += '<div class="project-links">' + links + '</div>';

    return html + '</article>';
  }

  function renderProjects() {
    var projects = arr(get('projects', []));
    var featured = [];
    var rest = [];
    var sideByKind = [];

    for (var i = 0; i < projects.length; i++) {
      var project = projects[i];
      if (!project || typeof project !== 'object') continue;
      if (project.kind === 'side') {
        sideByKind.push(project);
      } else if (project.featured === true) {
        featured.push(project);
      } else {
        rest.push(project);
      }
    }

    var ordered = featured.concat(rest);
    var workHTML = '';
    for (i = 0; i < ordered.length; i++) {
      workHTML += projectCard(ordered[i], true);
    }
    setHTML(elProjects, workHTML);

    var sideBuilds = arr(get('sideBuilds', [])).concat(sideByKind);
    var sideHTML = '';
    for (i = 0; i < sideBuilds.length; i++) {
      var side = sideBuilds[i];
      if (!side || typeof side !== 'object') continue;
      sideHTML += projectCard(side, false);
    }
    setHTML(elSide, sideHTML);
  }

  // --- experience ----------------------------------------------------

  function renderExperience() {
    var experience = arr(get('experience', []));
    var html = '';

    for (var i = 0; i < experience.length; i++) {
      var item = experience[i];
      if (!item || typeof item !== 'object') continue;

      html += '<div class="timeline-item"><div class="timeline-dot"></div>' +
        '<div class="timeline-body">';

      if (has(item.role)) {
        html += '<h3 class="timeline-role">' + esc(item.role) + '</h3>';
      }
      if (has(item.company)) {
        if (has(item.companyUrl)) {
          html += '<a class="company-link timeline-company" href="' +
            esc(item.companyUrl) + '">' + esc(item.company) + '</a>';
        } else {
          html += '<span class="timeline-company">' + esc(item.company) + '</span>';
        }
      }

      var meta = [];
      if (has(item.location)) meta.push(esc(item.location));
      if (has(item.period)) meta.push(esc(item.period));
      if (meta.length) {
        html += '<p class="timeline-meta">' + meta.join(' · ') + '</p>';
      }

      var details = arr(item.details);
      var detailHTML = '';
      for (var j = 0; j < details.length; j++) {
        if (has(details[j])) detailHTML += '<li>' + esc(details[j]) + '</li>';
      }
      if (detailHTML) {
        html += '<ul class="timeline-details">' + detailHTML + '</ul>';
      }

      var tags = arr(item.techTags);
      var tagHTML = '';
      for (j = 0; j < tags.length; j++) {
        if (has(tags[j])) tagHTML += techChip(tags[j]);
      }
      if (tagHTML) html += '<div class="role-tags">' + tagHTML + '</div>';

      html += '</div></div>';
    }

    setHTML(elTimeline, html);
  }

  // --- stack ---------------------------------------------------------

  function stackGroupHTML(title, items) {
    var rows = '';
    for (var i = 0; i < items.length; i++) {
      var name = nameOf(items[i]);
      if (!name) continue;
      var where = whereOf(items[i]);
      rows += '<li class="stack-item"><span class="stack-name">' + esc(name) + '</span>' +
        (has(where) ? '<span class="stack-where">' + esc(where) + '</span>' : '') +
        '</li>';
    }
    if (!rows) return '';
    return '<div class="stack-group">' +
      '<h3 class="stack-group-title">' + esc(title) + '</h3>' +
      '<ul class="stack-items">' + rows + '</ul></div>';
  }

  function renderStack() {
    var html = stackGroupHTML('daily driver', arr(get('skills.daily', []))) +
      stackGroupHTML('used in production', arr(get('skills.production', [])));
    setHTML(elStack, html);
  }

  // --- contact + footer ----------------------------------------------

  function renderContact() {
    setText(elContactHeading, get('contact.heading', ''));
    setText(elContactLead, get('contact.description', ''));

    var links = arr(get('contact.links', []));
    var html = '';
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (!link || !has(link.href)) continue;
      var label = has(link.label) ? link.label : link.type;
      if (!has(label)) label = link.href;
      var target = /^mailto:/i.test(String(link.href)) ? '' : ' target="_blank" rel="noopener"';
      html += '<a class="contact-card" href="' + esc(link.href) + '"' + target + '>' +
        esc(label) + '</a>';
    }
    setHTML(elContactLinks, html);

    var citation = get('contact.citation', null);
    if (citation && typeof citation === 'object' && has(citation.text)) {
      if (has(citation.href)) {
        setHTML(elCitation, '<a href="' + esc(citation.href) +
          '" target="_blank" rel="noopener">' + esc(citation.text) + '</a>');
      } else {
        setText(elCitation, citation.text);
      }
      if (elCitation) elCitation.style.display = '';
    } else if (elCitation) {
      elCitation.innerHTML = '';
      elCitation.style.display = 'none';
    }
  }

  function renderFooter() {
    var parts = [];
    var name = get('personal.name', '');
    if (has(name)) parts.push(String(name));
    parts.push(String(new Date().getFullYear()));
    parts.push('Built as static HTML/CSS/JS.');
    setText(elFooter, parts.join(' · '));
  }

  // --- motion --------------------------------------------------------

  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    var i;
    var reduced = false;
    try {
      reduced = !!(window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (err) {
      reduced = false;
    }

    if (reduced || typeof window.IntersectionObserver === 'undefined') {
      for (i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
      return;
    }

    var inset = get('settings.revealThreshold', null);
    if (typeof inset !== 'number' || !isFinite(inset) || inset < 0 || inset > 1) {
      inset = get('settings.fadeThreshold', null); // older config key
    }
    if (typeof inset !== 'number' || !isFinite(inset) || inset < 0 || inset > 1) {
      inset = 0.12;
    }

    // The configured value is a fraction of the VIEWPORT, not of the section.
    // A phone-width page stacks the cards into one column, so a section can
    // measure several times the viewport height and a fraction-of-element
    // threshold becomes unreachable -- the section would stay at opacity 0.
    var observer = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (!entries[k].isIntersecting) continue;
        entries[k].target.classList.add('is-visible');
        observer.unobserve(entries[k].target);
      }
    }, { rootMargin: '0px 0px -' + Math.round(inset * 100) + '% 0px', threshold: 0 });

    for (i = 0; i < nodes.length; i++) observer.observe(nodes[i]);
  }

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var scrolled = false;
    function apply() {
      var on = window.scrollY > 8;
      if (on === scrolled) return;
      scrolled = on;
      if (on) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', apply, { passive: true });
    apply();
  }

  // --- boot ----------------------------------------------------------

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
  }

  function render() {
    cacheElements();
    safe('meta', renderMeta);
    safe('hero', renderHero);
    safe('about', renderAbout);
    safe('impact', renderImpact);
    safe('projects', renderProjects);
    safe('experience', renderExperience);
    safe('stack', renderStack);
    safe('contact', renderContact);
    safe('footer', renderFooter);
    safe('reveal', initReveal);
    safe('header', initHeader);
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
