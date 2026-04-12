import api from './api'

export const reportService = {
  getSummary:     (params) => api.get('/reports/summary',       { params }),
  getByCategory:  (params) => api.get('/reports/by-category',   { params }),
  getMonthlyTrend:(params) => api.get('/reports/monthly-trend', { params }),
}
