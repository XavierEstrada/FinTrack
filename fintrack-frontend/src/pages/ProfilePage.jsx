import { useState, useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, AlertTriangle, Loader2, KeyRound, Eye, EyeOff, Plus, Pencil, Trash2, Bookmark, Camera } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { avatarService } from '../services/avatarService'

import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import { profileService } from '../services/profileService'
import { getAvatarGradient } from '../lib/utils'
import { supabase } from '../lib/supabaseClient'
import { useCategories, useDeleteCategory } from '../hooks/useCategories'
import CategoryFormModal from '../components/categories/CategoryFormModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const MAX_CUSTOM = 3

const CURRENCY_CODES = ['USD', 'CAD', 'MXN', 'CRC', 'EUR']

const inputCls = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

// ── Modal cambio de contraseña ────────────────────────────────────────────────
function ChangePasswordModal({ email, onClose, onSuccess }) {
  const { t } = useTranslation()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext,    setShowNext]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const pwSchema = z.object({
    current: z.string().min(1, t('changePassword.validation.currentRequired')),
    next: z.string()
      .min(8,  t('changePassword.validation.newMin'))
      .max(16, t('changePassword.validation.newMax'))
      .regex(/[A-Z]/, t('changePassword.validation.newUppercase'))
      .regex(/[0-9]/, t('changePassword.validation.newNumber')),
    confirm: z.string(),
  }).refine(d => d.next === d.confirm, {
    message: t('changePassword.validation.noMatch'),
    path: ['confirm'],
  }).refine(d => d.current !== d.next, {
    message: t('changePassword.validation.sameAsCurrent'),
    path: ['next'],
  })

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
      setError('current', { message: t('changePassword.currentWrong') })
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
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{t('changePassword.title')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('changePassword.subtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              {t('changePassword.currentPassword')}
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
              {t('changePassword.newPassword')}
            </label>
            <div className="relative">
              <input {...register('next')} type={showNext ? 'text' : 'password'} placeholder={t('changePassword.newPasswordPlaceholder')} className={pwInput} />
              <button type="button" onClick={() => setShowNext(v => !v)} className={eyeBtn} tabIndex={-1}>
                {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('changePassword.newPasswordHint')}</p>
            {errors.next && <p className="text-red-500 text-xs mt-1">{errors.next.message}</p>}
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              {t('changePassword.confirmPassword')}
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
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? t('changePassword.submitting') : t('changePassword.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal eliminación de cuenta ───────────────────────────────────────────────
function DeleteAccountModal({ email, onClose, onConfirmed }) {
  const { t } = useTranslation()
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
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{t('deleteAccount.title')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('deleteAccount.subtitle')}</p>
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{t('deleteAccount.warningTitle')}</p>
              <ul className="text-sm text-rose-600 dark:text-rose-400 space-y-1 list-disc list-inside">
                <li>{t('deleteAccount.item1')}</li>
                <li>{t('deleteAccount.item2')}</li>
                <li>{t('deleteAccount.item3')}</li>
                <li>{t('deleteAccount.item4')}</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
              >
                {t('common.continue')}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 space-y-4">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{t('deleteAccount.confirmIdentity')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('deleteAccount.confirmInstructions')}
            </p>
            <p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 select-all">
              {email}
            </p>
            <input
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder={t('deleteAccount.emailPlaceholder')}
              className={inputCls}
              autoFocus
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={typed.trim() !== email || loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? t('deleteAccount.deleting') : t('deleteAccount.deleteBtn')}
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
  const { t } = useTranslation()
  const { profile, session, setProfile, clearAuth } = useAuthStore()

  const [fullName, setFullName]                   = useState(profile?.full_name ?? '')
  const [currency, setCurrency]                   = useState(profile?.currency  ?? 'USD')
  const [avatarUrl, setAvatarUrl]                 = useState(profile?.avatar_url ?? null)
  const [avatarUploading, setAvatarUploading]     = useState(false)
  const [showDeleteModal, setShowDeleteModal]     = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const fileInputRef = useRef(null)
  const [catModalOpen, setCatModalOpen]           = useState(false)
  const [editingCat, setEditingCat]               = useState(null)
  const [confirmCat, setConfirmCat]               = useState(null)

  const { data: allCategories = [] } = useCategories()
  const deleteCategoryMutation       = useDeleteCategory()
  const userCategories               = allCategories.filter(c => c.isSystem === false)

  const openNewCat  = ()  => { setEditingCat(null); setCatModalOpen(true) }
  const openEditCat = (c) => { setEditingCat(c);    setCatModalOpen(true) }

  const confirmDeleteCat = () => {
    deleteCategoryMutation.mutate(confirmCat.id, {
      onSuccess: () => { toast.success(t('categoryModal.deleteSuccess')); setConfirmCat(null) },
      onError:   (err) => {
        const msg = err?.response?.data
        toast.error(typeof msg === 'string' ? msg : t('categoryModal.saveError'))
        setConfirmCat(null)
      },
    })
  }

  const email    = session?.user?.email ?? ''
  const gradient = getAvatarGradient(fullName || email || 'U')
  const initials = (fullName || email || '?')
    .split(/[\s@]/).filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)

  // Sincronizar avatarUrl cuando el profile del store carga (puede llegar después del mount)
  useEffect(() => {
    setAvatarUrl(profile?.avatar_url ?? null)
  }, [profile?.avatar_url])

  // Cargar perfil fresco del API al montar para asegurar que los campos estén actualizados
  useEffect(() => {
    profileService.get().then(r => {
      const { fullName: name, currency: cur, avatarUrl: url } = r.data
      if (name) setFullName(name)
      if (cur)  setCurrency(cur)
      if (url !== undefined) setAvatarUrl(url ?? null)
      // Actualizar store con datos frescos del API
      useAuthStore.getState().setProfile(
        { ...useAuthStore.getState().profile, full_name: name, currency: cur, avatar_url: url }
      )
    }).catch(() => {})
  }, []) // solo al montar

  const saveMutation = useMutation({
    mutationFn: () => profileService.update({ fullName, currency }).then(r => r.data),
    onSuccess: (data) => {
      setProfile({ ...profile, full_name: data.fullName, currency: data.currency })
      toast.success(t('profile.updateSuccess'))
    },
    onError: () => toast.error(t('profile.updateError')),
  })

  const handlePasswordChanged = async () => {
    setShowPasswordModal(false)
    toast.success(t('changePassword.successMsg'))
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = '' // permite re-seleccionar el mismo archivo

    setAvatarUploading(true)
    try {
      const url = await avatarService.upload(file, session.user.id)
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', session.user.id)
      setAvatarUrl(url)
      setProfile({ ...profile, avatar_url: url })
      toast.success(t('profile.photoUpdated'))
    } catch (err) {
      toast.error(err.message ?? t('profile.photoUploadError'))
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setAvatarUploading(true)
    try {
      await avatarService.remove(session.user.id)
      await supabase.from('profiles').update({ avatar_url: null }).eq('id', session.user.id)
      setAvatarUrl(null)
      setProfile({ ...profile, avatar_url: null })
      toast.success(t('profile.photoRemoved'))
    } catch {
      toast.error(t('profile.photoRemoveError'))
    } finally {
      setAvatarUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_280px] lg:items-start">

      {/* ── Col derecha: wrapper invisible en mobile (contents) · bloque en desktop ── */}
      {/* En mobile: cada hijo tiene su propio order. En desktop: un bloque en col-2 sin gap de fila */}
      <div className="contents lg:flex lg:flex-col lg:gap-4 lg:col-start-2 lg:row-start-1 lg:row-span-3">

        {/* 1. Perfil — primero en mobile · top de col derecha en desktop */}
        <div className="order-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="h-20" style={{ background: gradient }} />
            <div className="px-6 pb-6">
              <div className="relative w-16 h-16 -mt-8 mb-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed"
                  title={avatarUrl ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold" style={{ background: gradient }}>
                      {initials || '?'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 group-disabled:opacity-100 transition-opacity">
                    {avatarUploading
                      ? <Loader2 size={18} className="text-white animate-spin" />
                      : <Camera   size={18} className="text-white" />
                    }
                  </div>
                </button>
              </div>

              <p className="text-base font-semibold text-slate-900 dark:text-slate-50 leading-tight truncate">{fullName || '—'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{email}</p>

              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => fileInputRef.current?.click()} disabled={avatarUploading} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40">
                  {avatarUrl ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                </button>
                {avatarUrl && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600 select-none">·</span>
                    <button onClick={handleRemoveAvatar} disabled={avatarUploading} className="text-xs text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:underline disabled:opacity-40">
                      {t('profile.removePhoto')}
                    </button>
                  </>
                )}
              </div>

              {profile?.role === 'admin' && (
                <span className="inline-flex items-center mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 rounded-full">
                  {t('profile.adminBadge')}
                </span>
              )}
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* 4. Contraseña — cuarto en mobile · pegado al perfil en desktop */}
        <div className="order-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                <KeyRound size={15} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('profile.password')}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t('profile.passwordLastUpdated')}</p>
              </div>
            </div>
            <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              <KeyRound size={14} />
              {t('profile.changePassword')}
            </button>
          </div>
        </div>

      </div>

      {/* ── 2. Información personal — segundo en mobile · col izq row 1 desktop ── */}
      <div className="order-2 lg:col-start-1 lg:row-start-1">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{t('profile.personalInfo')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('profile.personalInfoSubtitle')}</p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('profile.fullName')}</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t('profile.fullNamePlaceholder')} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('profile.email')}</label>
              <input value={email} disabled className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed" />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('profile.emailReadonly')}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{t('profile.currency')}</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputCls}>
                {CURRENCY_CODES.map(code => (
                  <option key={code} value={code}>{t(`profile.currencies.${code}`)}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('profile.currencyHint')}</p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {saveMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saveMutation.isPending ? t('profile.saving') : t('profile.saveBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Mis categorías — tercero en mobile · col izq row 2 desktop ── */}
      <div className="order-3 lg:col-start-1 lg:row-start-2">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{t('profile.myCategories')}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('profile.myCategoriesSubtitle')}</p>
            </div>
            <button onClick={openNewCat} disabled={userCategories.length >= MAX_CUSTOM} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
              <Plus size={14} />
              {t('profile.newCategory')}
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1.5">
                <span>{t('profile.categoriesUsed', { used: userCategories.length, max: MAX_CUSTOM })}</span>
                <span className={userCategories.length >= MAX_CUSTOM ? 'text-amber-500 font-medium' : ''}>{userCategories.length}/{MAX_CUSTOM}</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${userCategories.length >= MAX_CUSTOM ? 'bg-amber-400' : 'bg-indigo-500'}`} style={{ width: `${(userCategories.length / MAX_CUSTOM) * 100}%` }} />
              </div>
            </div>

            {userCategories.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Bookmark size={18} className="text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('profile.noCategoriesTitle')}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t('profile.noCategoriesHint', { max: MAX_CUSTOM })}</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50 dark:divide-slate-800">
                {userCategories.map(cat => (
                  <li key={cat.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: (cat.color ?? '#06b6d4') + '25' }}>
                      <Bookmark size={16} style={{ color: cat.color ?? '#06b6d4' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{cat.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{cat.type === 'expense' ? t('common.expense') : t('common.income')}</p>
                    </div>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color ?? '#06b6d4' }} />
                    <button onClick={() => openEditCat(cat)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setConfirmCat(cat)} className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-colors"><Trash2 size={13} /></button>
                  </li>
                ))}
              </ul>
            )}

            {userCategories.length >= MAX_CUSTOM && (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                {t('profile.categoryLimitReached', { max: MAX_CUSTOM })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── 5. Zona de peligro — último en mobile · col izq row 3 desktop ── */}
      <div className="order-5 lg:col-start-1 lg:row-start-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-rose-200 dark:border-rose-900/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center shrink-0">
              <AlertTriangle size={15} className="text-rose-500 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('profile.dangerZone')}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('profile.dangerZoneSubtitle')}</p>
            </div>
          </div>
          <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-4 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
            {t('profile.deleteAccount')}
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

      <CategoryFormModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        category={editingCat}
      />

      <ConfirmDialog
        isOpen={!!confirmCat}
        onClose={() => setConfirmCat(null)}
        onConfirm={confirmDeleteCat}
        loading={deleteCategoryMutation.isPending}
        title={t('categoryModal.deleteTitle')}
        description={t('categoryModal.deleteConfirm', { name: confirmCat?.name })}
      />
    </div>
  )
}
