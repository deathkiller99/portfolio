# CLAUDE.md

Guidance for Claude Code (or any future contributor) working in this repository.

## Project overview

A personal portfolio site for **Sai Harsha Malla**, aimed at recruiters. It's a
**multi-page static site** with four pages — **Home**, **Work**, **About**,
**Contact** — linked by a fixed top nav. Work's core job is to showcase three
categories of projects (**Work**, **School**, **Personal**); About holds
credentials (education, work experience), an intro, institution logos, and
personal interests; Contact holds the three contact methods. No backend, no
build step, no framework.

## Tech stack & hosting

- Plain HTML / CSS / JavaScript. No bundler, no package.json, no dependencies.
- Font is loaded from Google Fonts (Space Grotesk) via a `<link>` in each page's `<head>`.
- Deploys to **Vercel** as a static site — pushing to the connected Git repo is
  the entire deploy process. Do not introduce a build step (e.g. a framework,
  a bundler) without discussing it first; the whole point of this stack is
  zero-friction editing and deployment.
- Open any `.html` file directly in a browser (or serve the folder with any
  static file server) to preview changes locally. No install step is required.

## File structure

```
Portfolio/
├── index.html              # Home: hero (no photo), role/ESSEC highlight, CTA to Work
├── work.html                # Work: "What I've been working on lately" + project accordion
├── about.html                 # About: photo, intro, experience/education (with logos), hobbies
├── contact.html                # Contact: headline + contact rows (no footer on this page)
├── css/
│   └── styles.css          # design tokens + all styling, shared across all four pages
├── js/
│   ├── projects-data.js     # project content (edit this to add/change projects) — only used by work.html
│   └── script.js            # rendering, accordion, scroll-reveal — logic only, included on every page
├── assets/
│   ├── photo.jpg
│   └── logos/               # institution logos used on About (essec.jpg, growthx.webp, etc.)
└── CLAUDE.md
```

Keep this separation: **content lives in `projects-data.js` and directly in
each page's markup; logic lives in `script.js`; visual styling lives in
`styles.css`.** Don't hardcode project content into `script.js`, and don't
inline styles into the HTML.

`script.js` is included on every page but only acts on elements that exist —
`renderCategory()` no-ops if its panel isn't on the page, `initAccordion()`
and `initScrollReveal()` iterate over whatever `.category`/`.reveal` elements
are present (zero or more). This is why the same unmodified script works
across Home/Work/About/Contact without per-page branching.

### Nav is duplicated across all four pages — keep it in sync

There's no templating, so the nav block is copy-pasted into each `.html`
file, differing only in which link carries `class="nav-link is-active"`.
**If you change the nav (add a page, rename a link, restyle it), you must
edit all four files identically.** This was an explicit tradeoff — the
alternative (fetching a shared nav partial via JS) would break "open the
HTML file directly, no server needed," which was worth keeping.

## Design system

All visual tokens are CSS custom properties defined once at the top of
`css/styles.css` (`:root`). When changing the look of the site, change the
token value — don't hardcode a new color/spacing value at the point of use.

- **Theme**: dark. Background `#0a0b0f`, elevated surfaces `#13151c`.
- **Accent**: a single electric blue, `#3b82f6` (`--accent`), used sparingly
  for headings, tags, hover states, the accordion icon, the active nav link,
  and the CTA button. Do not introduce a second accent color.
- **Type**: Space Grotesk (sharp, geometric sans) for everything — headings
  and body. No serif, no monospace. Max usable weight is 700 (Space Grotesk
  has no 800) — don't request a heavier weight.
- **Spacing**: an 8px-based scale (`--space-1` through `--space-8`). Use these
  variables instead of arbitrary pixel values.
- **Motion**: subtle only. Hover states (card lift + soft accent glow, footer
  link underline, contact-row lift, CTA button lift), a fade/slide on the
  project-category accordion, a staggered fade-up on project cards when a
  category opens, and a soft scroll-reveal (`.reveal` class, applied to the
  hero, `.category` boxes, and the About-page sections, driven by
  `initScrollReveal()` in `script.js`) as they enter the viewport. Do not add
  attention-grabbing or decorative animation — it should read as restrained
  and professional, not flashy.
- **Ambient background**: a fixed, very low-opacity radial-gradient glow
  (`body::before`) plus a faint grain texture (`body::after`, an SVG
  turbulence data URI at ~3.5% opacity) sit behind all content on every page.
  These are deliberately subtle — if either becomes visually noticeable
  rather than atmospheric, that's a bug, not a feature to lean into further.
- **Nav**: fixed to the top of the viewport on every page (`--nav-height:
  72px`), translucent + blurred background, wordmark ("Portfolio", in
  accent color) on the left, Home/Work/About/Contact links on the right,
  active page indicated by an accent underline. Because it's fixed, every
  page's main content column (`.main`) carries top padding of
  `calc(var(--nav-height) + var(--space-7))` to clear it — don't remove that
  padding when touching `.main`.
- **Layout**: no sidebar anymore (removed when the site moved from
  single-page to multi-page). Every page is a single centered content column,
  `max-width: var(--content-max-width)` (currently `1240px`), under the
  fixed nav. This only widens the *layout* (grids like project cards,
  About's two-column experience/education, hobby cards) — text elements
  (`.headline`, `.about-intro-text p`, `.contact-headline`) keep their own
  character-based `max-width` so paragraph line length stays readable
  regardless of this value.
- **Sticky footer**: `body` is a flex column (`min-height: 100vh`), `.main`
  carries `flex: 1 0 auto`, and `.site-footer` has `flex-shrink: 0`. This
  keeps the footer pinned to the bottom of the viewport on short pages
  (Home, About, Contact) instead of floating partway up on tall screens —
  don't change `.main`'s `flex` or `body`'s `display: flex` without
  preserving this behavior.
- **Home has no photo.** It was removed by explicit request; the hero is
  currently a single text column (eyebrow, name, headline, role-highlight
  box). This is an interim state — the site owner wasn't sure what, if
  anything, should fill that visual space, so don't assume the current
  single-column hero is the final call; a follow-up design pass may add
  something back (that's a design decision for the owner, not one to make
  unilaterally).

## Content conventions

- **Headline/positioning statement** (currently: *"A curious and analytical
  operator looking to own problems, solve them, and make a positive
  impact."*) is deliberately **generic and values-driven** — it does not name
  an industry (e.g. fintech, payments) or a job function. This was an
  explicit choice made with the site owner. If asked to revise the headline,
  preserve that constraint unless told otherwise.
- Credential entries (Experience, Education — on the About page) show **no
  dates** and only two lines: the organization/institution name (bold), then
  the role or degree below it. No extra detail line. Order is
  most-recent-first within each section, and Experience is listed before
  Education. Each entry also carries a small logo tile (`.timeline-logo`,
  a real institution logo image) to its left.
- Project blurbs should be short (1–2 sentences) — the card is a teaser, not
  the full case study.
- Tone throughout: crisp, professional, no filler adjectives.
- Never invent facts about the site owner (hobbies, project details, bio
  copy) to fill a gap — use an explicit bracketed placeholder (e.g. `[Add
  hobby/interest]`) instead, so it's obvious what still needs real content.

## Project data model

Projects are plain JS objects in `js/projects-data.js`, grouped into three
arrays: `window.PROJECTS.work`, `.school`, `.personal`. Only `work.html`
includes this file and renders them. Shape:

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

Every card gets a thumbnail (`renderThumb()` in `script.js`): a `canva`-type
project's embed renders directly as the thumbnail; anything else gets a
generated placeholder tile (a large faint letter, taken from the project's
first tag). There's no `image` field in the data model yet — if you want a
real screenshot on a text-type project, that's the place to extend the shape
and `renderThumb()` together.

**To update credentials (education/work experience):** edit the `<li
class="timeline-item">` entries directly in `about.html`, inside
`.about-columns`. Each item is `.timeline-logo` (small logo/monogram tile),
then a `.timeline-text` wrapper containing `.timeline-org` (bold) and
`.timeline-title` (role/degree, below) — no dates. There is no data file for
these — they're simple enough to stay as markup.

**About the `.timeline-logo` tiles:** each renders a real logo image from
`assets/logos/` (`essec.jpg`, `growthx.webp`, `icici-lombard.jpg`,
`manipal.jpg`, `worldline.webp`). The tile background is intentionally
white (`#fff`), not the dark theme color, because the source logos mix
solid-color and transparent/white backgrounds — a white chip keeps every
logo legible regardless. There's no padding inside the tile — logos render
at full size via `object-fit: contain` so they fill the frame, in their real
colors at all times (grayscale/dimming by default was tried and explicitly
rejected). Hovering the row (`.timeline-item:hover`) lifts the tile
slightly and adds a soft accent-blue glow — this is the site's one
"highlight" treatment for the logo strip; keep it to this single subtle
effect rather than adding more (per an explicit "classy, not gimmicky"
request). To add a new institution logo, drop the image in
`assets/logos/` and add an `<img>` inside a `.timeline-logo` div, same
pattern as the existing entries.

**To update contact info:** edit the links inside `<footer
class="site-footer">` (present on Home, Work, About — **not** Contact,
which has its own dedicated `.contact-row` list instead) **and** the
`.contact-row` entries in `contact.html`. The same three values appear in
both places; update them together.

## Current state / placeholders

- All six projects in `js/projects-data.js` (2 per category) are
  **placeholders** — titles, blurbs, and Canva embed URLs need to be replaced
  with real content.
- **About page now has real content throughout**: the two intro paragraphs,
  Experience/Education (with real institution logos), and the three "Outside
  of Work" hobby cards (Running, Vibe Coding, Cooking — each with a small
  outline SVG icon via `.hobby-icon`, inline in the markup, not an icon
  library) are all real. The page's *visual design* may still get a
  dedicated pass later, but there's no longer placeholder copy to swap in.
  In the intro, "payments and fintech" is deliberately highlighted in accent
  color (`.text-accent`) to signal the industry focus — keep this the one
  inline text highlight on the page rather than adding more.
- Real content wired in: name, headline, role/ESSEC highlight on Home, full
  About page (intro, experience/education with logos, hobbies), contact
  links (LinkedIn, phone, email) on the footer and the Contact page, and the
  About-page photo (`assets/photo.jpg`). To swap the photo, replace
  `assets/photo.jpg` (keep it roughly square, ~220×220 or larger — it's
  cropped with `object-fit: cover`).
- There is no resume/CV download button — this was an explicit choice (the
  site itself is meant to stand in for the resume).

## A note on `.superpowers/`

This directory contains tooling state from prior Claude Code sessions,
including leftover mockup artifacts from an earlier, unrelated brainstorming
session (different positioning — "GTM & Product Strategy, Payments" — and a
different layout, with no sidebar or photo). **That prior direction was
explicitly discarded** in favor of the design documented above. Don't treat
anything under `.superpowers/` as current project content or direction.
