const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---- Config: mirrors the frontend validation rules ----
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

app.use(cors());
app.use(express.json());
// Serve uploaded files statically so the frontend can preview/download them
app.use('/uploads', express.static(UPLOAD_DIR));
// Serve the frontend itself (so `node server.js` alone runs the whole app)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ---- Multer storage: keep original extension, avoid name collisions ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9_-]/gi, '_')
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject without throwing — Multer will surface this via err.message
    cb(new Error('UNSUPPORTED_FILE_TYPE'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// ---- Routes ----

// Single-file upload
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File exceeds the 10MB limit.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: 'Unsupported file type.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({
      message: 'Upload successful',
      file: {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: fileUrl,
      },
    });
  });
});

// List previously uploaded files (handy for the "uploaded files" gallery)
app.get('/api/files', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'Could not read uploads directory.' });
    const fileList = files.map((filename) => {
      const stats = fs.statSync(path.join(UPLOAD_DIR, filename));
      return {
        storedName: filename,
        size: stats.size,
        url: `/uploads/${filename}`,
      };
    });
    res.json({ files: fileList });
  });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
