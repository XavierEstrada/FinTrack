import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import LanguageToggle from '../components/ui/LanguageToggle'
import {
  TrendingUp, Cpu, Layers, MonitorPlay, Terminal, Database,
  ShieldCheck, Rocket, Server, Globe, Lock, CheckCircle,
  Cloud, Code2, ChevronRight, ArrowLeftRight, Wallet,
  BarChart3, PiggyBank, ShoppingCart, Car, Tv,
  Utensils, Briefcase, ArrowUpRight, ArrowDownRight, Zap,
} from 'lucide-react'

// ── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }

function FadeSection({ id, children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className={`scroll-mt-24 ${className}`}
    >
      {children}
    </motion.section>
  )
}

function Pill({ icon: Icon, label, className }) {
  return (
    <motion.span variants={fadeUp} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 ${className}`}>
      <Icon size={11} />{label}
    </motion.span>
  )
}

function H2({ children }) {
  return <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">{children}</motion.h2>
}

function Lead({ children }) {
  return <motion.p variants={fadeUp} className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mb-8">{children}</motion.p>
}

function CodeBlock({ title, lang, code }) {
  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-left">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-slate-500 ml-1">{title} · <span className="text-slate-400">{lang}</span></span>
      </div>
      <pre className="p-4 text-xs text-slate-300 overflow-x-auto leading-6 font-mono"><code>{code}</code></pre>
    </div>
  )
}

// ── Static data (icons + colors only — labels come from t()) ─────────────────

const NAV_ITEMS = [
  { id: 'stack',           labelKey: 'showcase.nav.stack',        Icon: Cpu },
  { id: 'arquitectura',    labelKey: 'showcase.nav.architecture',  Icon: Layers },
  { id: 'caracteristicas', labelKey: 'showcase.nav.features',      Icon: MonitorPlay },
  { id: 'api',             labelKey: 'showcase.nav.api',           Icon: Terminal },
  { id: 'base-de-datos',   labelKey: 'showcase.nav.database',      Icon: Database },
  { id: 'seguridad',       labelKey: 'showcase.nav.security',      Icon: ShieldCheck },
  { id: 'pruebas',         labelKey: 'showcase.nav.tests',         Icon: CheckCircle },
  { id: 'despliegue',      labelKey: 'showcase.nav.deploy',        Icon: Rocket },
]

const FRONTEND_STACK = [
  { name: 'React 19',              roleKey: 'showcase.stackSection.fe.react.role',    descKey: 'showcase.stackSection.fe.react.desc',    color: 'bg-cyan-50 dark:bg-cyan-950 border-cyan-100 dark:border-cyan-900',         text: 'text-cyan-700 dark:text-cyan-300' },
  { name: 'Vite 8',                roleKey: 'showcase.stackSection.fe.vite.role',     descKey: 'showcase.stackSection.fe.vite.desc',     color: 'bg-violet-50 dark:bg-violet-950 border-violet-100 dark:border-violet-900', text: 'text-violet-700 dark:text-violet-300' },
  { name: 'TanStack Query v5',     roleKey: 'showcase.stackSection.fe.tanstack.role', descKey: 'showcase.stackSection.fe.tanstack.desc', color: 'bg-rose-50 dark:bg-rose-950 border-rose-100 dark:border-rose-900',         text: 'text-rose-700 dark:text-rose-300' },
  { name: 'Zustand v5',            roleKey: 'showcase.stackSection.fe.zustand.role',  descKey: 'showcase.stackSection.fe.zustand.desc',  color: 'bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900',     text: 'text-amber-700 dark:text-amber-300' },
  { name: 'React Hook Form + Zod', roleKey: 'showcase.stackSection.fe.rhf.role',      descKey: 'showcase.stackSection.fe.rhf.desc',      color: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900', text: 'text-emerald-700 dark:text-emerald-300' },
  { name: 'Framer Motion',         roleKey: 'showcase.stackSection.fe.framer.role',   descKey: 'showcase.stackSection.fe.framer.desc',   color: 'bg-pink-50 dark:bg-pink-950 border-pink-100 dark:border-pink-900',         text: 'text-pink-700 dark:text-pink-300' },
  { name: 'Tailwind CSS',          roleKey: 'showcase.stackSection.fe.tailwind.role', descKey: 'showcase.stackSection.fe.tailwind.desc', color: 'bg-sky-50 dark:bg-sky-950 border-sky-100 dark:border-sky-900',             text: 'text-sky-700 dark:text-sky-300' },
  { name: 'Vitest',                roleKey: 'showcase.stackSection.fe.vitest.role',   descKey: 'showcase.stackSection.fe.vitest.desc',   color: 'bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-900', text: 'text-indigo-700 dark:text-indigo-300' },
]

const BACKEND_STACK = [
  { name: '.NET 9',                   roleKey: 'showcase.stackSection.be.dotnet.role',     descKey: 'showcase.stackSection.be.dotnet.desc' },
  { name: 'ASP.NET Core Web API',     roleKey: 'showcase.stackSection.be.aspnet.role',     descKey: 'showcase.stackSection.be.aspnet.desc' },
  { name: 'Entity Framework Core',    roleKey: 'showcase.stackSection.be.efcore.role',     descKey: 'showcase.stackSection.be.efcore.desc' },
  { name: 'AutoMapper 16',            roleKey: 'showcase.stackSection.be.automapper.role', descKey: 'showcase.stackSection.be.automapper.desc' },
  { name: 'xUnit + FluentAssertions', roleKey: 'showcase.stackSection.be.xunit.role',      descKey: 'showcase.stackSection.be.xunit.desc' },
]

const INFRA_STACK = [
  { name: 'Supabase', roleKey: 'showcase.stackSection.infra.supabase.role', descKey: 'showcase.stackSection.infra.supabase.desc', Icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  { name: 'Vercel',   roleKey: 'showcase.stackSection.infra.vercel.role',   descKey: 'showcase.stackSection.infra.vercel.desc',   Icon: Cloud,    color: 'text-slate-500',   bg: 'bg-slate-50 dark:bg-slate-800' },
  { name: 'Render',   roleKey: 'showcase.stackSection.infra.render.role',   descKey: 'showcase.stackSection.infra.render.desc',   Icon: Server,   color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-950' },
]

const API_ENDPOINTS = [
  { groupKey: 'showcase.apiSection.groups.transactions', color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300', rows: [
    { method: 'GET',    path: '/api/transactions',       descKey: 'showcase.apiSection.desc.txGet',    params: 'page, limit, type, categoryId, from, to, search' },
    { method: 'POST',   path: '/api/transactions',       descKey: 'showcase.apiSection.desc.txPost',   params: null },
    { method: 'PUT',    path: '/api/transactions/{id}',  descKey: 'showcase.apiSection.desc.txPut',    params: null },
    { method: 'DELETE', path: '/api/transactions/{id}',  descKey: 'showcase.apiSection.desc.txDelete', params: null },
  ]},
  { groupKey: 'showcase.apiSection.groups.categories', color: 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300', rows: [
    { method: 'GET',    path: '/api/categories',         descKey: 'showcase.apiSection.desc.catGet',    params: null },
    { method: 'POST',   path: '/api/categories',         descKey: 'showcase.apiSection.desc.catPost',   params: null },
    { method: 'DELETE', path: '/api/categories/{id}',    descKey: 'showcase.apiSection.desc.catDelete', params: null },
  ]},
  { groupKey: 'showcase.apiSection.groups.budgets', color: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300', rows: [
    { method: 'GET',    path: '/api/budgets',            descKey: 'showcase.apiSection.desc.budGet',    params: 'month (YYYY-MM-DD)' },
    { method: 'POST',   path: '/api/budgets',            descKey: 'showcase.apiSection.desc.budPost',   params: null },
    { method: 'PUT',    path: '/api/budgets/{id}',       descKey: 'showcase.apiSection.desc.budPut',    params: null },
    { method: 'DELETE', path: '/api/budgets/{id}',       descKey: 'showcase.apiSection.desc.budDelete', params: null },
  ]},
  { groupKey: 'showcase.apiSection.groups.savings', color: 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300', rows: [
    { method: 'GET',    path: '/api/savings-goals',      descKey: 'showcase.apiSection.desc.savGet',    params: 'month' },
    { method: 'POST',   path: '/api/savings-goals',      descKey: 'showcase.apiSection.desc.savPost',   params: null },
    { method: 'PUT',    path: '/api/savings-goals/{id}', descKey: 'showcase.apiSection.desc.savPut',    params: null },
    { method: 'DELETE', path: '/api/savings-goals/{id}', descKey: 'showcase.apiSection.desc.savDelete', params: null },
  ]},
  { groupKey: 'showcase.apiSection.groups.reports', color: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300', rows: [
    { method: 'GET', path: '/api/reports/summary', descKey: 'showcase.apiSection.desc.repGet', params: 'month' },
    { method: 'GET', path: '/api/admin/stats',     descKey: 'showcase.apiSection.desc.admGet', params: null, admin: true },
  ]},
]

const DB_TABLES = [
  {
    name: 'profiles', descKey: 'showcase.dbSection.tableDesc.profiles',
    color: 'border-indigo-200 dark:border-indigo-800',
    cols: [
      { name: 'id',         type: 'uuid',    note: 'FK → auth.users (PK)' },
      { name: 'name',       type: 'text',    note: null },
      { name: 'email',      type: 'text',    note: null },
      { name: 'role',       type: 'text',    note: '"user" | "admin"' },
      { name: 'currency',   type: 'text',    note: 'Ej: "USD", "EUR"' },
      { name: 'avatar_url', type: 'text',    note: 'Nullable' },
    ],
  },
  {
    name: 'categories', descKey: 'showcase.dbSection.tableDesc.categories',
    color: 'border-violet-200 dark:border-violet-800',
    cols: [
      { name: 'id',        type: 'uuid',    note: 'PK' },
      { name: 'user_id',   type: 'uuid',    note: 'Nullable si is_system = true' },
      { name: 'name',      type: 'text',    note: null },
      { name: 'icon',      type: 'text',    note: 'Nombre de ícono Lucide' },
      { name: 'color',     type: 'text',    note: 'Hex color' },
      { name: 'is_system', type: 'boolean', note: 'Si true, visible para todos' },
    ],
  },
  {
    name: 'transactions', descKey: 'showcase.dbSection.tableDesc.transactions',
    color: 'border-emerald-200 dark:border-emerald-800',
    cols: [
      { name: 'id',          type: 'uuid',    note: 'PK' },
      { name: 'user_id',     type: 'uuid',    note: 'FK → profiles' },
      { name: 'category_id', type: 'uuid',    note: 'FK → categories' },
      { name: 'type',        type: 'text',    note: '"income" | "expense"' },
      { name: 'amount',      type: 'decimal', note: null },
      { name: 'description', type: 'text',    note: null },
      { name: 'date',        type: 'date',    note: null },
      { name: 'receipt_url', type: 'text',    note: 'Nullable · Supabase Storage' },
    ],
  },
  {
    name: 'budgets', descKey: 'showcase.dbSection.tableDesc.budgets',
    color: 'border-amber-200 dark:border-amber-800',
    cols: [
      { name: 'id',           type: 'uuid',    note: 'PK' },
      { name: 'user_id',      type: 'uuid',    note: 'FK → profiles' },
      { name: 'category_id',  type: 'uuid',    note: 'FK → categories' },
      { name: 'month',        type: 'date',    note: 'Primer día del mes' },
      { name: 'limit_amount', type: 'decimal', note: null },
    ],
    constraint: 'UNIQUE (user_id, category_id, month)',
  },
  {
    name: 'savings_goals', descKey: 'showcase.dbSection.tableDesc.savings_goals',
    color: 'border-sky-200 dark:border-sky-800',
    cols: [
      { name: 'id',             type: 'uuid',    note: 'PK' },
      { name: 'user_id',        type: 'uuid',    note: 'FK → profiles' },
      { name: 'name',           type: 'text',    note: null },
      { name: 'target_amount',  type: 'decimal', note: null },
      { name: 'current_amount', type: 'decimal', note: null },
      { name: 'month',          type: 'date',    note: 'Primer día del mes' },
      { name: 'icon',           type: 'text',    note: 'Nombre de ícono Lucide' },
      { name: 'color',          type: 'text',    note: 'Hex color' },
    ],
  },
]

const METHOD_COLORS = {
  GET:    'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300',
  POST:   'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  PUT:    'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  DELETE: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
}

// ── Mock UI data (visual demo) ────────────────────────────────────────────────
const mockTx = [
  { id: 1, desc: 'Salario mensual',  cat: 'Ingresos',        Icon: Briefcase,    color: '#10b981', type: 'income',  amt: 3200.00 },
  { id: 2, desc: 'Supermercado',     cat: 'Alimentación',    Icon: ShoppingCart, color: '#6366f1', type: 'expense', amt: 124.50 },
  { id: 3, desc: 'Netflix',          cat: 'Entretenimiento', Icon: Tv,           color: '#f59e0b', type: 'expense', amt: 15.99 },
  { id: 4, desc: 'Gasolina',         cat: 'Transporte',      Icon: Car,          color: '#3b82f6', type: 'expense', amt: 65.00 },
  { id: 5, desc: 'Restaurante',      cat: 'Alimentación',    Icon: Utensils,     color: '#6366f1', type: 'expense', amt: 48.80 },
]
const mockBudgets = [
  { cat: 'Alimentación',    Icon: ShoppingCart, color: '#6366f1', bg: 'bg-indigo-500',  spent: 320, limit: 500 },
  { cat: 'Transporte',      Icon: Car,          color: '#3b82f6', bg: 'bg-blue-500',    spent: 190, limit: 200 },
  { cat: 'Entretenimiento', Icon: Tv,           color: '#f59e0b', bg: 'bg-amber-500',   spent: 45,  limit: 150 },
]
const mockGoals = [
  { name: 'Fondo de emergencia', pct: 50, color: '#6366f1' },
  { name: 'Viaje a Europa',      pct: 80, color: '#10b981' },
  { name: 'MacBook Pro',         pct: 16, color: '#f59e0b' },
]
const mockChart = [
  { m: 'Nov', i: 3000, e: 2100 },
  { m: 'Dic', i: 3200, e: 2800 },
  { m: 'Ene', i: 3200, e: 1900 },
  { m: 'Feb', i: 3200, e: 2200 },
  { m: 'Mar', i: 3500, e: 2400 },
  { m: 'Abr', i: 3200, e: 2540 },
]
function fmt(n) { return `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` }

// ── Main component ───────────────────────────────────────────────────────────
export default function ShowcasePage() {
  const { t } = useTranslation()
  const { dark, toggle: toggleDark } = useThemeStore()

  // Pre-computed translated arrays (must be inside component to use t())
  const flowSteps = [
    { n: '1', title: t('showcase.archSection.flow1t'), desc: t('showcase.archSection.flow1d') },
    { n: '2', title: t('showcase.archSection.flow2t'), desc: t('showcase.archSection.flow2d') },
    { n: '3', title: t('showcase.archSection.flow3t'), desc: t('showcase.archSection.flow3d') },
    { n: '4', title: t('showcase.archSection.flow4t'), desc: t('showcase.archSection.flow4d') },
  ]

  const secCards = [
    { icon: Lock,        color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950', title: t('showcase.secSection.jwt.title'),     desc: t('showcase.secSection.jwt.desc') },
    { icon: Database,    color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950', title: t('showcase.secSection.rls.title'),   desc: t('showcase.secSection.rls.desc') },
    { icon: ShieldCheck, color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-950', title: t('showcase.secSection.roles.title'),  desc: t('showcase.secSection.roles.desc') },
    { icon: Cloud,       color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-950',   title: t('showcase.secSection.storage.title'), desc: t('showcase.secSection.storage.desc') },
  ]

  const beTestGroups = [
    { group: t('showcase.testsSection.pagination.name'), desc: t('showcase.testsSection.pagination.desc') },
    { group: t('showcase.testsSection.filters.name'),    desc: t('showcase.testsSection.filters.desc') },
    { group: t('showcase.testsSection.totals.name'),     desc: t('showcase.testsSection.totals.desc') },
    { group: t('showcase.testsSection.crud.name'),       desc: t('showcase.testsSection.crud.desc') },
  ]

  const deployServices = [
    {
      Icon: Cloud, color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-slate-900', border: 'border-slate-200 dark:border-slate-700',
      name: 'Vercel', role: t('showcase.deploySection.vercel.role'),
      items: t('showcase.deploySection.vercel.items', { returnObjects: true }),
    },
    {
      Icon: Server, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900', border: 'border-emerald-200 dark:border-emerald-800',
      name: 'Render', role: t('showcase.deploySection.render.role'),
      items: t('showcase.deploySection.render.items', { returnObjects: true }),
    },
    {
      Icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900', border: 'border-indigo-200 dark:border-indigo-800',
      name: 'Supabase', role: t('showcase.deploySection.supabase.role'),
      items: t('showcase.deploySection.supabase.items', { returnObjects: true }),
    },
  ]

  const titleAfter = t('showcase.hero.titleAfter')

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FinTrack</span>
            <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">·</span>
            <span className="hidden sm:inline-block text-sm text-slate-400 dark:text-slate-500">{t('showcase.techDocs')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {t('showcase.backHome')}
            </Link>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
            <button
              onClick={toggleDark}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <LanguageToggle className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200" />
            <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              {t('showcase.tryApp')}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              {t('showcase.hero.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              {t('showcase.hero.titleBefore')}{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">FinTrack</span>
              {titleAfter && <>{' '}{titleAfter}</>}
            </h1>
            <p className="text-lg text-indigo-200/70 max-w-2xl mx-auto mb-8">
              {t('showcase.hero.desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['React 19', '.NET 9', 'Supabase', 'PostgreSQL', 'Vercel', 'xUnit', 'Vitest', 'TanStack Query'].map(tag => (
                <span key={tag} className="text-xs bg-white/10 text-indigo-200 border border-white/10 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Layout: Sidebar + Content ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-14 flex gap-12">

        {/* Sticky sidebar nav */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{t('showcase.sidebar.sections')}</p>
            <nav className="space-y-0.5">
              {NAV_ITEMS.map(({ id, labelKey, Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors group"
                >
                  <Icon size={14} className="shrink-0 group-hover:text-indigo-500 transition-colors" />
                  {t(labelKey)}
                </a>
              ))}
            </nav>

            <div className="mt-8 p-3 bg-indigo-50 dark:bg-indigo-950 rounded-xl border border-indigo-100 dark:border-indigo-900">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">{t('showcase.sidebar.ctaTitle')}</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-2">{t('showcase.sidebar.ctaDesc')}</p>
              <Link to="/register" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                {t('showcase.sidebar.ctaBtn')} <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-20">

          {/* ── Stack tecnológico ────────────────────────────────────────── */}
          <FadeSection id="stack">
            <Pill icon={Cpu} label={t('showcase.stackSection.pill')} className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300" />
            <H2>{t('showcase.stackSection.title')}</H2>
            <Lead>{t('showcase.stackSection.lead')}</Lead>

            <div className="space-y-8">
              {/* Frontend */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-indigo-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('showcase.stackSection.frontendLabel')}</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">React + Vite</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FRONTEND_STACK.map(item => (
                    <motion.div key={item.name} variants={fadeUp} className={`border rounded-xl p-4 ${item.color}`}>
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${item.text} bg-white/50 dark:bg-black/20`}>{t(item.roleKey)}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t(item.descKey)}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Server size={16} className="text-emerald-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('showcase.stackSection.backendLabel')}</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">.NET 9 Web API</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BACKEND_STACK.map(item => (
                    <motion.div key={item.name} variants={fadeUp} className="border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950">{t(item.roleKey)}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t(item.descKey)}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Infra */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Cloud size={16} className="text-amber-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t('showcase.stackSection.infraLabel')}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {INFRA_STACK.map(item => (
                    <motion.div key={item.name} variants={fadeUp} className={`border border-slate-100 dark:border-slate-800 ${item.bg} rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <item.Icon size={16} className={item.color} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">{t(item.roleKey)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t(item.descKey)}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeSection>

          {/* ── Arquitectura ─────────────────────────────────────────────── */}
          <FadeSection id="arquitectura">
            <Pill icon={Layers} label={t('showcase.archSection.pill')} className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 text-violet-700 dark:text-violet-300" />
            <H2>{t('showcase.archSection.title')}</H2>
            <Lead>{t('showcase.archSection.lead')}</Lead>

            {/* Diagram */}
            <motion.div variants={fadeUp} className="max-w-lg mx-auto space-y-3 mb-10">
              {/* Browser */}
              <div className="bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 text-center">
                <Globe className="mx-auto mb-1.5 text-indigo-500" size={22} />
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{t('showcase.archSection.browser')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">React 19 · Vite · TanStack Query · Zustand</p>
                <span className="inline-block mt-1.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">Vercel</span>
              </div>

              <div className="flex items-center gap-2 px-6">
                <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700" />
                <span className="text-[10px] text-slate-400 shrink-0 bg-white dark:bg-slate-950 px-2">JWT Bearer · HTTPS</span>
                <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700" />
              </div>

              {/* Services row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-violet-50 dark:bg-violet-950 border-2 border-violet-200 dark:border-violet-800 rounded-2xl p-4 text-center">
                  <Lock className="mx-auto mb-1.5 text-violet-500" size={20} />
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">Supabase Auth</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">JWT · RLS · Roles</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center">
                  <Server className="mx-auto mb-1.5 text-emerald-500" size={20} />
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">.NET 9 Web API</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ASP.NET Core · EF Core</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-full">Render</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-6">
                <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700" />
                <span className="text-[10px] text-slate-400 shrink-0 bg-white dark:bg-slate-950 px-2">EF Core + PostgreSQL driver</span>
                <div className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-700" />
              </div>

              {/* DB + Storage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
                  <Database className="mx-auto mb-1.5 text-slate-500" size={20} />
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">PostgreSQL</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('showcase.archSection.dbTables')}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">Supabase</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center">
                  <Cloud className="mx-auto mb-1.5 text-amber-500" size={20} />
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">Storage</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('showcase.archSection.storageFiles')}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full">Supabase</span>
                </div>
              </div>
            </motion.div>

            {/* Flow explanation */}
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4 mb-8">
              {flowSteps.map(s => (
                <div key={s.n} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-0.5">{s.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <CodeBlock
                title="TransactionService.cs · Filtrado + paginación"
                lang="C#"
                code={`// Construir query con filtros opcionales
var query = _db.Transactions
    .Where(t => t.UserId == userId);

if (type is not null)
    query = query.Where(t => t.Type == type);

if (from.HasValue)
    query = query.Where(t => t.Date >= from.Value);

if (search is not null)
    query = query.Where(t =>
        t.Description.ToLower().Contains(search.ToLower()));

// Calcular totales antes de paginar (mismos filtros aplicados)
var totalIncome  = await query
    .Where(t => t.Type == "income")
    .SumAsync(t => (decimal?)t.Amount) ?? 0;
var totalExpense = await query
    .Where(t => t.Type == "expense")
    .SumAsync(t => (decimal?)t.Amount) ?? 0;

// Paginar y mapear a DTO
var data = await query
    .OrderByDescending(t => t.Date)
    .Skip((page - 1) * limit)
    .Take(limit)
    .ProjectTo<TransactionDto>(_mapper.ConfigurationProvider)
    .ToListAsync();`}
              />
            </motion.div>
          </FadeSection>

          {/* ── Características ──────────────────────────────────────────── */}
          <FadeSection id="caracteristicas">
            <Pill icon={MonitorPlay} label={t('showcase.featSection.pill')} className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300" />
            <H2>{t('showcase.featSection.title')}</H2>
            <Lead>{t('showcase.featSection.lead')}</Lead>

            <div className="space-y-10">

              {/* Dashboard + Transacciones */}
              <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6">
                {/* Dashboard */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <BarChart3 size={14} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dashboard</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { l: t('common.balance'),  v: '$660',   c: 'text-indigo-600 dark:text-indigo-400',   bg: 'bg-indigo-50 dark:bg-indigo-950' },
                        { l: t('common.incomes'),  v: '$3,200', c: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
                        { l: t('common.expenses'), v: '$2,540', c: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-950' },
                      ].map(s => (
                        <div key={s.l} className={`${s.bg} rounded-xl p-3 text-center`}>
                          <p className="text-[10px] text-slate-400 mb-0.5">{s.l}</p>
                          <p className={`text-xs font-bold ${s.c}`}>{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{t('showcase.featSection.recent')}</p>
                    <div className="space-y-1">
                      {mockTx.slice(0, 3).map(tx => (
                        <div key={tx.id} className="flex items-center justify-between py-1 px-2 rounded-lg">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: tx.color + '22' }}>
                              <tx.Icon size={10} style={{ color: tx.color }} />
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{tx.desc}</span>
                          </div>
                          <span className={`text-xs font-semibold shrink-0 ml-2 ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-400'}`}>
                            {tx.type === 'income' ? '+' : '−'}{fmt(tx.amt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 pb-4 bg-white dark:bg-slate-900">
                    <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PiggyBank size={14} className="text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{t('showcase.featSection.savingsMonth')}</span>
                      </div>
                      <span className="text-xs text-indigo-500">{t('showcase.featSection.goalsMet2of3')}</span>
                    </div>
                  </div>
                  <div className="px-4 pb-3 bg-white dark:bg-slate-900">
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                      {(t('showcase.featSection.dashFeatures', { returnObjects: true })).map(f => (
                        <li key={f} className="flex items-start gap-2"><CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Transacciones */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <ArrowLeftRight size={14} className="text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('nav.transactions')}</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900">
                    <div className="flex gap-2 mb-3">
                      {[t('showcase.featSection.filterAll'), t('showcase.featSection.filterIncome'), t('showcase.featSection.filterExpense')].map((f, i) => (
                        <span key={f} className={`text-xs px-2.5 py-1 rounded-full font-medium ${i === 0 ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{f}</span>
                      ))}
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                      {mockTx.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: tx.color + '20' }}>
                              <tx.Icon size={12} style={{ color: tx.color }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">{tx.desc}</p>
                              <p className="text-[10px] text-slate-400">{tx.cat}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            {tx.type === 'income' ? <ArrowUpRight size={11} className="text-emerald-500" /> : <ArrowDownRight size={11} className="text-rose-400" />}
                            <span className={`text-xs font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{fmt(tx.amt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">↑ $3,200.00</span>
                      <span className="text-slate-400">Balance: $2,945.71</span>
                      <span className="text-rose-500 font-semibold">↓ $254.29</span>
                    </div>
                  </div>
                  <div className="px-4 pb-3 bg-white dark:bg-slate-900">
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                      {(t('showcase.featSection.txFeatures', { returnObjects: true })).map(f => (
                        <li key={f} className="flex items-start gap-2"><CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Presupuestos + Ahorros */}
              <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6">
                {/* Presupuestos */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Wallet size={14} className="text-violet-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('nav.budgets')}</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 space-y-3">
                    {mockBudgets.map((b) => {
                      const pct = Math.round((b.spent / b.limit) * 100)
                      const isWarn = pct >= 80
                      return (
                        <div key={b.cat}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: b.color + '22' }}>
                                <b.Icon size={11} style={{ color: b.color }} />
                              </div>
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{b.cat}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isWarn && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">{t('showcase.featSection.attn')}</span>}
                              <span className={`text-xs font-semibold ${isWarn ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'}`}>{pct}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                            <div className={`h-full rounded-full ${isWarn ? 'bg-amber-500' : b.bg}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-400">{fmt(b.spent)} {t('showcase.featSection.of')} {fmt(b.limit)}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="px-4 pb-3 bg-white dark:bg-slate-900">
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                      {(t('showcase.featSection.budgetFeatures', { returnObjects: true })).map(f => (
                        <li key={f} className="flex items-start gap-2"><CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ahorros */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <PiggyBank size={14} className="text-sky-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('nav.savings')}</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 space-y-4">
                    {mockGoals.map(g => (
                      <div key={g.name}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{g.name}</span>
                          <span className="text-xs font-semibold" style={{ color: g.color }}>{g.pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${g.pct}%`, backgroundColor: g.color }} />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                      <p className="text-xs text-slate-400">{t('showcase.featSection.goalsMetMonth')}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-3 bg-white dark:bg-slate-900">
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                      {(t('showcase.featSection.savingsFeatures', { returnObjects: true })).map(f => (
                        <li key={f} className="flex items-start gap-2"><CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Reportes */}
              <motion.div variants={fadeUp} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <BarChart3 size={14} className="text-rose-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('nav.reports')}</span>
                </div>
                <div className="p-5 bg-white dark:bg-slate-900">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Bar chart */}
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">{t('showcase.featSection.chartTitle')}</p>
                      <div className="flex items-end gap-2 h-28">
                        {mockChart.map((m, i) => (
                          <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex items-end gap-0.5 h-20">
                              <motion.div className="flex-1 bg-emerald-400 rounded-t-sm" initial={{ height: 0 }} whileInView={{ height: `${(m.i / 3500) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 }} />
                              <motion.div className="flex-1 bg-rose-400 rounded-t-sm" initial={{ height: 0 }} whileInView={{ height: `${(m.e / 3500) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 + 0.03 }} />
                            </div>
                            <span className="text-[9px] text-slate-400">{m.m}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-3 h-2 rounded-sm bg-emerald-400 inline-block" />{t('showcase.featSection.chartIncome')}</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-3 h-2 rounded-sm bg-rose-400 inline-block" />{t('showcase.featSection.chartExpense')}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">{t('showcase.featSection.moduleFeatures')}</p>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                        {(t('showcase.featSection.reportsFeatures', { returnObjects: true })).map(f => (
                          <li key={f} className="flex items-start gap-2"><CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </FadeSection>

          {/* ── API REST ─────────────────────────────────────────────────── */}
          <FadeSection id="api">
            <Pill icon={Terminal} label={t('showcase.apiSection.pill')} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" />
            <H2>{t('showcase.apiSection.title')}</H2>
            <Lead>{t('showcase.apiSection.lead')}</Lead>

            <motion.div variants={fadeUp} className="space-y-6">
              {API_ENDPOINTS.map(group => (
                <div key={group.groupKey}>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${group.color}`}>
                    {t(group.groupKey)}
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                          <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wide text-[10px] w-16">{t('showcase.apiSection.colMethod')}</th>
                          <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wide text-[10px]">{t('showcase.apiSection.colRoute')}</th>
                          <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wide text-[10px] hidden md:table-cell">{t('showcase.apiSection.colDesc')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {group.rows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] ${METHOD_COLORS[r.method]}`}>{r.method}</span>
                            </td>
                            <td className="px-4 py-3">
                              <code className="font-mono text-slate-700 dark:text-slate-200">{r.path}</code>
                              {r.params && <p className="text-[10px] text-slate-400 mt-0.5">?{r.params}</p>}
                              {r.admin && <span className="ml-2 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded">{t('showcase.apiSection.adminOnly')}</span>}
                            </td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{t(r.descKey)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <CodeBlock
                title="useTransactions.js · Hook con TanStack Query"
                lang="JavaScript"
                code={`// src/hooks/useTransactions.js
export function useTransactions(filters = {}) {
  return useQuery({
    // La queryKey incluye los filtros: si cambian,
    // TanStack Query refetch automáticamente
    queryKey: ['transactions', filters],
    queryFn:  () => transactionService.getAll(filters),
    staleTime: 1000 * 30, // 30 s en caché
  })
}

// Uso en componente
const { data, isLoading } = useTransactions({
  page: 1, limit: 20,
  type: 'expense',
  from: '2026-04-01',
  to:   '2026-04-30',
})`}
              />
            </motion.div>
          </FadeSection>

          {/* ── Base de datos ─────────────────────────────────────────────── */}
          <FadeSection id="base-de-datos">
            <Pill icon={Database} label={t('showcase.dbSection.pill')} className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-300" />
            <H2>{t('showcase.dbSection.title')}</H2>
            <Lead>{t('showcase.dbSection.lead')}</Lead>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              {DB_TABLES.map(tbl => (
                <div key={tbl.name} className={`border-2 ${tbl.color} rounded-xl overflow-hidden`}>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-100">{tbl.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t(tbl.descKey)}</p>
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-slate-900 space-y-1.5">
                    {tbl.cols.map(c => (
                      <div key={c.name} className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-200">{c.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">{c.type}</span>
                          {c.note && <span className="text-[10px] text-slate-400 hidden sm:inline">{c.note}</span>}
                        </div>
                      </div>
                    ))}
                    {tbl.constraint && (
                      <p className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 pt-1 border-t border-slate-50 dark:border-slate-800 mt-1">
                        {tbl.constraint}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </FadeSection>

          {/* ── Seguridad ────────────────────────────────────────────────── */}
          <FadeSection id="seguridad">
            <Pill icon={ShieldCheck} label={t('showcase.secSection.pill')} className="bg-rose-50 dark:bg-rose-950 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-300" />
            <H2>{t('showcase.secSection.title')}</H2>
            <Lead>{t('showcase.secSection.lead')}</Lead>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {secCards.map(s => (
                <motion.div key={s.title} variants={fadeUp} className={`${s.bg} border border-slate-100 dark:border-slate-800 rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon size={16} className={s.color} />
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{s.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp}>
              <CodeBlock
                title="RLS policy ejemplo · transactions"
                lang="SQL"
                code={`-- Solo el dueño puede leer sus transacciones
CREATE POLICY "user_own_transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- Solo el dueño puede insertar
CREATE POLICY "user_insert_transactions"
  ON transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- El backend extrae user_id del JWT, nunca del body
// TransactionsController.cs
[HttpPost]
public async Task<IActionResult> Create(CreateTransactionDto dto)
{
    // User.FindFirstValue(ClaimTypes.NameIdentifier) = sub del JWT
    var userId = Guid.Parse(User.FindFirstValue("sub")!);
    var result = await _svc.CreateAsync(dto, userId);
    return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
}`}
              />
            </motion.div>
          </FadeSection>

          {/* ── Pruebas ──────────────────────────────────────────────────── */}
          <FadeSection id="pruebas">
            <Pill icon={CheckCircle} label={t('showcase.testsSection.pill')} className="bg-sky-50 dark:bg-sky-950 border border-sky-100 dark:border-sky-900 text-sky-700 dark:text-sky-300" />
            <H2>{t('showcase.testsSection.title')}</H2>
            <Lead>{t('showcase.testsSection.lead')}</Lead>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Frontend */}
              <motion.div variants={fadeUp} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-violet-50 dark:bg-violet-950 px-4 py-3 border-b border-violet-100 dark:border-violet-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-violet-500" />
                      <span className="font-semibold text-sm text-violet-800 dark:text-violet-100">Frontend · Vitest</span>
                    </div>
                    <span className="text-xs font-bold bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">28 tests</span>
                  </div>
                </div>
                <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                  {[
                    { file: 'utils.test.js',          count: 22, desc: t('showcase.testsSection.utilsDesc') },
                    { file: 'receiptService.test.js',  count: 6,  desc: t('showcase.testsSection.receiptDesc') },
                  ].map(f => (
                    <div key={f.file} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-xs font-mono text-slate-700 dark:text-slate-200">{f.file}</code>
                        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">{f.count} tests</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Backend */}
              <motion.div variants={fadeUp} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-emerald-50 dark:bg-emerald-950 px-4 py-3 border-b border-emerald-100 dark:border-emerald-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-emerald-500" />
                      <span className="font-semibold text-sm text-emerald-800 dark:text-emerald-100">Backend · xUnit</span>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">12 tests</span>
                  </div>
                </div>
                <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                  {beTestGroups.map(g => (
                    <div key={g.group} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-0.5">{g.group}</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeUp}>
              <CodeBlock
                title="TransactionServiceTests.cs · Ejemplo de test"
                lang="C# / xUnit"
                code={`[Fact]
public async Task GetAllAsync_TotalesRespetanFiltroTipo()
{
    await SeedAsync(
        MakeTx("income",  1000),
        MakeTx("expense",  300)
    );

    // Filtrar solo ingresos → TotalExpense debe ser 0
    var result = await _svc.GetAllAsync(
        _userId, page: 1, limit: 10,
        type: "income",
        categoryId: null, from: null, to: null, search: null);

    result.TotalIncome.Should().Be(1000);
    result.TotalExpense.Should().Be(0);
}

// Constructor: cada test recibe su propia DB aislada
public TransactionServiceTests()
{
    var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString()) // nombre único
        .Options;
    _db = new AppDbContext(options);

    var services = new ServiceCollection();
    services.AddLogging();
    services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());
    var mapper = services.BuildServiceProvider()
        .GetRequiredService<IMapper>();

    _svc = new TransactionService(_db, mapper);
}`}
              />
            </motion.div>
          </FadeSection>

          {/* ── Despliegue ───────────────────────────────────────────────── */}
          <FadeSection id="despliegue">
            <Pill icon={Rocket} label={t('showcase.deploySection.pill')} className="bg-rose-50 dark:bg-rose-950 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-300" />
            <H2>{t('showcase.deploySection.title')}</H2>
            <Lead>{t('showcase.deploySection.lead')}</Lead>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {deployServices.map(s => (
                <motion.div key={s.name} variants={fadeUp} className={`border-2 ${s.border} ${s.bg} rounded-2xl p-5`}>
                  <div className="flex items-center gap-2 mb-1">
                    <s.Icon size={18} className={s.color} />
                    <span className="font-bold text-slate-800 dark:text-slate-100">{s.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{s.role}</p>
                  <ul className="space-y-1.5">
                    {s.items.map(i => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{i}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp}>
              <CodeBlock
                title="vercel.json · SPA rewrite para React Router"
                lang="JSON"
                code={`{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

// vite.config.js · Code splitting manual
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'motion'    // 133 KB
          if (id.includes('@supabase'))     return 'supabase'  // 186 KB
          if (id.includes('@tanstack'))     return 'query'     //  35 KB
          if (id.includes('react-dom') ||
              id.includes('react-router'))  return 'vendor'    // 275 KB
        },
      },
    },
  },
})`}
              />
            </motion.div>
          </FadeSection>

        </main>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <TrendingUp size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">FinTrack</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-400">{t('showcase.footer.portfolio')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('showcase.footer.backHome')}</Link>
            <Link to="/register" className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">{t('showcase.footer.tryApp')}</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
