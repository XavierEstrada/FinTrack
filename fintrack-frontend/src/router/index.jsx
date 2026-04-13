import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import LandingRoute from './LandingRoute'
import AppLayout from '../components/layout/AppLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import TransactionsPage from '../pages/TransactionsPage'
import BudgetsPage from '../pages/BudgetsPage'
import ReportsPage from '../pages/ReportsPage'
import ProfilePage from '../pages/ProfilePage'
import AdminPage from '../pages/admin/AdminPage'

export const router = createBrowserRouter([
  // Landing — shows page for guests, redirects authenticated users to /dashboard
  { path: '/', element: <LandingRoute /> },

  // Guest-only (redirect to /dashboard if already logged in)
  {
    element: <GuestRoute />,
    children: [
      { path: '/login',    element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // Protected app
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard',    element: <DashboardPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
          { path: '/budgets',      element: <BudgetsPage /> },
          { path: '/reports',      element: <ReportsPage /> },
          { path: '/profile',      element: <ProfilePage /> },
          { path: '/admin',        element: <AdminPage /> },
        ],
      },
    ],
  },
])
