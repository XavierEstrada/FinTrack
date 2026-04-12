import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/adminService'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn:  () => adminService.getStats().then(r => r.data),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn:  () => adminService.getUsers().then(r => r.data),
  })
}
