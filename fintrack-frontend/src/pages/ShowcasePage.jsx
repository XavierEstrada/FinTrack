import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  TrendingUp, Cpu, Layers, MonitorPlay, Terminal, Database,
  ShieldCheck, Rocket, Server, Globe, Lock, CheckCircle,
  Cloud, Code2, ChevronRight, ArrowLeftRight, Wallet,
  BarChart3, PiggyBank, Receipt, ShoppingCart, Car, Tv,
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

// ── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'stack',           label: 'Stack tecnológico', Icon: Cpu },
  { id: 'arquitectura',    label: 'Arquitectura',       Icon: Layers },
  { id: 'caracteristicas', label: 'Características',    Icon: MonitorPlay },
  { id: 'api',             label: 'API REST',            Icon: Terminal },
  { id: 'base-de-datos',   label: 'Base de datos',      Icon: Database },
  { id: 'seguridad',       label: 'Seguridad',           Icon: ShieldCheck },
  { id: 'pruebas',         label: 'Pruebas',             Icon: CheckCircle },
  { id: 'despliegue',      label: 'Despliegue',          Icon: Rocket },
]

const FRONTEND_STACK = [
  { name: 'React 19',               role: 'Framework UI',      desc: 'Componentes funcionales, hooks personalizados, composición de UI reutilizable.',                      color: 'bg-cyan-50 dark:bg-cyan-950 border-cyan-100 dark:border-cyan-900',     text: 'text-cyan-700 dark:text-cyan-300' },
  { name: 'Vite 8',                 role: 'Build tool',        desc: 'HMR instantáneo en desarrollo. Bundling con code-splitting manual para optimizar carga.',            color: 'bg-violet-50 dark:bg-violet-950 border-violet-100 dark:border-violet-900', text: 'text-violet-700 dark:text-violet-300' },
  { name: 'TanStack Query v5',      role: 'Server state',      desc: 'Caché automático, refetch en background, invalidación por queryKey. Sin Redux.',                     color: 'bg-rose-50 dark:bg-rose-950 border-rose-100 dark:border-rose-900',     text: 'text-rose-700 dark:text-rose-300' },
  { name: 'Zustand v5',             role: 'Client state',      desc: 'Store mínimo para sesión y perfil de usuario. Sin boilerplate, sin Context API manual.',            color: 'bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900', text: 'text-amber-700 dark:text-amber-300' },
  { name: 'React Hook Form + Zod',  role: 'Formularios',       desc: 'Validación tipada en cliente. Schemas Zod reutilizables e integrados con resolvers.',               color: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900', text: 'text-emerald-700 dark:text-emerald-300' },
  { name: 'Framer Motion',          role: 'Animaciones',       desc: 'Page transitions, scroll animations, floating elements. Declarativo y performante.',                 color: 'bg-pink-50 dark:bg-pink-950 border-pink-100 dark:border-pink-900',     text: 'text-pink-700 dark:text-pink-300' },
  { name: 'Tailwind CSS',           role: 'Estilos',           desc: 'Utility-first con dark mode automático. Diseño responsivo mobile-first en todo el proyecto.',        color: 'bg-sky-50 dark:bg-sky-950 border-sky-100 dark:border-sky-900',         text: 'text-sky-700 dark:text-sky-300' },
  { name: 'Vitest',                 role: 'Testing',           desc: '28 tests unitarios. vi.mock() para Supabase, vi.setSystemTime() para fechas deterministas.',         color: 'bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-900', text: 'text-indigo-700 dark:text-indigo-300' },
]

const BACKEND_STACK = [
  { name: '.NET 9',                       role: 'Runtime',         desc: 'Rendimiento top-tier, tipado fuerte, cross-platform. API compila a ejecutable nativo.' },
  { name: 'ASP.NET Core Web API',         role: 'Framework REST',  desc: 'Routing attribute-based, middleware configurable, Model Binding, validación automática.' },
  { name: 'Entity Framework Core',        role: 'ORM',             desc: 'LINQ queries tipadas, migraciones automáticas, InMemory provider para tests de integración.' },
  { name: 'AutoMapper 16',                role: 'Mapeo de DTOs',   desc: 'Separación limpia entre entidades de DB y contratos del API. Perfiles de mapeo centralizados.' },
  { name: 'xUnit + FluentAssertions',     role: 'Testing',         desc: '12 tests de integración con EF InMemory. Assertions legibles con .Should().Be().' },
]

const INFRA_STACK = [
  { name: 'Supabase',  role: 'PostgreSQL + Auth + Storage', desc: 'Base de datos gestionada, autenticación JWT lista para usar y almacenamiento de archivos con políticas RLS.', Icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  { name: 'Vercel',    role: 'Frontend hosting',            desc: 'Deploy automático al hacer push a main. SPA rewrites configurados en vercel.json para React Router.',         Icon: Cloud,    color: 'text-slate-500',   bg: 'bg-slate-50 dark:bg-slate-800' },
  { name: 'Render',    role: 'Backend hosting',             desc: 'Hosting del API .NET 9. Free tier con cold start. Deploy desde repositorio Git.',                            Icon: Server,   color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-950' },
]

const API_ENDPOINTS = [
  { group: 'Transacciones', color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300', rows: [
    { method: 'GET',    path: '/api/transactions',         desc: 'Lista paginada. Filtros: tipo, categoría, rango de fechas, búsqueda por texto.',  params: 'page, limit, type, categoryId, from, to, search' },
    { method: 'POST',   path: '/api/transactions',         desc: 'Crear transacción. Admite receipt_url para comprobante en Supabase Storage.',      params: null },
    { method: 'PUT',    path: '/api/transactions/{id}',    desc: 'Actualizar. Solo el dueño puede modificar su transacción.',                        params: null },
    { method: 'DELETE', path: '/api/transactions/{id}',    desc: 'Eliminar. El servicio verifica user_id antes de borrar.',                          params: null },
  ]},
  { group: 'Categorías', color: 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300', rows: [
    { method: 'GET',    path: '/api/categories',           desc: 'Devuelve categorías propias del usuario más las categorías de sistema (is_system = true).', params: null },
    { method: 'POST',   path: '/api/categories',           desc: 'Crear categoría personalizada con nombre, icono y color hex.',                            params: null },
    { method: 'DELETE', path: '/api/categories/{id}',      desc: 'Eliminar categoría propia. Las categorías de sistema no pueden eliminarse.',              params: null },
  ]},
  { group: 'Presupuestos', color: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300', rows: [
    { method: 'GET',    path: '/api/budgets',              desc: 'Presupuestos del mes con porcentaje gastado calculado en tiempo real.',  params: 'month (YYYY-MM-DD)' },
    { method: 'POST',   path: '/api/budgets',              desc: 'Crear límite mensual por categoría. Único por (user, categoría, mes).', params: null },
    { method: 'PUT',    path: '/api/budgets/{id}',         desc: 'Actualizar monto límite.',                                             params: null },
    { method: 'DELETE', path: '/api/budgets/{id}',         desc: 'Eliminar presupuesto.',                                                params: null },
  ]},
  { group: 'Metas de ahorro', color: 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300', rows: [
    { method: 'GET',    path: '/api/savings-goals',        desc: 'Metas del mes con progreso y porcentaje completado.',     params: 'month' },
    { method: 'POST',   path: '/api/savings-goals',        desc: 'Crear meta con nombre, ícono, color y monto objetivo.',  params: null },
    { method: 'PUT',    path: '/api/savings-goals/{id}',   desc: 'Actualizar monto actual o cualquier campo.',             params: null },
    { method: 'DELETE', path: '/api/savings-goals/{id}',   desc: 'Eliminar meta.',                                         params: null },
  ]},
  { group: 'Reportes & Admin', color: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300', rows: [
    { method: 'GET',    path: '/api/reports/summary',      desc: 'Resumen mensual: totales por tipo, top categorías, tendencia 6 meses.',                      params: 'month' },
    { method: 'GET',    path: '/api/admin/stats',          desc: 'Estadísticas globales del sistema (solo rol admin). Total usuarios, volumen de transacciones.', params: null, admin: true },
  ]},
]

const DB_TABLES = [
  {
    name: 'profiles', desc: 'Extiende auth.users de Supabase. Se crea automáticamente al registrarse.',
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
    name: 'categories', desc: 'Categorizacion de transacciones. Puede ser del sistema (visible para todos) o del usuario.',
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
    name: 'transactions', desc: 'Registro central de movimientos financieros. Cada fila pertenece a un solo usuario.',
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
    name: 'budgets', desc: 'Límites de gasto mensuales por categoría. Restricción UNIQUE evita duplicados.',
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
    name: 'savings_goals', desc: 'Metas de ahorro mensuales con seguimiento de progreso.',
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

// ── Mock UI data ─────────────────────────────────────────────────────────────
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
            <span className="hidden sm:inline-block text-sm text-slate-400 dark:text-slate-500">Documentación técnica</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              ← Inicio
            </Link>
            <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Probar app
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
              Proyecto de portafolio · Para reclutadores
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Cómo está construido{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">FinTrack</span>
            </h1>
            <p className="text-lg text-indigo-200/70 max-w-2xl mx-auto mb-8">
              Una aplicación fullstack de gestión financiera personal. Esta página documenta su arquitectura,
              stack tecnológico, patrones de diseño y decisiones de implementación.
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Secciones</p>
            <nav className="space-y-0.5">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors group"
                >
                  <Icon size={14} className="shrink-0 group-hover:text-indigo-500 transition-colors" />
                  {label}
                </a>
              ))}
            </nav>

            <div className="mt-8 p-3 bg-indigo-50 dark:bg-indigo-950 rounded-xl border border-indigo-100 dark:border-indigo-900">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">¿Quieres probarlo?</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-2">Crea una cuenta gratuita y explora la app en vivo.</p>
              <Link to="/register" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Comenzar <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-20">

          {/* ── Stack tecnológico ────────────────────────────────────────── */}
          <FadeSection id="stack">
            <Pill icon={Cpu} label="Stack tecnológico" className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300" />
            <H2>Tecnologías utilizadas</H2>
            <Lead>
              FinTrack es una aplicación fullstack moderna. El frontend consume el API REST del backend
              que conecta a Supabase (PostgreSQL + Auth + Storage) como infraestructura.
            </Lead>

            <div className="space-y-8">
              {/* Frontend */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-indigo-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Frontend</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">React + Vite</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FRONTEND_STACK.map(t => (
                    <motion.div key={t.name} variants={fadeUp} className={`border rounded-xl p-4 ${t.color}`}>
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${t.text} bg-white/50 dark:bg-black/20`}>{t.role}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Server size={16} className="text-emerald-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Backend</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">.NET 9 Web API</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BACKEND_STACK.map(t => (
                    <motion.div key={t.name} variants={fadeUp} className="border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.name}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950">{t.role}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Infra */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Cloud size={16} className="text-amber-500" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Infraestructura</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {INFRA_STACK.map(t => (
                    <motion.div key={t.name} variants={fadeUp} className={`border border-slate-100 dark:border-slate-800 ${t.bg} rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <t.Icon size={16} className={t.color} />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.name}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">{t.role}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeSection>

          {/* ── Arquitectura ─────────────────────────────────────────────── */}
          <FadeSection id="arquitectura">
            <Pill icon={Layers} label="Arquitectura" className="bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900 text-violet-700 dark:text-violet-300" />
            <H2>Arquitectura del sistema</H2>
            <Lead>
              El sistema sigue una arquitectura de tres capas: cliente React, API REST .NET y Supabase como backend-as-a-service.
              Los archivos van directo al Storage sin pasar por el API, reduciendo latencia y carga del servidor.
            </Lead>

            {/* Diagram */}
            <motion.div variants={fadeUp} className="max-w-lg mx-auto space-y-3 mb-10">
              {/* Browser */}
              <div className="bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 text-center">
                <Globe className="mx-auto mb-1.5 text-indigo-500" size={22} />
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">Navegador / Cliente</p>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">5 tablas · RLS policies</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">Supabase</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center">
                  <Cloud className="mx-auto mb-1.5 text-amber-500" size={20} />
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">Storage</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Comprobantes · Avatares</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full">Supabase</span>
                </div>
              </div>
            </motion.div>

            {/* Flow explanation */}
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { n: '1', t: 'Autenticación', d: 'El usuario se autentica en Supabase. Se retorna un JWT HS256 firmado con el secret del proyecto.' },
                { n: '2', t: 'Requests al API', d: 'El frontend adjunta el JWT en el header Authorization. El middleware del API valida la firma y extrae el user_id.' },
                { n: '3', t: 'Consultas a DB', d: 'EF Core traduce LINQ a SQL y consulta PostgreSQL. Las RLS policies garantizan aislamiento por usuario.' },
                { n: '4', t: 'Archivos directos', d: 'Los comprobantes se suben directo desde el browser a Supabase Storage (sin pasar por el API) usando el mismo JWT.' },
              ].map(s => (
                <div key={s.n} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-0.5">{s.t}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.d}</p>
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
            <Pill icon={MonitorPlay} label="Características" className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300" />
            <H2>Pantallas y funcionalidades</H2>
            <Lead>
              Cinco módulos principales más panel de administración. Cada módulo tiene su propia página, hook de datos y set de componentes.
            </Lead>

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
                        { l: 'Balance',   v: '$660',    c: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950' },
                        { l: 'Ingresos',  v: '$3,200',  c: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
                        { l: 'Gastos',    v: '$2,540',  c: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950' },
                      ].map(s => (
                        <div key={s.l} className={`${s.bg} rounded-xl p-3 text-center`}>
                          <p className="text-[10px] text-slate-400 mb-0.5">{s.l}</p>
                          <p className={`text-xs font-bold ${s.c}`}>{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Recientes</p>
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
                        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Ahorros del mes</span>
                      </div>
                      <span className="text-xs text-indigo-500">2 de 3 metas cumplidas</span>
                    </div>
                  </div>
                  <div className="px-4 pb-3 bg-white dark:bg-slate-900">
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                      {['KPIs de balance, ingresos y gastos del mes actual', 'Acceso rápido a últimas transacciones', 'Resumen del estado de metas de ahorro'].map(f => (
                        <li key={f} className="flex items-start gap-2"><CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Transacciones */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <ArrowLeftRight size={14} className="text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Transacciones</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900">
                    <div className="flex gap-2 mb-3">
                      {['Todos', 'Ingresos', 'Gastos'].map((f, i) => (
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
                      {['Filtros por tipo, categoría y rango de fechas', 'Búsqueda en tiempo real por descripción', 'Totales de ingresos/gastos del filtro activo', 'Subida y vista de comprobantes (PDF/imagen)'].map(f => (
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
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Presupuestos</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 space-y-3">
                    {mockBudgets.map((b, i) => {
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
                              {isWarn && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">Atención</span>}
                              <span className={`text-xs font-semibold ${isWarn ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'}`}>{pct}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                            <div className={`h-full rounded-full ${isWarn ? 'bg-amber-500' : b.bg}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-400">{fmt(b.spent)} de {fmt(b.limit)}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="px-4 pb-3 bg-white dark:bg-slate-900">
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                      {['Límite mensual por categoría, UNIQUE en DB', 'Toast de aviso cuando superas el 70% o 100%', 'Notificaciones una sola vez por sesión (sessionStorage)'].map(f => (
                        <li key={f} className="flex items-start gap-2"><CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ahorros */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <PiggyBank size={14} className="text-sky-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Metas de ahorro</span>
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
                      <p className="text-xs text-slate-400">2 de 3 metas cumplidas este mes</p>
                    </div>
                  </div>
                  <div className="px-4 pb-3 bg-white dark:bg-slate-900">
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mt-1">
                      {['Metas mensuales con nombre, ícono y color personalizado', 'Barra de progreso con porcentaje calculado en el API', 'Resumen visible desde el Dashboard'].map(f => (
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
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Reportes</span>
                </div>
                <div className="p-5 bg-white dark:bg-slate-900">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Bar chart */}
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Ingresos vs Gastos — 6 meses</p>
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
                        <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-3 h-2 rounded-sm bg-emerald-400 inline-block" />Ingresos</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-3 h-2 rounded-sm bg-rose-400 inline-block" />Gastos</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Características del módulo</p>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                        {[
                          'Gráfico de barras SVG custom (sin librería externa)',
                          'Gráfico de dona interactivo por categoría',
                          'Filtro por mes con navegación anterior/siguiente',
                          'Exportación a CSV del historial completo del mes',
                          'Top 5 categorías con más gasto',
                        ].map(f => (
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
            <Pill icon={Terminal} label="API REST" className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" />
            <H2>Endpoints del backend</H2>
            <Lead>
              API REST construida con ASP.NET Core. Todos los endpoints requieren JWT Bearer excepto donde se indique.
              El user_id se extrae del token, nunca se acepta como parámetro del cliente.
            </Lead>

            <motion.div variants={fadeUp} className="space-y-6">
              {API_ENDPOINTS.map(group => (
                <div key={group.group}>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${group.color}`}>
                    {group.group}
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                          <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wide text-[10px] w-16">Método</th>
                          <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Ruta</th>
                          <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wide text-[10px] hidden md:table-cell">Descripción</th>
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
                              {r.admin && <span className="ml-2 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded">Solo admin</span>}
                            </td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{r.desc}</td>
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
            <Pill icon={Database} label="Base de datos" className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-300" />
            <H2>Esquema de la base de datos</H2>
            <Lead>
              PostgreSQL gestionado por Supabase. Cinco tablas con claves foráneas y Row Level Security en todas ellas.
              Los usuarios solo pueden leer y modificar sus propios datos.
            </Lead>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              {DB_TABLES.map(t => (
                <div key={t.name} className={`border-2 ${t.color} rounded-xl overflow-hidden`}>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-100">{t.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-slate-900 space-y-1.5">
                    {t.cols.map(c => (
                      <div key={c.name} className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-200">{c.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">{c.type}</span>
                          {c.note && <span className="text-[10px] text-slate-400 hidden sm:inline">{c.note}</span>}
                        </div>
                      </div>
                    ))}
                    {t.constraint && (
                      <p className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 pt-1 border-t border-slate-50 dark:border-slate-800 mt-1">
                        {t.constraint}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </FadeSection>

          {/* ── Seguridad ────────────────────────────────────────────────── */}
          <FadeSection id="seguridad">
            <Pill icon={ShieldCheck} label="Seguridad" className="bg-rose-50 dark:bg-rose-950 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-300" />
            <H2>Autenticación y seguridad</H2>
            <Lead>
              Múltiples capas de seguridad: JWT en la API, Row Level Security en la base de datos
              y políticas de Storage en Supabase. El backend nunca confía en el client_id del cuerpo del request.
            </Lead>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Lock,       color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950', title: 'JWT HS256',            desc: 'Supabase emite tokens firmados con el secret del proyecto. El middleware de .NET valida firma, expiración y claims sin llamar a Supabase en cada request.' },
                { icon: Database,   color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950', title: 'Row Level Security', desc: 'Políticas RLS en todas las tablas. WHERE user_id = auth.uid() garantiza que cada usuario solo accede a sus propios registros, incluso con SQL directo.' },
                { icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950', title: 'Roles de usuario',    desc: 'Dos roles: "user" y "admin". Los admins bypasean RLS para estadísticas globales. AdminRoute en el frontend bloquea la ruta si el perfil no tiene rol admin.' },
                { icon: Cloud,      color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950', title: 'Storage policies',       desc: 'Las políticas del bucket "receipts" restringen INSERT, SELECT y DELETE al folder del propio usuario (receipts/{userId}/*). Sin server-side, directo desde browser.' },
              ].map(s => (
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
            <Pill icon={CheckCircle} label="Pruebas" className="bg-sky-50 dark:bg-sky-950 border border-sky-100 dark:border-sky-900 text-sky-700 dark:text-sky-300" />
            <H2>Suite de pruebas</H2>
            <Lead>
              40 tests en total — 28 unitarios en el frontend (Vitest) y 12 de integración en el backend (xUnit).
              Cada test de backend obtiene su propia base de datos en memoria para total aislamiento.
            </Lead>

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
                    { file: 'utils.test.js',          count: 22, desc: 'formatCurrency, formatDate, formatRelativeDate (con setSystemTime), monthLabel, toYearMonth, getAvatarGradient' },
                    { file: 'receiptService.test.js',  count: 6,  desc: 'Valida MIME type y tamaño. Mock de Supabase Storage con vi.mock(). Verifica ruta de remove().' },
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
                  {[
                    { group: 'Paginación (3)',   desc: 'Sin filtros devuelve todas · paginación por offset · no retorna datos de otro usuario' },
                    { group: 'Filtros (3)',       desc: 'Filtro por tipo · búsqueda case-insensitive · filtro por rango de fechas' },
                    { group: 'Totales (2)',       desc: 'TotalIncome y TotalExpense calculados · totales respetan el filtro de tipo activo' },
                    { group: 'CRUD (4)',          desc: 'CreateAsync guarda en DB · DeleteAsync elimina · retorna false para ID inexistente · no elimina datos ajenos' },
                  ].map(g => (
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
            <Pill icon={Rocket} label="Despliegue" className="bg-rose-50 dark:bg-rose-950 border border-rose-100 dark:border-rose-900 text-rose-700 dark:text-rose-300" />
            <H2>Infraestructura y despliegue</H2>
            <Lead>
              Tres servicios independientes en la nube, todos en free tier. El frontend se despliega automáticamente
              al hacer push a main. El backend requiere deploy manual o CI/CD configurado en Render.
            </Lead>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  Icon: Cloud, color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-slate-900', border: 'border-slate-200 dark:border-slate-700',
                  name: 'Vercel', role: 'Frontend',
                  items: ['Deploy automático desde GitHub', 'SPA rewrites (vercel.json)', 'Code splitting: bundle principal 289 KB', 'Variables de entorno VITE_* en dashboard'],
                },
                {
                  Icon: Server, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900', border: 'border-emerald-200 dark:border-emerald-800',
                  name: 'Render', role: 'Backend .NET 9',
                  items: ['Deploy desde repositorio Git', 'Runtime .NET 9 (sin Docker)', 'Variables de entorno en panel de Render', 'Free tier con cold start ~30 s'],
                },
                {
                  Icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900', border: 'border-indigo-200 dark:border-indigo-800',
                  name: 'Supabase', role: 'PostgreSQL + Auth + Storage',
                  items: ['PostgreSQL gestionado (500 MB free)', 'Auth JWT out-of-the-box', 'Storage bucket "receipts" con RLS', 'Migraciones vía dashboard o CLI'],
                },
              ].map(s => (
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
            <span className="text-xs text-slate-400">Proyecto de portafolio</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">← Inicio</Link>
            <Link to="/register" className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">Probar la app</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
