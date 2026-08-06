const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4001';

function getToken() {
  return localStorage.getItem('fieldnote_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // 204 No Content etc. — no body to parse
  }

  if (!res.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.status = res.status;
    error.fieldErrors = data?.errors || null;
    throw error;
  }
  return data;
}

// ---- auth ----
export const register = (payload) => request('/api/auth/register', { method: 'POST', body: payload, auth: false });
export const login = (payload) => request('/api/auth/login', { method: 'POST', body: payload, auth: false });
export const fetchMe = () => request('/api/auth/me');

// ---- teams ----
export const fetchTeams = () => request('/api/teams');
export const createTeam = (payload) => request('/api/teams', { method: 'POST', body: payload });
export const updateTeam = (id, payload) => request(`/api/teams/${id}`, { method: 'PUT', body: payload });
export const deleteTeam = (id) => request(`/api/teams/${id}`, { method: 'DELETE' });

// ---- runs ----
export const fetchRuns = (params = {}) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return request(`/api/runs${qs ? `?${qs}` : ''}`);
};
export const fetchRun = (id) => request(`/api/runs/${id}`);
export const createRun = (payload) => request('/api/runs', { method: 'POST', body: payload });
export const updateRun = (id, payload) => request(`/api/runs/${id}`, { method: 'PUT', body: payload });
export const deleteRun = (id) => request(`/api/runs/${id}`, { method: 'DELETE' });

// ---- dashboard ----
export const fetchDashboard = () => request('/api/dashboard');

export { getToken };
