import { Bell, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockUser } from '../../mocks/data'

export default function Header({ title, onMenuClick }) {
  const navigate = useNavigate()

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0">

      <div className="flex items-center gap-3">
        {/* Hamburger — visible solo en mobile/tablet */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base md:text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        <div className="w-px h-5 bg-slate-200 hidden md:block" />

        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 text-xs font-bold">
              {mockUser.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-700">{mockUser.full_name}</span>
        </div>

        <div className="w-px h-5 bg-slate-200 hidden md:block" />

        {/* TODO: reemplazar navigate con useAuth().logout() al conectar Supabase */}
        <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
          <LogOut size={16} />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
