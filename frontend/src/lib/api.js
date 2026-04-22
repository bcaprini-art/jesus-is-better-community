const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4004'

function getToken() {
  return localStorage.getItem('jib_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),

  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/api/auth/me'),

  // Sermons
  getSermons: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/sermons${qs ? '?' + qs : ''}`)
  },
  getSermon: (id) => request(`/api/sermons/${id}`),
  getComments: (sermonId) => request(`/api/sermons/${sermonId}/comments`),
  postComment: (sermonId, body) => request(`/api/sermons/${sermonId}/comments`, { method: 'POST', body: JSON.stringify(body) }),
  likeComment: (commentId) => request(`/api/comments/${commentId}/like`, { method: 'POST' }),

  // Prayers
  getPrayers: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/prayers${qs ? '?' + qs : ''}`)
  },
  postPrayer: (body) => request('/api/prayers', { method: 'POST', body: JSON.stringify(body) }),
  prayFor: (id) => request(`/api/prayers/${id}/pray`, { method: 'POST' }),
  markAnswered: (id) => request(`/api/prayers/${id}/answered`, { method: 'PATCH' }),

  // Dashboard
  getDashboard: () => request('/api/dashboard'),
}
