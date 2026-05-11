// ============================================================
// script.js -- Reads all content from PORTFOLIO (config.js)
// and renders the entire page dynamically.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const P = PORTFOLIO;
  const S = P.settings;

  // --- Render Page Meta ---
  document.getElementById('page-title').textContent = P.personal.name + ' | ' + P.personal.title;
  document.getElementById('page-meta').setAttribute('content',
    P.personal.title + ' specializing in DBT, SQL, and BigQuery.');
  document.getElementById('nav-logo').innerHTML = '&gt; ' + P.personal.initials;
  document.getElementById('hero-name').textContent = P.personal.name;
  document.getElementById('hero-desc').textContent = P.personal.tagline;

  // --- Typed.js ---
  new Typed('#typed-output', {
    strings: P.personal.roles,
    typeSpeed: S.typedSpeed,
    backSpeed: S.typedBackSpeed,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });

  // --- Particle Background ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(S.particleCount,
      Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * S.particleSpeed,
        vy: (Math.random() - 0.5) * S.particleSpeed,
        radius: Math.random() * (S.particleRadius[1] - S.particleRadius[0])
                + S.particleRadius[0]
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < S.connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(16, 185, 129, '
            + (0.15 * (1 - dist / S.connectionDistance)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // --- Render About Section ---
  const aboutContent = document.getElementById('about-content');
  P.personal.bio.forEach(para => {
    const p = document.createElement('p');
    if (para.highlights.length === 0) {
      p.textContent = para.text;
    } else {
      // Bold the highlighted phrases
      let html = para.text;
      para.highlights.forEach(h => {
        html = html.replace(h, '<strong>' + h + '</strong>');
      });
      p.innerHTML = html;
    }
    aboutContent.appendChild(p);
  });

  // About details
  const aboutDetails = document.getElementById('about-details');
  const details = [
    { label: 'Location', value: P.personal.location, type: 'text' },
    { label: 'Email',    value: P.personal.email,    type: 'email' },
    { label: 'LinkedIn', value: P.personal.linkedin,  type: 'linkedin' }
  ];
  details.forEach(d => {
    const div = document.createElement('div');
    div.className = 'about-detail-item';
    const label = document.createElement('span');
    label.className = 'detail-label';
    label.textContent = d.label;
    const val = document.createElement(d.type === 'text' ? 'span' : 'a');
    val.className = 'detail-value';
    if (d.type === 'email') {
      val.href = 'mailto:' + d.value;
      val.textContent = d.value;
    } else if (d.type === 'linkedin') {
      val.href = 'https://linkedin.com/in/' + d.value;
      val.textContent = 'linkedin.com/in/' + d.value;
      val.target = '_blank';
    } else {
      val.textContent = d.value;
    }
    div.appendChild(label);
    div.appendChild(val);
    aboutDetails.appendChild(div);
  });

  // --- Render Metrics Cards ---
  const metricsGrid = document.getElementById('metrics-grid');
  P.metrics.forEach(m => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML =
      '<div class="metric-icon">' + m.icon + '</div>' +
      '<div class="metric-number" data-target="' + m.value
        + '" data-suffix="' + m.suffix + '">0</div>' +
      '<div class="metric-label">' + m.label + '</div>';
    metricsGrid.appendChild(card);
  });

  // --- Render Charts ---
  const chartsRow = document.getElementById('charts-row');
  const C = P.charts;

  // Speed chart container
  const speedDiv = document.createElement('div');
  speedDiv.className = 'chart-container';
  speedDiv.innerHTML = '<h3>' + C.speed.title + '</h3>'
    + '<p class="chart-subtitle">' + C.speed.subtitle + '</p>'
    + '<canvas id="speed-chart"></canvas>';
  chartsRow.appendChild(speedDiv);

  // Savings chart container
  const savingsDiv = document.createElement('div');
  savingsDiv.className = 'chart-container';
  savingsDiv.innerHTML = '<h3>' + C.savings.title + '</h3>'
    + '<p class="chart-subtitle">' + C.savings.subtitle + '</p>'
    + '<canvas id="savings-chart"></canvas>';
  chartsRow.appendChild(savingsDiv);

  // Speed chart
  new Chart(document.getElementById('speed-chart'), {
    type: 'bar',
    data: {
      labels: C.speed.labels,
      datasets: [{
        label: C.speed.title,
        data: C.speed.data,
        backgroundColor: C.speed.colors,
        borderColor: C.speed.borders,
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.parsed.y + C.speed.yUnit + ' speed';
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#71717a',
            font: { family: "'JetBrains Mono', monospace", size: 11 }
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#71717a',
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            callback: function(val) { return val + C.speed.yUnit; }
          },
          grid: { color: 'rgba(39, 39, 42, 0.5)' }
        }
      }
    }
  });

  // Savings chart
  new Chart(document.getElementById('savings-chart'), {
    type: 'bar',
    data: {
      labels: C.savings.labels,
      datasets: [{
        label: 'Reduction',
        data: C.savings.data,
        backgroundColor: C.savings.colors,
        borderColor: C.savings.border,
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.5
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.parsed.x + C.savings.xUnit + ' reduction';
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: C.savings.xMax,
          ticks: {
            color: '#71717a',
            font: { family: "'JetBrains Mono', monospace", size: 11 },
            callback: function(val) { return val + C.savings.xUnit; }
          },
          grid: { color: 'rgba(39, 39, 42, 0.5)' }
        },
        y: {
          ticks: {
            color: '#a1a1aa',
            font: { family: "'JetBrains Mono', monospace", size: 11 }
          },
          grid: { display: false }
        }
      }
    }
  });

  // --- Render Projects ---
  const projectsGrid = document.getElementById('projects-grid');
  P.projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card'
      + (proj.featured ? ' featured' : '');

    let metricsHTML = '';
    if (proj.metrics && proj.metrics.length > 0) {
      metricsHTML = '<div class="project-metrics">'
        + proj.metrics.map(m =>
            '<div class="mini-metric">'
            + '<span class="mini-value">' + m.value + '</span>'
            + '<span class="mini-label">' + m.label + '</span>'
            + '</div>')
          .join('')
        + '</div>';
    }

    card.innerHTML =
      '<div class="project-header">'
      + (proj.featured
          ? '<span class="project-badge">Featured</span>'
          : '')
      + '<h3>' + proj.title + '</h3>'
      + '</div>'
      + '<p class="project-desc">' + proj.description + '</p>'
      + '<div class="project-tech">'
      + proj.tech.map(t => '<span>' + t + '</span>').join('')
      + '</div>'
      + metricsHTML;

    projectsGrid.appendChild(card);
  });

  // --- Render Experience ---
  const timeline = document.getElementById('timeline');
  P.experience.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML =
      '<div class="timeline-dot"></div>'
      + '<div class="timeline-content">'
      + '<div class="timeline-header">'
      + '<h3>' + exp.role + '</h3>'
      + '<a href="' + exp.companyUrl + '" target="_blank" class="company-link">'
      + exp.company + '</a>'
      + '</div>'
      + '<p class="timeline-meta">' + exp.location
      + ' | ' + exp.period + '</p>'
      + '<ul class="timeline-details">'
      + exp.details.map(d => '<li>' + d + '</li>').join('')
      + '</ul>'
      + '</div>';
    timeline.appendChild(item);
  });

  // --- Render Skills ---
  const skillsGrid = document.getElementById('skills-grid');
  P.skills.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'skill-category';
    div.innerHTML =
      '<h4>' + cat.category + '</h4>'
      + '<div class="skill-tags">'
      + cat.items.map(s =>
          '<span class="skill-tag ' + s.level + '">'
          + s.name + '</span>')
        .join('')
      + '</div>';
    skillsGrid.appendChild(div);
  });

  // --- Render Contact ---
  document.getElementById('contact-heading').textContent = P.contact.heading;
  document.getElementById('contact-desc').textContent = P.contact.description;
  const contactLinks = document.getElementById('contact-links');
  const contactIcons = { email: '&#9993;', linkedin: 'in', github: '&#8984;' };
  P.contact.links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'contact-card';
    a.href = link.href;
    a.target = link.type === 'email' ? '_self' : '_blank';
    a.innerHTML =
      '<span class="contact-icon">' + contactIcons[link.type] + '</span>'
      + '<span>' + link.label + '</span>';
    contactLinks.appendChild(a);
  });

  // --- Footer ---
  document.getElementById('footer-text').innerHTML =
    'Built by ' + P.personal.name + ' &copy; ' + new Date().getFullYear();

  // --- Animated Counters ---
  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    document.querySelectorAll('.metric-number').forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = S.counterDuration;
      const start = performance.now();
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // --- Scroll Fade-in ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.id === 'metrics') animateCounters();
      }
    });
  }, { threshold: S.fadeThreshold });

  document.querySelectorAll('section').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor =
      window.scrollY > 50 ? 'var(--border-hover)' : 'var(--border)';
  });
});
