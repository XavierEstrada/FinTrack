import { Outlet } from 'react-router-dom'

// TODO: Re-enable auth check when Supabase is configured
// import { Navigate } from 'react-router-dom'
// import { useAuthStore } from '../store/authStore'
// const { session, loading } = useAuthStore()
// if (loading) return <Spinner />
// return session ? <Outlet /> : <Navigate to="/login" replace />

export default function ProtectedRoute() {
  return <Outlet />
}
