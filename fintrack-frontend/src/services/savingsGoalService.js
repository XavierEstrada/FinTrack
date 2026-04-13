import api from './api'

export const savingsGoalService = {
  getAll: (params) => api.get('/savings-goals', { params }),
  create: (data)   => api.post('/savings-goals', data),
  update: (id, data) => api.put(`/savings-goals/${id}`, data),
  remove: (id)     => api.delete(`/savings-goals/${id}`),
}
