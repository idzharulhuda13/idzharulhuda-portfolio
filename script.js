// ===== Typed.js Hero Animation =====
document.addEventListener('DOMContentLoaded', () => {
  new Typed('#typed-output', {
    strings: [
      'Analytics Engineer',
      'SQL & DBT Developer',
      'BigQuery Optimizer',
      'Data Quality Builder',
      'ML Engineer'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
});

// ===== Particle Network Background =====
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createParticles() {
  particles = [];
  const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(16, 185, 129, ' + (0.15 * (1 - dist / 120)) + ')';
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw & move particles
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

// ===== Animated Counters =====
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  const counters = document.querySelectorAll('.metric-number');
  counters.forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      counter.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

// ===== Scroll Animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      if (entry.target.id === 'metrics') {
        animateCounters();
      }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== Chart: BigQuery Optimization =====
const chartEl = document.getElementById('optimization-chart');
if (chartEl) {
  new Chart(chartEl, {
    type: 'bar',
    data: {
      labels: ['Query Speed', 'Slot Time', 'Data Shuffled'],
      datasets: [
        {
          label: 'Before',
          data: [1, 100, 100],
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'After',
          data: [9, 4, 42],
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#a1a1aa', font: { family: "'JetBrains Mono', monospace" } }
        }
      },
      scales: {
        x: {
          ticks: { color: '#71717a', font: { family: "'JetBrains Mono', monospace", size: 11 } },
          grid: { color: 'rgba(39, 39, 42, 0.5)' }
        },
        y: {
          ticks: { color: '#71717a', font: { family: "'JetBrains Mono', monospace", size: 11 } },
          grid: { color: 'rgba(39, 39, 42, 0.5)' }
        }
      }
    }
  });
}

// ===== Navbar scroll effect =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.borderBottomColor = 'var(--border-hover)';
  } else {
    navbar.style.borderBottomColor = 'var(--border)';
  }
});
