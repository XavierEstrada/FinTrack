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
    await supabase.auth.signOut()
    // Forzar limpieza del estado por si onAuthStateChange no dispara a tiempo
    useAuthStore.getState().clearAuth()
  }

  return { session, profile, loading, login, register, logout }
}
