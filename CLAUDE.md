# CLAUDE.md

Guidance for Claude Code (or any future contributor) working in this repository.

## Project overview

A personal portfolio site for **Sai Harsha Malla**, aimed at recruiters. Its core
job is to showcase three categories of projects — **Work**, **School**, and
**Personal** — alongside a credentials sidebar (education, work history) and
contact links. This is a static site: no backend, no build step, no framework.

## Tech stack & hosting

- Plain HTML / CSS / JavaScript. No bundler, no package.json, no dependencies.
- Font is loaded from Google Fonts (Inter) via a `<link>` in `index.html`.
- Deploys to **Vercel** as a static site — pushing to the connected Git repo is
  the entire deploy process. Do not introduce a build step (e.g. a framework,
  a bundler) without discussing it first; the whole point of this stack is
  zero-friction editing and deployment.
- Open `index.html` directly in a browser (or serve the folder with any static
  file server) to preview changes locally. No install step is required.

## File structure

```
Portfolio/
├── index.html              # all page markup
├── css/
│   └── styles.css          # design tokens + all styling
├── js/
│   ├── projects-data.js     # project content (edit this to add/change projects)
│   └── script.js            # rendering, accordion, scroll-reveal — logic only
├── assets/
│   └── photo-placeholder.svg
└── CLAUDE.md
```

Keep this separation: **content lives in `projects-data.js` and in the
credential markup in `index.html`; logic lives in `script.js`; visual styling
lives in `styles.css`.** Don't hardcode project content into `script.js`, and
don't inline styles into `index.html`.

## Design system

All visual tokens are CSS custom properties defined once at the top of
`css/styles.css` (`:root`). When changing the look of the site, change the
token value — don't hardcode a new color/spacing value at the point of use.

- **Theme**: dark. Background `#0a0b0f`, elevated surfaces `#13151c`.
- **Accent**: a single electric blue, `#3b82f6` (`--accent`), used sparingly
  for headings, tags, hover states, and the icon in the accordion toggle.
  Do not introduce a second accent color.
- **Type**: Inter (geometric sans) for everything — headings and body. No
  serif, no monospace.
- **Spacing**: an 8px-based scale (`--space-1` through `--space-8`). Use these
  variables instead of arbitrary pixel values.
- **Motion**: subtle only. Hover states, a fade/slide on the project-category
  accordion, and a soft scroll-reveal on the hero section. Do not add
  attention-grabbing or decorative animation — it should read as restrained
  and professional, not flashy.
- **Layout**: a two-column grid — a sticky left sidebar (`--sidebar-width:
  280px`) for credentials, and a main content column for the hero and
  projects. Below `800px` viewport width, the sidebar stacks above the main
  content (see the media query at the bottom of `styles.css`).

## Content conventions

- **Headline/positioning statement** (currently: *"A curious and analytical
  operator looking to own problems, solve them, and make a positive
  impact."*) is deliberately **generic and values-driven** — it does not name
  an industry (e.g. fintech, payments) or a job function. This was an
  explicit choice made with the site owner. If asked to revise the headline,
  preserve that constraint unless told otherwise.
- Sidebar credentials (Education, Work History) are ordered **most recent
  first**.
- Project blurbs should be short (1–2 sentences) — the card is a teaser, not
  the full case study.
- Tone throughout: crisp, professional, no filler adjectives.

## Project data model

Projects are plain JS objects in `js/projects-data.js`, grouped into three
arrays: `window.PROJECTS.work`, `.school`, `.personal`. Shape:

```js
{
  title: string,
  blurb: string,        // 1-2 sentence summary shown on the card
  tags: string[],        // short labels, rendered as pills
  detail: {
    type: 'text',
    content: string      // shown directly on the card
  } | {
    type: 'canva',
    embedUrl: string     // Canva "Share → Embed" URL, rendered in an iframe
  }
}
```

`js/script.js` renders these into the DOM on `DOMContentLoaded` — it has no
knowledge of specific projects, only of this shape. This means:

**To add a new project:** open `js/projects-data.js`, append a new object to
the correct array (`work`, `school`, or `personal`), save. Nothing else needs
to change.

**To add a Canva-embedded project:** in Canva, use *Share → Embed* to get the
embed URL, and set `detail: { type: 'canva', embedUrl: '<that URL>' }`.

**To update credentials (education/work history):** edit the `<li
class="timeline-item">` entries directly in `index.html`, inside
`.sidebar-section`. There is no data file for these — they're simple enough
to stay as markup. Keep entries ordered most-recent-first.

**To update contact info:** edit the three links inside `<footer
class="site-footer">` in `index.html`.

## Current state / placeholders

- All six projects in `js/projects-data.js` (2 per category) are
  **placeholders** — titles, blurbs, and Canva embed URLs need to be replaced
  with real content.
- The hero photo (`assets/photo-placeholder.svg`) is a placeholder silhouette.
  Replace it with a real headshot (update the `src` in `index.html`'s
  `.hero-photo img`; keep it roughly square, ~220×220 or larger).
- Real content already wired in: name, headline, education, work history, and
  footer contact links (LinkedIn, phone, email) all reflect real data.
- There is no resume/CV download button — this was an explicit choice (the
  site itself is meant to stand in for the resume).

## A note on `.superpowers/`

This directory contains tooling state from prior Claude Code sessions,
including leftover mockup artifacts from an earlier, unrelated brainstorming
session (different positioning — "GTM & Product Strategy, Payments" — and a
different layout, with no sidebar or photo). **That prior direction was
explicitly discarded** in favor of the design documented above. Don't treat
anything under `.superpowers/` as current project content or direction.
