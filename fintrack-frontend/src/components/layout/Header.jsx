import { LogOut, Menu, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useThemeStore } from '../../store/themeStore'
import UserAvatar from '../ui/UserAvatar'

export default function Header({ title, onMenuClick }) {
  const { dark, toggle } = useThemeStore()
  const { session, profile, logout } = useAuth()

  const displayName = profile?.full_name ?? session?.user?.user_metadata?.full_name ?? '…'

  const handleLogout = async () => {
    await logout()
    // ProtectedRoute detecta session = null y redirige a /login automáticamente
  }

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

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden md:block" />

        <div className="hidden md:flex items-center gap-2.5">
          <UserAvatar profile={profile} session={session} className="w-8 h-8" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{displayName}</span>
        </div>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden md:block" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
