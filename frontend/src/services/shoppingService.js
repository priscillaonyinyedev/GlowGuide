import api from './api'

export const wishlistService = {
  get: () => api.get('/wishlist').then((r) => r.data),
  add: (productId) => api.post(`/wishlist/${productId}`).then((r) => r.data),
  remove: (productId) => api.delete(`/wishlist/${productId}`).then((r) => r.data),
}

export const cartService = {
  get: () => api.get('/cart').then((r) => r.data),
  addItem: (productId, quantity = 1) =>
    api.post('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (productId, quantity) =>
    api.put(`/cart/items/${productId}`, { quantity }).then((r) => r.data),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`).then((r) => r.data),
  clear: () => api.delete('/cart').then((r) => r.data),
}

export const orderService = {
  checkout: (payload) => api.post('/orders', payload).then((r) => r.data),
  myOrders: () => api.get('/orders').then((r) => r.data),
  get: (id) => api.get(`/orders/${id}`).then((r) => r.data),
}

export const reviewService = {
  forProduct: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }).then((r) => r.data),
  create: (productId, payload) =>
    api.post(`/reviews/product/${productId}`, payload).then((r) => r.data),
}
