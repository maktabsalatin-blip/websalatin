// ============ PARTICLE ANIMATION (Flash-like Effect) ============
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80;
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;

    // Mouse interaction
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < 100) {
        this.opacity = 1;
      } else {
        this.opacity = Math.max(0.2, this.opacity - 0.01);
      }
    }
  }
  draw() {
    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < 120) {
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * (1 - distance/120)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ============ NAVBAR SCROLL ============
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ============ MOBILE MENU ============
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ SCROLL REVEAL ============
const revealElements = document.querySelectorAll(
  '.section-header, .about-features, .vm-card, .program-card, .leader-card, .heritage-item, .contact-wrapper'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

// ============ COUNTER ANIMATION ============
const statNumbers = document.querySelectorAll('.stat h3');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const finalText = target.textContent;
      const isPlus = finalText.includes('+');
      const num = parseInt(finalText);
      let current = 0;
      const increment = num / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          current = num;
          clearInterval(timer);
        }
        target.textContent = Math.floor(current) + (isPlus ? '+' : '');
      }, 30);
      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(stat => counterObserver.observe(stat));

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formMessage.textContent = '✓ Pesan berhasil dikirim! Terima kasih atas perhatian Anda.';
  formMessage.classList.add('success');
  contactForm.reset();
  setTimeout(() => {
    formMessage.classList.remove('success');
  }, 5000);
});

// ============ PARALLAX EFFECT ============
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-content');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - (scrolled / 700);
  }
});

// ============ DYNAMIC YEAR ============
document.querySelectorAll('.footer-bottom p').forEach(p => {
  if (p.textContent.includes('2024')) {
    p.textContent = p.textContent.replace('2024', new Date().getFullYear());
  }
});

console.log('%c⚜ Yayasan Salatin Al Asyrof Azzahro ⚜', 'color: #d4af37; font-size: 18px; font-weight: bold;');
console.log('%cWebsite powered by HTML, CSS & JavaScript', 'color: #a0aec0;');
