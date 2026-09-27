import api from './api'

export const quizService = {
  submit: (answers) => api.post('/quiz/submit', answers).then((r) => r.data),
  myResults: () => api.get('/quiz/results').then((r) => r.data),
  latestResult: () => api.get('/quiz/results/latest').then((r) => r.data),
}

export const recommendationService = {
  forLatestQuiz: () => api.get('/recommendations').then((r) => r.data),
  forQuizResult: (quizResultId) =>
    api.get(`/recommendations/${quizResultId}`).then((r) => r.data),
}
