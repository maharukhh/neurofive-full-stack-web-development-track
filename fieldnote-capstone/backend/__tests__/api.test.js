const request = require('supertest');
const app = require('../app');
const db = require('../db');

// The in-memory DB persists across every test in this file (one module
// instance per file), so without this, team-name conflicts and cumulative
// dashboard counts leak between tests. Clearing tables gives each test a
// genuinely clean slate.
beforeEach(() => {
  db.exec('DELETE FROM runs; DELETE FROM teams; DELETE FROM users;');
});

// Helper: register + return { user, token }
async function registerUser(overrides = {}) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: `user${Math.random().toString(36).slice(2)}@test.com`,
      password: 'password123',
      role: 'member',
      ...overrides,
    });
  return res.body;
}

describe('POST /api/auth/register', () => {
  test('registers a new user with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@fieldnote.test',
      password: 'strongpassword',
    });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('ada@fieldnote.test');
    expect(res.body.user.role).toBe('member'); // default role
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password_hash).toBeUndefined(); // never leak the hash
  });

  test('rejects a weak password with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Weak Pw',
      email: 'weak@fieldnote.test',
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.password).toBeDefined();
  });

  test('rejects a duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'First',
      email: 'dupe@fieldnote.test',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Second',
      email: 'dupe@fieldnote.test',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  test('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login Test',
      email: 'login@fieldnote.test',
      password: 'password123',
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@fieldnote.test', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('rejects an incorrect password with 401', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login Test 2',
      email: 'login2@fieldnote.test',
      password: 'password123',
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login2@fieldnote.test', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });
});

describe('Protected routes', () => {
  test('GET /api/teams without a token returns 401', async () => {
    const res = await request(app).get('/api/teams');
    expect(res.status).toBe(401);
  });

  test('GET /api/teams with an invalid token returns 401', async () => {
    const res = await request(app).get('/api/teams').set('Authorization', 'Bearer garbage-token');
    expect(res.status).toBe(401);
  });
});

describe('Teams — RBAC (admin-only writes)', () => {
  test('an admin can create a team', async () => {
    const { token } = await registerUser({ role: 'admin' });
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Legged Locomotion', description: 'quadruped research' });
    expect(res.status).toBe(201);
    expect(res.body.team.name).toBe('Legged Locomotion');
  });

  test('a member cannot create a team (403)', async () => {
    const { token } = await registerUser({ role: 'member' });
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Should Fail' });
    expect(res.status).toBe(403);
  });

  test('any authenticated user can list teams', async () => {
    const admin = await registerUser({ role: 'admin' });
    await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 'Perception' });

    const member = await registerUser({ role: 'member' });
    const res = await request(app).get('/api/teams').set('Authorization', `Bearer ${member.token}`);
    expect(res.status).toBe(200);
    expect(res.body.teams.some((t) => t.name === 'Perception')).toBe(true);
  });
});

describe('Runs — CRUD + ownership', () => {
  async function setupTeamAndOwner() {
    const admin = await registerUser({ role: 'admin' });
    const teamRes = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 'Soft Gripper' });
    return { admin, team: teamRes.body.team };
  }

  test('an authenticated user can create a run', async () => {
    const { admin, team } = await setupTeamAndOwner();
    const res = await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: team.id, title: 'Grasp test #1', category: 'Robotics', duration_sec: 90 });
    expect(res.status).toBe(201);
    expect(res.body.run.title).toBe('Grasp test #1');
  });

  test('rejects a run with an invalid category (400)', async () => {
    const { admin, team } = await setupTeamAndOwner();
    const res = await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: team.id, title: 'Bad run', category: 'Not A Category', duration_sec: 10 });
    expect(res.status).toBe(400);
    expect(res.body.errors.category).toBeDefined();
  });

  test('a different member cannot edit someone else\'s run (403)', async () => {
    const { admin, team } = await setupTeamAndOwner();
    const runRes = await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: team.id, title: 'Owned by admin', category: 'Robotics', duration_sec: 60 });

    const otherMember = await registerUser({ role: 'member' });
    const res = await request(app)
      .put(`/api/runs/${runRes.body.run.id}`)
      .set('Authorization', `Bearer ${otherMember.token}`)
      .send({ team_id: team.id, title: 'Hijacked', category: 'Robotics', duration_sec: 60 });
    expect(res.status).toBe(403);
  });

  test('the owner can delete their own run', async () => {
    const { admin, team } = await setupTeamAndOwner();
    const runRes = await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: team.id, title: 'To be deleted', category: 'Automation', duration_sec: 30 });

    const res = await request(app)
      .delete(`/api/runs/${runRes.body.run.id}`)
      .set('Authorization', `Bearer ${admin.token}`);
    expect(res.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/runs/${runRes.body.run.id}`)
      .set('Authorization', `Bearer ${admin.token}`);
    expect(getRes.status).toBe(404);
  });

  test('runs can be filtered by category via query params', async () => {
    const { admin, team } = await setupTeamAndOwner();
    await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: team.id, title: 'CV run', category: 'Computer Vision', duration_sec: 45 });
    await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: team.id, title: 'Robotics run', category: 'Robotics', duration_sec: 45 });

    const res = await request(app)
      .get('/api/runs?category=Computer Vision')
      .set('Authorization', `Bearer ${admin.token}`);
    expect(res.status).toBe(200);
    expect(res.body.runs.every((r) => r.category === 'Computer Vision')).toBe(true);
  });
});

describe('GET /api/dashboard', () => {
  test('returns aggregated stats consistent with the created runs', async () => {
    const admin = await registerUser({ role: 'admin' });
    const teamRes = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 'Drone SLAM' });

    await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: teamRes.body.team.id, title: 'Run A', category: 'Robotics', duration_sec: 100 });
    await request(app)
      .post('/api/runs')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ team_id: teamRes.body.team.id, title: 'Run B', category: 'Robotics', duration_sec: 200 });

    const res = await request(app).get('/api/dashboard').set('Authorization', `Bearer ${admin.token}`);
    expect(res.status).toBe(200);
    expect(res.body.summary.totalRuns).toBe(2);
    expect(res.body.summary.avgDurationSec).toBe(150);
  });
});
