import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useCreateSavingsGoal, useUpdateSavingsGoal } from '../../hooks/useSavingsGoals'
import { useCurrencySymbol } from '../../hooks/useCurrency'

const schema = z.object({
  name:         z.string().min(1, 'El nombre es requerido').max(60, 'Máximo 60 caracteres'),
  targetAmount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  month:        z.string().min(1, 'Selecciona un mes'),
})

const fieldCls = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
const labelCls = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5'
const errCls   = 'text-red-500 text-xs mt-1'

const currentMonth = new Date().toISOString().slice(0, 7)

export default function SavingsGoalModal({ isOpen, onClose, goal = null, defaultMonth }) {
  const { t } = useTranslation()
  const isEditing      = !!goal
  const currencySymbol = useCurrencySymbol()
  const createMutation = useCreateSavingsGoal()
  const updateMutation = useUpdateSavingsGoal()
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { month: defaultMonth ?? currentMonth, name: '', targetAmount: '' },
  })

  useEffect(() => {
    if (goal) {
      const monthStr = goal.month ? String(goal.month).slice(0, 7) : (defaultMonth ?? currentMonth)
      reset({ name: goal.name, targetAmount: goal.targetAmount, month: monthStr })
    } else {
      reset({ month: defaultMonth ?? currentMonth, name: '', targetAmount: '' })
    }
  }, [goal, isOpen, defaultMonth])

  const handleClose = () => {
    if (isDirty) setShowCloseConfirm(true)
    else onClose()
  }

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: goal.id, name: data.name, targetAmount: data.targetAmount })
      } else {
        await createMutation.mutateAsync({
          name:         data.name,
          targetAmount: data.targetAmount,
          month:        `${data.month}-01`,
        })
      }
      toast.success(isEditing ? t('savingsModal.updateSuccess') : t('savingsModal.createSuccess'))
      onClose()
    } catch {
      toast.error(t('savingsModal.saveError'))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} onRequestClose={handleClose} title={isEditing ? t('savingsModal.editTitle') : t('savingsModal.newTitle')} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

        <div>
          <label className={labelCls}>{t('savingsModal.goalName')}</label>
          <input
            {...register('name')}
            type="text"
            placeholder={t('savingsModal.goalNamePlaceholder')}
            className={fieldCls}
          />
          {errors.name && <p className={errCls}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelCls}>{t('savingsModal.targetAmount')}</label>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
            <span className="pl-3 pr-1.5 text-slate-400 dark:text-slate-500 text-sm shrink-0">{currencySymbol}</span>
            <input
              {...register('targetAmount')}
              type="number" step="0.01" min="0" placeholder="0.00"
              className="flex-1 py-2 pr-3 text-sm text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          {errors.targetAmount && <p className={errCls}>{errors.targetAmount.message}</p>}
        </div>

        <div>
          <label className={labelCls}>{t('common.month')}</label>
          <input
            {...register('month')}
            type="month"
            disabled={isEditing}
            className={`${fieldCls} ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.month && <p className={errCls}>{errors.month.message}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            {t('common.cancel')}
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {isSubmitting ? t('common.saving') : isEditing ? t('common.save') : t('savingsModal.createBtn')}
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={() => { setShowCloseConfirm(false); onClose() }}
        title={t('common.discardChanges')}
        description={t('common.unsavedChanges')}
        confirmLabel={t('common.discard')}
        variant="warning"
      />
    </Modal>
  )
}
