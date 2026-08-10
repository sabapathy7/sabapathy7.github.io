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

  // Download PDF — GA4 recommended event: file_download
  // (also fired via inline onclick on #downloadPdf as a backup)
  const pdfBtn = document.getElementById('downloadPdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
      track('file_download', {
        file_name: pdfBtn.getAttribute('download') || 'Kanagasabapathy_Rajkumar_iOSDeveloper.pdf',
        file_extension: 'pdf',
        link_text: 'Download PDF',
        link_url: pdfBtn.href,
      });
      track('pdf_download', {
        file_name: pdfBtn.getAttribute('download') || 'Kanagasabapathy_Rajkumar_iOSDeveloper.pdf',
        link_url: pdfBtn.href,
      });
    });
  }

  // Section nav + CTA clicks (data-ga tags)
  document.querySelectorAll('[data-ga]').forEach(el => {
    if (el.id === 'downloadPdf') return; // handled above
    el.addEventListener('click', () => {
      const eventName = el.getAttribute('data-ga');
      track(eventName, {
        section: el.getAttribute('data-ga-section') || undefined,
        link_text: linkLabel(el),
        link_url: el.getAttribute('href') || undefined,
      });
    });
  });

  // Section views — once per section when it enters the viewport
  // (includes in-page blocks like #experience that are not <section> tags)
  const viewTargets = document.querySelectorAll(
    '#hero, #about, #experience, #skills, #packages, #talks, #articles, #contact'
  );
  const seenSections = new Set();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (!id || seenSections.has(id)) return;
        seenSections.add(id);
        track('section_view', { section: id });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    viewTargets.forEach(section => observer.observe(section));
  }

  // Outbound / mailto clicks
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      if (link.id === 'downloadPdf' || link.classList.contains('btn-pdf')) return;

      if (href.startsWith('mailto:')) {
        track('contact_click', {
          method: 'email',
          link_url: href,
        });
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) return;

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

});
