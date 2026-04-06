document.addEventListener('DOMContentLoaded', () => {

  // ===== Cursor Glow =====
  const glow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  });

  // ===== Navbar Scroll =====
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .conf-spotlight');
  const navLinks = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile Nav Toggle =====
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ===== Scroll Reveal with staggered delay =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay');
        const ms = delay ? parseInt(delay) * 120 : 0;
        setTimeout(() => entry.target.classList.add('visible'), ms);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== Counter Animation =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    let current = 0;
    const step = target / (1500 / 16);
    const tick = () => {
      current += step;
      if (current >= target) { el.textContent = target; return; }
      el.textContent = Math.floor(current);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ===== Hero Particles =====
  const particlesContainer = document.getElementById('heroParticles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    Object.assign(p.style, {
      position: 'absolute', width: size + 'px', height: size + 'px', borderRadius: '50%',
      background: Math.random() > 0.5 ? '#f05138' : '#0071e3',
      left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
      opacity: Math.random() * 0.3 + 0.05,
      animation: `float ${Math.random() * 10 + 10}s ${Math.random() * 6}s infinite ease-in-out`,
      pointerEvents: 'none'
    });
    particlesContainer.appendChild(p);
  }

  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(20px, -30px) scale(1.1); }
      50% { transform: translate(-15px, -50px) scale(0.9); }
      75% { transform: translate(25px, -20px) scale(1.05); }
    }
  `;
  document.head.appendChild(floatStyle);

  // ===== Tilt Effect on Cards =====
  document.querySelectorAll('.community-card, .social-card, .ms-card, .talk-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -6;
      const rotateY = (x - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ===== Typing Effect =====
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--accent)';
    let i = 0;
    const type = () => {
      if (i < text.length) { heroTitle.textContent += text.charAt(i); i++; setTimeout(type, 60); }
      else { setTimeout(() => { heroTitle.style.borderRight = 'none'; }, 1500); }
    };
    setTimeout(type, 800);
  }

  // ===== Chip Tooltips =====
  const tooltip = document.getElementById('chipTooltip');
  document.querySelectorAll('.chip[data-tip]').forEach(chip => {
    chip.addEventListener('mouseenter', (e) => {
      tooltip.textContent = chip.getAttribute('data-tip');
      tooltip.classList.add('show');
    });
    chip.addEventListener('mousemove', (e) => {
      tooltip.style.left = e.clientX + 12 + 'px';
      tooltip.style.top = e.clientY - 36 + 'px';
    });
    chip.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
    chip.addEventListener('click', () => {
      chip.style.transform = 'translateY(-3px) scale(1.05)';
      setTimeout(() => { chip.style.transform = ''; }, 300);
    });
  });

});
