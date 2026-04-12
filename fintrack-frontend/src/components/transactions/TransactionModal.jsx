import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Modal from '../ui/Modal'
import { useCategories } from '../../hooks/useCategories'
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/useTransactions'

const schema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount:      z.coerce.number().positive('El monto debe ser mayor a 0'),
  type:        z.enum(['income', 'expense']),
  categoryId:  z.string().min(1, 'Selecciona una categoría'),
  date:        z.string().min(1, 'La fecha es requerida'),
})

const field  = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500'
const label  = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5'
const errCls = 'text-red-500 text-xs mt-1'

export default function TransactionModal({ isOpen, onClose, transaction = null }) {
  const isEditing = !!transaction
  const today     = new Date().toISOString().split('T')[0]

  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'expense', date: today },
  })

  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount:      transaction.amount,
        type:        transaction.type,
        categoryId:  transaction.categoryId ?? '',
        date:        transaction.date?.split('T')[0] ?? today,
      })
    } else {
      reset({ type: 'expense', date: today, categoryId: '', description: '', amount: '' })
    }
  }, [transaction, isOpen])

  const selectedType        = watch('type')
  const filteredCategories  = categories.filter(c => c.type === selectedType)

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: transaction.id, data })
        toast.success('Transacción actualizada', { description: data.description })
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Transacción agregada', { description: data.description })
      }
      onClose()
    } catch {
      toast.error('No se pudo guardar la transacción')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar transacción' : 'Nueva transacción'}>
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

        {/* Tipo */}
        <div>
          <p className={label}>Tipo</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'expense', label: 'Gasto',   active: 'bg-rose-500 text-white border-rose-500'       },
              { value: 'income',  label: 'Ingreso',  active: 'bg-emerald-500 text-white border-emerald-500' },
            ].map(opt => (
              <label
                key={opt.value}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                  selectedType === opt.value
                    ? opt.active
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <input type="radio" value={opt.value} {...register('type')} className="sr-only" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className={label}>Descripción</label>
          <input
            {...register('description')}
            placeholder="Ej: Supermercado, Salario…"
            className={field}
          />
          {errors.description && <p className={errCls}>{errors.description.message}</p>}
        </div>

        {/* Monto y fecha */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Monto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                {...register('amount')}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`${field} pl-7`}
              />
            </div>
            {errors.amount && <p className={errCls}>{errors.amount.message}</p>}
          </div>

          <div>
            <label className={label}>Fecha</label>
            <input {...register('date')} type="date" className={field} />
            {errors.date && <p className={errCls}>{errors.date.message}</p>}
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className={label}>Categoría</label>
          <select {...register('categoryId')} className={field} disabled={loadingCategories}>
            <option value="">
              {loadingCategories ? 'Cargando categorías…' : 'Seleccionar categoría…'}
            </option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className={errCls}>{errors.categoryId.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              selectedType === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Agregar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
