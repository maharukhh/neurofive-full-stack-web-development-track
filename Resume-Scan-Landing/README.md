# ResumeScan — Landing Page

A responsive SaaS landing page for **ResumeScan**, a fictional tool that
checks whether a resume will actually parse correctly in an Applicant
Tracking System (ATS) before a recruiter ever sees it. Built as a frontend
proof-of-concept — no backend, no real scanning logic, just the UI.

**Live demo:** _add your deployed URL here after deploying_

## Why React (and not plain HTML/CSS/JS)

I picked **React + Vite** over plain JS for three reasons:

1. **Component reuse** — things like the feature cards, step cards, and nav
   links are repeated with different data. React lets me map over an array
   of objects instead of copy-pasting markup six times.
2. **State for the mobile menu** — the nav's hamburger menu needs to
   open/close. `useState` handles this cleanly without manual DOM
   manipulation.
3. **Fast dev loop** — Vite's hot-reload made it much faster to iterate on
   the design than refreshing a static HTML file.

I did **not** reach for Next.js or a UI kit like MUI/Chakra, because this is
a single static page with no routing or backend — that would be more
tooling than the problem needs.

## Project / component structure

```
src/
  App.jsx                 → composes all sections in order
  index.css                → design tokens (CSS variables): color, type, spacing
  components/
    Navbar.jsx / .css      → sticky nav, responsive hamburger menu
    Hero.jsx  / .css       → headline + the animated "resume scan" mockup
    LogosBar.jsx / .css    → row of real ATS platform names (Workday, Lever, etc.)
    HowItWorks.jsx / .css  → 3-step process (upload → parse → fix list)
    Features.jsx / .css    → 4-card grid of what the tool checks (lucide-react icons)
    ReportPreview.jsx/.css → sample score report mockup (SVG progress ring + bars)
    CTA.jsx / .css         → email capture form
    Footer.jsx / .css      → footer + disclaimer
```

Each component owns its own CSS file (no global stylesheet sprawl), but all
of them pull colors, spacing, and fonts from the CSS variables defined once
in `index.css`. That's the "design system" — change a token there and it
updates everywhere.

## Design system

| Token | Value | Used for |
|---|---|---|
| `--ink-900` | `#10131b` | Page background |
| `--paper` | `#f6f4ee` | Light cards (resume mockup, report card) |
| `--signal` | `#b6ff3c` | Single accent color — "ATS match" green, used sparingly |
| `--font-display` | Space Grotesk | Headings |
| `--font-body` | Inter | Body text |
| `--font-mono` | JetBrains Mono | Labels, eyebrows, data/score text |
| `--sp-1`…`--sp-8` | 0.5rem → 7rem | Spacing scale, 8px-based |

**Signature element:** the hero has a mock resume with an animated scan-line
that sweeps down the page, "highlighting" matched keywords as it passes —
a visual metaphor for what the product actually does, instead of a generic
hero illustration.

## Responsiveness

Breakpoints at `980px` (tablet) and `560px` (mobile):
- Hero and report sections drop from a 2-column grid to a single column,
  with the visual reordering above the copy on smaller screens.
- The nav collapses into a hamburger menu with an accessible
  `aria-expanded` toggle below `900px`.
- The features grid goes 4 → 2 → 1 columns as the viewport shrinks.
- All type sizes use `clamp()` so headings scale smoothly instead of
  jumping between fixed breakpoint sizes.

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Deployment

Deployed on **Vercel** (or Netlify — either works with zero config for a
Vite app):

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), click **New Project** → import the
   GitHub repo.
3. Vercel auto-detects Vite. Build command: `npm run build`, output
   directory: `dist`. Click Deploy.

For Netlify: same repo, build command `npm run build`, publish directory
`dist`.
