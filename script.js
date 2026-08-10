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

  // --- Analytics helpers (GA4) ---
  const track = (eventName, params = {}) => {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params);
  };

  const linkLabel = (el) =>
    (el.getAttribute('aria-label') || el.textContent || el.href || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);

  // PDF download
  document.querySelectorAll('a[download], a.btn-pdf').forEach(link => {
    link.addEventListener('click', () => {
      track('pdf_download', {
        file_name: link.getAttribute('download') || 'resume.pdf',
        link_url: link.href,
      });
    });
  });

  // Outbound / mailto / internal CTA clicks
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;

      if (href.startsWith('mailto:')) {
        track('contact_click', {
          method: 'email',
          link_url: href,
        });
        return;
      }

      // Skip PDF (already tracked above)
      if (link.hasAttribute('download') || link.classList.contains('btn-pdf')) return;

      try {
        const url = new URL(href, window.location.origin);
        const isOutbound = url.origin !== window.location.origin;
        if (!isOutbound) {
          // In-page CTA (e.g. Get in Touch → #contact is handled by hash skip;
          // same-origin non-hash links if any)
          return;
        }

        let category = 'outbound';
        if (url.hostname.includes('github.com')) category = 'github';
        else if (url.hostname.includes('linkedin.com')) category = 'linkedin';
        else if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) category = 'youtube';
        else if (url.hostname.includes('sessionize.com')) category = 'sessionize';
        else if (url.hostname.includes('swiftpublished.in')) category = 'article';
        else if (url.hostname.includes('medium.com')) category = 'medium';

        track('outbound_click', {
          link_category: category,
          link_text: linkLabel(link),
          link_url: url.href,
        });
      } catch (_) {
        // ignore malformed hrefs
      }
    });
  });

  // Primary CTAs (hash links that matter)
  document.querySelectorAll('.btn-primary, .btn-ghost, .link-more').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      track('cta_click', {
        link_text: linkLabel(link),
        link_url: href,
      });
    });
  });

});
