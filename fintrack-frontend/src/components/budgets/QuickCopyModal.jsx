import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ClipboardCopy } from 'lucide-react'
import Modal from '../ui/Modal'
import CategoryIcon from '../ui/CategoryIcon'
import { useBudgets, useUpsertBudget } from '../../hooks/useBudgets'
import { useFormatCurrency } from '../../hooks/useCurrency'

/** Devuelve el mes anterior en formato YYYY-MM */
function prevMonthOf(ym) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number)
  const label = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(y, m - 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export default function QuickCopyModal({ isOpen, onClose, targetMonth, existingBudgets = [] }) {
  const fmt          = useFormatCurrency()
  const sourceMonth  = prevMonthOf(targetMonth)
  const upsert       = useUpsertBudget()

  const { data: sourceBudgets = [], isLoading } = useBudgets(isOpen ? sourceMonth : null)

  // Categorías que ya tienen presupuesto en el mes destino
  const existingCatIds = new Set(existingBudgets.map(b => b.categoryId))

  // Elegibles: mensuales del mes origen que aún no existen en el destino
  const eligible = sourceBudgets.filter(b => !b.isAnnual && !existingCatIds.has(b.categoryId))

  const [selected, setSelected]   = useState(new Set())
  const [submitting, setSubmitting] = useState(false)

  // Al abrir: seleccionar todos por defecto
  useEffect(() => {
    if (isOpen) setSelected(new Set(eligible.map(b => b.categoryId)))
  }, [isOpen, eligible.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (catId) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(catId) ? next.delete(catId) : next.add(catId)
      return next
    })

  const allChecked = selected.size > 0 && selected.size === eligible.length
  const toggleAll  = () => setSelected(allChecked ? new Set() : new Set(eligible.map(b => b.categoryId)))

  const handleCopy = async () => {
    const toBeCopied = eligible.filter(b => selected.has(b.categoryId))
    if (!toBeCopied.length) return

    setSubmitting(true)
    const results = await Promise.allSettled(
      toBeCopied.map(b =>
        upsert.mutateAsync({
          categoryId: b.categoryId,
          amount:     b.amount,
          month:      `${targetMonth}-01`,
          isAnnual:   false,
        })
      )
    )
    setSubmitting(false)

    const ok  = results.filter(r => r.status === 'fulfilled').length
    const err = results.filter(r => r.status === 'rejected').length

    if (ok > 0)  toast.success(`${ok} presupuesto${ok !== 1 ? 's' : ''} copiado${ok !== 1 ? 's' : ''} correctamente`)
    if (err > 0) toast.error(`${err} presupuesto${err !== 1 ? 's' : ''} no se pudo${err !== 1 ? 'ron' : ''} copiar`)

    onClose()
  }

  const emptyMsg = isLoading
    ? null
    : sourceBudgets.length === 0
      ? `No hay presupuestos en ${monthLabel(sourceMonth)} para copiar.`
      : eligible.length === 0
        ? 'Todos los presupuestos disponibles ya están configurados para este mes.'
        : null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <ClipboardCopy size={16} className="text-indigo-500" />
          Copiar presupuestos
        </span>
      }
      size="sm"
    >
      <div className="px-6 pt-1 pb-5 space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Selecciona los presupuestos de{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{monthLabel(sourceMonth)}</span>
          {' '}que quieres copiar a{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{monthLabel(targetMonth)}</span>.
          Se copiarán con el mismo monto y podrás editarlos después.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : emptyMsg ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">{emptyMsg}</p>
        ) : (
          <>
            {/* Encabezado seleccionar todos */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Seleccionar todos</span>
              </label>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {selected.size} de {eligible.length} seleccionado{selected.size !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Lista de presupuestos */}
            <div className="space-y-1 max-h-60 overflow-y-auto -mx-2 px-2">
              {eligible.map(b => {
                const isChecked = selected.has(b.categoryId)
                const color     = b.categoryColor ?? '#94a3b8'
                return (
                  <label
                    key={b.categoryId}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-700/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(b.categoryId)}
                      className="w-4 h-4 rounded accent-indigo-600 shrink-0 cursor-pointer"
                    />
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: color + '20', color }}
                    >
                      <CategoryIcon name={b.categoryIcon} size={14} />
                    </div>
                    <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {b.categoryName}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      {fmt(b.amount)}
                    </span>
                  </label>
                )
              })}
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
          >
            Cancelar
          </button>
          {!emptyMsg && (
            <button
              type="button"
              onClick={handleCopy}
              disabled={submitting || selected.size === 0}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting
                ? 'Copiando…'
                : `Copiar ${selected.size > 0 ? selected.size : ''} presupuesto${selected.size !== 1 ? 's' : ''}`
              }
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
