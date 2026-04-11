import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'

export function useTransactions(params) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getAll(params).then((r) => r.data),
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => transactionService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  })
}
