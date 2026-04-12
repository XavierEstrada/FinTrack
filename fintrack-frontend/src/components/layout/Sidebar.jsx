import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Wallet,
  BarChart3, User, ShieldCheck, TrendingUp, X,
} from 'lucide-react'
import { mockUser } from '../../mocks/data'
import { getAvatarGradient } from '../../lib/utils'

const navLinks = [
  { to: '/',             label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/transactions', label: 'Transacciones', icon: ArrowLeftRight  },
  { to: '/budgets',      label: 'Presupuestos',  icon: Wallet          },
  { to: '/reports',      label: 'Reportes',      icon: BarChart3       },
  { to: '/profile',      label: 'Perfil',        icon: User            },
]

export default function Sidebar({ isOpen, onClose }) {
  const gradient = getAvatarGradient(mockUser.full_name)

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-slate-900
      border-r border-slate-200 dark:border-slate-800 flex flex-col
      transition-transform duration-300 ease-in-out
      lg:static lg:translate-x-0 lg:z-auto
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">FinTrack</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={17} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {mockUser.role === 'admin' && (
          <NavLink
            to="/admin"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ShieldCheck size={17} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                Administración
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: gradient }}
          >
            <span className="text-white text-xs font-bold">
              {mockUser.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{mockUser.full_name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{mockUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
