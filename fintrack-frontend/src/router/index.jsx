import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
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
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
          { path: '/budgets', element: <BudgetsPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/admin', element: <AdminPage /> },
        ],
      },
    ],
  },
])
