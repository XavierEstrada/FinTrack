import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/authStore'

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) console.error('[AuthProvider] fetchProfile error:', error)
  return data
}

export default function AuthProvider({ children }) {
  const { setSession, setProfile, clearAuth } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) {
        const profile = await fetchProfile(session.user.id)
        setProfile(profile)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          clearAuth()
          return
        }
        setSession(session)
        if (session) {
          const profile = await fetchProfile(session.user.id)
          setProfile(profile)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return children
}
