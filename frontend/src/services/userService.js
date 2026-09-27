import api from './api'

export const userService = {
  updateProfile: (payload) => api.put('/users/me', payload).then((r) => r.data),
  updateSkinProfile: (payload) => api.put('/users/me/skin-profile', payload).then((r) => r.data),
  deleteAccount: () => api.delete('/users/me'),
  uploadProfileImage: (file) => {
    const body = new FormData()
    body.append('file', file)
    return api.post('/media/profile', body).then((r) => r.data)
  },
}

export const contactService = {
  send: (payload) => api.post('/contact', payload),
}

export const newsletterService = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
}
