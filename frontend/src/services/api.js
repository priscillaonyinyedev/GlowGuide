import axios from 'axios'

const TOKEN_KEY = 'glowguide_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalizes every failure into the ApiErrorResponse shape the Spring Boot
// GlobalExceptionHandler returns, so callers can rely on err.message existing.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear()
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ERR_NETWORK'
        ? 'GlowGuide could not reach the backend at http://localhost:8080. Start the Spring Boot API and try again.'
        : 'Something went wrong. Please try again.')
    return Promise.reject({ ...error, message })
  }
)

export default api
