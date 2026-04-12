import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Modal from '../ui/Modal'
import { useCategories } from '../../hooks/useCategories'
import { useUpsertBudget } from '../../hooks/useBudgets'

const schema = z.object({
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  amount:     z.coerce.number().positive('El monto debe ser mayor a 0'),
  month:      z.string().min(1, 'Selecciona un mes'),
})

const field  = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
const label  = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5'
const errCls = 'text-red-500 text-xs mt-1'

const currentMonth = new Date().toISOString().slice(0, 7)

export default function BudgetModal({ isOpen, onClose, budget = null }) {
  const isEditing = !!budget
  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const upsertMutation = useUpsertBudget()

  const expenseCategories = categories.filter(c => c.type === 'expense')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { month: currentMonth },
  })

  useEffect(() => {
    if (budget) {
      // budget.month viene como "2026-04-01", el input type="month" necesita "2026-04"
      const monthStr = budget.month ? String(budget.month).slice(0, 7) : currentMonth
      reset({ categoryId: budget.categoryId, amount: budget.amount, month: monthStr })
    } else {
      reset({ month: currentMonth, categoryId: '', amount: '' })
    }
  }, [budget, isOpen])

  const onSubmit = async (data) => {
    try {
      // Convertir "2026-04" → "2026-04-01" (primer día del mes)
      await upsertMutation.mutateAsync({
        categoryId: data.categoryId,
        amount:     data.amount,
        month:      `${data.month}-01`,
      })
      toast.success(isEditing ? 'Presupuesto actualizado' : 'Presupuesto creado')
      onClose()
    } catch {
      toast.error('No se pudo guardar el presupuesto')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

        <div>
          <label className={label}>Categoría</label>
          <select {...register('categoryId')} className={field} disabled={isEditing || loadingCategories}>
            <option value="">{loadingCategories ? 'Cargando…' : 'Seleccionar categoría…'}</option>
            {expenseCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className={errCls}>{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className={label}>Monto límite mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              {...register('amount')}
              type="number" step="0.01" min="0" placeholder="0.00"
              className={`${field} pl-7`}
            />
          </div>
          {errors.amount && <p className={errCls}>{errors.amount.message}</p>}
        </div>

        <div>
          <label className={label}>Mes</label>
          <input {...register('month')} type="month" className={field} />
          {errors.month && <p className={errCls}>{errors.month.message}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear presupuesto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
