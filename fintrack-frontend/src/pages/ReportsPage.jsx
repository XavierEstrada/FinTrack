import { Download, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'
import { mockCategoryExpenses, mockMonthlyData } from '../mocks/data'
import { formatCurrency } from '../lib/utils'
import AnimatedNumber from '../components/ui/AnimatedNumber'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const rowItem = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

function LineChart() {
  const values = mockMonthlyData.map(d => d.income - d.expenses)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 500, h = 120, pad = 20

  // Convertimos los puntos en un SVG path (para poder animar con pathLength)
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

      {/* Área de relleno */}
      <motion.path
        d={areaD}
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />

      {/* Línea principal — se traza de izquierda a derecha */}
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

      {/* Puntos que aparecen uno por uno */}
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

const totalExpenses = mockCategoryExpenses.reduce((s, c) => s + c.amount, 0)
const totalBalance  = mockMonthlyData.reduce((s, d) => s + (d.income - d.expenses), 0)

export default function ReportsPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      {/* Toolbar */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
          <CalendarDays size={15} className="text-slate-400 shrink-0" />
          <span>01 Nov 2025 — 30 Abr 2026</span>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
          <Download size={15} />
          Exportar CSV
        </button>
      </motion.div>

      {/* Line chart */}
      <motion.div
        className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Evolución del balance neto</p>
            <p className="text-xs text-slate-400 mt-0.5">Últimos 6 meses</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xl md:text-2xl font-bold text-indigo-600">
              <AnimatedNumber value={totalBalance} formatter={formatCurrency} duration={1.2} />
            </p>
            <p className="text-xs text-emerald-500 font-medium">+18.3% vs período anterior</p>
          </div>
        </div>
        <LineChart />
        <div className="flex justify-between mt-1 px-4">
          {mockMonthlyData.map(d => (
            <span key={d.month} className="text-[11px] text-slate-400">{d.month}</span>
          ))}
        </div>
      </motion.div>

      {/* Category table con stagger por filas */}
      <motion.div
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="px-4 md:px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-800">Resumen por categoría</p>
          <p className="text-xs text-slate-400 mt-0.5">Gastos del período seleccionado</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoría</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">%</th>
                <th className="px-4 md:px-5 py-3 w-32 md:w-40 text-xs font-semibold text-slate-500 uppercase tracking-wide">Distribución</th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-slate-50"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {mockCategoryExpenses.map((c, i) => (
                <motion.tr key={c.name} variants={rowItem} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="font-medium text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-5 py-3.5 text-right font-semibold text-slate-800">{formatCurrency(c.amount)}</td>
                  <td className="px-4 md:px-5 py-3.5 text-right text-slate-500">{Math.round((c.amount / totalExpenses) * 100)}%</td>
                  <td className="px-4 md:px-5 py-3.5">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.amount / totalExpenses) * 100}%` }}
                        transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50">
                <td className="px-4 md:px-5 py-3 text-sm font-semibold text-slate-700">Total</td>
                <td className="px-4 md:px-5 py-3 text-right text-sm font-bold text-slate-800">{formatCurrency(totalExpenses)}</td>
                <td className="px-4 md:px-5 py-3 text-right text-sm text-slate-500">100%</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
