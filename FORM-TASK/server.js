const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- Multer setup (file/image field) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      // Reject with a recognizable error; handled below in error middleware
      return cb(new Error("INVALID_FILE_TYPE"));
    }
    cb(null, true);
  },
});

// ---------- Server-side validation (mirrors client, never trusts it) ----------
const ALLOWED_DEPARTMENTS = ["engineering", "design", "marketing", "sales", "support"];

function validateRegistration(body) {
  const errors = {};
  const { fullName, email, phone, department, eventDate, bio } = body;

  // Full Name
  if (!fullName || !fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  } else if (!/^[a-zA-Z\s.'-]+$/.test(fullName.trim())) {
    errors.fullName = "Full name can only contain letters, spaces, and ' . -";
  }

  // Email
  if (!email || !email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address (e.g. name@example.com).";
  }

  // Phone
  if (!phone || !phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\+?[0-9]{10,15}$/.test(phone.trim())) {
    errors.phone = "Phone must be 10-15 digits, optionally starting with +.";
  }

  // Department (dropdown)
  if (!department || !department.trim()) {
    errors.department = "Please select a department.";
  } else if (!ALLOWED_DEPARTMENTS.includes(department.trim().toLowerCase())) {
    errors.department = "Selected department is not valid.";
  }

  // Event date
  if (!eventDate || !eventDate.trim()) {
    errors.eventDate = "Event date is required.";
  } else {
    const d = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(d.getTime())) {
      errors.eventDate = "Enter a valid date.";
    } else if (d < today) {
      errors.eventDate = "Event date cannot be in the past.";
    }
  }

  // Bio / message
  if (!bio || !bio.trim()) {
    errors.bio = "Please write a short bio.";
  } else if (bio.trim().length < 10) {
    errors.bio = "Bio must be at least 10 characters.";
  } else if (bio.trim().length > 300) {
    errors.bio = "Bio must be under 300 characters.";
  }

  return errors;
}

// ---------- Route ----------
app.post("/api/register", (req, res) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      if (err.message === "INVALID_FILE_TYPE") {
        return res.status(400).json({
          success: false,
          errors: { photo: "Only JPG, PNG, or WEBP images are allowed." },
        });
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          errors: { photo: "Image must be smaller than 2MB." },
        });
      }
      return res.status(400).json({
        success: false,
        errors: { photo: "File upload failed. Please try again." },
      });
    }

    // Simulate a little latency so the loading state is visible/testable
    setTimeout(() => {
      const errors = validateRegistration(req.body);

      // File is required
      if (!req.file) {
        errors.photo = errors.photo || "Please upload a profile photo.";
      }

      if (Object.keys(errors).length > 0) {
        // Clean up an uploaded file if the rest of the form was invalid
        if (req.file) {
          fs.unlink(req.file.path, () => {});
        }
        return res.status(400).json({ success: false, errors });
      }

      return res.status(200).json({
        success: true,
        message: `Thanks, ${req.body.fullName.trim()}! Your registration was received.`,
        data: {
          fullName: req.body.fullName.trim(),
          email: req.body.email.trim(),
          phone: req.body.phone.trim(),
          department: req.body.department.trim(),
          eventDate: req.body.eventDate.trim(),
          bio: req.body.bio.trim(),
          photoUrl: "/uploads/" + req.file.filename,
        },
      });
    }, 700);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
