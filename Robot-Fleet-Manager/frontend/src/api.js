const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (err) {
    throw new Error("Can't reach the server. Is the backend running?");
  }

  if (res.status === 204) return null;

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body (e.g. some error responses)
  }

  if (!res.ok) {
    throw new Error(body?.error || `Request failed with status ${res.status}`);
  }

  return body;
}

export const api = {
  list: () => request("/robots"),
  create: (data) =>
    request("/robots", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/robots/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/robots/${id}`, { method: "DELETE" }),
};
