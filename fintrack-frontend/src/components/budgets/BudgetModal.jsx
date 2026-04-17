import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CalendarRange } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import ConfirmDialog from '../ui/ConfirmDialog'
import CategorySelect from '../ui/CategorySelect'
import { useCategories } from '../../hooks/useCategories'
import { useBudgets, useUpsertBudget } from '../../hooks/useBudgets'
import { useCurrencySymbol } from '../../hooks/useCurrency'
import { budgetService } from '../../services/budgetService'

const schema = z.object({
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  amount:     z.coerce.number().positive('El monto debe ser mayor a 0'),
  month:      z.string().min(1, 'Selecciona un mes'),
  isAnnual:   z.boolean().optional(),
})

const field  = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
const label  = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5'
const errCls = 'text-red-500 text-xs mt-1'

const currentMonth = new Date().toISOString().slice(0, 7)

export default function BudgetModal({ isOpen, onClose, budget = null, defaultMonth }) {
  const { t } = useTranslation()
  const isEditing      = !!budget
  const currencySymbol = useCurrencySymbol()
  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const upsertMutation = useUpsertBudget()
  const [showAnnualConfirm, setShowAnnualConfirm] = useState(false)
  const [pendingData, setPendingData]             = useState(null)
  const [cleaning, setCleaning]                   = useState(false)

  const expenseCategories = categories.filter(c => c.type === 'expense')

  const { register, handleSubmit, reset, watch, control, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { month: defaultMonth ?? currentMonth, isAnnual: false },
  })

  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const handleClose = () => {
    if (isDirty) setShowCloseConfirm(true)
    else onClose()
  }

  const isAnnual      = watch('isAnnual')
  const selectedMonth = watch('month')

  // Categorías ya presupuestadas para el mes seleccionado.
  // Los presupuestos anuales aparecen en la respuesta de cualquier mes del año,
  // por lo que bloquean la categoría en todos los meses automáticamente.
  const { data: existingBudgets = [] } = useBudgets(selectedMonth)
  const takenIds = isEditing
    ? new Set()
    : new Set(existingBudgets.map(b => b.categoryId))

  const availableCategories = expenseCategories.filter(c => !takenIds.has(c.id))
  const allTaken = !isEditing && !loadingCategories && expenseCategories.length > 0 && availableCategories.length === 0

  useEffect(() => {
    if (budget) {
      const monthStr = budget.month ? String(budget.month).slice(0, 7) : currentMonth
      reset({
        categoryId: budget.categoryId,
        amount:     budget.amount,
        month:      monthStr,
        isAnnual:   budget.isAnnual ?? false,
      })
    } else {
      reset({ month: defaultMonth ?? currentMonth, categoryId: '', amount: '', isAnnual: false })
    }
  }, [budget, isOpen, defaultMonth])

  const doSave = async (data) => {
    try {
      const monthValue = data.isAnnual
        ? `${data.month.slice(0, 4)}-01-01`
        : `${data.month}-01`

      // If creating as annual, delete any existing monthly budgets for this
      // category across all 12 months of the selected year first
      if (!isEditing && data.isAnnual) {
        setCleaning(true)
        const year = data.month.slice(0, 4)
        const months = Array.from({ length: 12 }, (_, i) =>
          `${year}-${String(i + 1).padStart(2, '0')}`
        )
        const results = await Promise.all(
          months.map(m => budgetService.getAll({ month: m }).then(r => r.data).catch(() => []))
        )
        const toDelete = results.flat().filter(b => b.categoryId === data.categoryId && !b.isAnnual)
        await Promise.allSettled(toDelete.map(b => budgetService.remove(b.id)))
        setCleaning(false)
      }

      await upsertMutation.mutateAsync({
        categoryId: data.categoryId,
        amount:     data.amount,
        month:      monthValue,
        isAnnual:   data.isAnnual ?? false,
      })
      toast.success(isEditing ? t('budgetModal.updateSuccess') : t('budgetModal.createSuccess'))
      onClose()
    } catch {
      setCleaning(false)
      toast.error(t('budgetModal.saveError'))
    }
  }

  const onSubmit = (data) => {
    if (!isEditing && data.isAnnual) {
      setPendingData(data)
      setShowAnnualConfirm(true)
    } else {
      doSave(data)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} onRequestClose={handleClose} title={isEditing ? t('budgetModal.editTitle') : t('budgetModal.newTitle')} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

        <div>
          <label className={label}>{t('common.category')}</label>
          {allTaken ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50">
              {t('budgetModal.allCategoriesUsed')}
            </p>
          ) : (
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <CategorySelect
                  categories={isEditing ? expenseCategories : availableCategories}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isEditing}
                  loading={loadingCategories}
                />
              )}
            />
          )}
          {errors.categoryId && <p className={errCls}>{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className={label}>{t('budgetModal.limitAmount')}</label>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
            <span className="pl-3 pr-1.5 text-slate-400 dark:text-slate-500 text-sm shrink-0">{currencySymbol}</span>
            <input
              {...register('amount')}
              type="number" step="0.01" min="0" placeholder="0.00"
              className="flex-1 py-2 pr-3 text-sm text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          {errors.amount && <p className={errCls}>{errors.amount.message}</p>}
        </div>

        {/* Annual toggle */}
        <Controller
          name="isAnnual"
          control={control}
          render={({ field }) => (
            <div>
              <label className={`flex items-start gap-3 select-none ${isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={!!field.value}
                    onChange={e => !isEditing && field.onChange(e.target.checked)}
                    disabled={isEditing}
                  />
                  <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${field.value ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${field.value ? 'translate-x-4' : ''}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <CalendarRange size={14} className="text-indigo-500" />
                    {t('budgetModal.annualBudget')}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {t('budgetModal.annualHint')}
                  </p>
                </div>
              </label>
              {isEditing && (
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-1.5 ml-12">
                  {t('budgetModal.changeTypeWarning')}
                </p>
              )}
            </div>
          )}
        />

        <div>
          <label className={label}>{isAnnual ? t('common.year') : t('common.month')}</label>
          <input
            {...register('month')}
            type="month"
            className={field}
          />
          {isAnnual && (
            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1 flex items-center gap-1">
              <CalendarRange size={11} />
              {t('budgetModal.yearOnly', { year: watch('month')?.slice(0, 4) ?? '…' })}
            </p>
          )}
          {errors.month && <p className={errCls}>{errors.month.message}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            {t('common.cancel')}
          </button>
          <button type="submit" disabled={isSubmitting || cleaning || allTaken}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {cleaning ? t('common.processing') : isSubmitting ? t('common.saving') : isEditing ? t('common.save') : t('budgetModal.createBtn')}
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

      <ConfirmDialog
        isOpen={showAnnualConfirm}
        onClose={() => { setShowAnnualConfirm(false); setPendingData(null) }}
        onConfirm={() => { setShowAnnualConfirm(false); doSave(pendingData) }}
        title={t('budgetModal.confirmAnnualTitle')}
        description={t('budgetModal.confirmAnnualBody', { year: pendingData?.month?.slice(0, 4) ?? '…' })}
        confirmLabel={t('common.confirm')}
        loadingLabel={t('common.processing')}
        variant="warning"
      />
    </Modal>
  )
}
