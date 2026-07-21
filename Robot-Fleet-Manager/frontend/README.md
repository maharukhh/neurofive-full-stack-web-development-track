# Robot Fleet Manager — Frontend

A React (Vite) dashboard for managing a fleet of robots: register new units, view the roster, edit status/battery/location inline, and remove decommissioned robots. Talks to the [backend API](../backend).

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # optional — defaults to http://localhost:4000/api
npm run dev             # runs on http://localhost:5173
```

Make sure the backend is running first (`cd backend && npm start`).

## Features

- **Create** — form to register a new robot (name, model, status, battery, location)
- **Read** — live roster table with fleet stats (unit count, active count, average battery)
- **Update** — inline row editing
- **Delete** — with an inline confirm step before removal
- Loading skeletons while the roster fetches, per-row spinners during update/delete, and error banners with retry — nothing feels instant/fake
- State managed with a small custom hook (`useRobots`) using local React state — no external state library needed for this scope

## Project structure

```
frontend/
  src/
    main.jsx
    App.jsx
    api.js              # fetch wrapper for the backend
    useRobots.js          # CRUD state + loading/error handling
    index.css
    components/
      RobotForm.jsx
      RobotRow.jsx
      StatusBadge.jsx
      BatteryBar.jsx
```

## Build for production

```bash
npm run build
npm run preview
```
