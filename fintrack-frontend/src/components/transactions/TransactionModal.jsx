import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Paperclip, X, FileText, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import ConfirmDialog from '../ui/ConfirmDialog'
import CategorySelect from '../ui/CategorySelect'
import { useCategories } from '../../hooks/useCategories'
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/useTransactions'
import { useCurrencySymbol } from '../../hooks/useCurrency'
import { useAuthStore } from '../../store/authStore'
import { receiptService } from '../../services/receiptService'

const schema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount:      z.coerce.number().positive('El monto debe ser mayor a 0'),
  type:        z.enum(['income', 'expense']),
  categoryId:  z.string().min(1, 'Selecciona una categoría'),
  date:        z.string().min(1, 'La fecha es requerida'),
})

const field  = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500'
const label  = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5'
const errCls = 'text-red-500 text-xs mt-1'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(file) {
  return file?.type?.startsWith('image/')
}

export default function TransactionModal({ isOpen, onClose, transaction = null }) {
  const isEditing      = !!transaction
  const today          = new Date().toISOString().split('T')[0]
  const currencySymbol = useCurrencySymbol()
  const userId         = useAuthStore(s => s.session?.user?.id)

  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [pendingFile,      setPendingFile]       = useState(null)       // File seleccionado aún no subido
  const [previewUrl,       setPreviewUrl]        = useState(null)       // URL de preview local (object URL)
  const [receiptRemoved,   setReceiptRemoved]    = useState(false)      // usuario eliminó el comprobante existente
  const [uploading,        setUploading]         = useState(false)
  const fileInputRef = useRef(null)

  const existingReceiptUrl = transaction?.receiptUrl ?? null

  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const { register, handleSubmit, watch, reset, control, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'expense', date: today },
  })

  // Resetear estado de comprobante al abrir/cerrar
  useEffect(() => {
    if (isOpen) {
      setPendingFile(null)
      setPreviewUrl(null)
      setReceiptRemoved(false)
    }
    if (transaction) {
      reset({
        description: transaction.description,
        amount:      transaction.amount,
        type:        transaction.type,
        categoryId:  transaction.categoryId ?? '',
        date:        transaction.date?.split('T')[0] ?? today,
      })
    } else {
      reset({ type: 'expense', date: today, categoryId: '', description: '', amount: '' })
    }
  }, [transaction, isOpen])

  // Liberar object URL al desmontar o cambiar de archivo
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setReceiptRemoved(false)
    if (isImage(file)) setPreviewUrl(URL.createObjectURL(file))
    else setPreviewUrl(null)
    e.target.value = ''   // permite seleccionar el mismo archivo de nuevo
  }

  const handleRemoveReceipt = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(null)
    setPreviewUrl(null)
    if (existingReceiptUrl && !receiptRemoved) setReceiptRemoved(true)
  }

  const hasReceipt = pendingFile || (existingReceiptUrl && !receiptRemoved)
  const hasChanges = isDirty || !!pendingFile || receiptRemoved

  const handleClose = () => {
    if (hasChanges) setShowCloseConfirm(true)
    else onClose()
  }

  const selectedType       = watch('type')
  const filteredCategories = categories.filter(c => c.type === selectedType)

  const onSubmit = async (data) => {
    try {
      setUploading(!!pendingFile)
      let receiptUrl = existingReceiptUrl

      // Si el usuario eliminó el comprobante, borrar del storage
      if (receiptRemoved && existingReceiptUrl) {
        await receiptService.remove(existingReceiptUrl).catch(() => {})
        receiptUrl = null
      }

      // Si hay un archivo nuevo, subir (y borrar el antiguo si aplica)
      if (pendingFile) {
        if (existingReceiptUrl && !receiptRemoved) {
          await receiptService.remove(existingReceiptUrl).catch(() => {})
        }
        receiptUrl = await receiptService.upload(pendingFile, userId)
      }

      setUploading(false)
      const payload = { ...data, receiptUrl }

      if (isEditing) {
        await updateMutation.mutateAsync({ id: transaction.id, data: payload })
        toast.success('Transacción actualizada', { description: data.description })
      } else {
        await createMutation.mutateAsync(payload)
        toast.success('Transacción agregada', { description: data.description })
      }
      onClose()
    } catch (err) {
      setUploading(false)
      toast.error(err?.message ?? 'No se pudo guardar la transacción')
    }
  }

  // Determina el label del comprobante a mostrar
  const receiptLabel = pendingFile
    ? pendingFile.name
    : existingReceiptUrl && !receiptRemoved
      ? 'Comprobante adjunto'
      : null

  const receiptSubLabel = pendingFile
    ? formatBytes(pendingFile.size)
    : existingReceiptUrl && !receiptRemoved
      ? 'Guardado'
      : null

  const isBusy = isSubmitting || uploading

  return (
    <Modal isOpen={isOpen} onClose={onClose} onRequestClose={handleClose} title={isEditing ? 'Editar transacción' : 'Nueva transacción'}>
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

        {/* Tipo */}
        <div>
          <p className={label}>Tipo</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'expense', label: 'Gasto',   active: 'bg-rose-500 text-white border-rose-500'       },
              { value: 'income',  label: 'Ingreso',  active: 'bg-emerald-500 text-white border-emerald-500' },
            ].map(opt => (
              <label
                key={opt.value}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                  selectedType === opt.value
                    ? opt.active
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <input type="radio" value={opt.value} {...register('type')} className="sr-only" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className={label}>Descripción</label>
          <input
            {...register('description')}
            placeholder="Ej: Supermercado, Salario…"
            className={field}
          />
          {errors.description && <p className={errCls}>{errors.description.message}</p>}
        </div>

        {/* Monto y fecha */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Monto</label>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
              <span className="pl-3 pr-1.5 text-slate-400 dark:text-slate-500 text-sm shrink-0">{currencySymbol}</span>
              <input
                {...register('amount')}
                type="number" step="0.01" min="0" placeholder="0.00"
                className="flex-1 py-2 pr-3 text-sm text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            {errors.amount && <p className={errCls}>{errors.amount.message}</p>}
          </div>

          <div>
            <label className={label}>Fecha</label>
            <input {...register('date')} type="date" className={field} />
            {errors.date && <p className={errCls}>{errors.date.message}</p>}
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className={label}>Categoría</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategorySelect
                categories={filteredCategories}
                value={field.value}
                onChange={field.onChange}
                loading={loadingCategories}
              />
            )}
          />
          {errors.categoryId && <p className={errCls}>{errors.categoryId.message}</p>}
        </div>

        {/* Comprobante */}
        <div>
          <label className={label}>Comprobante <span className="text-slate-300 dark:text-slate-600 font-normal">(opcional)</span></label>

          {hasReceipt ? (
            <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50">
              {/* Preview imagen o icono PDF */}
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-10 h-10 rounded-md object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
              ) : existingReceiptUrl && !pendingFile && !receiptRemoved && existingReceiptUrl.match(/\.(jpg|jpeg|png|webp|heic)(\?|$)/i) ? (
                <img src={existingReceiptUrl} alt="comprobante" className="w-10 h-10 rounded-md object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="w-10 h-10 rounded-md bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-rose-500 dark:text-rose-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{receiptLabel}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{receiptSubLabel}</p>
                  {/* Ver comprobante existente */}
                  {existingReceiptUrl && !pendingFile && !receiptRemoved && (
                    <a
                      href={existingReceiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                      Ver
                    </a>
                  )}
                  {/* Reemplazar */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-indigo-500 dark:text-indigo-400 hover:underline"
                  >
                    Reemplazar
                  </button>
                </div>
              </div>

              {/* Quitar */}
              <button
                type="button"
                onClick={handleRemoveReceipt}
                className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-400 dark:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
            >
              <Paperclip size={14} />
              Adjuntar comprobante — JPG, PNG, PDF · máx. 10 MB
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              selectedType === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isBusy && <Loader2 size={14} className="animate-spin" />}
            {uploading ? 'Subiendo…' : isSubmitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Agregar'}
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={() => { setShowCloseConfirm(false); onClose() }}
        title="¿Descartar cambios?"
        description="Tienes cambios sin guardar. Si cierras ahora, se perderán."
        confirmLabel="Descartar"
        variant="warning"
      />
    </Modal>
  )
}
