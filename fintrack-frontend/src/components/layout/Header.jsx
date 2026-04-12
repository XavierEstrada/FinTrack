import { Bell, LogOut, Menu, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockUser } from '../../mocks/data'
import { getAvatarGradient } from '../../lib/utils'
import { useThemeStore } from '../../store/themeStore'

export default function Header({ title, onMenuClick }) {
  const navigate = useNavigate()
  const { dark, toggle } = useThemeStore()
  const gradient = getAvatarGradient(mockUser.full_name)

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Toggle dark mode */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          title={dark ? 'Modo claro' : 'Modo oscuro'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden md:block" />

        <div className="hidden md:flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: gradient }}
          >
            <span className="text-white text-xs font-bold">
              {mockUser.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{mockUser.full_name}</span>
        </div>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden md:block" />

        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
