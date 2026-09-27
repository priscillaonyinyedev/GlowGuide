import api from './api'

export const authService = {
  signup: (payload) => api.post('/auth/signup', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me').then((r) => r.data),
  verifyEmail: (token) => api.get('/auth/verify-email', { params: { token } }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  emailStatus: () => api.get('/auth/email-status').then((r) => r.data),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
}

const apiOrigin = new URL(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').origin
export const googleLoginUrl =
  import.meta.env.VITE_GOOGLE_LOGIN_URL || `${apiOrigin}/oauth2/authorization/google`
export const googleLoginEnabled = import.meta.env.VITE_GOOGLE_LOGIN_ENABLED === 'true'
