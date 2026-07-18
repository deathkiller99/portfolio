(function () {
  'use strict';

  function renderCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    card.appendChild(title);

    const blurb = document.createElement('p');
    blurb.className = 'project-blurb';
    blurb.textContent = project.blurb;
    card.appendChild(blurb);

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

    if (project.detail) {
      if (project.detail.type === 'canva') {
        const embed = document.createElement('div');
        embed.className = 'project-embed';
        const iframe = document.createElement('iframe');
        iframe.src = project.detail.embedUrl;
        iframe.loading = 'lazy';
        iframe.allowFullscreen = true;
        embed.appendChild(iframe);
        card.appendChild(embed);
      } else if (project.detail.type === 'text') {
        const detailText = document.createElement('p');
        detailText.className = 'project-blurb';
        detailText.textContent = project.detail.content;
        card.appendChild(detailText);
      }
    }

    return card;
  }

  function renderCategory(name) {
    const panel = document.querySelector('[data-panel="' + name + '"]');
    if (!panel) return;
    const projects = (window.PROJECTS && window.PROJECTS[name]) || [];
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
    const hero = document.getElementById('hero');
    if (!hero || !('IntersectionObserver' in window)) {
      if (hero) hero.classList.add('in-view');
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
    observer.observe(hero);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCategory('work');
    renderCategory('school');
    renderCategory('personal');
    initAccordion();
    initScrollReveal();
  });
})();
