import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/authStore'

async function fetchProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) console.error('[AuthProvider] fetchProfile error:', error)
    return data
  } catch (e) {
    console.error('[AuthProvider] fetchProfile EXCEPTION:', e)
    return null
  }
}

// Helpers que leen siempre el estado actual del store sin crear dependencias de closure
const store = {
  isSigningOut: () => useAuthStore.getState().isSigningOut,
  setSession:   (s) => useAuthStore.getState().setSession(s),
  setProfile:   (p) => useAuthStore.getState().setProfile(p),
  clearAuth:    ()  => useAuthStore.getState().clearAuth(),
}

export default function AuthProvider({ children }) {
  useEffect(() => {
    // Carga inicial de sesión
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (store.isSigningOut()) return
      store.setSession(session)
      if (session) {
        const profile = await fetchProfile(session.user.id)
        store.setProfile(profile)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          store.clearAuth()
          return
        }

        // Si estamos cerrando sesión, ignorar TOKEN_REFRESHED u otros eventos
        // que podrían re-autenticar al usuario involuntariamente.
        if (store.isSigningOut()) return

        if (!session) {
          store.clearAuth()
          return
        }

        store.setSession(session)

        // Diferir la query con setTimeout para evitar el deadlock de Supabase:
        // supabase.from() dentro de un callback de onAuthStateChange queda colgada
        // porque el cliente espera que el estado de auth se estabilice primero.
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id)
            store.setProfile(profile)
          }, 0)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return children
}
