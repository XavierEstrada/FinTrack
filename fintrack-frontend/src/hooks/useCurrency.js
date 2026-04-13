import { useAuthStore } from '../store/authStore'
import { formatCurrency } from '../lib/utils'

/**
 * Retorna un formatter de moneda enlazado a la preferencia del usuario.
 * Úsalo en lugar de llamar formatCurrency directamente.
 *
 * const fmt = useFormatCurrency()
 * fmt(1234.5)  →  "$1,234.50"  (o el símbolo que tenga el usuario)
 */
export function useFormatCurrency() {
  const currency = useAuthStore(s => s.profile?.currency ?? 'USD')
  return (amount) => formatCurrency(amount, currency)
}
