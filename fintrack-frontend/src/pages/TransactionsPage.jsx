import { useState } from 'react'
import { Search, Plus, SlidersHorizontal, Pencil, Trash2, Receipt } from 'lucide-react'
import { mockTransactions, mockCategories } from '../mocks/data'
import { formatCurrency, formatDate } from '../lib/utils'
import TransactionModal from '../components/transactions/TransactionModal'

export default function TransactionsPage() {
  const [search, setSearch]             = useState('')
  const [typeFilter, setTypeFilter]     = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [modalOpen, setModalOpen]       = useState(false)
  const [editing, setEditing]           = useState(null)

  const filtered = mockTransactions.filter(tx => {
    const matchSearch   = tx.description.toLowerCase().includes(search.toLowerCase())
    const matchType     = typeFilter === 'all' || tx.type === typeFilter
    const matchCategory = categoryFilter === 'all' || tx.category === categoryFilter
    return matchSearch && matchType && matchCategory
  })

  const openNew  = ()   => { setEditing(null); setModalOpen(true) }
  const openEdit = (tx) => { setEditing(tx);   setModalOpen(true) }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filters row */}
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas las categorías</option>
            {mockCategories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {/* New transaction */}
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus size={16} />
          Nueva transacción
        </button>
      </div>

      {/* Table — scroll horizontal en mobile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Descripción</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoría</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Monto</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 md:px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="px-4 md:px-5 py-3.5 font-medium text-slate-800">{tx.description}</td>
                  <td className="px-4 md:px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tx.category_color }} />
                      <span className="text-slate-600">{tx.category}</span>
                    </span>
                  </td>
                  <td className="px-4 md:px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className={`px-4 md:px-5 py-3.5 text-right font-semibold ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 md:px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-md transition-colors">
                        <Receipt size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(tx)}
                        className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button className="p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-md transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                    No se encontraron transacciones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 md:px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">Mostrando {filtered.length} de {mockTransactions.length} transacciones</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40" disabled>Anterior</button>
            <span className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md">1</span>
            <button className="px-3 py-1.5 text-xs text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50">Siguiente</button>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={editing}
      />
    </div>
  )
}
