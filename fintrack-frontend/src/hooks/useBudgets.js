import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '../services/budgetService'

export function useBudgets(month) {
  return useQuery({
    queryKey: ['budgets', month],
    queryFn:  () => budgetService.getAll({ month }).then(r => r.data),
    enabled:  !!month,
  })
}

export function useUpsertBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => budgetService.create(data).then(r => r.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}

export function useDeleteBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => budgetService.remove(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}
