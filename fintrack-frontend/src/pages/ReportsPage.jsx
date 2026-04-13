import { useState } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { monthLabel } from '../lib/utils'
import { useFormatCurrency } from '../hooks/useCurrency'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { useByCategory, useMonthlyTrend } from '../hooks/useReports'

const pieContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const pieItem = {
  hidden: { opacity: 0, x: -8 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

function PieChart({ data = [], fmt }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-32 text-xs text-slate-400 dark:text-slate-500">
      Sin gastos para este mes
    </div>
  )

  const cumPcts  = data.map((_, i) => data.slice(0, i).reduce((s, c) => s + c.percentage, 0))
  const gradient = data.map((c, i) =>
    `${c.categoryColor ?? '#94a3b8'} ${cumPcts[i]}% ${cumPcts[i] + c.percentage}%`
  ).join(', ')

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
      <motion.div
        className="w-36 h-36 rounded-full shrink-0"
        style={{ background: `conic-gradient(${gradient})` }}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0,   opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'backOut' }}
      />
      <motion.ul
        className="space-y-2 w-full"
        variants={pieContainer}
        initial="hidden"
        animate="show"
      >
        {data.map(c => (
          <motion.li key={c.categoryId ?? c.categoryName} variants={pieItem}
            className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.categoryColor ?? '#94a3b8' }} />
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{c.categoryName}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{fmt(c.total)}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">{Math.round(c.percentage)}%</span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const rowItem = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

// Devuelve el primer y último día de un mes dado como "YYYY-MM"
function monthBounds(ym) {
  const [y, m] = ym.split('-').map(Number)
  const last   = new Date(y, m, 0).getDate()
  return { from: `${ym}-01`, to: `${ym}-${String(last).padStart(2, '0')}` }
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

function LineChart({ data = [] }) {
  if (data.length < 2) return (
    <div className="h-32 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
      Sin suficientes datos para el gráfico
    </div>
  )

  const values = data.map(d => d.balance)
  const min    = Math.min(...values)
  const max    = Math.max(...values)
  const range  = max - min || 1
  const w = 500, h = 120, pad = 20

  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return [x, y]
  })

  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const areaD = `M${pad},${h - pad} ${pathD.slice(1)} L${pts[pts.length - 1][0]},${h - pad} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaD}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 1.2, ease: 'easeInOut' }, opacity: { duration: 0.1 } }}
      />
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r="4"
          fill="#6366f1"
          stroke="white"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.2 + (i / (pts.length - 1)) * 1.0 }}
        />
      ))}
    </svg>
  )
}

export default function ReportsPage() {
  const fmt = useFormatCurrency()
  const [currentDate, setCurrentDate] = useState(new Date())
  const currentMonth = toYearMonth(currentDate)
  const { from, to } = monthBounds(currentMonth)

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const { data: byCategory = [], isLoading: loadingCat } = useByCategory(from, to)
  const { data: trend = [],       isLoading: loadingTrend } = useMonthlyTrend(6)

  const totalExpenses = byCategory.reduce((s, c) => s + c.total, 0)
  const totalBalance  = trend.reduce((s, d) => s + d.balance, 0)

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Toolbar */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300">
          <button onClick={prevMonth} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><ChevronLeft size={16} /></button>
          <span className="font-medium px-2 min-w-[140px] text-center">{monthDisplay(currentMonth)}</span>
          <button onClick={nextMonth} className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"><ChevronRight size={16} /></button>
        </div>
        <button
          className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          onClick={() => {
            if (!byCategory.length) return
            const rows  = [['Categoría', 'Total', '%'], ...byCategory.map(c => [c.categoryName, c.total, c.percentage])]
            const csv   = rows.map(r => r.join(',')).join('\n')
            const blob  = new Blob([csv], { type: 'text/csv' })
            const url   = URL.createObjectURL(blob)
            const a     = document.createElement('a')
            a.href      = url
            a.download  = `reporte-${currentMonth}.csv`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          <Download size={15} />
          Exportar CSV
        </button>
      </motion.div>

      {/* Line chart — últimos 6 meses */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Evolución del balance neto</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Últimos 6 meses</p>
          </div>
          <div className="sm:text-right">
            {loadingTrend ? (
              <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              <p className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                <AnimatedNumber value={totalBalance} formatter={fmt} duration={1.2} />
              </p>
            )}
          </div>
        </div>
        <LineChart data={trend} />
        {trend.length > 0 && (
          <div className="flex justify-between mt-1 px-4">
            {trend.map(d => (
              <span key={d.month} className="text-[11px] text-slate-400 dark:text-slate-500">
                {monthLabel(d.month)}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pie chart — gastos por categoría del mes */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Gastos por categoría</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-5">{monthDisplay(currentMonth)}</p>
        <PieChart data={byCategory} fmt={fmt} />
      </motion.div>

      {/* Category table */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="px-4 md:px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Resumen por categoría</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Gastos de {monthDisplay(currentMonth)}</p>
        </div>

        {loadingCat ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">Cargando…</p>
        ) : byCategory.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">Sin gastos para este mes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Categoría</th>
                  <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total</th>
                  <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">%</th>
                  <th className="px-4 md:px-5 py-3 w-32 md:w-40 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Distribución</th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-slate-50 dark:divide-slate-800"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {byCategory.map((c, i) => (
                  <motion.tr key={c.categoryId ?? c.categoryName} variants={rowItem} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 md:px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.categoryColor ?? '#94a3b8' }} />
                        <span className="font-medium text-slate-800 dark:text-slate-100">{c.categoryName}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-5 py-3.5 text-right font-semibold text-slate-800 dark:text-slate-100">{fmt(c.total)}</td>
                    <td className="px-4 md:px-5 py-3.5 text-right text-slate-500 dark:text-slate-400">{Math.round(c.percentage)}%</td>
                    <td className="px-4 md:px-5 py-3.5">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: c.categoryColor ?? '#94a3b8' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${c.percentage}%` }}
                          transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
              <tfoot>
                <tr className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 md:px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Total</td>
                  <td className="px-4 md:px-5 py-3 text-right text-sm font-bold text-slate-800 dark:text-slate-100">{fmt(totalExpenses)}</td>
                  <td className="px-4 md:px-5 py-3 text-right text-sm text-slate-500 dark:text-slate-400">100%</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
