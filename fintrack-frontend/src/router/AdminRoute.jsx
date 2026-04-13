import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Protege rutas exclusivas de administradores.
 * Siempre se monta dentro de ProtectedRoute, por lo que la sesión ya está garantizada.
 * Espera a que el perfil cargue antes de evaluar el rol para evitar falsos redirects.
 */
export default function AdminRoute() {
  const session = useAuthStore(s => s.session)
  const profile = useAuthStore(s => s.profile)

  // El perfil se carga asincrónicamente después de la sesión (setTimeout en AuthProvider).
  // Mientras session existe pero profile aún no ha llegado, mostramos spinner.
  if (session && profile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <Outlet />
}
