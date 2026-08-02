// Deterministic mock dataset: experiment runs logged over the last 16 weeks,
// across 4 research teams and 3 project categories. Seeded RNG so the data
// (and therefore the demo) is stable across server restarts.

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260721);

const TEAMS = ['Legged Locomotion', 'Soft Gripper', 'Drone SLAM', 'Perception'];
const CATEGORIES = ['Robotics', 'Computer Vision', 'Automation'];
const STATUSES = ['nominal', 'watch', 'failed'];
// weighted so most runs succeed, a minority need attention, few fail outright
const STATUS_WEIGHTS = [0.72, 0.19, 0.09];

function pickWeighted(items, weights) {
  const r = rand();
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (r <= acc) return items[i];
  }
  return items[items.length - 1];
}

function generateRuns() {
  const runs = [];
  const today = new Date('2026-07-25'); // fixed "today" for demo stability
  const WEEKS = 16;
  let runId = 1000;

  for (let w = WEEKS - 1; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - w * 7);

    // 8-22 runs logged per week, trending gently upward over time
    const baseCount = 8 + Math.round((WEEKS - w) * 0.6);
    const count = baseCount + Math.floor(rand() * 8);

    for (let i = 0; i < count; i++) {
      const dayOffset = Math.floor(rand() * 7);
      const date = new Date(weekStart);
      date.setDate(date.getDate() + dayOffset);

      const team = TEAMS[Math.floor(rand() * TEAMS.length)];
      const category =
        team === 'Perception'
          ? 'Computer Vision'
          : team === 'Drone SLAM'
          ? (rand() > 0.4 ? 'Robotics' : 'Computer Vision')
          : team === 'Soft Gripper'
          ? (rand() > 0.5 ? 'Robotics' : 'Automation')
          : 'Robotics';

      const status = pickWeighted(STATUSES, STATUS_WEIGHTS);
      const durationSec = Math.round(40 + rand() * 260);

      runs.push({
        id: `#${runId++}`,
        date: date.toISOString().slice(0, 10),
        team,
        category,
        status,
        durationSec,
      });
    }
  }
  return runs;
}

const RUNS = generateRuns();

module.exports = { RUNS, TEAMS, CATEGORIES };
