import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2, PiggyBank, Target, CheckCircle2, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { SkeletonCardGrid } from '../components/ui/Skeleton'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import SavingsGoalModal from '../components/savings/SavingsGoalModal'
import { useSavingsGoals, useDeleteSavingsGoal } from '../hooks/useSavingsGoals'
import { useFormatCurrency } from '../hooks/useCurrency'
import { toYearMonth, monthDisplay } from '../lib/utils'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const cardItem  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } }

function goalZone(pct) {
  if (pct >= 100) return 'met'
  if (pct >= 60)  return 'close'
  return 'far'
}

function SavingsGoalCard({ goal, onEdit, onDelete, index }) {
  const fmt      = useFormatCurrency()
  const { t }    = useTranslation()
  const rawPct   = goal.targetAmount > 0 ? (goal.saved / goal.targetAmount) * 100 : 0
  const pct      = Math.min(rawPct, 100)
  const zone     = goalZone(rawPct)
  const remaining = Math.max(0, goal.targetAmount - goal.saved)

  const barColor = zone === 'met' ? 'bg-emerald-500' : zone === 'close' ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-600'
  const borderColor = zone === 'met'
    ? 'border-emerald-200 dark:border-emerald-800/50'
    : 'border-slate-200 dark:border-slate-800'

  return (
    <motion.div variants={cardItem}
      className={`bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${borderColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            zone === 'met' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-indigo-50 dark:bg-indigo-900/30'
          }`}>
            {zone === 'met'
              ? <CheckCircle2 size={18} className="text-emerald-500" />
              : <Target size={18} className="text-indigo-500" />
            }
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{goal.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t('savings.monthlyGoal')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(goal)}
            className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-md transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(goal)}
            className="p-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 hover:bg-rose-100 rounded-md transition-colors">
            <Trash2 size={13} />
          </button>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            zone === 'met'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : zone === 'close'
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {Math.round(rawPct)}%
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.15 + index * 0.06, ease: 'easeOut' }}
          />
        </div>
      </div>

      {zone === 'met' && (
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-2.5 py-1.5 mb-3 text-xs font-medium">
          <CheckCircle2 size={12} className="shrink-0" />
          {t('savings.goalReached')}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 dark:text-slate-500">{t('savings.savedThisMonth')} </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{fmt(goal.saved)}</span>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${
            zone === 'met' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
          }`}>
            {zone === 'met' ? t('savings.completed') : t('savings.remaining', { amount: fmt(remaining) })}
          </p>
          <p className="text-slate-400 dark:text-slate-500">{t('savings.of', { amount: fmt(goal.targetAmount) })}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function SavingsPage() {
  const fmt  = useFormatCurrency()
  const { t } = useTranslation()
  const now  = new Date()
  const [currentDate, setCurrentDate] = useState(now)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editing, setEditing]         = useState(null)
  const [confirmGoal, setConfirmGoal] = useState(null)

  const month = toYearMonth(currentDate)
  const { data: goals = [], isLoading } = useSavingsGoals(month)
  const deleteMutation = useDeleteSavingsGoal()

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const openNew  = ()  => { setEditing(null); setModalOpen(true) }
  const openEdit = (g) => { setEditing(g);    setModalOpen(true) }

  const confirmDelete = () => {
    deleteMutation.mutate(confirmGoal.id, {
      onSuccess: () => { toast.success(t('savings.deleteSuccess')); setConfirmGoal(null) },
      onError:   () => { toast.error(t('savings.deleteError')); setConfirmGoal(null) },
    })
  }

  const saved       = goals[0]?.saved ?? 0   // igual para todas las metas del mes
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
  const metCount    = goals.filter(g => g.saved >= g.targetAmount).length

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300">
          <button onClick={prevMonth} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><ChevronLeft size={16} /></button>
          <span className="font-medium px-2 min-w-[120px] text-center">{monthDisplay(month)}</span>
          <button onClick={nextMonth} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><ChevronRight size={16} /></button>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={16} />{t('savings.newGoal')}
        </button>
      </motion.div>

      {/* Summary cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4" variants={container} initial="hidden" animate="show">
        {[
          { label: t('savings.totalGoals'),     value: totalTarget, color: 'text-slate-800 dark:text-slate-100',     icon: Target      },
          { label: t('savings.savedThisMonth'), value: saved,       color: 'text-indigo-600 dark:text-indigo-400',   icon: PiggyBank   },
          { label: t('savings.goalsMet'),       value: metCount,    color: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2, isCount: true },
        ].map(item => (
          <motion.div key={item.label} variants={cardItem} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <item.icon size={14} className="text-slate-400 dark:text-slate-500" />
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
            <p className={`text-xl font-bold ${item.color}`}>
              {item.isCount
                ? <span>{metCount} <span className="text-sm font-medium text-slate-400">/ {goals.length}</span></span>
                : <AnimatedNumber value={item.value} formatter={fmt} />
              }
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Savings note */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-start gap-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 rounded-xl px-4 py-3 text-xs text-indigo-700 dark:text-indigo-300"
        >
          <TrendingUp size={14} className="shrink-0 mt-0.5" />
          <span dangerouslySetInnerHTML={{ __html: t('savings.howItWorks', { amount: fmt(saved) }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </motion.div>
      )}

      {/* Goal cards */}
      {isLoading ? (
        <SkeletonCardGrid count={3} />
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4" variants={container} initial="hidden" animate="show">
          {goals.map((g, i) => (
            <SavingsGoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={setConfirmGoal} index={i} />
          ))}
          <motion.button variants={cardItem} onClick={openNew}
            className="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-5 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group min-h-[160px]">
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{t('savings.newGoal')}</span>
          </motion.button>
        </motion.div>
      )}

      {goals.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <PiggyBank size={26} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('savings.empty')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('savings.emptyHint')}</p>
          </div>
          <button onClick={openNew}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={15} />{t('savings.newGoal')}
          </button>
        </motion.div>
      )}

      <SavingsGoalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        goal={editing}
        defaultMonth={month}
      />

      <ConfirmDialog
        isOpen={!!confirmGoal}
        onClose={() => setConfirmGoal(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title={t('savings.deleteTitle')}
        description={t('savings.deleteConfirm', { name: confirmGoal?.name })}
      />
    </div>
  )
}
