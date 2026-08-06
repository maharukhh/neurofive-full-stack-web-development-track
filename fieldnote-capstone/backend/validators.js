const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORIES = ['Robotics', 'Computer Vision', 'Automation'];
const STATUSES = ['nominal', 'watch', 'failed'];

function validateRegister(body) {
  const errors = {};
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    errors.email = 'A valid email is required';
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (body.role && !['admin', 'member'].includes(body.role)) {
    errors.role = 'Role must be "admin" or "member"';
  }
  return errors;
}

function validateLogin(body) {
  const errors = {};
  if (!body.email || !EMAIL_RE.test(body.email)) errors.email = 'A valid email is required';
  if (!body.password) errors.password = 'Password is required';
  return errors;
}

function validateTeam(body) {
  const errors = {};
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.name = 'Team name must be at least 2 characters';
  }
  return errors;
}

function validateRun(body) {
  const errors = {};
  if (!body.team_id || isNaN(Number(body.team_id))) errors.team_id = 'A valid team is required';
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters';
  }
  if (!body.category || !CATEGORIES.includes(body.category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(', ')}`;
  }
  if (body.status && !STATUSES.includes(body.status)) {
    errors.status = `Status must be one of: ${STATUSES.join(', ')}`;
  }
  if (body.duration_sec === undefined || isNaN(Number(body.duration_sec)) || Number(body.duration_sec) <= 0) {
    errors.duration_sec = 'Duration must be a positive number of seconds';
  }
  return errors;
}

module.exports = { validateRegister, validateLogin, validateTeam, validateRun, CATEGORIES, STATUSES };
