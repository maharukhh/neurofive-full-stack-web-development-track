#  Mahrukh's & Bean — Coffee Shop Landing Page

A minimal, responsive landing page for a small coffee shop — the
first task in a series before any backend work gets wired in. The
goal here was to prove a clean, component-based frontend, not to
build anything feature-heavy.

## Live Demo

[Add your deployed URL here once published]

## Framework Choice

Plain HTML/CSS/JS. For a first, minimal landing page there's no real
benefit to a build step or a framework runtime — the whole page is
static markup driven by a handful of template functions, each loaded
as a regular script (not an ES module) so the page also renders
correctly when opened directly as a local file — no server required.

## Structure

```
coffee-shop-landing/
├── index.html              # shell: mounts #app, loads component scripts + main.js in order
├── css/
│   └── style.css           # design tokens + layout + responsive rules
└── js/
    ├── main.js              # calls each component function and mounts them in order
    └── components/
        ├── navbar.js        # sticky nav + mobile menu toggle
        ├── hero.js          # headline + CTA + cup/steam SVG mark
        ├── menu.js          # renders menu items from one data array
        ├── about.js
        ├── visit.js         # hours + location, hours from one data array
        └── footer.js
```

Each component is a small module exporting a function that returns an
HTML string (plus `initNavbar()` for the one interactive piece — the
mobile menu). `main.js` is the only file that knows about
composition/order, so any section can be reordered, removed, or reused
independently. Menu items and hours are both driven by a single data
array per component, so updating the actual menu or hours later means
editing one array, not the markup.

## Design System

All values live as CSS custom properties in `css/style.css`:

- **Color** — warm cream background, dark espresso-brown ink, a muted
  sage green accent, and a deeper brown used for primary buttons and
  the cup mark.
- **Type** — a serif display face (system serif stack — no external
  font load, works offline) for headings and menu item names, a
  system sans for body copy, and a monospace stack used only for
  eyebrows and prices.
- **Spacing** — a 4px-based scale (`--space-1` … `--space-24`) used for
  every margin/padding so rhythm stays consistent across sections.

## Responsive Breakpoints

Mobile-first. Base styles target mobile; two `min-width` breakpoints
layer on top:

- **≥ 640px (tablet)** — hours/location cards go to 2 columns.
- **≥ 768px** — desktop nav links appear, mobile menu toggle hides.
- **≥ 1024px (desktop)** — hero splits into a two-column layout,
  section padding increases.

## Running Locally

No build step, and no server required — just open `index.html`
directly in a browser (double-click it, or drag it into a browser
window).

