document.addEventListener('DOMContentLoaded', () => {

  // Navbar active link highlight on scroll
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], footer[id]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      navLinksEl.classList.toggle('open');
    });
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinksEl.classList.remove('open'));
    });
  }

});
