import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LandingPage from '../pages/LandingPage'

export default function LandingRoute() {
  const { session, loading } = useAuthStore()

  if (loading) return null
  if (session) return <Navigate to="/dashboard" replace />

  return <LandingPage />
}
