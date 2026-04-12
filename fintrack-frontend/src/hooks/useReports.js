import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'

export function useSummary(from, to) {
  return useQuery({
    queryKey: ['reports', 'summary', from, to],
    queryFn:  () => reportService.getSummary({ from, to }).then(r => r.data),
    enabled:  !!(from && to),
  })
}

export function useByCategory(from, to) {
  return useQuery({
    queryKey: ['reports', 'by-category', from, to],
    queryFn:  () => reportService.getByCategory({ from, to }).then(r => r.data),
    enabled:  !!(from && to),
  })
}

export function useMonthlyTrend(months = 6) {
  return useQuery({
    queryKey: ['reports', 'monthly-trend', months],
    queryFn:  () => reportService.getMonthlyTrend({ months }).then(r => r.data),
  })
}
