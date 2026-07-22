const form = document.getElementById("regForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const spinner = document.getElementById("spinner");
const toastContainer = document.getElementById("toastContainer");

const ALLOWED_DEPARTMENTS = ["engineering", "design", "marketing", "sales", "support"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// ---------- Validation rules (mirrors server.js) ----------
function validateField(name, value) {
  switch (name) {
    case "fullName":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Full name must be at least 2 characters.";
      if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return "Full name can only contain letters, spaces, and ' . -";
      return "";

    case "email":
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Enter a valid email address (e.g. name@example.com).";
      return "";

    case "phone":
      if (!value.trim()) return "Phone number is required.";
      if (!/^\+?[0-9]{10,15}$/.test(value.trim())) return "Phone must be 10-15 digits, optionally starting with +.";
      return "";

    case "department":
      if (!value.trim()) return "Please select a department.";
      if (!ALLOWED_DEPARTMENTS.includes(value.trim().toLowerCase())) return "Selected department is not valid.";
      return "";

    case "eventDate": {
      if (!value.trim()) return "Event date is required.";
      const d = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(d.getTime())) return "Enter a valid date.";
      if (d < today) return "Event date cannot be in the past.";
      return "";
    }

    case "bio":
      if (!value.trim()) return "Please write a short bio.";
      if (value.trim().length < 10) return "Bio must be at least 10 characters.";
      if (value.trim().length > 300) return "Bio must be under 300 characters.";
      return "";

    default:
      return "";
  }
}

function validateFile(fileInput) {
  const file = fileInput.files[0];
  if (!file) return "Please upload a profile photo.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG, or WEBP images are allowed.";
  if (file.size > MAX_FILE_SIZE) return "Image must be smaller than 2MB.";
  return "";
}

function showFieldError(name, message) {
  const input = document.getElementById(name);
  const errEl = document.getElementById("err-" + name);
  errEl.textContent = message;
  input.classList.toggle("invalid", !!message);
}

// Live validation on blur/change for each text-like field
["fullName", "email", "phone", "department", "eventDate", "bio"].forEach((name) => {
  const el = document.getElementById(name);
  el.addEventListener("blur", () => showFieldError(name, validateField(name, el.value)));
  el.addEventListener("input", () => {
    if (el.classList.contains("invalid")) {
      showFieldError(name, validateField(name, el.value));
    }
  });
});

document.getElementById("photo").addEventListener("change", (e) => {
  showFieldError("photo", validateFile(e.target));
});

function validateAll() {
  const fields = ["fullName", "email", "phone", "department", "eventDate", "bio"];
  let firstInvalid = null;
  let valid = true;

  fields.forEach((name) => {
    const el = document.getElementById(name);
    const msg = validateField(name, el.value);
    showFieldError(name, msg);
    if (msg) {
      valid = false;
      if (!firstInvalid) firstInvalid = el;
    }
  });

  const photoInput = document.getElementById("photo");
  const photoMsg = validateFile(photoInput);
  showFieldError("photo", photoMsg);
  if (photoMsg) {
    valid = false;
    if (!firstInvalid) firstInvalid = photoInput;
  }

  if (firstInvalid) firstInvalid.focus();
  return valid;
}

// ---------- Toasts ----------
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

// ---------- Loading state ----------
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnText.textContent = isLoading ? "Submitting..." : "Register";
  spinner.classList.toggle("hidden", !isLoading);
}

// ---------- Submit ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateAll()) {
    showToast("Please fix the errors in the form.", "error");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData(form);
    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      // Server-side validation caught something (or file rejected)
      if (result.errors) {
        Object.entries(result.errors).forEach(([name, msg]) => showFieldError(name, msg));
      }
      showToast("Submission failed. Please check the highlighted fields.", "error");
      return;
    }

    showToast(result.message || "Registration successful!", "success");
    form.reset();
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll("input, select, textarea").forEach((el) => el.classList.remove("invalid"));

  } catch (err) {
    console.error(err);
    showToast("Network error. Please try again.", "error");
  } finally {
    setLoading(false);
  }
});
