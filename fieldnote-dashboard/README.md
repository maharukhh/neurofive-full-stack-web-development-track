# Fieldnote — Ops Dashboard

A data-visualization dashboard showing experiment run activity across
research teams. Started as **Week 4, Task 2: Dashboard with Data
Visualization**; this revision adds the **Week 5, Task 1: Testing
Across the Stack** requirements on top of it. Continues the Fieldnote
project/brand from earlier weeks — this is the internal ops view a lab
team would use to see how their logged runs are trending.

## Stack

- **Backend**: Node.js + Express — serves aggregated stats computed
  server-side from an in-memory dataset of ~250 experiment runs
- **Frontend**: React + Vite + **Recharts** — fetches from the backend
  and renders the charts
- No database — the dataset is generated once at server start with a
  seeded random generator, so numbers are stable across restarts but
  large enough to show real trends

## How each requirement is met

| Requirement | Where |
|---|---|
| 3+ visualizations | Bar chart (runs/week), line chart (success-rate trend), donut chart (category breakdown), plus 4 stat cards |
| Charting library | Recharts |
| Backend-fed data | `GET /api/dashboard` — every number (totals, weekly buckets, success rate) is aggregated in `server.js`, not pre-computed in the frontend |
| Responsive | Chart grid: 1 column (mobile) → 2 columns (tablet, ≥860px) → 3 columns (desktop, ≥1200px); stat cards 2→4 columns; filter bar wraps and stacks under 560px |
| Interactive filter | Date range (from/to) + category + team selects — all four re-query the backend and re-render every chart |
| 5+ frontend tests | 11 tests — see [Testing](#testing) |
| 5+ backend tests, happy + failure paths | 10 tests — see [Testing](#testing) |
| E2E test of a real user flow | Playwright: load dashboard → filter → data updates — see [Testing](#testing) |

## Project structure

```
backend/
  data.js       # seeded mock dataset generator (runs: date, team, category, status, duration)
  app.js        # Express app + routes (exported, unbound — this is what tests import)
  server.js     # thin entry point: imports app.js and calls app.listen()
  __tests__/
    dashboard.test.js   # Jest + Supertest API tests
  package.json
frontend/
  src/
    api.js                       # fetch wrappers for both endpoints
    components/
      Header.jsx/css
      Filters.jsx/css              # the interactive filter bar
      StatCards.jsx/css             # 4 summary stat cards
      ChartCard.jsx/css              # shared chart frame used by all 3 charts
      RunsBarChart.jsx                # bar chart
      SuccessLineChart.jsx             # line chart
      CategoryDonutChart.jsx            # donut chart
      Dashboard.jsx/css                  # fetches data, owns filter state, composes everything
      __tests__/                          # Vitest + React Testing Library component tests
    test/setup.js                           # jest-dom matcher setup for Vitest
    App.jsx
    styles/tokens.css, global.css        # design tokens (color, type, spacing)
e2e/
  playwright.config.js    # auto-starts both backend and frontend before running tests
  tests/
    dashboard-filter-flow.spec.js   # real user-flow test: load → filter → data updates
```

## Running locally

Two servers — backend first, then frontend, in separate terminals:

```bash
# Terminal 1 — backend (http://localhost:4000)
cd backend
npm install
node server.js

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

The frontend is hardcoded to call `http://localhost:4000` in
`frontend/src/api.js` — update `API_BASE` there if you deploy the
backend somewhere else.

## Testing

Three layers, matching the app's three moving parts.

### Backend — Jest + Supertest (10 tests)

Covers both endpoints: happy paths (default query, category filter, team
filter, an out-of-range date that legitimately returns zero results) and
failure cases (malformed dates, unknown category, unknown team — all
return `400` with an error message, added specifically so there was a
real failure path to test, not just empty-input edge cases).

```bash
cd backend
npm install
npm test
```

### Frontend — Vitest + React Testing Library (11 tests)

Covers component rendering (`StatCards`, `ChartCard`), user interaction
(`Filters` — selecting a category/team calls `onChange` with the right
next state, via `@testing-library/user-event`), and an integration test
of `Dashboard` itself (loading state → rendered data, and the error
state when the API call rejects) with the API module mocked via
`vi.mock`.

```bash
cd frontend
npm install
npm test
```

### End-to-end — Playwright (2 tests)

Simulates the real user flow this app supports: **dashboard loads with
live data from the backend → user changes the category filter → stat
cards and charts update to the narrower dataset**, plus a second test
for the empty-state when a filter matches nothing. `playwright.config.js`
starts both the backend and frontend servers automatically, so this is
the one command that exercises the whole stack together, not mocks.

```bash
cd e2e
npm install
npx playwright install chromium   # one-time browser download
npm test
```

> **Note:** the Playwright browser download requires the
> `deb.nodesource.com` / Playwright CDN domains, which may be blocked in
> sandboxed CI environments — if `playwright install` fails there, run
> the E2E suite from a normal machine instead. The backend and frontend
> test suites above have no such restriction.

### Run everything

```bash
(cd backend && npm test) && (cd frontend && npm test) && (cd e2e && npm test)
```

This has two moving parts, so it needs two deployments:

**Backend** → Render, Railway, or Fly.io all support a plain Node/Express
app with a free tier. Whichever you use, set the start command to
`node server.js` inside the `backend/` folder.

**Frontend** → Vercel or Netlify, same as any Vite app:
```bash
cd frontend
npm run build
```
Before deploying, update `API_BASE` in `frontend/src/api.js` to your
deployed backend's URL (not `localhost`).
