import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import CategoryIcon from '../ui/CategoryIcon'
import { useCreateSystemCategory, useUpdateSystemCategory } from '../../hooks/useAdmin'

// Full icon list — keys must match iconMap in CategoryIcon.jsx
const ALL_ICONS = [
  'tag', 'shopping-cart', 'shopping-bag', 'shopping-basket', 'utensils',
  'utensils-crossed', 'car', 'home', 'heart', 'briefcase', 'gamepad-2',
  'zap', 'book-open', 'music', 'plane', 'coffee', 'gift', 'trending-up',
  'dollar-sign', 'credit-card', 'wallet', 'bus', 'train', 'film', 'tv',
  'smartphone', 'monitor', 'laptop', 'wrench', 'scissors', 'shirt', 'baby',
  'bike', 'pizza', 'apple', 'leaf', 'sun', 'moon', 'star', 'sparkles',
  'package', 'box', 'building', 'building-2', 'graduation-cap', 'stethoscope',
  'pill', 'dumbbell', 'fuel', 'receipt', 'banknote', 'coins', 'piggy-bank',
  'landmark', 'percent', 'globe', 'map-pin', 'camera', 'headphones', 'watch',
  'gem', 'hammer', 'lightbulb', 'wifi', 'phone', 'mail', 'send', 'truck',
  'anchor', 'flame', 'snowflake', 'umbrella', 'cloud', 'wind', 'trees',
  'flower-2', 'dog', 'cat', 'salad', 'ice-cream', 'beer', 'wine',
  'sandwich', 'soup',
]

const SYSTEM_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#0ea5e9', '#10b981', '#f59e0b', '#64748b', '#78716c', '#6b7280',
]

const inputCls = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500'
const lbl      = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5'

export default function SystemCategoryFormModal({ isOpen, onClose, category = null }) {
  const { t } = useTranslation()
  const isEditing      = !!category
  const createMutation = useCreateSystemCategory()
  const updateMutation = useUpdateSystemCategory()

  const [name,   setName]   = useState('')
  const [type,   setType]   = useState('expense')
  const [color,  setColor]  = useState(SYSTEM_COLORS[0])
  const [icon,   setIcon]   = useState('tag')
  const [iconSearch, setIconSearch] = useState('')
  const [error,  setError]  = useState('')

  useEffect(() => {
    if (!isOpen) return
    if (category) {
      setName(category.name)
      setType(category.type)
      setColor(category.color ?? SYSTEM_COLORS[0])
      setIcon(category.icon  ?? 'tag')
    } else {
      setName('')
      setType('expense')
      setColor(SYSTEM_COLORS[0])
      setIcon('tag')
    }
    setIconSearch('')
    setError('')
  }, [category, isOpen])

  const isPending = createMutation.isPending || updateMutation.isPending

  const filteredIcons = iconSearch.trim()
    ? ALL_ICONS.filter(i => i.includes(iconSearch.toLowerCase()))
    : ALL_ICONS

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError(t('systemCategoryModal.nameRequired')); return }
    setError('')

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: category.id, data: { name: name.trim(), color, icon } })
        toast.success(t('systemCategoryModal.updateSuccess'))
      } else {
        await createMutation.mutateAsync({ name: name.trim(), type, color, icon })
        toast.success(t('systemCategoryModal.createSuccess'))
      }
      onClose()
    } catch {
      toast.error(t('systemCategoryModal.saveError'))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('systemCategoryModal.editTitle') : t('systemCategoryModal.newTitle')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

        {/* Nombre */}
        <div>
          <label className={lbl}>{t('common.name')}</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('systemCategoryModal.namePlaceholder')}
            className={inputCls}
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Tipo — solo al crear */}
        {!isEditing && (
          <div>
            <p className={lbl}>{t('common.type')}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'expense', label: t('common.expense'), active: 'bg-rose-500 text-white border-rose-500'       },
                { value: 'income',  label: t('common.income'),  active: 'bg-emerald-500 text-white border-emerald-500' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                    type === opt.value
                      ? opt.active
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input type="radio" value={opt.value} checked={type === opt.value}
                    onChange={() => setType(opt.value)} className="sr-only" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        <div>
          <p className={lbl}>{t('common.color')}</p>
          <div className="flex flex-wrap gap-2">
            {SYSTEM_COLORS.map(c => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => setColor(c)}
                style={{ background: c }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c
                    ? 'ring-2 ring-offset-2 ring-slate-500 dark:ring-slate-300 scale-110'
                    : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Icono */}
        <div>
          <p className={lbl}>{t('systemCategoryModal.icon')}</p>
          <input
            value={iconSearch}
            onChange={e => setIconSearch(e.target.value)}
            placeholder={t('systemCategoryModal.searchIcon')}
            className={`${inputCls} mb-2`}
          />
          <div className="h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2">
            <div className="grid grid-cols-9 gap-1">
              {filteredIcons.map(i => (
                <button
                  key={i}
                  type="button"
                  title={i}
                  onClick={() => setIcon(i)}
                  className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
                    icon === i
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <CategoryIcon name={i} size={15} />
                </button>
              ))}
              {filteredIcons.length === 0 && (
                <p className="col-span-9 text-xs text-slate-400 text-center py-4">{t('systemCategoryModal.noResults')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Vista previa */}
        <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: color + '25', color }}>
            <CategoryIcon name={icon} size={15} />
          </div>
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {name.trim() || t('common.preview')}
            </span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${
              type === 'income'
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
            }`}>
              {type === 'income' ? t('common.income') : t('common.expense')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40">
            {t('common.cancel')}
          </button>
          <button type="submit" disabled={isPending}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {isPending ? t('common.saving') : isEditing ? t('common.save') : t('systemCategoryModal.createBtn')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
