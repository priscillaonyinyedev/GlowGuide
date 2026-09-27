import api from './api'

export const assistantService = {
  ask: (message) => api.post('/assistant/ask', { message }).then((response) => response.data),
}
