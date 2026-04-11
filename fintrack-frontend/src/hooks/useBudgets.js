import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '../services/budgetService'

export function useBudgets(params) {
  return useQuery({
    queryKey: ['budgets', params],
    queryFn: () => budgetService.getAll(params).then((r) => r.data),
  })
}

export function useCreateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => budgetService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}
