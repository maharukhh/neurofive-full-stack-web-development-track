# Robot Fleet Manager — Backend

A REST API for managing a fleet of robots. Built with **Express** and **SQLite** (via `better-sqlite3`).

## Resource: Robot

| Field      | Type    | Notes                                            |
|------------|---------|---------------------------------------------------|
| id         | integer | auto-generated                                    |
| name       | string  | required                                           |
| model      | string  | required                                           |
| status     | string  | one of `idle`, `active`, `charging`, `error`       |
| battery    | integer | 0–100                                              |
| location   | string  | required, e.g. `"Warehouse A - Zone 3"`            |
| created_at | string  | auto-generated timestamp                           |
| updated_at | string  | auto-updated timestamp                             |

## Setup

```bash
cd backend
npm install
npm start        # runs on http://localhost:4000
```

For auto-restart during development:

```bash
npm run dev
```

Optionally seed the database with sample robots:

```bash
node src/seed.js
```

The database is a local SQLite file (`fleet.db`), created automatically on first run — no external DB setup needed.

## API Endpoints

Base URL: `http://localhost:4000/api`

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/robots`        | List all robots          |
| GET    | `/robots/:id`    | Get a single robot       |
| POST   | `/robots`        | Create a robot           |
| PUT    | `/robots/:id`    | Update a robot           |
| DELETE | `/robots/:id`    | Delete a robot           |
| GET    | `/health`        | Health check             |

### Example: create a robot

```bash
curl -X POST http://localhost:4000/api/robots \
  -H "Content-Type: application/json" \
  -d '{
    "name": "R2-Delta-04",
    "model": "TurtleBot3",
    "status": "active",
    "battery": 82,
    "location": "Warehouse A - Zone 3"
  }'
```

### Error responses

All errors return JSON in the shape `{ "error": "message" }` with an appropriate HTTP status code (`400` validation errors, `404` not found, `500` server errors).

## Project structure

```
backend/
  src/
    server.js         # app entrypoint
    db.js              # SQLite connection + schema
    validation.js       # request payload validation
    seed.js              # optional demo data
    middleware/
      errorHandler.js   # centralized error handling
    routes/
      robots.js          # CRUD route handlers
```
