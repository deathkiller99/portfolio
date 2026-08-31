(function () {
  'use strict';

  // Hand-drawn outline icons (same stroke style as the About-page hobby
  // icons) used as project thumbnails instead of the generic letter glyph.
  // Add a new key here, then reference it via `icon: '<key>'` on a project.
  var ICONS = {
    growth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>',
    pos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="5" rx="0.5"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="8" y1="18" x2="12" y2="18"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="12" width="3" height="8"/><rect x="12" y="8" width="3" height="12"/><rect x="18" y="4" width="3" height="16"/></svg>'
  };

  function renderThumb(project) {
    const thumb = document.createElement('div');

    if (project.detail && project.detail.type === 'pdf') {
      thumb.className = 'project-thumb';
      const iframe = document.createElement('iframe');
      // #toolbar=0&navpanes=0 trims the native PDF viewer chrome for a
      // cleaner in-card preview. Rendering quality varies by browser/OS —
      // some mobile browsers may fall back to a blank frame or a download —
      // which is why the whole card is also a link straight to the PDF
      // (see renderCard), not just this inline preview.
      iframe.src = project.detail.pdfUrl + '#toolbar=0&navpanes=0';
      iframe.loading = 'lazy';
      thumb.appendChild(iframe);
    } else if (project.icon && ICONS[project.icon]) {
      thumb.className = 'project-thumb project-thumb-placeholder';
      thumb.innerHTML = ICONS[project.icon];
      thumb.firstElementChild.classList.add('project-thumb-icon');
    } else {
      // No icon or real screenshot yet — show a generated placeholder tile
      // (a project's own tag initial) instead of leaving the card bare.
      thumb.className = 'project-thumb project-thumb-placeholder';
      const glyph = document.createElement('span');
      glyph.className = 'project-thumb-glyph';
      const source = (project.tags && project.tags[0]) || project.title;
      glyph.textContent = source.charAt(0).toUpperCase();
      thumb.appendChild(glyph);
    }

    return thumb;
  }

  function renderCard(project) {
    const detailType = project.detail && project.detail.type;
    const isPdf = detailType === 'pdf';
    const isLink = detailType === 'link';

    // PDF projects are a single whole-card link so clicking anywhere
    // (including the preview) opens the file — see the pointer-events
    // rule on .project-thumb iframe that makes this work.
    const card = document.createElement(isPdf ? 'a' : 'article');
    card.className = 'project-card';
    if (isPdf) {
      card.href = project.detail.pdfUrl;
      card.target = '_blank';
      card.rel = 'noopener';
    }

    // `link` projects have two destinations (an external URL and a
    // download), so the card itself can't be one big <a> like the PDF
    // case — a download <a> nested inside it would be invalid HTML.
    // Instead the thumbnail/title/tags nest inside their own inner link,
    // and the download button is appended to `card` as a sibling below.
    let content = card;
    if (isLink) {
      content = document.createElement('a');
      content.className = 'project-card-link';
      content.href = project.detail.url;
      content.target = '_blank';
      content.rel = 'noopener';
      card.appendChild(content);
    }

    content.appendChild(renderThumb(project));

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    content.appendChild(title);

    if (project.blurb) {
      const blurb = document.createElement('p');
      blurb.className = 'project-blurb';
      blurb.textContent = project.blurb;
      content.appendChild(blurb);
    }

    if (project.tags && project.tags.length) {
      const tagList = document.createElement('div');
      tagList.className = 'project-tags';
      project.tags.forEach(function (tag) {
        const pill = document.createElement('span');
        pill.className = 'project-tag';
        pill.textContent = tag;
        tagList.appendChild(pill);
      });
      content.appendChild(tagList);
    }

    if (detailType === 'text') {
      const detailText = document.createElement('p');
      detailText.className = 'project-blurb';
      detailText.textContent = project.detail.content;
      content.appendChild(detailText);
    }

    if (isLink && project.detail.downloadUrl) {
      const download = document.createElement('a');
      download.className = 'project-download-btn btn';
      download.href = project.detail.downloadUrl;
      download.download = '';
      download.rel = 'noopener';
      download.textContent = project.detail.downloadLabel || 'Download file';
      card.appendChild(download);
    }

    return card;
  }

  function renderCategory(name) {
    const panel = document.querySelector('[data-panel="' + name + '"]');
    if (!panel) return;
    const projects = (window.PROJECTS && window.PROJECTS[name]) || [];

    if (!projects.length) {
      const empty = document.createElement('p');
      empty.className = 'category-empty';
      empty.textContent = 'Some great work coming soon!';
      panel.appendChild(empty);
      return;
    }

    projects.forEach(function (project) {
      panel.appendChild(renderCard(project));
    });
  }

  function initAccordion() {
    const categories = document.querySelectorAll('.category');
    categories.forEach(function (category) {
      const toggle = category.querySelector('.category-toggle');
      const panel = category.querySelector('.category-panel');

      toggle.addEventListener('click', function () {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          toggle.setAttribute('aria-expanded', 'false');
          panel.classList.remove('is-open');
          panel.addEventListener('transitionend', function handler() {
            panel.hidden = true;
            panel.removeEventListener('transitionend', handler);
          });
        } else {
          panel.hidden = false;
          // Force reflow so the transition runs after unhiding.
          void panel.offsetHeight;
          toggle.setAttribute('aria-expanded', 'true');
          panel.classList.add('is-open');
        }
      });
    });
  }

  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    function currentTheme() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    // The switch's visual thumb position is pure CSS, keyed off the same
    // [data-theme] attribute (see styles.css) — this only keeps the
    // role="switch" aria-checked state in sync for assistive tech.
    function syncAria() {
      toggle.setAttribute('aria-checked', currentTheme() === 'dark' ? 'true' : 'false');
    }

    syncAria();

    toggle.addEventListener('click', function () {
      const next = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncAria();
    });
  }

  function initPageBeams() {
    const canvas = document.querySelector('.page-beams');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const BEAM_COUNT = 10;
    let beams = [];
    let vw = 0;
    let vh = 0;
    let rafId = null;

    function isDarkTheme() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function createBeam(width, height) {
      return {
        x: Math.random() * width,
        y: height + Math.random() * height * 0.4,
        width: 70 + Math.random() * 90,
        length: height * 1.6,
        speed: 0.12 + Math.random() * 0.18,
        opacity: 0.05 + Math.random() * 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.006 + Math.random() * 0.01
      };
    }

    function resize() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      canvas.style.width = vw + 'px';
      canvas.style.height = vh + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      beams = Array.from({ length: BEAM_COUNT }, function () {
        return createBeam(vw, vh);
      });
    }

    function drawBeam(beam) {
      const pulsing = beam.opacity * (0.75 + Math.sin(beam.pulse) * 0.25);
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((-12 * Math.PI) / 180);
      const gradient = ctx.createLinearGradient(0, 0, 0, -beam.length);
      gradient.addColorStop(0, 'hsla(217, 91%, 60%, 0)');
      gradient.addColorStop(0.3, 'hsla(217, 91%, 60%, ' + pulsing + ')');
      gradient.addColorStop(0.7, 'hsla(217, 91%, 60%, ' + pulsing + ')');
      gradient.addColorStop(1, 'hsla(217, 91%, 60%, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, -beam.length, beam.width, beam.length);
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, vw, vh);
      ctx.filter = 'blur(30px)';
      beams.forEach(function (beam) {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < 0) {
          Object.assign(beam, createBeam(vw, vh));
          beam.y = vh + 40;
        }
        drawBeam(beam);
      });
      rafId = requestAnimationFrame(animate);
    }

    function start() {
      if (rafId !== null) return;
      animate();
    }

    function stop() {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    resize();
    if (isDarkTheme()) start();
    window.addEventListener('resize', resize);

    // The canvas is display:none in light theme (see styles.css) — stop
    // the animation loop entirely rather than drawing to a hidden canvas
    // 60 times a second, and resume it if the theme switches back.
    new MutationObserver(function () {
      if (isDarkTheme()) start(); else stop();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCategory('work');
    renderCategory('school');
    renderCategory('personal');
    initAccordion();
    initThemeToggle();
    initPageBeams();
    initScrollReveal();
  });
})();
