import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function GuestRoute() {
  const { session, loading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && session) {
      navigate('/', { replace: true })
    }
  }, [session, loading, navigate])

  if (loading) return null
  if (session) return null

  return <Outlet />
}
