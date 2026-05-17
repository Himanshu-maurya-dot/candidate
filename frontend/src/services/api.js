import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Candidate APIs ──────────────────────────────────────────
export const addCandidate = (data) => api.post('/api/candidates', data);

export const getAllCandidates = (params = {}) =>
  api.get('/api/candidates', { params });

export const deleteCandidate = (id) => api.delete(`/api/candidates/${id}`);

// ── Match API ───────────────────────────────────────────────
export const matchCandidates = (data) => api.post('/api/match', data);

// ── AI API ──────────────────────────────────────────────────
export const aiShortlist = (data) => api.post('/api/ai/shortlist', data);

export default api;
