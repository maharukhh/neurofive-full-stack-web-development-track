const API_BASE = 'http://localhost:4000';

export async function fetchMeta() {
  const res = await fetch(`${API_BASE}/api/meta`);
  if (!res.ok) throw new Error('Failed to load filter options');
  return res.json();
}

export async function fetchDashboard(filters) {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters.team && filters.team !== 'All') params.set('team', filters.team);

  const res = await fetch(`${API_BASE}/api/dashboard?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load dashboard data');
  return res.json();
}
