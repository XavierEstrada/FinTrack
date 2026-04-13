import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2, CalendarRange, Bookmark, AlertTriangle, Ban, ClipboardCopy } from 'lucide-react'
import { SkeletonCardGrid } from '../components/ui/Skeleton'
import CategoryIcon from '../components/ui/CategoryIcon'
import { motion } from 'framer-motion'
import { useFormatCurrency } from '../hooks/useCurrency'
import { useBudgets, useDeleteBudget } from '../hooks/useBudgets'
import { useCategories } from '../hooks/useCategories'
import BudgetModal from '../components/budgets/BudgetModal'
import QuickCopyModal from '../components/budgets/QuickCopyModal'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import CategoryFormModal from '../components/categories/CategoryFormModal'
import { toast } from 'sonner'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const cardItem  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } }

function progressColor(pct) {
  if (pct >= 100) return 'bg-rose-500'
  if (pct >= 70)  return 'bg-amber-400'
  return 'bg-emerald-500'
}

// Devuelve la zona de estado del presupuesto
function budgetZone(pct, over) {
  if (over)       return 'exceeded'   // >100%
  if (pct >= 100) return 'full'       // exactamente 100%
  if (pct >= 70)  return 'warning'    // 70–99%
  return 'ok'
}

function toYearMonth(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthDisplay(ym) {
  const [year, month] = ym.split('-')
  const label = new Intl.DateTimeFormat('es-ES', { month: 'long' })
    .format(new Date(Number(year), Number(month) - 1))
  return `${label.charAt(0).toUpperCase() + label.slice(1)} ${year}`
}

const badgeStyles = {
  ok:       'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
  warning:  'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  full:     'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  exceeded: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
}

function BudgetCard({ budget, onEdit, onDelete, index }) {
  const fmt       = useFormatCurrency()
  const pct       = budget.amount > 0 ? Math.min((budget.spent / budget.amount) * 100, 100) : 0
  const remaining = budget.amount - budget.spent
  const over      = budget.spent > budget.amount
  const color     = budget.categoryColor ?? '#94a3b8'
  const zone      = budgetZone(pct, over)

  return (
    <motion.div variants={cardItem}
      className={`bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${
        zone === 'ok'
          ? 'border-slate-200 dark:border-slate-800'
          : zone === 'warning'
            ? 'border-amber-200 dark:border-amber-800/50'
            : 'border-rose-200 dark:border-rose-800/50'
      }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: color + '20' }}>
            <div style={{ color }}>
              <CategoryIcon name={budget.categoryIcon} size={18} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{budget.categoryName}</p>
            {budget.isAnnual
              ? <p className="text-xs text-indigo-500 dark:text-indigo-400 flex items-center gap-1"><CalendarRange size={10} />Presupuesto anual</p>
              : <p className="text-xs text-slate-400 dark:text-slate-500">Presupuesto mensual</p>
            }
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(budget)}
            className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-md transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(budget)}
            className="p-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 hover:bg-rose-100 rounded-md transition-colors">
            <Trash2 size={13} />
          </button>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeStyles[zone]}`}>
            {Math.round(budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0)}%
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${progressColor(pct)}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.15 + index * 0.06, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Alerta de zona */}
      {zone === 'warning' && (
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-2.5 py-1.5 mb-3 text-xs font-medium">
          <AlertTriangle size={12} className="shrink-0" />
          Cerca del límite — solo queda {fmt(remaining)}
        </div>
      )}
      {zone === 'full' && (
        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-lg px-2.5 py-1.5 mb-3 text-xs font-medium">
          <Ban size={12} className="shrink-0" />
          Sin presupuesto restante
        </div>
      )}
      {zone === 'exceeded' && (
        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-lg px-2.5 py-1.5 mb-3 text-xs font-medium">
          <AlertTriangle size={12} className="shrink-0" />
          Excedido por {fmt(Math.abs(remaining))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 dark:text-slate-500">Gastado </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{fmt(budget.spent)}</span>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${
            zone === 'ok'      ? 'text-emerald-600 dark:text-emerald-400' :
            zone === 'warning' ? 'text-amber-600 dark:text-amber-400'    :
                                 'text-rose-600 dark:text-rose-400'
          }`}>
            {zone === 'ok'       && `${fmt(remaining)} disponible`}
            {zone === 'warning'  && `${fmt(remaining)} disponible`}
            {zone === 'full'     && 'Sin presupuesto restante'}
            {zone === 'exceeded' && `+${fmt(Math.abs(remaining))} excedido`}
          </p>
          <p className="text-slate-400 dark:text-slate-500">de {fmt(budget.amount)}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function BudgetsPage() {
  const fmt = useFormatCurrency()
  const now = new Date()
  const [currentDate, setCurrentDate] = useState(now)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState(null)
  const [confirmBudget, setConfirmBudget] = useState(null)
  const [catModalOpen, setCatModalOpen]   = useState(false)
  const [copyModalOpen, setCopyModalOpen] = useState(false)

  const { data: allCategories = [] } = useCategories()
  const userCategories               = allCategories.filter(c => c.isSystem === false)

  const month        = toYearMonth(currentDate)
  const { data: rawBudgets = [], isLoading } = useBudgets(month)

  // El botón de copia rápida solo está disponible para el mes actual o el siguiente
  const todayYM      = toYearMonth(now)
  const nextYM       = toYearMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1))
  const canQuickCopy = month === todayYM || month === nextYM
  const budgets = [...rawBudgets].sort((a, b) => a.categoryName.localeCompare(b.categoryName, 'es'))
  const deleteMutation = useDeleteBudget()

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const openNew  = ()  => { setEditing(null); setModalOpen(true) }
  const openEdit = (b) => { setEditing(b);    setModalOpen(true) }

  const handleDelete = (b) => setConfirmBudget(b)

  const confirmDelete = () => {
    deleteMutation.mutate(confirmBudget.id, {
      onSuccess: () => { toast.success('Presupuesto eliminado'); setConfirmBudget(null) },
      onError:   () => { toast.error('No se pudo eliminar el presupuesto'); setConfirmBudget(null) },
    })
  }

  const totalBudgeted  = budgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent     = budgets.reduce((s, b) => s + b.spent,  0)
  const totalAvailable = totalBudgeted - totalSpent

  return (
    <div className="space-y-4 md:space-y-5">
      <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300">
          <button onClick={prevMonth} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><ChevronLeft size={16} /></button>
          <span className="font-medium px-2 min-w-[120px] text-center">{monthDisplay(month)}</span>
          <button onClick={nextMonth} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><ChevronRight size={16} /></button>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setCatModalOpen(true)}
            disabled={userCategories.length >= 3}
            title={userCategories.length >= 3 ? 'Límite de 3 categorías alcanzado' : 'Agregar categoría personalizada'}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Bookmark size={14} />
            <span className="hidden sm:inline">Categoría personalizada</span>
            <span className="sm:hidden">Cat. personalizada</span>
          </button>
          {canQuickCopy && (
            <button
              onClick={() => setCopyModalOpen(true)}
              title="Copiar presupuestos del mes anterior"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              <ClipboardCopy size={14} />
              <span className="hidden sm:inline">Copiar del mes anterior</span>
              <span className="sm:hidden">Copiar</span>
            </button>
          )}
          <button onClick={openNew}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={16} />Nuevo presupuesto
          </button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4" variants={container} initial="hidden" animate="show">
        {[
          { label: 'Total presupuestado', value: totalBudgeted,  color: 'text-slate-800 dark:text-slate-100'      },
          { label: 'Total gastado',        value: totalSpent,     color: 'text-rose-500 dark:text-rose-400'        },
          { label: 'Disponible',           value: totalAvailable, color: 'text-emerald-600 dark:text-emerald-400'  },
        ].map(item => (
          <motion.div key={item.label} variants={cardItem} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
            <p className={`text-xl font-bold ${item.color}`}>
              <AnimatedNumber value={item.value} formatter={fmt} />
            </p>
          </motion.div>
        ))}
      </motion.div>

      {isLoading ? (
        <SkeletonCardGrid count={3} />
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4" variants={container} initial="hidden" animate="show">
          {budgets.map((b, i) => (
            <BudgetCard key={b.id} budget={b} onEdit={openEdit} onDelete={handleDelete} index={i} />
          ))}
          <motion.button variants={cardItem} onClick={openNew}
            className="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-5 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group min-h-[160px]">
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Agregar categoría</span>
          </motion.button>
        </motion.div>
      )}

      <BudgetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} budget={editing} defaultMonth={month} />

      <QuickCopyModal
        isOpen={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        targetMonth={month}
        existingBudgets={budgets}
      />

      <CategoryFormModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!confirmBudget}
        onClose={() => setConfirmBudget(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Eliminar presupuesto"
        description={
          confirmBudget?.isAnnual
            ? `¿Estás seguro de que quieres eliminar el presupuesto anual de ${confirmBudget?.categoryName}? Se eliminará de todos los meses de ${confirmBudget?.month?.slice(0, 4) ?? 'ese año'}. Esta acción no se puede deshacer.`
            : `¿Estás seguro de que quieres eliminar el presupuesto de ${confirmBudget?.categoryName}? Esta acción no se puede deshacer.`
        }
      />
    </div>
  )
}
