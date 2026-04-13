import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  TrendingUp, ChevronRight, CheckCircle, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Briefcase, Tv, Car, Utensils, Stethoscope,
  BarChart3, Wallet, ArrowLeftRight, ShieldCheck,
} from 'lucide-react'

// ── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ── Mock data ────────────────────────────────────────────────────────────────
const mockTransactions = [
  { id: 1, description: 'Salario mensual',      category: 'Ingresos',        Icon: Briefcase,    color: '#10b981', type: 'income',  amount: 3200.00, date: '01 abr' },
  { id: 2, description: 'Supermercado',          category: 'Alimentación',    Icon: ShoppingCart, color: '#6366f1', type: 'expense', amount: 124.50,  date: '04 abr' },
  { id: 3, description: 'Netflix',               category: 'Entretenimiento', Icon: Tv,           color: '#f59e0b', type: 'expense', amount: 15.99,   date: '08 abr' },
  { id: 4, description: 'Gasolina',              category: 'Transporte',      Icon: Car,          color: '#3b82f6', type: 'expense', amount: 65.00,   date: '10 abr' },
  { id: 5, description: 'Restaurante',           category: 'Alimentación',    Icon: Utensils,     color: '#6366f1', type: 'expense', amount: 48.80,   date: '11 abr' },
]

const mockBudgets = [
  { category: 'Alimentación',    Icon: ShoppingCart, color: '#6366f1', bgColor: 'bg-indigo-500',  spent: 320, limit: 500 },
  { category: 'Transporte',      Icon: Car,          color: '#3b82f6', bgColor: 'bg-blue-500',    spent: 185, limit: 200 },
  { category: 'Entretenimiento', Icon: Tv,           color: '#f59e0b', bgColor: 'bg-amber-500',   spent: 45,  limit: 150 },
  { category: 'Salud',           Icon: Stethoscope,  color: '#10b981', bgColor: 'bg-emerald-500', spent: 60,  limit: 300 },
]

const mockChart = [
  { month: 'Nov', income: 3000, expense: 2100 },
  { month: 'Dic', income: 3200, expense: 2800 },
  { month: 'Ene', income: 3200, expense: 1900 },
  { month: 'Feb', income: 3200, expense: 2200 },
  { month: 'Mar', income: 3500, expense: 2400 },
  { month: 'Abr', income: 3200, expense: 2540 },
]
const chartMax = 3500

const mockCategories = [
  { name: 'Alimentación',    pct: 42, color: '#6366f1' },
  { name: 'Transporte',      pct: 24, color: '#3b82f6' },
  { name: 'Entretenimiento', pct: 18, color: '#f59e0b' },
  { name: 'Salud',           pct: 10, color: '#10b981' },
  { name: 'Otros',           pct: 6,  color: '#94a3b8' },
]

function fmt(n) {
  return new Intl.NumberFormat('es-PA', { style: 'currency', currency: 'USD' }).format(n)
}

// ── Sub-components ───────────────────────────────────────────────────────────

function MockDashboard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-white/20 overflow-hidden w-full max-w-sm">
      {/* Titlebar */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">Dashboard — Abril 2026</span>
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Balance',  value: '$660',   color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950' },
            { label: 'Ingresos', value: '$3,200',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
            { label: 'Gastos',   value: '$2,540',  color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">{s.label}</p>
              <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        {/* Mini transactions */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Últimas transacciones</p>
          <div className="space-y-1">
            {mockTransactions.slice(0, 4).map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: tx.color + '20' }}>
                    <tx.Icon size={11} style={{ color: tx.color }} />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{tx.description}</span>
                </div>
                <span className={`text-xs font-semibold shrink-0 ml-2 ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                  {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FinTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Comenzar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 min-h-[90vh] flex items-center">
        {/* Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-violet-600/25 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-2xl pointer-events-none"
        />

        <div className="relative max-w-6xl mx-auto px-5 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-indigo-500/15 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              Gestión financiera personal
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Tus finanzas,{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                bajo control
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-indigo-200/70 max-w-md leading-relaxed mb-10">
              Registra ingresos y gastos, controla presupuestos por categoría y entiende
              tus hábitos financieros con reportes claros y visuales.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/30"
              >
                Empieza ahora — es gratis
                <ChevronRight size={16} />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-indigo-200 border border-indigo-500/30 px-6 py-3.5 rounded-xl font-medium hover:bg-indigo-500/10 transition-colors"
              >
                Iniciar sesión
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 text-xs text-indigo-300/60">
              {['Sin tarjeta de crédito', 'Datos cifrados', 'Acceso inmediato'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-emerald-400" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — mock dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="hidden lg:flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MockDashboard />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <Section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 py-12">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { label: 'Balance este mes', value: '$660.00', sub: '+$3,200 ingresos', Icon: TrendingUp },
            { label: 'Transacciones',    value: '34',      sub: 'registradas en abril',   Icon: ArrowLeftRight },
            { label: 'Presupuestos',     value: '4',       sub: 'activos este mes',        Icon: Wallet },
          ].map(({ label, value, sub, Icon }) => (
            <motion.div key={label} variants={fadeUp} className="text-white">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon size={15} className="text-white/60" />
                <span className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-4xl font-extrabold text-white mb-1">{value}</p>
              <p className="text-sm text-white/60">{sub}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Transactions preview ─────────────────────────────────────────── */}
      <Section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-emerald-100 dark:border-emerald-900">
              <ArrowLeftRight size={12} />
              Transacciones
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4 leading-snug">
              Organiza cada<br />movimiento
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Registra ingresos y gastos con categorías, descripción y fecha. Filtra por tipo o
              categoría y pagina a través de todo tu historial sin perder nada.
            </motion.p>
            <motion.ul variants={fadeUp} className="space-y-2.5">
              {['Categorías con iconos personalizados', 'Búsqueda y filtros en tiempo real', 'Historial completo paginado'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Mock transaction list */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Transacciones — Abril 2026</span>
              <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">34 en total</span>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {mockTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  variants={fadeUp}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tx.color + '18' }}>
                      <tx.Icon size={14} style={{ color: tx.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{tx.description}</p>
                      <p className="text-xs text-slate-400">{tx.category} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {tx.type === 'income'
                      ? <ArrowUpRight size={13} className="text-emerald-500" />
                      : <ArrowDownRight size={13} className="text-rose-400" />
                    }
                    <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {fmt(tx.amount)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── Budgets preview ──────────────────────────────────────────────── */}
      <Section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-indigo-950/40 dark:via-slate-950 dark:to-violet-950/30">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-violet-200 dark:border-violet-900">
              <Wallet size={12} />
              Presupuestos
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              Controla cuánto gastas
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Asigna un límite mensual a cada categoría. FinTrack calcula automáticamente cuánto llevas
              gastado y te avisa cuando te acercas al límite.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockBudgets.map((b, i) => {
              const pct = Math.round((b.spent / b.limit) * 100)
              const isWarning  = pct >= 80 && pct < 100
              const isDanger   = pct >= 100
              const barColor   = isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : b.bgColor
              const textColor  = isDanger ? 'text-rose-600 dark:text-rose-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'

              return (
                <motion.div
                  key={b.category}
                  variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-white dark:border-slate-800 shadow-md shadow-indigo-100/50 dark:shadow-none"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: b.color + '18' }}>
                        <b.Icon size={14} style={{ color: b.color }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{b.category}</span>
                    </div>
                    {isWarning && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded-md">Atención</span>}
                    {isDanger  && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded-md">Excedido</span>}
                  </div>

                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(pct, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className={`text-sm font-bold ${textColor}`}>{fmt(b.spent)}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500"> / {fmt(b.limit)}</span>
                    </div>
                    <span className={`text-xs font-semibold ${textColor}`}>{pct}%</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* ── Reports preview ──────────────────────────────────────────────── */}
      <Section className="py-20 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">

          {/* Mock chart + categories */}
          <motion.div variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }} className="space-y-4">

            {/* Bar chart */}
            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Ingresos vs Gastos — últimos 6 meses</p>
              <div className="flex items-end gap-3 h-32">
                {mockChart.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5 h-24">
                      <motion.div
                        className="flex-1 bg-emerald-500/80 rounded-t-sm"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(m.income / chartMax) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
                      />
                      <motion.div
                        className="flex-1 bg-rose-500/70 rounded-t-sm"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(m.expense / chartMax) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.07 + 0.04, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{m.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-2 rounded-sm bg-emerald-500/80 inline-block" /> Ingresos</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-2 rounded-sm bg-rose-500/70 inline-block" /> Gastos</span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Gastos por categoría</p>
              <div className="space-y-2.5">
                {mockCategories.map((c, i) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{c.name}</span>
                      <span className="text-slate-400 font-medium">{c.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: c.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <div>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-indigo-500/15 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-indigo-500/20">
              <BarChart3 size={12} />
              Reportes
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white mb-4 leading-snug">
              Entiende a dónde<br />va tu dinero
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed mb-6">
              Visualiza la evolución de tus ingresos y gastos mes a mes, identifica en qué categorías
              gastas más y exporta los datos a CSV para análisis externo.
            </motion.p>
            <motion.ul variants={fadeUp} className="space-y-2.5">
              {['Gráfico de ingresos vs gastos (6 meses)', 'Distribución de gastos por categoría', 'Exportación de datos a CSV'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle size={15} className="text-indigo-400 shrink-0" />
                  {f}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </Section>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <Section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">Todo incluido, sin complicaciones</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Cada funcionalidad fue diseñada para que tomar control de tus finanzas sea simple y directo.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: ArrowLeftRight, label: 'Transacciones', desc: 'Registra ingresos y gastos con categoría, fecha y descripción.',         color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
              { Icon: Wallet,         label: 'Presupuestos',  desc: 'Límites mensuales por categoría con seguimiento automático.',            color: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-50 dark:bg-violet-950' },
              { Icon: BarChart3,      label: 'Reportes',      desc: 'Gráficos de tendencias y distribución exportables a CSV.',               color: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-50 dark:bg-indigo-950' },
              { Icon: ShieldCheck,    label: 'Seguridad',     desc: 'Autenticación segura. Solo tú ves tus datos.',                           color: 'text-blue-600 dark:text-blue-400',      bg: 'bg-blue-50 dark:bg-blue-950' },
            ].map(({ Icon, label, desc, color, bg }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                transition={{ delay: i * 0.07 }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
              >
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={18} className={color} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <Section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl px-8 py-16 overflow-hidden shadow-2xl shadow-indigo-500/30">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"
            />

            <motion.h2 variants={fadeUp} className="relative text-3xl md:text-4xl font-bold text-white mb-4">
              Empieza a controlar<br />tus finanzas hoy
            </motion.h2>
            <motion.p variants={fadeUp} className="relative text-indigo-200 max-w-md mx-auto mb-8">
              Crea tu cuenta gratuitamente y comienza a registrar tus movimientos en menos de un minuto.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Crear cuenta gratis
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <TrendingUp size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">FinTrack</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">© 2026 FinTrack · Tu gestor de finanzas personales</p>
        </div>
      </footer>

    </div>
  )
}
