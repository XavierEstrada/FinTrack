import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, Bookmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CategoryIcon from './CategoryIcon'

/**
 * Dropdown custom de categorías que muestra ícono + nombre.
 * Usa createPortal para evitar clipping por overflow del Modal padre.
 *
 * Props:
 *  - categories: array de { id, name, icon }
 *  - value: id seleccionado (string)
 *  - onChange: (id: string) => void
 *  - disabled: boolean
 *  - loading: boolean
 *  - placeholder: string
 */
function CategoryOption({ c, value, onChange, setOpen, isCustom = false }) {
  const active = c.id === value
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onChange(c.id)
        setOpen(false)
      }}
      className={[
        'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
        active
          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700',
      ].join(' ')}
    >
      {isCustom
        ? <Bookmark size={15} className={active ? 'text-indigo-500 shrink-0' : 'text-slate-400 shrink-0'} />
        : <CategoryIcon name={c.icon} size={15} className={active ? 'text-indigo-500 shrink-0' : 'text-slate-400 shrink-0'} />
      }
      <span className="flex-1 truncate">{c.name}</span>
      {active && <Check size={13} className="text-indigo-500 shrink-0" />}
    </button>
  )
}

export default function CategorySelect({
  categories = [],
  value,
  onChange,
  disabled = false,
  loading = false,
  placeholder,
}) {
  const { t } = useTranslation()
  const resolvedPlaceholder = placeholder ?? t('categorySelect.placeholder')
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const selected     = categories.find(c => c.id === value) ?? null
  const systemCats   = categories.filter(c => c.isSystem !== false)
  const customCats   = categories.filter(c => c.isSystem === false)

  const handleOpen = () => {
    if (disabled || loading) return
    const rect = buttonRef.current.getBoundingClientRect()
    setDropdownStyle({
      position: 'fixed',
      top:   rect.bottom + 4,
      left:  rect.left,
      width: rect.width,
      zIndex: 9999,
    })
    setOpen(true)
  }

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!open) return
    const handleOutside = (e) => {
      if (
        buttonRef.current  && !buttonRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled || loading}
        className={[
          'w-full border rounded-lg px-3 py-2 text-sm text-left flex items-center gap-2 transition-colors',
          open
            ? 'border-indigo-500 ring-2 ring-indigo-500 focus:outline-none'
            : 'border-slate-200 dark:border-slate-700',
          'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        {loading ? (
          <span className="text-slate-400 dark:text-slate-500 flex-1">{t('categorySelect.loading')}</span>
        ) : selected ? (
          <>
            {selected.isSystem === false
              ? <Bookmark size={15} className="text-indigo-500 shrink-0" />
              : <CategoryIcon name={selected.icon} size={15} className="text-indigo-500 shrink-0" />
            }
            <span className="flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 flex-1">{resolvedPlaceholder}</span>
        )}
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown vía portal para evitar clipping del modal */}
      {open && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 overflow-y-auto max-h-52"
        >
          {categories.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-400">{t('categorySelect.empty')}</p>
          ) : (
            <>
              {systemCats.map(c => (
                <CategoryOption key={c.id} c={c} value={value} onChange={onChange} setOpen={setOpen} />
              ))}

              {customCats.length > 0 && (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 mt-1">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
                      <Bookmark size={9} />
                      {t('categorySelect.custom')}
                    </span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
                  </div>
                  {customCats.map(c => (
                    <CategoryOption key={c.id} c={c} value={value} onChange={onChange} setOpen={setOpen} isCustom />
                  ))}
                </>
              )}
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
