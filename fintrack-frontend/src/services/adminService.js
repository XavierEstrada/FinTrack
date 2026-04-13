import api from './api'

export const adminService = {
  getStats: ()             => api.get('/admin/stats'),
  getUsers: ()             => api.get('/admin/users'),

  // System categories
  createSystemCategory: (data)     => api.post('/admin/categories', data),
  updateSystemCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteSystemCategory: (id)       => api.delete(`/admin/categories/${id}`),
}
