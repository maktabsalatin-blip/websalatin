/* ===================================================
   Yayasan Salatin Asyrof Azzahro — JavaScript
   Flash-style Animations & Interactivity
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticles();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCountUp();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    initParallaxOrbs();
});

/* ===================================================
   PRELOADER
   =================================================== */

function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2000);
    });

    // Failsafe — hide after 4 seconds
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 4000);
}

/* ===================================================
   FLOATING PARTICLES
   =================================================== */

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = 40 + Math.random() * 15; // Gold hue range
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.01 + Math.random() * 0.02;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;

            const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.15;

            if (this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }

            return Math.max(0, pulseOpacity);
        }

        draw(currentOpacity) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 60%, 60%, ${currentOpacity})`;
            ctx.fill();

            // Subtle glow
            if (this.size > 1.2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 60%, 60%, ${currentOpacity * 0.1})`;
                ctx.fill();
            }
        }
    }

    // Create particles — scale by screen size
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            const opacity = p.update();
            p.draw(opacity);
        });

        // Draw faint connection lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const lineOpacity = (1 - dist / 120) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(42, 60%, 55%, ${lineOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ===================================================
   NAVBAR
   =================================================== */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect
    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
}

/* ===================================================
   MOBILE MENU
   =================================================== */

function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const links = menu.querySelectorAll('.mobile-link');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ===================================================
   SCROLL REVEAL
   =================================================== */

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply delay from CSS custom property if present
                const delay = getComputedStyle(entry.target).getPropertyValue('--delay');
                if (delay) {
                    const ms = parseFloat(delay) * 1000;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, ms);
                } else {
                    entry.target.classList.add('revealed');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ===================================================
   COUNT-UP ANIMATION
   =================================================== */

function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.round(startValue + (target - startValue) * eased);

        el.textContent = current.toLocaleString('id-ID');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ===================================================
   SMOOTH SCROLL
   =================================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================================
   BACK TO TOP
   =================================================== */

function initBackToTop() {
    const btn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===================================================
   CONTACT FORM
   =================================================== */

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate submission
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Mengirim...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
            submitBtn.innerHTML = `
                <span>Pesan Terkirim!</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7"/>
                </svg>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #2D6A4F, #40916C)';
            submitBtn.style.borderColor = '#2D6A4F';

            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
            }, 3000);
        }, 1500);
    });
}

/* ===================================================
   PARALLAX FLOATING ORBS (Background Depth Effect)
   =================================================== */

function initParallaxOrbs() {
    // Create floating orbs for depth
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.style.cssText = `
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            background: radial-gradient(circle, rgba(212, 175, 55, ${0.02 + Math.random() * 0.04}), transparent 70%);
            width: ${100 + Math.random() * 300}px;
            height: ${100 + Math.random() * 300}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: orb-float-${i} ${15 + Math.random() * 20}s ease-in-out infinite;
        `;
        hero.appendChild(orb);

        // Inject keyframes
        const style = document.createElement('style');
        const xRange = 20 + Math.random() * 40;
        const yRange = 20 + Math.random() * 40;
        style.textContent = `
            @keyframes orb-float-${i} {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(${xRange}px, -${yRange}px); }
                50% { transform: translate(-${xRange / 2}px, ${yRange}px); }
                75% { transform: translate(${xRange / 3}px, -${yRange / 2}px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Mouse parallax for hero
    if (window.innerWidth > 768) {
        const heroContent = document.querySelector('.hero-content');
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            if (heroContent) {
                heroContent.style.transform = `translate(${x * 5}px, ${y * 3}px)`;
            }
        });
    }
}

/* ===================================================
   MAGNETIC CURSOR EFFECT ON BUTTONS (Desktop only)
   =================================================== */

if (window.innerWidth > 768) {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}
