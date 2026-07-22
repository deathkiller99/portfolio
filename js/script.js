(function () {
  'use strict';

  // Hand-drawn outline icons (same stroke style as the About-page hobby
  // icons) used as project thumbnails instead of the generic letter glyph.
  // Add a new key here, then reference it via `icon: '<key>'` on a project.
  var ICONS = {
    growth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>',
    pos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="5" rx="0.5"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="8" y1="18" x2="12" y2="18"/></svg>'
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
    const isPdf = project.detail && project.detail.type === 'pdf';

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

    card.appendChild(renderThumb(project));

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    card.appendChild(title);

    if (project.blurb) {
      const blurb = document.createElement('p');
      blurb.className = 'project-blurb';
      blurb.textContent = project.blurb;
      card.appendChild(blurb);
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
      card.appendChild(tagList);
    }

    if (project.detail && project.detail.type === 'text') {
      const detailText = document.createElement('p');
      detailText.className = 'project-blurb';
      detailText.textContent = project.detail.content;
      card.appendChild(detailText);
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
    initScrollReveal();
  });
})();
