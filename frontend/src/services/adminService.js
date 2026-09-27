import api from './api'

export const adminService = {
  uploadImage: (purpose, file) => {
    const body = new FormData()
    body.append('file', file)
    return api.post(`/admin/media/${purpose}`, body).then((r) => r.data)
  },
  overview: () => api.get('/admin/overview').then((r) => r.data),
  quizData: () => api.get('/admin/quiz-data').then((r) => r.data),
  analytics: () => api.get('/admin/analytics').then((r) => r.data),

  products: {
    list: (params) => api.get('/admin/products', { params }).then((r) => r.data),
    create: (payload) => api.post('/admin/products', payload).then((r) => r.data),
    update: (id, payload) => api.put(`/admin/products/${id}`, payload).then((r) => r.data),
    remove: (id) => api.delete(`/admin/products/${id}`),
  },
  brands: {
    list: () => api.get('/admin/brands').then((r) => r.data),
    create: (payload) => api.post('/admin/brands', payload).then((r) => r.data),
    update: (id, payload) => api.put(`/admin/brands/${id}`, payload).then((r) => r.data),
    remove: (id) => api.delete(`/admin/brands/${id}`),
  },
  categories: {
    list: () => api.get('/admin/categories').then((r) => r.data),
    create: (payload) => api.post('/admin/categories', payload).then((r) => r.data),
    update: (id, payload) => api.put(`/admin/categories/${id}`, payload).then((r) => r.data),
    remove: (id) => api.delete(`/admin/categories/${id}`),
  },
  ingredients: {
    list: (params) => api.get('/admin/ingredients', { params }).then((r) => r.data),
    create: (payload) => api.post('/admin/ingredients', payload).then((r) => r.data),
    update: (id, payload) => api.put(`/admin/ingredients/${id}`, payload).then((r) => r.data),
    remove: (id) => api.delete(`/admin/ingredients/${id}`),
  },
  users: {
    list: (params) => api.get('/admin/users', { params }).then((r) => r.data),
    updateRoles: (id, roles) => api.put(`/admin/users/${id}/roles`, { roles }).then((r) => r.data),
    setEnabled: (id, enabled) => api.put(`/admin/users/${id}/status`, { enabled }).then((r) => r.data),
  },
  orders: {
    list: (params) => api.get('/admin/orders', { params }).then((r) => r.data),
    updateStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data),
  },
  reviews: {
    list: (params) => api.get('/admin/reviews', { params }).then((r) => r.data),
    moderate: (id, status) => api.put(`/admin/reviews/${id}/status`, { status }).then((r) => r.data),
    remove: (id) => api.delete(`/admin/reviews/${id}`),
  },
}
