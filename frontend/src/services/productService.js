import api from './api'

export const productService = {
  list: (params) => api.get('/products', { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
  featured: () => api.get('/products/featured').then((r) => r.data),
  related: (slug) => api.get(`/products/${slug}/related`).then((r) => r.data),
  create: (payload) => api.post('/admin/products', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/admin/products/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/admin/products/${id}`),
}
