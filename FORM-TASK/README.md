# Event Registration Form — Forms, Validation & Real User Feedback

A full-stack multi-field registration form with strict client-side **and** server-side validation, file upload handling, toast notifications, and a proper loading state on submit.

Built as **Week 3 Task 1** for the Full Stack Web Development track.

## Features

- 7-field form: full name, email, phone, department (dropdown), event date (date picker), profile photo (file upload), and a short bio
- Real-time client-side validation with field-specific error messages (blur + live re-validation)
- Independent server-side validation that mirrors every client-side rule — the server never trusts the frontend
- File upload via Multer with mimetype whitelist (`jpeg`/`png`/`webp`) and a 2MB size limit
- Success/error toast notifications
- Submit button disables and shows a loading spinner while the request is in flight
- Invalid submissions clean up any file that was uploaded before the rest of validation failed

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express |
| File uploads | Multer |
| Frontend | Vanilla HTML, CSS, JavaScript (no framework/build step) |

## Project Structure

```
FORM-TASK/
├── package.json
├── server.js          # Express server + validation + file upload route
└── public/
    ├── index.html      # Form markup
    ├── style.css        # Styling, toast + spinner animations
    ├── script.js         # Client-side validation, toasts, fetch submit logic
    └── uploads/            # Uploaded profile photos land here
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js

# 3. Open in your browser
http://localhost:3000
```

> Open the app through `http://localhost:3000`, not by double-clicking `index.html` — the form calls a backend API, so it needs the Node server running.

## Validation Rules

| Field | Rule |
|---|---|
| Full Name | Required, min 2 characters, letters/spaces/`.`/`'`/`-` only |
| Email | Required, valid email format |
| Phone | Required, 10–15 digits, optional leading `+` |
| Department | Required, must match an allowed value (dropdown) |
| Event Date | Required, valid date, cannot be in the past |
| Profile Photo | Required, JPG/PNG/WEBP only, max 2MB |
| Bio | Required, 10–300 characters |

All of the above are enforced independently on both the client (`public/script.js`) and the server (`server.js`), so the API rejects invalid data even if the frontend is bypassed.

## API

**`POST /api/register`** — `multipart/form-data`

Success (`200`):
```json
{
  "success": true,
  "message": "Thanks, <name>! Your registration was received.",
  "data": { "fullName": "...", "email": "...", "photoUrl": "/uploads/..." }
}
```

Validation failure (`400`):
```json
{
  "success": false,
  "errors": { "email": "Enter a valid email address (e.g. name@example.com)." }
}
```

## Notes

- Uploaded files are saved to `public/uploads/` with a unique, collision-safe filename.
- A short artificial delay is added on submit so the loading state is actually visible during local testing.
