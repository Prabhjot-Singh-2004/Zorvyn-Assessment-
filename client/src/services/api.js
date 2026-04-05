const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getHeaders = (includeAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  post: async (endpoint, body, includeAuth = true) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  put: async (endpoint, body) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  patch: async (endpoint, body) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  }
};

export default api;
