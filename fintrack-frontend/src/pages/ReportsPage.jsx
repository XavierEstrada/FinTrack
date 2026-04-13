import { useState } from 'react'
import { Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { monthLabel } from '../lib/utils'
import { useFormatCurrency } from '../hooks/useCurrency'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { useByCategory, useMonthlyTrend } from '../hooks/useReports'

const pieContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const pieItem = {
  hidden: { opacity: 0, x: -8 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = angleDeg * Math.PI / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function sectorPath(cx, cy, r, startAngle, endAngle) {
  const s     = polarToCartesian(cx, cy, r, startAngle)
  const e     = polarToCartesian(cx, cy, r, endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [`M ${cx} ${cy}`, `L ${s.x} ${s.y}`, `A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`, 'Z'].join(' ')
}

function PieChart({ data = [], fmt }) {
  const [hovered, setHovered] = useState(null)

  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-xs text-slate-400 dark:text-slate-500">
      Sin gastos para este mes
    </div>
  )

  const CX = 140, CY = 140, R = 124

  let cumAngle = -90
  const slices = data.map(c => {
    const start = cumAngle
    const sweep = (c.percentage / 100) * 360
    cumAngle += sweep
    return { ...c, startAngle: start, endAngle: cumAngle, midAngle: start + sweep / 2, sweep }
  })

  const hov = hovered !== null ? slices[hovered] : null

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">

      {/* SVG donut */}
      <div className="relative shrink-0" style={{ width: 280, height: 280 }}>
        <motion.svg
          width="280" height="280" viewBox="0 0 280 280"
          style={{ overflow: 'visible' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          {slices.map((slice, i) => {
            const isHov = hovered === i
            const rad   = slice.midAngle * Math.PI / 180
            const dx    = isHov ? Math.cos(rad) * 9 : 0
            const dy    = isHov ? Math.sin(rad) * 9 : 0

            return (
              <g
                key={i}
                style={{ transform: `translate(${dx}px, ${dy}px)`, transition: 'transform 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {slice.sweep >= 359.9 ? (
                  <circle cx={CX} cy={CY} r={R}
                    fill={slice.categoryColor ?? '#94a3b8'}
                    stroke="white" strokeWidth="2"
                    style={{ opacity: hovered !== null && !isHov ? 0.45 : 1, transition: 'opacity 0.15s' }}
                  />
                ) : (
                  <path
                    d={sectorPath(CX, CY, R, slice.startAngle, slice.endAngle)}
                    fill={slice.categoryColor ?? '#94a3b8'}
                    stroke="white" strokeWidth="2"
                    style={{ opacity: hovered !== null && !isHov ? 0.45 : 1, transition: 'opacity 0.15s' }}
                  />
                )}
              </g>
            )
          })}
        </motion.svg>

        {/* Donut hole — center info */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[144px] h-[144px] rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center px-2 gap-0.5">
            {hov ? (
              <>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight truncate max-w-[90px]">
                  {hov.categoryName}
                </p>
                <p className="text-xl font-bold leading-tight" style={{ color: hov.categoryColor ?? '#94a3b8' }}>
                  {Math.round(hov.percentage)}%
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight font-medium">
                  {fmt(hov.total)}
                </p>
              </>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {data.length} {data.length === 1 ? 'categoría' : 'categorías'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.ul
        className="space-y-1 w-full"
        variants={pieContainer}
        initial="hidden"
        animate="show"
      >
        {slices.map((c, i) => (
          <motion.li
            key={c.categoryId ?? c.categoryName}
            variants={pieItem}
            className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-default transition-colors ${
              hovered === i
                ? 'bg-slate-100 dark:bg-slate-800'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: c.categoryColor ?? '#94a3b8',
                  transform: hovered === i ? 'scale(1.35)' : 'scale(1)',
                  transition: 'transform 0.15s',
                }}
              />
              <span className={`text-xs truncate transition-colors duration-150 ${
                hovered === i ? 'text-slate-800 dark:text-slate-100 font-medium' : 'text-slate-600 dark:text-slate-400'
              }`}>
                {c.categoryName}
              </span>
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

  const exportCSV = () => {
    if (!byCategory.length) return
    const headers = ['Categoría', 'Total', 'Porcentaje']
    const rows    = byCategory.map(c => [
      `"${c.categoryName}"`,
      fmt(c.total),
      `${Math.round(c.percentage)}%`,
    ])
    // BOM UTF-8 + punto y coma como separador → Excel en español lo abre correctamente
    const bom  = '\ufeff'
    const csv  = bom + [headers, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `reporte-${currentMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    if (!byCategory.length) return
    const month    = monthDisplay(currentMonth)
    const dateStr  = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })

    const rows = byCategory.map(c => `
      <tr>
        <td>
          <span class="dot" style="background:${c.categoryColor ?? '#94a3b8'}"></span>
          ${c.categoryName}
        </td>
        <td style="text-align:right">${fmt(c.total)}</td>
        <td style="text-align:right">${Math.round(c.percentage)}%</td>
        <td style="text-align:right; width:160px">
          <div class="bar-bg">
            <div class="bar-fill" style="width:${c.percentage}%;background:${c.categoryColor ?? '#94a3b8'}"></div>
          </div>
        </td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte FinTrack — ${month}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           color: #1e293b; background: #fff; padding: 40px; }
    header { display: flex; justify-content: space-between; align-items: flex-start;
             border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 28px; }
    header h1 { font-size: 22px; font-weight: 700; color: #6366f1; }
    header p  { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .summary  { display: flex; gap: 20px; margin-bottom: 28px; }
    .card     { flex: 1; border: 1px solid #e2e8f0; border-radius: 10px;
                padding: 14px 18px; }
    .card-label { font-size: 11px; color: #94a3b8; text-transform: uppercase;
                  letter-spacing: .05em; margin-bottom: 6px; }
    .card-value { font-size: 20px; font-weight: 700; color: #1e293b; }
    .card-value.accent { color: #6366f1; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead tr { background: #f8fafc; }
    th { text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 600;
         color: #64748b; text-transform: uppercase; letter-spacing: .04em;
         border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9;
         vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tfoot td { font-weight: 700; border-top: 2px solid #e2e8f0;
               padding-top: 12px; }
    .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%;
           margin-right: 8px; vertical-align: middle; }
    .bar-bg   { background: #f1f5f9; border-radius: 4px; height: 7px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; }
    footer { margin-top: 32px; font-size: 11px; color: #cbd5e1; text-align: center; }
    @media print {
      body { padding: 24px; }
      @page { margin: 1.5cm; size: A4; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Reporte de gastos</h1>
      <p>${month}</p>
    </div>
    <div style="text-align:right">
      <p style="font-size:11px;color:#94a3b8">Generado el ${dateStr}</p>
      <p style="font-size:11px;color:#94a3b8;margin-top:2px">FinTrack</p>
    </div>
  </header>

  <div class="summary">
    <div class="card">
      <div class="card-label">Total gastado</div>
      <div class="card-value accent">${fmt(totalExpenses)}</div>
    </div>
    <div class="card">
      <div class="card-label">Categorías</div>
      <div class="card-value">${byCategory.length}</div>
    </div>
    <div class="card">
      <div class="card-label">Mayor gasto</div>
      <div class="card-value">${byCategory[0]?.categoryName ?? '—'}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Categoría</th>
        <th style="text-align:right">Total</th>
        <th style="text-align:right">%</th>
        <th style="text-align:right">Distribución</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td style="text-align:right">${fmt(totalExpenses)}</td>
        <td style="text-align:right">100%</td>
        <td></td>
      </tr>
    </tfoot>
  </table>

  <footer>Generado con FinTrack · ${dateStr}</footer>

  <script>window.onload = () => { window.print() }<\/script>
</body>
</html>`

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
  }

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
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={!byCategory.length}
            className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={15} />
            CSV
          </button>
          <button
            onClick={exportPDF}
            disabled={!byCategory.length}
            className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText size={15} />
            PDF
          </button>
        </div>
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
