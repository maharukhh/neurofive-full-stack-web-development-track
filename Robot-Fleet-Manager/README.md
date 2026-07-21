# Robot Fleet Manager

A full-stack CRUD app for managing a fleet of robots — built as a Week 2 full-stack exercise (frontend talking to a self-built backend, not a public API).

- **Backend**: Node.js + Express + SQLite (`/backend`)
- **Frontend**: React + Vite (`/frontend`)

## Quick start

```bash
# 1. start the backend
cd backend
npm install
npm start          # http://localhost:4000

# 2. in a new terminal, start the frontend
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Open http://localhost:5173 — the dashboard talks to the API at http://localhost:4000/api.

## What it does

Manages a single resource, **Robot** (`name`, `model`, `status`, `battery`, `location`), with full CRUD:

- Register a new robot via a form
- View the fleet roster with live stats (unit count, active count, average battery)
- Edit a robot's details inline
- Delete a robot with a confirm step
- Loading states (skeletons, spinners) and error states (banners, retry, inline row errors) on every action

See [`backend/README.md`](./backend/README.md) and [`frontend/README.md`](./frontend/README.md) for full setup and API details.
