import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import { mockBudgets } from '../mocks/data'
import { formatCurrency } from '../lib/utils'
import BudgetModal from '../components/budgets/BudgetModal'
import AnimatedNumber from '../components/ui/AnimatedNumber'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function progressColor(pct) {
  if (pct >= 100) return 'bg-rose-500'
  if (pct >= 75)  return 'bg-amber-400'
  return 'bg-emerald-500'
}

function BudgetCard({ budget, onEdit, index }) {
  const pct        = Math.min((budget.spent / budget.amount) * 100, 100)
  const remaining  = budget.amount - budget.spent
  const overBudget = budget.spent > budget.amount

  return (
    <motion.div
      variants={cardItem}
      className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: budget.color + '20' }}>
            <span className="w-3 h-3 rounded-full" style={{ background: budget.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{budget.category}</p>
            <p className="text-xs text-slate-400">Presupuesto mensual</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
          >
            <Pencil size={13} />
          </button>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${overBudget ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      {/* Progress bar animada */}
      <div className="mb-3">
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${progressColor(pct)}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.15 + index * 0.06, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400">Gastado </span>
          <span className="font-semibold text-slate-700">{formatCurrency(budget.spent)}</span>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${overBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            {overBudget
              ? `+${formatCurrency(Math.abs(remaining))} excedido`
              : `${formatCurrency(remaining)} disponible`}
          </p>
          <p className="text-slate-400">de {formatCurrency(budget.amount)}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function BudgetsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)

  const openNew  = ()  => { setEditing(null); setModalOpen(true) }
  const openEdit = (b) => { setEditing(b);    setModalOpen(true) }

  const totalBudgeted  = mockBudgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent     = mockBudgets.reduce((s, b) => s + b.spent,  0)
  const totalAvailable = totalBudgeted - totalSpent

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header row */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-600">
          <button className="hover:text-slate-900 transition-colors"><ChevronLeft size={16} /></button>
          <span className="font-medium px-2">Abril 2026</span>
          <button className="hover:text-slate-900 transition-colors"><ChevronRight size={16} /></button>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Nuevo presupuesto
        </button>
      </motion.div>

      {/* Summary con números animados */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[
          { label: 'Total presupuestado', value: totalBudgeted,  color: 'text-slate-800'   },
          { label: 'Total gastado',        value: totalSpent,     color: 'text-rose-500'    },
          { label: 'Disponible',           value: totalAvailable, color: 'text-emerald-600' },
        ].map(item => (
          <motion.div key={item.label} variants={cardItem} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-xl font-bold ${item.color}`}>
              <AnimatedNumber value={item.value} formatter={formatCurrency} />
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Budget cards con stagger */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {mockBudgets.map((b, i) => (
          <BudgetCard key={b.id} budget={b} onEdit={openEdit} index={i} />
        ))}

        <motion.button
          variants={cardItem}
          onClick={openNew}
          className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors group min-h-[160px]"
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Agregar categoría</span>
        </motion.button>
      </motion.div>

      <BudgetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} budget={editing} />
    </div>
  )
}
