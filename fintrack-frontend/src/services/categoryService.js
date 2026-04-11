import api from './api'

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  remove: (id) => api.delete(`/categories/${id}`),
}
