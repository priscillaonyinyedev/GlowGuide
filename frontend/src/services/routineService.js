import api from './api'

export const routineService = {
  list: () => api.get('/routines').then((r) => r.data),
  get: (id) => api.get(`/routines/${id}`).then((r) => r.data),
  create: (payload) => api.post('/routines', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/routines/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/routines/${id}`),
}
