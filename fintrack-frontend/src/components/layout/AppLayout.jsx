import { useState, useEffect } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, ArrowLeftRight, Wallet, BarChart3, User, ShieldCheck, PiggyBank } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuthStore } from '../../store/authStore'

const titles = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transacciones',
  '/budgets':      'Presupuestos',
  '/savings':      'Ahorros',
  '/reports':      'Reportes',
  '/profile':      'Mi Perfil',
  '/admin':        'Administración',
}

const APP_NAME = 'FinTrack'

const baseLinks = [
  { to: '/dashboard',    label: 'Inicio',        icon: LayoutDashboard },
  { to: '/transactions', label: 'Transacciones', icon: ArrowLeftRight  },
  { to: '/budgets',      label: 'Presupuestos',  icon: Wallet          },
  { to: '/savings',      label: 'Ahorros',       icon: PiggyBank       },
  { to: '/reports',      label: 'Reportes',      icon: BarChart3       },
  { to: '/profile',      label: 'Perfil',        icon: User            },
]

const adminLink = { to: '/admin', label: 'Admin', icon: ShieldCheck }

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
}

export default function AppLayout() {
  const location    = useLocation()
  const title       = titles[location.pathname] ?? APP_NAME
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.title = title === APP_NAME ? APP_NAME : `${title} | ${APP_NAME}`
  }, [title])
  const profile     = useAuthStore(s => s.profile)
  const isAdmin     = profile?.role === 'admin'
  const bottomLinks = isAdmin ? [...baseLinks, adminLink] : baseLinks

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-4 md:p-6 min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom navigation — solo visible en mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex">
        {bottomLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
