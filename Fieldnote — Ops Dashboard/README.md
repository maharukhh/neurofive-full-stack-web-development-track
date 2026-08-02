# Fieldnote — Ops Dashboard

A data-visualization dashboard showing experiment run activity across
research teams, built for **Week 4, Task 2: Dashboard with Data
Visualization**. Continues the Fieldnote project/brand from earlier
weeks — this is the internal ops view a lab team would use to see how
their logged runs are trending.

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

## Project structure

```
backend/
  data.js       # seeded mock dataset generator (runs: date, team, category, status, duration)
  server.js     # Express app — /api/meta (filter options) and /api/dashboard (aggregated data)
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
    App.jsx
    styles/tokens.css, global.css        # design tokens (color, type, spacing)
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

## Deploying

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
