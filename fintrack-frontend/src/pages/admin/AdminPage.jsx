import { useState } from 'react'
import { Users, ArrowLeftRight, TrendingUp, Plus, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { formatDate, getAvatarGradient } from '../../lib/utils'
import { useFormatCurrency } from '../../hooks/useCurrency'
import AnimatedNumber from '../../components/ui/AnimatedNumber'
import CategoryIcon from '../../components/ui/CategoryIcon'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import SystemCategoryFormModal from '../../components/admin/SystemCategoryFormModal'
import { useAdminStats, useAdminUsers, useDeleteSystemCategory } from '../../hooks/useAdmin'
import { useCategories } from '../../hooks/useCategories'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const cardItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}
const rowItem = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export default function AdminPage() {
  const fmt = useFormatCurrency()
  const { data: stats, isLoading: loadingStats } = useAdminStats()
  const { data: users = [], isLoading: loadingUsers } = useAdminUsers()
  const { data: allCategories = [], isLoading: loadingCats } = useCategories()
  const deleteMutation = useDeleteSystemCategory()

  const [catModalOpen, setCatModalOpen]   = useState(false)
  const [editingCat,   setEditingCat]     = useState(null)
  const [confirmCat,   setConfirmCat]     = useState(null)

  const systemCategories = allCategories.filter(c => c.isSystem !== false)
  const expenseCats      = systemCategories.filter(c => c.type === 'expense')
  const incomeCats       = systemCategories.filter(c => c.type === 'income')

  const openNew      = ()  => { setEditingCat(null); setCatModalOpen(true) }
  const openEdit     = (c) => { setEditingCat(c);    setCatModalOpen(true) }
  const handleDelete = (c) => setConfirmCat(c)

  const confirmDelete = () => {
    deleteMutation.mutate(confirmCat.id, {
      onSuccess: () => { toast.success('Categoría eliminada'); setConfirmCat(null) },
      onError:   (err) => {
        const msg = err?.response?.data ?? 'No se pudo eliminar la categoría'
        toast.error(typeof msg === 'string' ? msg : 'No se pudo eliminar la categoría')
        setConfirmCat(null)
      },
    })
  }

  const statCards = [
    { label: 'Usuarios',          value: stats?.totalUsers        ?? 0, icon: Users,          color: 'text-indigo-600 dark:text-indigo-400',   bg: 'bg-indigo-50 dark:bg-indigo-900/30',   currency: false },
    { label: 'Transacciones',     value: stats?.totalTransactions ?? 0, icon: ArrowLeftRight, color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-900/30',   currency: false },
    { label: 'Volumen total',     value: stats?.totalVolume       ?? 0, icon: TrendingUp,     color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', currency: true  },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {statCards.map(({ label, value, icon: Icon, color, bg, currency }) => (
          <motion.div
            key={label}
            variants={cardItem}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <div className={`w-8 md:w-9 h-8 md:h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            {loadingStats ? (
              <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              <p className={`text-lg md:text-2xl font-bold tracking-tight ${color}`}>
                {currency
                  ? <AnimatedNumber value={value} formatter={fmt} duration={1} />
                  : <AnimatedNumber value={value} formatter={v => Math.round(v).toLocaleString()} duration={1} />
                }
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* System categories */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="px-4 md:px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Categorías del sistema</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {loadingCats ? 'Cargando…' : `${systemCategories.length} categorías globales`}
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Plus size={15} />
            Nueva categoría
          </button>
        </div>

        {loadingCats ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">Cargando…</p>
        ) : systemCategories.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">Sin categorías del sistema</p>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {/* Expense categories */}
            {expenseCats.length > 0 && (
              <div className="px-4 md:px-5 py-3">
                <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-wide mb-3">
                  Gastos ({expenseCats.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {expenseCats.map(cat => (
                    <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )}

            {/* Income categories */}
            {incomeCats.length > 0 && (
              <div className="px-4 md:px-5 py-3">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-3">
                  Ingresos ({incomeCats.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {incomeCats.map(cat => (
                    <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Users table */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <div className="px-4 md:px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Usuarios registrados</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {loadingUsers ? 'Cargando…' : `${users.length} cuentas en total`}
          </p>
        </div>

        {loadingUsers ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">Cargando…</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">Sin usuarios</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Usuario</th>
                  <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rol</th>
                  <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Transacciones</th>
                  <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Registro</th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-slate-50 dark:divide-slate-800"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {users.map(user => {
                  const name     = user.fullName || user.email || 'Usuario'
                  const gradient = getAvatarGradient(name)
                  const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
                  return (
                    <motion.tr key={user.id} variants={rowItem} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 md:px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: gradient }}
                          >
                            <span className="text-white text-xs font-bold">{initials}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-right text-slate-600 dark:text-slate-400 font-medium">
                        {user.transactionCount}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                    </motion.tr>
                  )
                })}
              </motion.tbody>
            </table>
          </div>
        )}
      </motion.div>

      <SystemCategoryFormModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        category={editingCat}
      />

      <ConfirmDialog
        isOpen={!!confirmCat}
        onClose={() => setConfirmCat(null)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Eliminar categoría del sistema"
        description={`¿Estás seguro de que quieres eliminar "${confirmCat?.name}"? Esta acción no se puede deshacer y fallará si hay transacciones asociadas.`}
      />
    </div>
  )
}

function CategoryRow({ cat, onEdit, onDelete }) {
  const color = cat.color ?? '#94a3b8'
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: color + '20', color }}
      >
        <CategoryIcon name={cat.icon} size={15} />
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">
        {cat.name}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(cat)}
          className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-md transition-colors"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={() => onDelete(cat)}
          className="p-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 hover:bg-rose-100 rounded-md transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
