import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savingsGoalService } from '../services/savingsGoalService'

export function useSavingsGoals(month) {
  return useQuery({
    queryKey: ['savings-goals', month],
    queryFn:  () => savingsGoalService.getAll({ month }).then(r => r.data),
    enabled:  !!month,
  })
}

export function useCreateSavingsGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => savingsGoalService.create(data).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['savings-goals'] }),
  })
}

export function useUpdateSavingsGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => savingsGoalService.update(id, data).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['savings-goals'] }),
  })
}

export function useDeleteSavingsGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => savingsGoalService.remove(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['savings-goals'] }),
  })
}
