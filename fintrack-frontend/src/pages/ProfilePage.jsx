import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, AlertTriangle, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import { profileService } from '../services/profileService'
import { getAvatarGradient } from '../lib/utils'
import { supabase } from '../lib/supabaseClient'

const currencies = [
  { code: 'USD', label: 'Dólar estadounidense (USD · $)'  },
  { code: 'CAD', label: 'Dólar canadiense (CAD · CA$)'   },
  { code: 'MXN', label: 'Peso mexicano (MXN · MX$)'      },
  { code: 'CRC', label: 'Colón costarricense (CRC · ₡)'  },
  { code: 'EUR', label: 'Euro (EUR · €)'                  },
]

const inputCls = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

// ── Modal cambio de contraseña ────────────────────────────────────────────────
const pwSchema = z.object({
  current:  z.string().min(1, 'Ingresa tu contraseña actual'),
  next:     z.string().min(8, 'Mínimo 8 caracteres'),
  confirm:  z.string(),
}).refine(d => d.next === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
}).refine(d => d.current !== d.next, {
  message: 'La nueva contraseña debe ser diferente a la actual',
  path: ['next'],
})

function ChangePasswordModal({ email, onClose, onSuccess }) {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext,    setShowNext]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(pwSchema),
  })

  const onSubmit = async ({ current, next }) => {
    // 1. Verificar contraseña actual reautenticando
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    })
    if (signInErr) {
      setError('current', { message: 'Contraseña actual incorrecta' })
      return
    }

    // 2. Actualizar contraseña en Supabase Auth
    const { error: updateErr } = await supabase.auth.updateUser({ password: next })
    if (updateErr) {
      setError('root', { message: updateErr.message })
      return
    }

    onSuccess()
  }

  const pwInput = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const eyeBtn  = 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
            <KeyRound size={17} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Cambiar contraseña</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Se cerrará tu sesión al finalizar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Contraseña actual
            </label>
            <div className="relative">
              <input {...register('current')} type={showCurrent ? 'text' : 'password'} placeholder="••••••••" className={pwInput} autoFocus />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className={eyeBtn} tabIndex={-1}>
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.current && <p className="text-red-500 text-xs mt-1">{errors.current.message}</p>}
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Nueva contraseña
            </label>
            <div className="relative">
              <input {...register('next')} type={showNext ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" className={pwInput} />
              <button type="button" onClick={() => setShowNext(v => !v)} className={eyeBtn} tabIndex={-1}>
                {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.next && <p className="text-red-500 text-xs mt-1">{errors.next.message}</p>}
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input {...register('confirm')} type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className={pwInput} />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className={eyeBtn} tabIndex={-1}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
          </div>

          {errors.root && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.root.message}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? 'Verificando…' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal eliminación de cuenta ───────────────────────────────────────────────
function DeleteAccountModal({ email, onClose, onConfirmed }) {
  const [step, setStep]       = useState(1)
  const [typed, setTyped]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onConfirmed()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">

        {step === 1 && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Eliminar cuenta</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Esta acción es permanente e irreversible</p>
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Al eliminar tu cuenta se borrará:</p>
              <ul className="text-sm text-rose-600 dark:text-rose-400 space-y-1 list-disc list-inside">
                <li>Todas tus transacciones</li>
                <li>Todos tus presupuestos</li>
                <li>Tus categorías personalizadas</li>
                <li>Tu perfil y datos de acceso</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 space-y-4">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Confirma tu identidad</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Escribe tu correo electrónico exactamente para confirmar la eliminación:
            </p>
            <p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 select-all">
              {email}
            </p>
            <input
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder="Escribe tu correo…"
              className={inputCls}
              autoFocus
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={typed.trim() !== email || loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? 'Eliminando…' : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── ProfilePage ───────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { profile, session, setProfile, clearAuth } = useAuthStore()

  const [fullName, setFullName]               = useState(profile?.full_name ?? '')
  const [currency, setCurrency]               = useState(profile?.currency  ?? 'USD')
  const [showDeleteModal, setShowDeleteModal]   = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const email    = session?.user?.email ?? ''
  const gradient = getAvatarGradient(fullName || email || 'U')
  const initials = (fullName || email || '?')
    .split(/[\s@]/).filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)

  // Cargar perfil fresco del API al montar para asegurar que los campos estén actualizados
  useEffect(() => {
    profileService.get().then(r => {
      const { fullName: name, currency: cur } = r.data
      if (name) setFullName(name)
      if (cur)  setCurrency(cur)
      // Actualizar store con datos frescos del API
      useAuthStore.getState().setProfile(
        { ...useAuthStore.getState().profile, full_name: name, currency: cur }
      )
    }).catch(() => {})
  }, []) // solo al montar

  const saveMutation = useMutation({
    mutationFn: () => profileService.update({ fullName, currency }).then(r => r.data),
    onSuccess: (data) => {
      setProfile({ ...profile, full_name: data.fullName, currency: data.currency })
      toast.success('Perfil actualizado')
    },
    onError: () => toast.error('No se pudo actualizar el perfil'),
  })

  const handlePasswordChanged = async () => {
    setShowPasswordModal(false)
    toast.success('Contraseña actualizada. Inicia sesión nuevamente.')
    // Dar un momento para que el toast se vea antes de cerrar sesión
    setTimeout(async () => {
      useAuthStore.getState().startSignOut()
      useAuthStore.getState().clearAuth()
      try { await supabase.auth.signOut() } catch { /* no crítico */ }
    }, 1200)
  }

  const handleDeleteConfirmed = async () => {
    await profileService.deleteAccount()
    clearAuth()
    await supabase.auth.signOut()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">

      {/* ── Columna izquierda ─────────────────────────────────────────── */}
      <div className="space-y-4">

        {/* Avatar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Franja de color */}
          <div className="h-20" style={{ background: gradient }} />
          {/* Contenido */}
          <div className="px-6 pb-6">
            {/* Avatar superpuesto */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white dark:border-slate-900 -mt-8 mb-3 shrink-0"
              style={{ background: gradient }}
            >
              {initials || '?'}
            </div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50 leading-tight truncate">
              {fullName || '—'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{email}</p>
            {profile?.role === 'admin' && (
              <span className="inline-flex items-center mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 rounded-full">
                Administrador
              </span>
            )}
          </div>
        </div>

        {/* Contraseña */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
              <KeyRound size={15} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Contraseña</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Última actualización desconocida</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            <KeyRound size={14} />
            Cambiar contraseña
          </button>
        </div>

        {/* Zona de peligro */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-rose-200 dark:border-rose-900/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center shrink-0">
              <AlertTriangle size={15} className="text-rose-500 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Zona de peligro</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Acciones irreversibles</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-4 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            Eliminar cuenta
          </button>
        </div>

      </div>

      {/* ── Columna derecha — formulario ──────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-50">Información personal</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Actualiza tus datos de perfil y preferencias</p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Nombre completo
            </label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Tu nombre completo"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Email
            </label>
            <input
              value={email}
              disabled
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">El email no puede cambiarse</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Moneda preferida
            </label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputCls}>
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Solo cambia los símbolos que ves en la app. No modifica tus datos.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saveMutation.isPending
              ? <Loader2 size={15} className="animate-spin" />
              : <Save size={15} />
            }
            {saveMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          email={email}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordChanged}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          email={email}
          onClose={() => setShowDeleteModal(false)}
          onConfirmed={handleDeleteConfirmed}
        />
      )}
    </div>
  )
}
