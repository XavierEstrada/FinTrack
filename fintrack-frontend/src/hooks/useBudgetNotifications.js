import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useBudgets } from './useBudgets'
import { toYearMonth } from '../lib/utils'

const currentMonth = toYearMonth(new Date())
const SESSION_KEY  = `fintrack_budget_notifs_${currentMonth}`

/**
 * Muestra toasts de alerta una sola vez por sesión cuando hay presupuestos
 * del mes actual en zona de advertencia (≥70%) o superados (≥100%).
 *
 * Se llama desde AppLayout para que funcione en toda la app.
 */
export function useBudgetNotifications() {
  const { data: budgets = [], isSuccess } = useBudgets(currentMonth)
  const notified = useRef(false)

  useEffect(() => {
    if (!isSuccess || notified.current) return
    // Ya se mostró en esta sesión del navegador
    if (sessionStorage.getItem(SESSION_KEY)) { notified.current = true; return }

    const exceeded = []
    const warning  = []

    for (const b of budgets) {
      if (!b.amount) continue
      const pct = (b.spent / b.amount) * 100
      if (pct >= 100) exceeded.push({ ...b, pct: Math.round(pct) })
      else if (pct >= 70) warning.push({ ...b, pct: Math.round(pct) })
    }

    // Presupuestos superados — uno por uno, son críticos
    exceeded.forEach(b => {
      toast.error(`${b.categoryName} excedido`, {
        description: `Llevas el ${b.pct}% del límite — revisa tus gastos`,
        duration: 8000,
      })
    })

    // Presupuestos en advertencia — agrupados si hay más de 2
    if (warning.length === 1) {
      toast.warning(`${warning[0].categoryName} al ${warning[0].pct}%`, {
        description: 'Cerca del límite mensual',
        duration: 6000,
      })
    } else if (warning.length > 1) {
      const names = warning.map(b => `${b.categoryName} (${b.pct}%)`).join(', ')
      toast.warning(`${warning.length} presupuestos cerca del límite`, {
        description: names,
        duration: 7000,
      })
    }

    sessionStorage.setItem(SESSION_KEY, '1')
    notified.current = true
  }, [isSuccess, budgets])
}
