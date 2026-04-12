import { Users, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { mockUsers, mockTransactions } from '../../mocks/data'
import { formatCurrency, formatDate, getAvatarGradient } from '../../lib/utils'

const globalIncome   = mockTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
const globalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

const stats = [
  { label: 'Usuarios',         value: mockUsers.length,                                  icon: Users,          color: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-50 dark:bg-indigo-900/30'  },
  { label: 'Transacciones',    value: mockUsers.reduce((s, u) => s + u.transactions, 0), icon: ArrowLeftRight, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/30'  },
  { label: 'Ingresos totales', value: formatCurrency(globalIncome),                      icon: TrendingUp,     color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  { label: 'Gastos totales',   value: formatCurrency(globalExpenses),                    icon: TrendingDown,   color: 'text-rose-500 dark:text-rose-400',    bg: 'bg-rose-50 dark:bg-rose-900/30'    },
]

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
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
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
            <p className={`text-lg md:text-2xl font-bold tracking-tight ${color}`}>{value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Users table */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="px-4 md:px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Usuarios registrados</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{mockUsers.length} cuentas en total</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rol</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Transacciones</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Balance</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Registro</th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-slate-50 dark:divide-slate-800"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {mockUsers.map(user => {
                const gradient = getAvatarGradient(user.name)
                return (
                  <motion.tr key={user.id} variants={rowItem} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 md:px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: gradient }}
                        >
                          <span className="text-white text-xs font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
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
                    <td className="px-4 md:px-5 py-3.5 text-right text-slate-600 dark:text-slate-400 font-medium">{user.transactions}</td>
                    <td className={`px-4 md:px-5 py-3.5 text-right font-semibold ${user.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-4 md:px-5 py-3.5 text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">{formatDate(user.joined)}</td>
                  </motion.tr>
                )
              })}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
