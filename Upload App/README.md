# File/Image Upload UI — Connected to Backend Storage

A drag-and-drop file upload component (vanilla HTML/CSS/JS) connected to an
Express + Multer backend that stores files on local disk.

## What it does

- **Styled dropzone** — drag & drop or click to browse (no bare `<input>`)
- **Client-side validation** — rejects wrong file types / files over 10MB
  *before* anything is sent to the server
- **Preview before submit** — image thumbnail (or a PDF badge) + filename/size,
  with a chance to remove and re-pick before uploading
- **Upload progress** — a segmented "transmission bar" driven by
  `XMLHttpRequest`'s `upload.progress` event (real byte-level progress, not
  a fake timer)
- **Backend storage** — Express + Multer saves the file to `backend/uploads/`
  with a collision-safe filename, and re-validates type/size server-side
  (never trust the client alone)
- **Post-upload display** — successful uploads appear in a gallery below,
  each one a link to the stored file (image preview inline, PDF opens/downloads)
  and the gallery repopulates from the server on page refresh

## Project structure

```
upload-app/
├── backend/
│   ├── server.js        # Express server, Multer config, API routes
│   ├── uploads/          # Files land here (created automatically)
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Run it

```bash
cd backend
npm install
node server.js
```

Then open **http://localhost:5000** — the backend also serves the frontend,
so there's nothing extra to run.

## API

| Method | Route          | Description                              |
|--------|----------------|-------------------------------------------|
| POST   | `/api/upload`  | multipart field `file` → stores + returns file metadata |
| GET    | `/api/files`   | lists everything currently in `uploads/`  |
| GET    | `/uploads/:name` | static file access (used for previews/downloads) |

**Validation rules** (enforced on both frontend and backend):
- Allowed types: JPG, PNG, GIF, WEBP, PDF
- Max size: 10MB

## Swapping in cloud storage

Local disk storage is used here for simplicity. To move to S3/Cloudinary/Firebase,
only `backend/server.js` needs to change — replace `multer.diskStorage` with
`multer-s3`, `multer-storage-cloudinary`, or a Firebase Admin SDK upload inside
the same `/api/upload` route. The frontend doesn't need to change at all since
it just expects a `url` back in the JSON response.
