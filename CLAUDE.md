# CLAUDE.md

Guidance for Claude Code (or any future contributor) working in this repository.

## Project overview

A personal portfolio site for **Sai Harsha Malla**, aimed at recruiters. It's a
**single-page static site** (`index.html`) — **Hero**, **Work**, **About**, and
**Contact** are sections stacked on one page, reached by scrolling rather than
a nav (there is no nav bar). Work's core job is to showcase three categories
of projects (**Work**, **School**, **Personal**); About holds credentials
(education, work experience), an intro, institution logos, and personal
interests; Contact holds the three contact methods. No backend, no build
step, no framework.

The site was originally four separate pages (Home/Work/About/Contact) linked
by a fixed top nav, then converted to this single-page structure. If you see
references to that old shape anywhere outside this file (old notes, etc.),
this document is the current source of truth.

## Tech stack & hosting

- Plain HTML / CSS / JavaScript. No bundler, no package.json, no dependencies.
- Font is loaded from Google Fonts (Space Grotesk) via a `<link>` in the
  page's `<head>`.
- Deploys to **Vercel** as a static site — pushing to the connected Git repo is
  the entire deploy process. Do not introduce a build step (e.g. a framework,
  a bundler) without discussing it first; the whole point of this stack is
  zero-friction editing and deployment.
- Open `index.html` directly in a browser (or serve the folder with any
  static file server) to preview changes locally. No install step is required.
- **`vercel.json`** overrides the `X-Robots-Tag` header to `all` on every
  path. Vercel auto-injects `X-Robots-Tag: noindex` on the default
  `*.vercel.app` domain (not custom domains) to keep it out of search
  engines — but that also caused LinkedIn's link-preview/"Featured" flow to
  reject the URL as invalid. Don't remove this override while the site is
  still on a `*.vercel.app` domain; if a custom domain is added later,
  it's fine to check whether the override is still needed (custom domains
  don't get the auto-noindex).
- **Live site**: https://portfolio-harsha9987.vercel.app (the stable
  project-scoped alias — use this one in profiles/links, not the
  per-deploy `portfolio-<hash>-harsha9987.vercel.app` URLs printed by each
  `vercel --prod` run).
- The page's `<head>` carries Open Graph + Twitter Card meta tags
  (`og:title`, `og:description`, `og:image`, `twitter:card`, etc.), using
  the stable production URL and `assets/photo.jpg` as the preview image. If
  the title/description changes, update these tags alongside `<title>`/the
  description `<meta>` — don't let them drift.

## File structure

```
Portfolio/
├── index.html              # The whole site: Hero → Work → About → Contact
│                            #   sections, floating theme toggle, no nav
├── css/
│   └── styles.css          # design tokens + all styling
├── js/
│   ├── projects-data.js     # project content (edit this to add/change projects) — included by index.html
│   └── script.js            # rendering, accordion, scroll-reveal, ambient
│                            #   beams animation, theme toggle — all page logic
├── assets/
│   ├── photo.jpg            # used once, in the Hero section
│   ├── logos/                # institution logos used in About (essec.jpg, growthx.webp, etc.)
│   └── work/                  # PDFs referenced by pdf-type projects, one subfolder per category:
│       ├── essec-growthx/      #   school-category PDFs
│       ├── worldline/           #   work-category PDFs
│       └── personal/             #   personal-category PDFs
├── vercel.json               # X-Robots-Tag override (see Tech stack & hosting)
└── CLAUDE.md
```

Keep this separation: **content lives in `projects-data.js` and directly in
`index.html`'s markup; logic lives in `script.js`; visual styling lives in
`styles.css`.** Don't hardcode project content into `script.js`, and don't
inline styles into the HTML.

## Single-page structure — sections, not pages

There's no nav and no other HTML files to navigate to — everything is one
scroll down `index.html`:

1. **Hero** (`<section id="hero">`) — name, headline, current role, and a
   "View my work →" CTA that's a plain `href="#work"` anchor link (smooth
   scrolling comes from `html { scroll-behavior: smooth; }` in `styles.css`
   — no JS involved). A photo sits to its right on desktop; on mobile the
   layout stacks with the **text first, photo second** (`flex-direction:
   column`, not `column-reverse` — don't flip that back, it was a deliberate
   fix so identity/positioning text leads on mobile too).
2. **Work** (`<section id="work">`) — the project accordion.
3. **About** (`<section id="about" class="about-section">`, wrapping three
   inner sections — intro, Experience/Education columns, hobby cards).
4. **Contact** (`<section id="contact">`).

**Hero and Work are both `min-height: 100vh`, content top-aligned** (not
vertically centered — that was tried and made both sections feel like mostly
empty space). This does two things: it keeps Work off-screen until the
visitor scrolls (or clicks the Hero CTA), and it guarantees that when the CTA
lands you on `#work`, About can't peek in at the bottom of the screen — the
Work section's box is always at least one full viewport tall. If you change
either section's content height substantially, re-check that landing on
`#work` still shows *only* Work.

**Section boundaries get a divider**, not a nav: `.projects` and
`.about-section` (the old page boundaries) get `border-top: 1px solid
var(--border)` plus generous `padding-top`/`margin-top`. `.about-section`'s
own top spacing was deliberately kept small (`padding-top: var(--space-6)`,
no extra margin) because Work's forced `min-height: 100vh` already provides
a large gap on its own — stacking a second full `--space-8` gap on top of
that looked excessive. `.contact` has no `border-top` (removed by request —
no divider between "Outside of Work" and Contact).

The floating **theme toggle** (`.theme-toggle-float`, fixed top-right) is
the only persistent UI chrome on the page — there's deliberately no
section-jump control; one was added and then removed because a taller
control panel ended up overlapping the Hero photo and the Work accordion's
icons at various scroll positions. If a "jump to section" affordance is
wanted again, keep it small enough not to repeat that.

`script.js` has no per-page branching (there's only one page) — it just
queries for elements and no-ops if something isn't present (`renderCategory`
returns early if its panel is missing, `initAccordion`/`initScrollReveal`
iterate over whatever `.category`/`.reveal` elements exist).

### The inline theme-detection script

`index.html`'s `<head>` starts with an inline `<script>` (right after `<meta
charset>`, before everything else) that reads `localStorage.getItem('theme')`,
falls back to `prefers-color-scheme` if nothing's saved, and sets
`data-theme` on `<html>` synchronously. It must stay this early and inline
(not deferred, not moved into `script.js`) so the correct theme is applied
*before* the browser paints — otherwise reloading would flash dark before
switching to a saved light preference.

## Design system

All visual tokens are CSS custom properties defined once at the top of
`css/styles.css` (`:root`). When changing the look of the site, change the
token value — don't hardcode a new color/spacing value at the point of use.

- **Theme**: dark by default (background `#0a0b0f`, elevated surfaces
  `#13151c`), with a **light theme** available via `:root[data-theme="light"]`
  in `styles.css`. Light theme's background is a **warm off-white/cream**
  (`#f4efe4`, elevated `#ece7d9`, hover `#e3dcca`, border `#dcd5c2`) —
  deliberately not pure white; it was `#ffffff` originally, then warmed up
  twice by request (once to cream, then deepened further) partly for its own
  sake and partly so the light-theme ambient blue gradient (below) reads
  with more contrast against it. Both themes share the same token names
  (`--bg`, `--text`, `--accent`, etc.) — the light override block only
  changes the values, so every component that already uses the tokens works
  in both themes automatically with no special-casing. The `.theme-toggle`
  is a sliding switch (a pill track with static sun/moon icons at each end
  and a `.theme-toggle-thumb` that slides between them). It lives alone in a
  `.theme-toggle-float` wrapper (`position: fixed`, top-right corner — see
  "Single-page structure" above for why there's nothing else in that
  corner), wired up by `initThemeToggle()` in `script.js`. It flips the
  `data-theme` attribute on `<html>` and persists the choice to
  `localStorage` (`theme` key); absence of the attribute/stored value means
  dark. **The thumb's position is pure CSS**
  (`:root[data-theme="light"] .theme-toggle-thumb { left: 3px; }`, default
  `left: 29px`) driven directly off the same root attribute the inline head
  script sets before paint — not off JS/`aria-checked` — specifically so
  there's no flash or jump on page load. `initThemeToggle()` only toggles
  the attribute on click and keeps `aria-checked` (`role="switch"`) in sync
  for assistive tech; it does not touch the thumb's visual position.
- **Accent**: a single electric blue — `#3b82f6` in dark, a deeper `#1d4ed8`
  in light (for text-contrast reasons against the light background) — used
  sparingly for headings, tags, hover states, the accordion icon, the CTA
  button, and the theme-toggle thumb. Do not introduce a second accent
  color, and don't add a third color for light mode beyond this one
  deliberate shade adjustment. There's also a `--accent-rgb` token (the same
  color as a bare `R, G, B` component list, e.g. `59, 130, 246`) specifically
  so hover box-shadows can stay theme-correct via `rgba(var(--accent-rgb),
  0.4)` instead of hardcoding the dark theme's hex at the call site — every
  accent-tinted `box-shadow` in the file (`.timeline-item:hover
  .timeline-logo`, `.btn-primary:hover`, `.category:hover`,
  `.project-card:hover`) uses this pattern. Use it for any new glow/shadow
  that should use the accent color, rather than writing a new hardcoded
  `rgba(59, 130, 246, ...)`.
- **Type**: Space Grotesk (sharp, geometric sans) for everything — headings
  and body. No serif, no monospace. Max usable weight is 700 (Space Grotesk
  has no 800) — don't request a heavier weight.
- **Spacing**: an 8px-based scale (`--space-1` through `--space-8`). Use these
  variables instead of arbitrary pixel values.
- **Motion**: mostly subtle — hover states (card lift + soft accent glow,
  contact-row lift, CTA button lift), a fade/slide on the project-category
  accordion, a staggered fade-up on project cards when a category opens, and
  a soft scroll-reveal (`.reveal` class, applied to the hero, `.category`
  boxes, and the About-page sections, driven by `initScrollReveal()` in
  `script.js`) as they enter the viewport. The one more dynamic exception is
  the **ambient beams animation** (see below), which exists specifically
  because a fully static background felt too plain in dark mode — it was
  tuned down significantly from an initial version (single accent hue
  instead of multi-hue, low opacity, slow drift) to stay atmospheric rather
  than decorative. Don't add further attention-grabbing motion beyond these
  two categories.
- **Ambient background**: three layered pieces, all `position: fixed`
  (viewport-relative, not page-height-relative) and `pointer-events: none`,
  all behind real content:
  - `body::before` — a soft radial-gradient glow. In dark theme it's a
    top-right + bottom-left glow using `--accent-soft`. In light theme
    (`:root[data-theme="light"] body::before`) it's fully overridden to two
    washes rising from the **bottom-left and bottom-right corners** toward
    center, using the same accent blue at a custom `rgba(29, 78, 216, 0.15)`
    (stronger than the shared `--accent-soft` token, and a dedicated literal
    rather than changing that token, since `--accent-soft` is also used
    elsewhere for tags/hover backgrounds).
  - `body::after` — a faint grain texture (an SVG turbulence data URI at
    ~3.5% opacity, `mix-blend-mode: overlay`), same in both themes.
  - `.page-beams` — a `<canvas>` driven by `initPageBeams()` in `script.js`:
    ~10 slow-drifting, softly pulsing light beams, single accent hue
    (`hsl(217, 91%, 60%)`), heavily blurred, very low opacity. **Dark theme
    only** — `:root[data-theme="light"] .page-beams { display: none; }`,
    because the fixed blue hue didn't read well against the light
    background. `initPageBeams()` uses a `MutationObserver` on
    `<html>`'s `data-theme` attribute to start/stop the animation loop
    entirely when the theme is toggled, rather than drawing to a hidden
    canvas 60 times a second.

  All three are deliberately subtle — if any of them becomes visually
  noticeable rather than atmospheric, that's a bug, not a feature to lean
  into further.

  **Stacking-context gotcha, learned the hard way:** these all used to have
  `z-index: -1` (the natural instinct for "put this behind everything"), and
  it silently made them **completely invisible** — a real element (or even a
  pseudo-element) with a negative `z-index` inside `body` paints *behind
  `body`'s own solid background color*, not above it, once you also account
  for `body { display: flex }` making its children (`.main`, `.site-footer`)
  behave like positioned/z-indexed content rather than plain flow content.
  The fix that's now in place: `body::before`/`body::after`/`.page-beams`
  all use a small **positive** `z-index` (`0`/`1`), and `.main` and
  `.site-footer` are given an **explicitly higher** `z-index: 2` (with
  `position: relative`) so real content is guaranteed to paint above the
  ambient layers regardless of implicit flex-item/DOM-order stacking rules.
  If you ever add another fixed/absolute decorative layer, use this same
  positive-z-index-plus-explicit-content-z-index pattern — don't reach for
  `-1`, and verify with actual pixel sampling (not just "it looks fine in
  one screenshot") if you're unsure, since this bug is easy to miss in a
  quick visual check.
- **Layout**: no nav to clear anymore — `.main`'s top padding is a plain
  `var(--space-8)` (no `calc()` involving a nav height). Every section is
  part of the same centered content column, `max-width:
  var(--content-max-width)` (currently `1240px`). This only widens the
  *layout* (grids like project cards, About's two-column
  experience/education, hobby cards) — text elements (`.headline`,
  `.about-intro-text p`) keep their own readable measure; `.contact-headline`
  is forced to a single line only above a `1100px` min-width breakpoint
  (below that it wraps normally, to avoid horizontal overflow at in-between
  viewport widths).
- **Sticky footer**: `body` is a flex column (`min-height: 100vh`), `.main`
  carries `flex: 1 0 auto`, and `.site-footer` has `flex-shrink: 0`. This
  matters less now that the page is long by default (Hero and Work alone are
  each a full viewport tall), but don't break it regardless — don't change
  `.main`'s `flex` or `body`'s `display: flex` without preserving this
  behavior.
- **Hero photo**: `.hero-photo` sits to the right of the hero text on
  desktop (`assets/photo.jpg`, 280×280, rounded corners). It intentionally
  has **no colored border/glow** — a soft blue halo (`box-shadow` ring using
  `--accent-soft`) was tried and rejected ("the blue does not look good on
  the dark background"); it now just uses the same neutral card treatment as
  everything else on the site (`border: 1px solid var(--border)` + a plain
  dark drop-shadow for lift, no color). This is a different location than
  the old multi-page site's About-page photo — About no longer has a photo
  at all; `assets/photo.jpg` is now referenced once, in the Hero.

## Content conventions

- **Headline/positioning statement** (currently: *"A curious and analytical
  operator looking to own problems, solve them, and make a positive
  impact."*) is deliberately **generic and values-driven** — it does not name
  an industry (e.g. fintech, payments) or a job function. This was an
  explicit choice made with the site owner. If asked to revise the headline,
  preserve that constraint unless told otherwise.
- Credential entries (Experience, Education — in the About section) show **no
  dates** and only two lines: the organization/institution name (bold), then
  the role or degree below it. No extra detail line. Order is
  most-recent-first within each section, and Experience is listed before
  Education. Each entry also carries a small logo tile (`.timeline-logo`,
  a real institution logo image) to its left.
- Project blurbs, when present, should be short (1–2 sentences) — the card
  is a teaser, not the full case study. `blurb` is optional: for `pdf`-type
  projects especially, it's fine to omit it entirely and let the title + PDF
  preview carry the card (explicit site-owner preference — don't add
  blurbs back onto PDF projects that don't have one).
- Tone throughout: crisp, professional, no filler adjectives.
- Never invent facts about the site owner (hobbies, project details, bio
  copy) to fill a gap — use an explicit bracketed placeholder (e.g. `[Add
  hobby/interest]`) instead, so it's obvious what still needs real content.

## Project data model

Projects are plain JS objects in `js/projects-data.js`, grouped into three
arrays: `window.PROJECTS.work`, `.school`, `.personal`. `index.html` includes
this file (before `script.js`) and renders them into the Work section. Shape:

```js
{
  title: string,
  blurb: string,        // 1-2 sentence summary shown on the card
  tags: string[],        // short labels, rendered as pills
  detail: {
    type: 'text',
    content: string      // shown directly on the card
  } | {
    type: 'pdf',
    pdfUrl: string       // path to a PDF in assets/work/, e.g. 'assets/work/capstone.pdf'
  } | {
    type: 'link',
    url: string,         // external destination (e.g. a GitHub repo) — the
                          // thumbnail/title/tags link here, in an inner
                          // `.project-card-link` <a> (the outer card stays
                          // an <article>, unlike the pdf-type whole-card-link)
    downloadUrl: string,  // optional — path to a downloadable file (e.g. in
                          // assets/work/); renders a separate `.project-
                          // download-btn` below the card as a sibling, not
                          // nested inside the url link (nesting an <a>
                          // inside an <a> is invalid HTML)
    downloadLabel: string // optional — download button text, defaults to
                          // 'Download file'
  }
}
```

Use `link`-type for a project whose file format can't be previewed inline the
way a PDF can (e.g. a `.pbix` Power BI file) — link out to something that
*can* be previewed (a GitHub repo with a README/screenshots, a hosted demo)
and offer the raw file as a separate download rather than inventing a fake
inline preview for it.

There is no `canva` type — an earlier version supported Canva embeds, but
the site owner isn't using Canva, so that code path was removed rather than
kept around unused. Don't reintroduce it speculatively.

`js/script.js` renders these into the DOM on `DOMContentLoaded` — it has no
knowledge of specific projects, only of this shape. This means:

**To add a new project:** open `js/projects-data.js`, append a new object to
the correct array (`work`, `school`, or `personal`), save. Nothing else needs
to change.

**To add a PDF-backed project:** drop the PDF file into the matching
category subfolder under `assets/work/` (`essec-growthx/`, `worldline/`,
`personal/` — these mirror the three project categories), then set
`detail: { type: 'pdf', pdfUrl: 'assets/work/<category>/<filename>.pdf' }`.
Use clean, URL-safe filenames (lowercase, hyphens, no spaces/`&`/parens) —
rename the source file if needed rather than encoding a messy name into the
URL. Most confidential work projects will be `text`-type instead (no file
to share); most School (ESSEC & GrowthX) projects are expected to be
`pdf`-type.

**Large PDFs**: inline preview means the whole file loads in the browser.
Multi-tens-of-MB PDFs (a couple of the current ones are 25–55MB) will be
slow, especially on mobile — flag this to the site owner and suggest
compressing before adding new ones, rather than silently accepting huge
files.

Every card gets a thumbnail (`renderThumb()` in `script.js`), in this
priority order:

1. **`pdf`-type**: the PDF renders inline via an iframe (native PDF toolbar
   hidden). Rendering is inconsistent across mobile browsers (some show a
   blank frame or force a download instead of a preview) — so rather than
   relying on the preview alone, **the whole card is a link** (`renderCard()`
   builds a `pdf`-type card as `<a href={pdfUrl} target="_blank">` instead
   of an `<article>`) — clicking anywhere, including over the preview,
   opens the PDF. This only works because `.project-thumb iframe` has
   `pointer-events: none`, letting the click pass through the iframe to the
   enclosing link instead of being captured by the PDF's own document.
   There's no separate "Open PDF" link element anymore — don't add one back
   (a nested `<a>` inside the card-link would be invalid HTML).
1a. **`link`-type**: same idea as `pdf`, but the destination isn't
   iframe-able — thumbnail/title/tags sit inside an inner `<a
   class="project-card-link">` pointing at `detail.url` (e.g. a GitHub
   repo), and if `detail.downloadUrl` is set, a separate `<a
   class="project-download-btn">` (styled as an outlined button, reusing
   the `.btn` base class) is appended below as a sibling — not nested
   inside the card-link, since a nested `<a>` would be invalid HTML.
   `renderThumb()` treats `link`-type the same as any non-`pdf` type: it
   falls through to the `icon`/letter-glyph logic below.
2. **`icon` field set** (any detail type, typically `text`-type projects):
   renders one of the hand-drawn outline SVGs from the `ICONS` map in
   `script.js` (same stroke style as the About-page hobby icons — `viewBox
   0 0 24 24`, `stroke="currentColor"`, `stroke-width="1.6"`, round caps/
   joins), on a soft radial-glow tile (`.project-thumb-placeholder`; not a
   photo/screenshot — deliberately abstract, tried a diagonal-line pattern
   first and replaced it with this per the site owner). Pick or add an icon
   that thematically fits the project (e.g. `growth` for a market-sizing/
   strategy project, `ai` for AI work, `pos` for a payments-terminal
   project) rather than reusing one arbitrarily. To add a new icon: add a
   key to `ICONS` in `script.js`, then reference it via `icon: '<key>'` on
   the project object.
3. **Neither**: falls back to the same radial-glow tile with a generated
   letter glyph (taken from the project's first tag or title) instead of an
   icon.

There's no `image` field in the data model — if you want a real screenshot
on a project, that's the place to extend the shape and `renderThumb()`
together.

**Empty categories get a "coming soon" message, not fake placeholders.**
`renderCategory()` checks `projects.length` and, if empty, renders a single
centered `.category-empty` message ("Some great work coming soon!") instead
of iterating an empty array. Don't add placeholder project objects back in
to "fill" an empty category — leave the array empty and let the message do
its job until there's real content.

**To update credentials (education/work experience):** edit the `<li
class="timeline-item">` entries directly in `index.html`, inside the About
section's `.about-columns`. Each item is `.timeline-logo` (small logo/
monogram tile), then a `.timeline-text` wrapper containing `.timeline-org`
(bold) and `.timeline-title` (role/degree, below) — no dates. There is no
data file for these — they're simple enough to stay as markup.

**About the `.timeline-logo` tiles:** each renders a real logo image from
`assets/logos/` (`essec.jpg`, `growthx.webp`, `icici-lombard.jpg`,
`manipal.jpg`, `worldline.webp`). The tile background is intentionally
white (`#fff`), not the theme background color, because the source logos mix
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

**To update contact info:** edit the `.contact-row` entries inside the
Contact section in `index.html`. The `<footer class="site-footer">` no
longer duplicates this — it was simplified to just the text "Harsha's
Portfolio" (the old footer's three contact links were removed once the
Contact section itself sat directly above it on the same page), so it
doesn't need to be kept in sync with contact info changes anymore.

## Current state / placeholders

- **`school` (ESSEC & GrowthX) projects are real**: three PDF-backed
  projects (Telmont Marketing Strategy, UiPath Marketing Strategy, Groww
  Onboarding Breakdown), each `pdf`-type with no `blurb` (title + preview
  only, by explicit request).
- **`work` (Worldline) projects are real**: three `text`-type projects
  (Strategy & Business Potential - Nordics, AI Tooling for Enterprise GTM,
  SoftPOS Business Case — France), confidential so no files — each is a
  single ~40-60 word paragraph in `detail.content`, no separate `blurb`
  (same "let the one summary carry the card" pattern as the PDF projects).
  Each also has an `icon` (`growth`, `ai`, `pos` respectively) chosen to
  thematically match the project. Keep new `work` entries in this same word
  range unless told otherwise.
- **`personal` has one real project**: "Data Jobs Dashboard - PowerBI",
  `link`-type (a `.pbix` can't be previewed inline like a PDF) pointing at
  its GitHub repo (README + screenshots), with a separate download button
  for the raw `.pbix` (in `assets/work/personal/`). No `blurb` — title +
  link carries the card, same pattern as the PDF projects. Add further
  real personal projects the same way; if the array is ever empty again,
  `renderCategory()` falls back to the "Some great work coming soon!"
  message (see the Project Data Model section above) — don't add
  placeholder project objects to fill it.
- **About section has real content throughout**: the two intro paragraphs
  (now horizontally centered as a single ~640px column with justified text,
  since it lost its photo when that moved to the Hero), Experience/Education
  (with real institution logos), and the three "Outside of Work" hobby cards
  (Running, Vibe Coding, Cooking — each with a small outline SVG icon via
  `.hobby-icon`, inline in the markup, not an icon library) are all real. In
  the intro, "payments and fintech" and "AI native" are highlighted in
  accent color (`.text-accent`) — keep these as the inline text highlights
  on the page rather than adding more.
- Real content wired in: name, headline, current role on Hero, full About
  section (intro, experience/education with logos, hobbies), and contact
  links (LinkedIn, phone, email) in the Contact section.
- There is no resume/CV download button — this was an explicit choice (the
  site itself is meant to stand in for the resume).

## A note on `.superpowers/`

This directory contains tooling state from prior Claude Code sessions,
including leftover mockup artifacts from an earlier, unrelated brainstorming
session (different positioning — "GTM & Product Strategy, Payments" — and a
different layout, with a sidebar and no single-page structure). **That prior
direction was explicitly discarded** in favor of the design documented
above. Don't treat anything under `.superpowers/` as current project content
or direction.
