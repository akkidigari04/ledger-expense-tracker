const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (res.status === 204) return null;

  const json = await res.json().catch(() => ({ error: 'Invalid server response' }));

  if (!res.ok) {
    const message = json.errors
      ? json.errors.map((e) => e.msg).join(', ')
      : json.error || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return json;
}

// ── Expenses ──────────────────────────────────────────────────────────────
export const expensesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'All'))
    ).toString();
    return request(`/expenses${qs ? `?${qs}` : ''}`);
  },
  get:    (id)   => request(`/expenses/${id}`),
  create: (body) => request('/expenses', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id)   => request(`/expenses/${id}`, { method: 'DELETE' }),
  summary: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/expenses/summary${qs ? `?${qs}` : ''}`);
  },
  exportCSV: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'All'))
    ).toString();
    return `${BASE}/expenses/export${qs ? `?${qs}` : ''}`;
  },
};

// ── Budgets ───────────────────────────────────────────────────────────────
export const budgetsApi = {
  list:   ()             => request('/budgets'),
  upsert: (body)         => request('/budgets', { method: 'POST', body: JSON.stringify(body) }),
  delete: (category)     => request(`/budgets/${category}`, { method: 'DELETE' }),
};
