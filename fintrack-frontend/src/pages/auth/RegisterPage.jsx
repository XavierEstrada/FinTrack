import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TrendingUp, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  fullName:        z.string().min(2, 'Ingresa tu nombre completo'),
  email:           z.string().email('Email inválido'),
  password: z.string()
    .min(8,  'Mínimo 8 caracteres')
    .max(16, 'Máximo 16 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

const inputCls = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      setServerError(null)
      await registerUser(data.email, data.password, data.fullName)
      setSuccess(true)
    } catch (err) {
      setServerError(err.message)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 w-full max-w-sm text-center shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">¡Cuenta creada!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Revisa tu email para confirmar tu cuenta y luego inicia sesión.</p>
          <Link to="/login" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Ir al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-700 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/5 rounded-full" />

        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">FinTrack</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Empieza hoy<br />sin costo
          </h1>
          <p className="text-indigo-200 text-base mb-8">
            Crea tu cuenta en segundos y comienza a registrar tus finanzas.
          </p>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-white text-sm font-medium mb-3">Incluye todo lo que necesitas:</p>
            {['Transacciones ilimitadas', 'Presupuestos por categoría', 'Reportes y gráficos', 'Subida de comprobantes'].map(f => (
              <div key={f} className="flex items-center gap-2 mb-2">
                <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                <span className="text-indigo-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-xs relative">© 2026 FinTrack · Tu gestor de finanzas personales</p>
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-50">FinTrack</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
          >
            <ArrowLeft size={13} />
            Volver al inicio
          </Link>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">Crear cuenta</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Completa los datos para comenzar</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nombre completo</label>
              <input {...register('fullName')} type="text" placeholder="Juan Pérez" className={inputCls} />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="tu@email.com" className={inputCls} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Contraseña</label>
                <div className="relative">
                  <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className={`${inputCls} pr-10`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">8-16 car. · mayúscula · número</p>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Confirmar</label>
                <div className="relative">
                  <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className={`${inputCls} pr-10`} />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
