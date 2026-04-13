import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { session, profile, loading } = useAuthStore()

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const register = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
  }

  const logout = async () => {
    // 1. Marcar que estamos cerrando sesión ANTES de cualquier await.
    //    Esto bloquea que onAuthStateChange re-autentique si llega un TOKEN_REFRESHED.
    useAuthStore.getState().startSignOut()

    // 2. Limpiar estado local inmediatamente → ProtectedRoute redirige sin esperar red.
    useAuthStore.getState().clearAuth()

    // 3. Invalidar sesión en Supabase (en segundo plano, errores son no-críticos).
    try {
      await supabase.auth.signOut()
    } catch {
      // La sesión local ya fue limpiada; el usuario ya fue redirigido.
    }
  }

  return { session, profile, loading, login, register, logout }
}
