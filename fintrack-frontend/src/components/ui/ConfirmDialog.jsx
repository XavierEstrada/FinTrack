import { AlertTriangle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Diálogo de confirmación personalizado que reemplaza window.confirm().
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void        — cancela sin hacer nada
 *  - onConfirm: () => void      — confirma la acción destructiva
 *  - title: string
 *  - description: string
 *  - confirmLabel?: string      — default "Eliminar"
 *  - loading?: boolean          — deshabilita botones mientras se procesa
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Eliminar',
  loading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={!loading ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm p-6"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Icono */}
            <div className="w-11 h-11 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-4">
              <AlertTriangle size={20} className="text-rose-500 dark:text-rose-400" />
            </div>

            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1.5">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{description}</p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Eliminando…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
