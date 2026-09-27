import api from './api'

export const brandService = {
  list: () => api.get('/brands').then((r) => r.data),
  getBySlug: (slug) => api.get(`/brands/${slug}`).then((r) => r.data),
}

export const categoryService = {
  list: () => api.get('/categories').then((r) => r.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then((r) => r.data),
}

export const ingredientService = {
  list: (params) => api.get('/ingredients', { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/ingredients/${slug}`).then((r) => r.data),
}

export const articleService = {
  list: (params) => api.get('/articles', { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/articles/${slug}`).then((r) => r.data),
}
