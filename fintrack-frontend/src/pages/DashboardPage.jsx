import { TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatRelativeDate, monthLabel } from '../lib/utils'
import { useFormatCurrency } from '../hooks/useCurrency'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { useSummary, useByCategory, useMonthlyTrend } from '../hooks/useReports'
import { useTransactions } from '../hooks/useTransactions'

// Rango del mes actual
function currentMonthRange() {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  return { from: `${year}-${month}-01`, to: `${year}-${month}-${lastDay}` }
}

const { from, to } = currentMonthRange()

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function BarChart({ data = [] }) {
  if (!data.length) return (
    <div className="h-44 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
      Sin datos para mostrar
    </div>
  )
  const max = Math.max(...data.flatMap(d => [d.income, d.expense]), 1)
  return (
    <div className="flex items-end justify-between gap-1 sm:gap-3 h-44 pt-4">
      {data.map((item, i) => (
        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1" style={{ height: '140px' }}>
            <motion.div
              className="flex-1 max-w-5 bg-emerald-400 dark:bg-emerald-500 rounded-t origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
              style={{ height: `${(item.income / max) * 100}%` }}
            />
            <motion.div
              className="flex-1 max-w-5 bg-rose-300 dark:bg-rose-500 rounded-t origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: 'easeOut' }}
              style={{ height: `${(item.expense / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {monthLabel(item.month)}
          </span>
        </div>
      ))}
    </div>
  )
}

function PieChart({ data = [] }) {
  const fmt = useFormatCurrency()
  if (!data.length) return (
    <div className="flex items-center justify-center h-28 text-xs text-slate-400 dark:text-slate-500">
      Sin gastos en este período
    </div>
  )

  const cumPcts  = data.map((_, i) => data.slice(0, i).reduce((s, c) => s + c.percentage, 0))
  const gradient = data.map((c, i) =>
    `${c.categoryColor ?? '#94a3b8'} ${cumPcts[i]}% ${cumPcts[i] + c.percentage}%`
  ).join(', ')

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <motion.div
        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full shrink-0"
        style={{ background: `conic-gradient(${gradient})` }}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0,   opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'backOut' }}
      />
      <motion.ul
        className="space-y-2 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {data.map(c => (
          <motion.li key={c.categoryId ?? c.categoryName} variants={cardItem} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.categoryColor ?? '#94a3b8' }} />
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">{c.categoryName}</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 shrink-0">{fmt(c.total)}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

export default function DashboardPage() {
  const fmt = useFormatCurrency()
  const { data: summary,  isLoading: loadingSummary }  = useSummary(from, to)
  const { data: byCategory = [] }                       = useByCategory(from, to)
  const { data: trend = [] }                            = useMonthlyTrend(6)
  const { data: txData }                                = useTransactions({ page: 1, limit: 5 })
  const recent = txData?.data ?? []

  const kpis = [
    {
      label: 'Ingresos del mes',
      value: summary?.totalIncome  ?? 0,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg:    'bg-emerald-50 dark:bg-emerald-900/30',
    },
    {
      label: 'Gastos del mes',
      value: summary?.totalExpense ?? 0,
      icon: TrendingDown,
      color: 'text-rose-500 dark:text-rose-400',
      bg:    'bg-rose-50 dark:bg-rose-900/30',
    },
    {
      label: 'Balance neto',
      value: summary?.balance      ?? 0,
      icon: DollarSign,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg:    'bg-indigo-50 dark:bg-indigo-900/30',
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            variants={cardItem}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            {loadingSummary ? (
              <div className="h-8 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              <p className={`text-xl md:text-2xl font-bold tracking-tight ${color}`}>
                <AnimatedNumber value={value} formatter={fmt} duration={1} />
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
      >
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Ingresos vs Gastos</p>
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-500 inline-block" /> Ingresos</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-300 dark:bg-rose-500 inline-block" /> Gastos</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Últimos 6 meses</p>
          <BarChart data={trend} />
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Gastos por categoría</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Mes actual</p>
          <PieChart data={byCategory} />
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Últimas transacciones</p>
          <Link to="/transactions" className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            Ver todas <ArrowRight size={13} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">
            No hay transacciones recientes
          </p>
        ) : (
          <motion.ul
            className="divide-y divide-slate-50 dark:divide-slate-800"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {recent.map(tx => (
              <motion.li
                key={tx.id}
                variants={cardItem}
                className="flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: (tx.categoryColor ?? '#94a3b8') + '20' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: tx.categoryColor ?? '#94a3b8' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{tx.description}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {tx.categoryName ?? '—'} · {formatRelativeDate(tx.date)}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold shrink-0 ml-3 ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </div>
  )
}
