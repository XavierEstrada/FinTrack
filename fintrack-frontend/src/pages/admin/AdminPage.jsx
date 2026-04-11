import { Users, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import { mockUsers, mockTransactions } from '../../mocks/data'
import { formatCurrency, formatDate } from '../../lib/utils'

const globalIncome   = mockTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
const globalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

const stats = [
  { label: 'Usuarios',         value: mockUsers.length,                                   icon: Users,         color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
  { label: 'Transacciones',    value: mockUsers.reduce((s, u) => s + u.transactions, 0),  icon: ArrowLeftRight, color: 'text-violet-600', bg: 'bg-violet-50'  },
  { label: 'Ingresos totales', value: formatCurrency(globalIncome),                       icon: TrendingUp,    color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Gastos totales',   value: formatCurrency(globalExpenses),                     icon: TrendingDown,  color: 'text-rose-500',    bg: 'bg-rose-50'    },
]

export default function AdminPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats: 2 cols en mobile, 4 en desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs md:text-sm font-medium text-slate-500">{label}</p>
              <div className={`w-8 md:w-9 h-8 md:h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className={`text-lg md:text-2xl font-bold tracking-tight ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Users table — scroll horizontal en mobile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 md:px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-800">Usuarios registrados</p>
          <p className="text-xs text-slate-400 mt-0.5">{mockUsers.length} cuentas en total</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rol</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Transacciones</th>
                <th className="text-right px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Balance</th>
                <th className="text-left px-4 md:px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-indigo-700 text-xs font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-4 md:px-5 py-3.5 text-right text-slate-600 font-medium">{user.transactions}</td>
                  <td className={`px-4 md:px-5 py-3.5 text-right font-semibold ${user.balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {formatCurrency(user.balance)}
                  </td>
                  <td className="px-4 md:px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">{formatDate(user.joined)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
