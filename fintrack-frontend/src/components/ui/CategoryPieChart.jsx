import { useState } from 'react'
import { motion } from 'framer-motion'

const legendContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const legendItem = {
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

/**
 * Gráfico de dona interactivo para gastos por categoría.
 *
 * Props:
 *  - data: array de { categoryId?, categoryName, categoryColor?, percentage, total }
 *  - fmt:  función de formato de moneda
 *  - size: diámetro del SVG en px (default 280)
 *  - emptyMessage: texto cuando no hay datos (default "Sin gastos para este mes")
 */
export default function CategoryPieChart({ data = [], fmt, size = 280, emptyMessage = 'Sin gastos para este mes' }) {
  const [hovered, setHovered] = useState(null)

  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-xs text-slate-400 dark:text-slate-500">
      {emptyMessage}
    </div>
  )

  const CX = size / 2
  const CY = size / 2
  const R  = size / 2 - size * 0.07   // margen de ~7% para el efecto hover

  let cumAngle = -90
  const slices = data.map(c => {
    const start = cumAngle
    const sweep = (c.percentage / 100) * 360
    cumAngle += sweep
    return { ...c, startAngle: start, endAngle: cumAngle, midAngle: start + sweep / 2, sweep }
  })

  const hov      = hovered !== null ? slices[hovered] : null
  const holeSize = size * 0.515   // diámetro del hueco central

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">

      {/* SVG donut */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <motion.svg
          width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          {slices.map((slice, i) => {
            const isHov = hovered === i
            const rad   = slice.midAngle * Math.PI / 180
            const push  = size * 0.032   // distancia de empuje al hacer hover
            const dx    = isHov ? Math.cos(rad) * push : 0
            const dy    = isHov ? Math.sin(rad) * push : 0

            return (
              <g
                key={i}
                style={{ transform: `translate(${dx}px, ${dy}px)`, transition: 'transform 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {slice.sweep >= 359.9 ? (
                  <circle
                    cx={CX} cy={CY} r={R}
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

        {/* Donut hole — info central */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center px-2 gap-0.5"
            style={{ width: holeSize, height: holeSize }}
          >
            {hov ? (
              <>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight truncate" style={{ maxWidth: holeSize * 0.65 }}>
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

      {/* Leyenda */}
      <motion.ul
        className="space-y-1 w-full"
        variants={legendContainer}
        initial="hidden"
        animate="show"
      >
        {slices.map((c, i) => (
          <motion.li
            key={c.categoryId ?? c.categoryName}
            variants={legendItem}
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
