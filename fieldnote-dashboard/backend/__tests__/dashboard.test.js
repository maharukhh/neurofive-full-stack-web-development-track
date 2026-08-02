const request = require('supertest');
const app = require('../app');

describe('GET /api/meta', () => {
  test('returns team/category filter options and a date range', async () => {
    const res = await request(app).get('/api/meta');
    expect(res.status).toBe(200);
    expect(res.body.teams).toContain('All');
    expect(res.body.categories).toContain('All');
    expect(res.body.dateRange.min).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(res.body.dateRange.max).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('GET /api/dashboard — happy path', () => {
  test('with no filters, returns aggregated data for the full dataset', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.summary.totalRuns).toBeGreaterThan(0);
    expect(Array.isArray(res.body.runsByWeek)).toBe(true);
    expect(Array.isArray(res.body.successTrend)).toBe(true);
    expect(Array.isArray(res.body.categoryBreakdown)).toBe(true);
  });

  test('summary.successRate is consistent with categoryBreakdown totals', async () => {
    const res = await request(app).get('/api/dashboard');
    const breakdownTotal = res.body.categoryBreakdown.reduce((sum, c) => sum + c.value, 0);
    expect(breakdownTotal).toBe(res.body.summary.totalRuns);
  });

  test('filtering by a single category narrows categoryBreakdown to just that category', async () => {
    const res = await request(app).get('/api/dashboard').query({ category: 'Robotics' });
    expect(res.status).toBe(200);
    expect(res.body.categoryBreakdown).toHaveLength(1);
    expect(res.body.categoryBreakdown[0].name).toBe('Robotics');
  });

  test('filtering by team narrows activeTeams to 1', async () => {
    const res = await request(app).get('/api/dashboard').query({ team: 'Perception' });
    expect(res.status).toBe(200);
    expect(res.body.summary.activeTeams).toBe(1);
  });

  test('a date range outside the dataset returns zeroed summary, not an error', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .query({ from: '2099-01-01', to: '2099-01-31' });
    expect(res.status).toBe(200);
    expect(res.body.summary.totalRuns).toBe(0);
    expect(res.body.summary.successRate).toBe(0);
    expect(res.body.categoryBreakdown).toHaveLength(0);
  });
});

describe('GET /api/dashboard — failure cases', () => {
  test('rejects a malformed "from" date with 400', async () => {
    const res = await request(app).get('/api/dashboard').query({ from: 'not-a-date' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/from/i);
  });

  test('rejects a malformed "to" date with 400', async () => {
    const res = await request(app).get('/api/dashboard').query({ to: '07/25/2026' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/to/i);
  });

  test('rejects an unknown category with 400', async () => {
    const res = await request(app).get('/api/dashboard').query({ category: 'Underwater Basket Weaving' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/category/i);
  });

  test('rejects an unknown team with 400', async () => {
    const res = await request(app).get('/api/dashboard').query({ team: 'Not A Real Team' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/team/i);
  });
});
