import { TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { mockTransactions, mockMonthlyData, mockCategoryExpenses } from '../mocks/data'
import { formatCurrency, formatDate } from '../lib/utils'
import AnimatedNumber from '../components/ui/AnimatedNumber'

const income   = mockTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
const expenses = mockTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
const balance  = income - expenses

const kpis = [
  { label: 'Ingresos del mes', value: income,   icon: TrendingUp,   color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8.2% vs mes anterior' },
  { label: 'Gastos del mes',   value: expenses, icon: TrendingDown, color: 'text-rose-500',    bg: 'bg-rose-50',    trend: '-3.1% vs mes anterior' },
  { label: 'Balance neto',     value: balance,  icon: DollarSign,   color: 'text-indigo-600',  bg: 'bg-indigo-50',  trend: '+12.4% vs mes anterior' },
]

// Variantes para stagger de cards
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function BarChart() {
  const max = Math.max(...mockMonthlyData.flatMap(d => [d.income, d.expenses]))
  return (
    <div className="flex items-end justify-between gap-1 sm:gap-3 h-44 pt-4">
      {mockMonthlyData.map((item, i) => (
        <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1" style={{ height: '140px' }}>
            {/* Barra ingresos */}
            <motion.div
              className="flex-1 max-w-5 bg-emerald-400 rounded-t origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
              style={{ height: `${(item.income / max) * 100}%` }}
            />
            {/* Barra gastos */}
            <motion.div
              className="flex-1 max-w-5 bg-rose-300 rounded-t origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: 'easeOut' }}
              style={{ height: `${(item.expenses / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{item.month}</span>
        </div>
      ))}
    </div>
  )
}

function PieChart() {
  let cumulative = 0
  const gradient = mockCategoryExpenses.map(c => {
    const start = cumulative
    cumulative += c.pct
    return `${c.color} ${start}% ${cumulative}%`
  }).join(', ')

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
        {mockCategoryExpenses.map(c => (
          <motion.li key={c.name} variants={cardItem} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
              <span className="text-xs sm:text-sm text-slate-600 truncate">{c.name}</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-800 shrink-0">{formatCurrency(c.amount)}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

export default function DashboardPage() {
  const recent = mockTransactions.slice(0, 5)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* KPI Cards con stagger */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {kpis.map(({ label, value, icon: Icon, color, bg, trend }) => (
          <motion.div
            key={label}
            variants={cardItem}
            className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            <p className={`text-xl md:text-2xl font-bold tracking-tight ${color}`}>
              <AnimatedNumber value={value} formatter={formatCurrency} duration={1} />
            </p>
            <p className="text-xs text-slate-400 mt-1">{trend}</p>
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
        <div className="lg:col-span-3 bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-slate-800">Ingresos vs Gastos</p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> Ingresos</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-300 inline-block" /> Gastos</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-2">Últimos 6 meses</p>
          <BarChart />
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-1">Gastos por categoría</p>
          <p className="text-xs text-slate-400 mb-4">Mes actual</p>
          <PieChart />
        </div>
      </motion.div>

      {/* Recent transactions */}
      <motion.div
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-800">Últimas transacciones</p>
          <Link to="/transactions" className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
            Ver todas <ArrowRight size={13} />
          </Link>
        </div>
        <motion.ul
          className="divide-y divide-slate-50"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {recent.map(tx => (
            <motion.li
              key={tx.id}
              variants={cardItem}
              className="flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: tx.category_color + '20' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: tx.category_color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{tx.description}</p>
                  <p className="text-xs text-slate-400">{tx.category} · {formatDate(tx.date)}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold shrink-0 ml-3 ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  )
}
