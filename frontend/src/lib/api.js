import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7860'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// ── Patients CRUD ────────────────────────────────────────────────────────────

export const patientApi = {
  getAll: () => api.get('/patients').then(r => r.data),

  getOne: (id) => api.get(`/patients/${id}`).then(r => r.data),

  create: (data) => api.post('/patients', data).then(r => r.data),

  update: (id, data) => api.put(`/patients/${id}`, data).then(r => r.data),

  delete: (id) => api.delete(`/patients/${id}`),

  regenerateRemarks: (id) =>
    api.post(`/patients/${id}/regenerate-remarks`).then(r => r.data),
}

// ── Error message helper ─────────────────────────────────────────────────────

export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (Array.isArray(detail)) {
      return detail.map(d => d.msg).join(', ')
    }
    return detail || error.message
  }
  return String(error)
}
