import { Camera, Save } from 'lucide-react'
import { mockUser } from '../mocks/data'

const currencies = ['USD', 'EUR', 'HNL', 'GTQ', 'MXN', 'COP']

export default function ProfilePage() {
  return (
    <div className="max-w-2xl space-y-5">
      {/* Avatar card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 mb-4">Foto de perfil</p>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
              {mockUser.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            {/* TODO: conectar con Supabase Storage en Fase 6 */}
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{mockUser.full_name}</p>
            <p className="text-xs text-slate-400 mb-2">{mockUser.email}</p>
            <button className="text-xs text-indigo-600 hover:underline font-medium">
              Subir nueva foto
            </button>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 mb-4">Información personal</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Nombre completo</label>
            <input
              defaultValue={mockUser.full_name}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
            <input
              defaultValue={mockUser.email}
              disabled
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">El email no puede cambiarse</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Moneda preferida</label>
            <select
              defaultValue={mockUser.currency}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">Afecta el formato de moneda en toda la app</p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
          {/* TODO: conectar con API en Fase 6 */}
          <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Save size={15} />
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl p-6 border border-rose-200 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 mb-1">Zona de peligro</p>
        <p className="text-xs text-slate-400 mb-4">Estas acciones son permanentes e irreversibles.</p>
        <button className="text-sm font-medium text-rose-600 border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors">
          Eliminar cuenta
        </button>
      </div>
    </div>
  )
}
