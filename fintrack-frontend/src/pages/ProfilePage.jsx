import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Camera, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import { profileService } from '../services/profileService'
import { getAvatarGradient } from '../lib/utils'

const currencies = ['USD', 'EUR', 'HNL', 'GTQ', 'MXN', 'COP']
const inputCls   = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

export default function ProfilePage() {
  const { profile, setProfile } = useAuthStore()

  const [fullName, setFullName]   = useState(profile?.full_name  ?? '')
  const [currency, setCurrency]   = useState(profile?.currency   ?? 'USD')

  const gradient = getAvatarGradient(fullName || 'U')
  const initials = fullName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || '?'

  const mutation = useMutation({
    mutationFn: () => profileService.update({ fullName, currency }).then(r => r.data),
    onSuccess: (data) => {
      // Actualizar el store con los nuevos valores
      setProfile({ ...profile, full_name: data.fullName, currency: data.currency })
      toast.success('Perfil actualizado', { description: 'Los cambios han sido guardados.' })
    },
    onError: () => toast.error('No se pudo actualizar el perfil'),
  })

  return (
    <div className="max-w-2xl space-y-5">
      {/* Avatar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Foto de perfil</p>
        <div className="flex items-center gap-5">
          <div className="relative">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={fullName} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: gradient }}>
                {initials}
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow hover:bg-indigo-700 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{fullName || '—'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{profile?.email ?? ''}</p>
            <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Subir nueva foto
            </button>
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Información personal</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Nombre completo</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Email</label>
            <input
              value={profile?.email ?? ''}
              disabled
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">El email no puede cambiarse</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Moneda preferida</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputCls}>
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Afecta el formato de moneda en toda la app</p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save size={15} />
            {mutation.isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-rose-200 dark:border-rose-900/50 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Zona de peligro</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Estas acciones son permanentes e irreversibles.</p>
        <button className="text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-4 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
          Eliminar cuenta
        </button>
      </div>
    </div>
  )
}
