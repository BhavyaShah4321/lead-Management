import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// ── Leads ──────────────────────────────────────────────────────────────────────

/**
 * GET /api/leads
 * @param {Object} params - Optional query params: { search, status }
 */
export const getLeads = (params = {}) => {
  return api.get('/leads', { params });
};

/**
 * POST /api/leads
 * @param {Object} data - { name, email, phone, status }
 */
export const createLead = (data) => {
  return api.post('/leads', data);
};

/**
 * GET /api/leads/:id
 * @param {string} id - Lead MongoDB _id
 */
export const getLeadById = (id) => {
  return api.get(`/leads/${id}`);
};

/**
 * PATCH /api/leads/:id
 * @param {string} id   - Lead MongoDB _id
 * @param {Object} data - Fields to update (partial)
 */
export const updateLead = (id, data) => {
  return api.patch(`/leads/${id}`, data);
};

/**
 * DELETE /api/leads/:id
 * @param {string} id - Lead MongoDB _id
 */
export const deleteLead = (id) => {
  return api.delete(`/leads/${id}`);
};

// ── Notes ──────────────────────────────────────────────────────────────────────

/**
 * GET /api/leads/:id/notes
 * @param {string} leadId - Lead MongoDB _id
 */
export const getNotesByLead = (leadId) => {
  return api.get(`/leads/${leadId}/notes`);
};

/**
 * POST /api/leads/:id/notes
 * @param {string} leadId - Lead MongoDB _id
 * @param {Object} data   - { content }
 */
export const createNote = (leadId, data) => {
  return api.post(`/leads/${leadId}/notes`, data);
};
