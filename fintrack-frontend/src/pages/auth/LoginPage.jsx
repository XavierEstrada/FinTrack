import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TrendingUp, ShieldCheck, BarChart3, Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'

const inputCls = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [serverError, setServerError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const schema = z.object({
    email:    z.string().email(t('auth.validation.emailInvalid')),
    password: z.string().min(6, t('auth.validation.passwordMin')),
  })

  const features = [
    { icon: BarChart3,   text: t('auth.login.feature1') },
    { icon: Wallet,      text: t('auth.login.feature2') },
    { icon: ShieldCheck, text: t('auth.login.feature3') },
  ]

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      setServerError(null)
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden">
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
            {t('landing.hero.title')}
          </h1>
          <p className="text-indigo-200 text-base mb-10">
            {t('landing.hero.subtitle')}
          </p>
          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-indigo-100 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-indigo-300 text-xs relative">{t('common.copyright')}</p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-slate-950">
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
            {t('auth.login.backHome')}
          </Link>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">{t('auth.login.title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">{t('auth.login.subtitle')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('auth.login.email')}</label>
              <input {...register('email')} type="email" placeholder={t('auth.login.emailPlaceholder')} className={inputCls} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('auth.login.password')}</label>
              <div className="relative">
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder={t('auth.login.passwordPlaceholder')} className={`${inputCls} pr-10`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
              {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              {t('auth.login.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
