const express = require('express');
const cors = require('cors');
const { RUNS, TEAMS, CATEGORIES } = require('./data');

const app = express();
app.use(cors());

// ---------- helpers ----------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isoWeekLabel(dateStr) {
  const d = new Date(dateStr);
  // Monday-start week bucket, labeled by that Monday's date
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

function filterRuns({ from, to, category, team }) {
  return RUNS.filter((r) => {
    if (from && r.date < from) return false;
    if (to && r.date > to) return false;
    if (category && category !== 'All' && r.category !== category) return false;
    if (team && team !== 'All' && r.team !== team) return false;
    return true;
  });
}

// ---------- routes ----------

// Filter option lists (static, but served from the backend as the source of truth)
app.get('/api/meta', (req, res) => {
  res.json({
    teams: ['All', ...TEAMS],
    categories: ['All', ...CATEGORIES],
    dateRange: {
      min: RUNS.reduce((min, r) => (r.date < min ? r.date : min), RUNS[0].date),
      max: RUNS.reduce((max, r) => (r.date > max ? r.date : max), RUNS[0].date),
    },
  });
});

// Main aggregation endpoint — every number here is computed server-side
// from the filtered run set, not pre-baked.
app.get('/api/dashboard', (req, res) => {
  const { from, to, category, team } = req.query;

  // ---- basic input validation (a real failure case for the test suite) ----
  if (from && !DATE_RE.test(from)) {
    return res.status(400).json({ error: 'Invalid "from" date, expected YYYY-MM-DD' });
  }
  if (to && !DATE_RE.test(to)) {
    return res.status(400).json({ error: 'Invalid "to" date, expected YYYY-MM-DD' });
  }
  if (category && category !== 'All' && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `Unknown category: ${category}` });
  }
  if (team && team !== 'All' && !TEAMS.includes(team)) {
    return res.status(400).json({ error: `Unknown team: ${team}` });
  }

  const runs = filterRuns({ from, to, category, team });

  // ---- summary stat cards ----
  const totalRuns = runs.length;
  const nominalCount = runs.filter((r) => r.status === 'nominal').length;
  const successRate = totalRuns ? Math.round((nominalCount / totalRuns) * 1000) / 10 : 0;
  const activeTeams = new Set(runs.map((r) => r.team)).size;
  const avgDurationSec = totalRuns
    ? Math.round(runs.reduce((sum, r) => sum + r.durationSec, 0) / totalRuns)
    : 0;

  // ---- runs per week (bar) ----
  const weekMap = new Map();
  runs.forEach((r) => {
    const wk = isoWeekLabel(r.date);
    weekMap.set(wk, (weekMap.get(wk) || 0) + 1);
  });
  const runsByWeek = [...weekMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([week, count]) => ({ week, count }));

  // ---- success rate trend per week (line) ----
  const weekStatusMap = new Map();
  runs.forEach((r) => {
    const wk = isoWeekLabel(r.date);
    if (!weekStatusMap.has(wk)) weekStatusMap.set(wk, { total: 0, nominal: 0 });
    const entry = weekStatusMap.get(wk);
    entry.total += 1;
    if (r.status === 'nominal') entry.nominal += 1;
  });
  const successTrend = [...weekStatusMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([week, { total, nominal }]) => ({
      week,
      rate: total ? Math.round((nominal / total) * 1000) / 10 : 0,
    }));

  // ---- category breakdown (donut) ----
  const catMap = new Map();
  runs.forEach((r) => {
    catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
  });
  const categoryBreakdown = [...catMap.entries()].map(([name, value]) => ({ name, value }));

  res.json({
    summary: { totalRuns, successRate, activeTeams, avgDurationSec },
    runsByWeek,
    successTrend,
    categoryBreakdown,
  });
});

module.exports = app;
