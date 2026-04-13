import { useState } from 'react'
import { Search, Plus, Pencil, Trash2, Receipt, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'
import { SkeletonRow } from '../components/ui/Skeleton'
import { toast } from 'sonner'
import { formatDate } from '../lib/utils'
import { useFormatCurrency } from '../hooks/useCurrency'
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import TransactionModal from '../components/transactions/TransactionModal'
import CategoryIcon from '../components/ui/CategoryIcon'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import CategoryFormModal from '../components/categories/CategoryFormModal'

const LIMIT = 10

const inputCls = 'text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600'

export default function TransactionsPage() {
  const fmt = useFormatCurrency()
  const [search, setSearch]                 = useState('')
  const [typeFilter, setTypeFilter]         = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage]                     = useState(1)
  const [modalOpen, setModalOpen]           = useState(false)
  const [editing, setEditing]               = useState(null)
  const [confirmTx, setConfirmTx]           = useState(null)
  const [catModalOpen, setCatModalOpen]     = useState(false)

  const params = {
    page,
    limit: LIMIT,
    ...(typeFilter     && { type: typeFilter }),
    ...(categoryFilter && { categoryId: categoryFilter }),
    ...(search         && { search }),
  }

  const { data, isLoading, isError } = useTransactions(params)
  const { data: categories = [] }    = useCategories()
  const deleteMutation               = useDeleteTransaction()
  const userCategories               = categories.filter(c => c.isSystem === false)

  const transactions = data?.data  ?? []
  const total        = data?.total ?? 0
  const totalPages   = Math.max(1, Math.ceil(total / LIMIT))

  const openNew  = ()   => { setEditing(null); setModalOpen(true) }
  const openEdit = (tx) => { setEditing(tx);   setModalOpen(true) }

  const handleDelete = (tx) => setConfirmTx(tx)

  const confirmDelete = () => {
    deleteMutation.mutate(confirmTx.id, {
      onSuccess: () => { toast.success('Transacción eliminada'); setConfirmTx(null) },
      onError:   () => { toast.error('No se pudo eliminar la transacción'); setConfirmTx(null) },
    })
  }

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 items-center gap-2 flex-wrap">

          <div className="relative min-w-[120px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={handleFilterChange(setSearch)}
              placeholder="Buscar…"
              className={`w-full pl-9 pr-3 py-2 ${inputCls}`}
            />
          </div>

          <select value={typeFilter} onChange={handleFilterChange(setTypeFilter)} className={inputCls}>
            <option value="">Todos los tipos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>

          <select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className={inputCls}>
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => setCatModalOpen(true)}
            disabled={userCategories.length >= 3}
            title={userCategories.length >= 3 ? 'Límite de 3 categorías alcanzado' : 'Agregar categoría personalizada'}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Bookmark size={14} />
            <span className="hidden sm:inline">Categoría personalizada</span>
            <span className="sm:hidden">Cat. personalizada</span>
          </button>
        </div>

        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus size={16} />
          Nueva transacción
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Fecha</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Descripción</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Categoría</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tipo</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Monto</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

              {isError && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-rose-400 text-sm">
                    Error al cargar las transacciones
                  </td>
                </tr>
              )}

              {!isLoading && !isError && transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 md:px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-4 md:px-5 py-3.5 font-medium text-slate-800 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-1 h-8 rounded-full shrink-0 ${tx.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {tx.description}
                    </div>
                  </td>
                  <td className="px-4 md:px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5">
                      {tx.categoryName
                        ? <CategoryIcon
                            name={tx.categoryIcon}
                            size={14}
                            className="shrink-0 text-slate-400 dark:text-slate-500"
                          />
                        : <span className="w-2 h-2 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                      }
                      <span className="text-slate-600 dark:text-slate-400">{tx.categoryName ?? '—'}</span>
                    </span>
                  </td>
                  <td className="px-4 md:px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className={`px-4 md:px-5 py-3.5 text-right font-semibold ${
                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                  </td>
                  <td className="px-4 md:px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {tx.receiptUrl && (
                        <a
                          href={tx.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <Receipt size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(tx)}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-md transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && !isError && transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No se encontraron transacciones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 md:px-5 py-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {total} transacción{total !== 1 ? 'es' : ''} en total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="p-1.5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '…'
                  ? <span key={`ellipsis-${i}`} className="px-2 text-xs text-slate-400">…</span>
                  : <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        page === p
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
              )
            }

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="p-1.5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={editing}
      />

      <ConfirmDialog
        isOpen={!!confirmTx}
        onClose={() => setConfirmTx(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Eliminar transacción"
        description={`¿Estás seguro de que quieres eliminar "${confirmTx?.description}"? Esta acción no se puede deshacer.`}
      />

      <CategoryFormModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
      />
    </div>
  )
}
