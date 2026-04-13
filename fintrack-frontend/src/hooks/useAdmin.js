import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useCreateSystemCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => adminService.createSystemCategory(data).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateSystemCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateSystemCategory(id, data).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteSystemCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminService.deleteSystemCategory(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}
