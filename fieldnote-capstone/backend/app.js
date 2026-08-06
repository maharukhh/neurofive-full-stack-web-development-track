const express = require('express');
const cors = require('cors');
const db = require('./db');
const { hashPassword, verifyPassword, signToken } = require('./auth');
const { requireAuth, requireRole } = require('./middleware');
const { validateRegister, validateLogin, validateTeam, validateRun } = require('./validators');

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

// ============================================================
// AUTH
// ============================================================

app.post('/api/auth/register', (req, res) => {
  const errors = validateRegister(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const { name, email, password, role } = req.body;
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ errors: { email: 'An account with this email already exists' } });

  const password_hash = hashPassword(password);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name.trim(), email.toLowerCase(), password_hash, role === 'admin' ? 'admin' : 'member');

  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = signToken(user);
  res.status(201).json({ user, token });
});

app.post('/api/auth/login', (req, res) => {
  const errors = validateLogin(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const { email, password } = req.body;
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!row || !verifyPassword(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  const token = signToken(user);
  res.json({ user, token });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// ============================================================
// TEAMS  (admin-only writes; any authenticated user can read)
// ============================================================

app.get('/api/teams', requireAuth, (req, res) => {
  const teams = db
    .prepare(
      `SELECT teams.*, COUNT(runs.id) as run_count
       FROM teams LEFT JOIN runs ON runs.team_id = teams.id
       GROUP BY teams.id ORDER BY teams.name`
    )
    .all();
  res.json({ teams });
});

app.post('/api/teams', requireAuth, requireRole('admin'), (req, res) => {
  const errors = validateTeam(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const existing = db.prepare('SELECT id FROM teams WHERE name = ?').get(req.body.name.trim());
  if (existing) return res.status(409).json({ errors: { name: 'A team with this name already exists' } });

  const info = db
    .prepare('INSERT INTO teams (name, description, created_by) VALUES (?, ?, ?)')
    .run(req.body.name.trim(), req.body.description || null, req.user.id);
  const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ team });
});

app.put('/api/teams/:id', requireAuth, requireRole('admin'), (req, res) => {
  const errors = validateTeam(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  db.prepare('UPDATE teams SET name = ?, description = ? WHERE id = ?').run(
    req.body.name.trim(),
    req.body.description || null,
    req.params.id
  );
  res.json({ team: db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id) });
});

app.delete('/api/teams/:id', requireAuth, requireRole('admin'), (req, res) => {
  const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  db.prepare('DELETE FROM teams WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

// ============================================================
// RUNS  (any authenticated user can create/read; edit/delete
// restricted to the run's owner or an admin — basic RBAC + ownership)
// ============================================================

app.get('/api/runs', requireAuth, (req, res) => {
  const { team_id, category, status, q } = req.query;
  let sql = `SELECT runs.*, teams.name as team_name, users.name as owner_name
             FROM runs
             JOIN teams ON teams.id = runs.team_id
             JOIN users ON users.id = runs.created_by
             WHERE 1=1`;
  const params = [];
  if (team_id) {
    sql += ' AND runs.team_id = ?';
    params.push(team_id);
  }
  if (category) {
    sql += ' AND runs.category = ?';
    params.push(category);
  }
  if (status) {
    sql += ' AND runs.status = ?';
    params.push(status);
  }
  if (q) {
    sql += ' AND runs.title LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY runs.created_at DESC';

  const runs = db.prepare(sql).all(...params);
  res.json({ runs });
});

app.get('/api/runs/:id', requireAuth, (req, res) => {
  const run = db
    .prepare(
      `SELECT runs.*, teams.name as team_name, users.name as owner_name
       FROM runs JOIN teams ON teams.id = runs.team_id JOIN users ON users.id = runs.created_by
       WHERE runs.id = ?`
    )
    .get(req.params.id);
  if (!run) return res.status(404).json({ error: 'Run not found' });
  res.json({ run });
});

app.post('/api/runs', requireAuth, (req, res) => {
  const errors = validateRun(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const team = db.prepare('SELECT id FROM teams WHERE id = ?').get(req.body.team_id);
  if (!team) return res.status(400).json({ errors: { team_id: 'That team does not exist' } });

  const info = db
    .prepare(
      `INSERT INTO runs (team_id, title, category, status, duration_sec, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.body.team_id,
      req.body.title.trim(),
      req.body.category,
      req.body.status || 'nominal',
      req.body.duration_sec,
      req.body.notes || null,
      req.user.id
    );
  const run = db.prepare('SELECT * FROM runs WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ run });
});

function canModifyRun(req, run) {
  return req.user.role === 'admin' || req.user.id === run.created_by;
}

app.put('/api/runs/:id', requireAuth, (req, res) => {
  const run = db.prepare('SELECT * FROM runs WHERE id = ?').get(req.params.id);
  if (!run) return res.status(404).json({ error: 'Run not found' });
  if (!canModifyRun(req, run)) {
    return res.status(403).json({ error: 'Only the run\'s owner or an admin can edit it' });
  }

  const errors = validateRun(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  db.prepare(
    `UPDATE runs SET title = ?, category = ?, status = ?, duration_sec = ?, notes = ?, team_id = ?
     WHERE id = ?`
  ).run(
    req.body.title.trim(),
    req.body.category,
    req.body.status || 'nominal',
    req.body.duration_sec,
    req.body.notes || null,
    req.body.team_id,
    req.params.id
  );
  res.json({ run: db.prepare('SELECT * FROM runs WHERE id = ?').get(req.params.id) });
});

app.delete('/api/runs/:id', requireAuth, (req, res) => {
  const run = db.prepare('SELECT * FROM runs WHERE id = ?').get(req.params.id);
  if (!run) return res.status(404).json({ error: 'Run not found' });
  if (!canModifyRun(req, run)) {
    return res.status(403).json({ error: 'Only the run\'s owner or an admin can delete it' });
  }
  db.prepare('DELETE FROM runs WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

// ============================================================
// DASHBOARD  (server-side aggregation for the charts page)
// ============================================================

app.get('/api/dashboard', requireAuth, (req, res) => {
  const totalRuns = db.prepare('SELECT COUNT(*) as c FROM runs').get().c;
  const nominalCount = db.prepare("SELECT COUNT(*) as c FROM runs WHERE status = 'nominal'").get().c;
  const successRate = totalRuns ? Math.round((nominalCount / totalRuns) * 1000) / 10 : 0;
  const activeTeams = db.prepare('SELECT COUNT(DISTINCT team_id) as c FROM runs').get().c;
  const avgDuration = db.prepare('SELECT AVG(duration_sec) as a FROM runs').get().a;

  const categoryBreakdown = db
    .prepare('SELECT category as name, COUNT(*) as value FROM runs GROUP BY category')
    .all();

  const statusBreakdown = db
    .prepare('SELECT status as name, COUNT(*) as value FROM runs GROUP BY status')
    .all();

  const byTeam = db
    .prepare(
      `SELECT teams.name as team, COUNT(runs.id) as count
       FROM teams LEFT JOIN runs ON runs.team_id = teams.id
       GROUP BY teams.id ORDER BY count DESC`
    )
    .all();

  res.json({
    summary: {
      totalRuns,
      successRate,
      activeTeams,
      avgDurationSec: avgDuration ? Math.round(avgDuration) : 0,
    },
    categoryBreakdown,
    statusBreakdown,
    byTeam,
  });
});

module.exports = app;
