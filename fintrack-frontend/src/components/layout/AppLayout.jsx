import { useState, useEffect } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, ArrowLeftRight, Wallet, BarChart3, User, ShieldCheck, PiggyBank } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuthStore } from '../../store/authStore'
import { useBudgetNotifications } from '../../hooks/useBudgetNotifications'

const APP_NAME = 'FinTrack'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
}

export default function AppLayout() {
  const { t } = useTranslation()
  const location    = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const titles = {
    '/dashboard':    t('nav.dashboard'),
    '/transactions': t('nav.transactions'),
    '/budgets':      t('nav.budgets'),
    '/savings':      t('nav.savings'),
    '/reports':      t('nav.reports'),
    '/profile':      t('nav.profile'),
    '/admin':        t('nav.admin'),
  }

  const baseLinks = [
    { to: '/dashboard',    label: t('nav.dashboard'),    icon: LayoutDashboard },
    { to: '/transactions', label: t('nav.transactions'), icon: ArrowLeftRight  },
    { to: '/budgets',      label: t('nav.budgets'),      icon: Wallet          },
    { to: '/savings',      label: t('nav.savings'),      icon: PiggyBank       },
    { to: '/reports',      label: t('nav.reports'),      icon: BarChart3       },
    { to: '/profile',      label: t('nav.profile'),      icon: User            },
  ]

  const adminLink = { to: '/admin', label: t('nav.admin'), icon: ShieldCheck }

  const title = titles[location.pathname] ?? APP_NAME

  useEffect(() => {
    document.title = title === APP_NAME ? APP_NAME : `${title} | ${APP_NAME}`
  }, [title])
  useBudgetNotifications()

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
