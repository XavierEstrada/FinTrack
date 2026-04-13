import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import Modal from '../ui/Modal'
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategories'

export const CUSTOM_COLORS = [
  { value: '#06b6d4', label: 'Cian'   },
  { value: '#f43f5e', label: 'Rosa'   },
  { value: '#c026d3', label: 'Fucsia' },
  { value: '#0284c7', label: 'Océano' },
  { value: '#16a34a', label: 'Bosque' },
  { value: '#a16207', label: 'Dorado' },
]

const inputCls = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500'
const lbl      = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5'

export default function CategoryFormModal({ isOpen, onClose, category = null }) {
  const isEditing      = !!category
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const [name,  setName]  = useState('')
  const [type,  setType]  = useState('expense')
  const [color, setColor] = useState(CUSTOM_COLORS[0].value)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    if (category) {
      setName(category.name)
      setType(category.type)
      setColor(category.color ?? CUSTOM_COLORS[0].value)
    } else {
      setName('')
      setType('expense')
      setColor(CUSTOM_COLORS[0].value)
    }
    setError('')
  }, [category, isOpen])

  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('El nombre es requerido'); return }
    setError('')
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: category.id, data: { name: name.trim(), color, icon: 'bookmark' } })
        toast.success('Categoría actualizada')
      } else {
        await createMutation.mutateAsync({ name: name.trim(), type, color, icon: 'bookmark' })
        toast.success('Categoría creada')
      }
      onClose()
    } catch {
      toast.error('No se pudo guardar la categoría')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar categoría' : 'Nueva categoría personalizada'} size="sm">
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

        {/* Nombre */}
        <div>
          <label className={lbl}>Nombre</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Ahorro, Ocio…"
            className={inputCls}
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Tipo — solo al crear */}
        {!isEditing && (
          <div>
            <p className={lbl}>Tipo</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'expense', label: 'Gasto',   active: 'bg-rose-500 text-white border-rose-500'       },
                { value: 'income',  label: 'Ingreso',  active: 'bg-emerald-500 text-white border-emerald-500' },
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
          <p className={lbl}>Color</p>
          <div className="flex items-center gap-2.5">
            {CUSTOM_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setColor(c.value)}
                style={{ background: c.value }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c.value
                    ? 'ring-2 ring-offset-2 ring-slate-500 dark:ring-slate-300 scale-110'
                    : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Vista previa */}
        <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: color + '25' }}>
            <Bookmark size={15} style={{ color }} />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
            {name.trim() || 'Vista previa…'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40">
            Cancelar
          </button>
          <button type="submit" disabled={isPending}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {isPending ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
