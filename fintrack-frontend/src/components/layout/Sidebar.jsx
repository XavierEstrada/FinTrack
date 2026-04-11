import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Wallet,
  BarChart3, User, ShieldCheck, TrendingUp, X,
} from 'lucide-react'
import { mockUser } from '../../mocks/data'

const navLinks = [
  { to: '/',             label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/transactions', label: 'Transacciones', icon: ArrowLeftRight  },
  { to: '/budgets',      label: 'Presupuestos',  icon: Wallet          },
  { to: '/reports',      label: 'Reportes',      icon: BarChart3       },
  { to: '/profile',      label: 'Perfil',        icon: User            },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col
      transition-transform duration-300 ease-in-out
      lg:static lg:translate-x-0 lg:z-auto
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">FinTrack</span>
        </div>
        {/* Botón cerrar — solo visible en mobile */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
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
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
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
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ShieldCheck size={17} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                Administración
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-indigo-700 text-xs font-bold">
              {mockUser.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{mockUser.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{mockUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
