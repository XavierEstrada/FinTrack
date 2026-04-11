export const mockUser = {
  id: '1',
  email: 'juan.perez@email.com',
  full_name: 'Juan Pérez',
  currency: 'USD',
  role: 'admin',
  avatar_url: null,
}

export const mockCategories = [
  { id: '1', name: 'Alimentación', color: '#6366f1', type: 'expense' },
  { id: '2', name: 'Transporte',   color: '#8b5cf6', type: 'expense' },
  { id: '3', name: 'Entretenimiento', color: '#ec4899', type: 'expense' },
  { id: '4', name: 'Salud',        color: '#10b981', type: 'expense' },
  { id: '5', name: 'Servicios',    color: '#f59e0b', type: 'expense' },
  { id: '6', name: 'Salario',      color: '#22c55e', type: 'income'  },
  { id: '7', name: 'Freelance',    color: '#06b6d4', type: 'income'  },
]

export const mockTransactions = [
  { id: '1',  description: 'Supermercado La Colonia', amount: 85.50,   type: 'expense', category: 'Alimentación',    category_color: '#6366f1', date: '2026-04-10' },
  { id: '2',  description: 'Salario Abril',           amount: 3200.00, type: 'income',  category: 'Salario',         category_color: '#22c55e', date: '2026-04-01' },
  { id: '3',  description: 'Netflix',                 amount: 15.99,   type: 'expense', category: 'Entretenimiento', category_color: '#ec4899', date: '2026-04-08' },
  { id: '4',  description: 'Gasolina',                amount: 45.00,   type: 'expense', category: 'Transporte',      category_color: '#8b5cf6', date: '2026-04-07' },
  { id: '5',  description: 'Proyecto web cliente',    amount: 800.00,  type: 'income',  category: 'Freelance',       category_color: '#06b6d4', date: '2026-04-05' },
  { id: '6',  description: 'Farmacia',                amount: 32.80,   type: 'expense', category: 'Salud',           category_color: '#10b981', date: '2026-04-04' },
  { id: '7',  description: 'Internet Claro',          amount: 59.99,   type: 'expense', category: 'Servicios',       category_color: '#f59e0b', date: '2026-04-03' },
  { id: '8',  description: 'Restaurante El Portal',   amount: 67.30,   type: 'expense', category: 'Alimentación',    category_color: '#6366f1', date: '2026-04-02' },
  { id: '9',  description: 'Uber',                    amount: 12.50,   type: 'expense', category: 'Transporte',      category_color: '#8b5cf6', date: '2026-04-09' },
  { id: '10', description: 'Spotify',                 amount: 9.99,    type: 'expense', category: 'Entretenimiento', category_color: '#ec4899', date: '2026-04-06' },
]

export const mockBudgets = [
  { id: '1', category: 'Alimentación',    color: '#6366f1', amount: 400, spent: 152.80 },
  { id: '2', category: 'Transporte',      color: '#8b5cf6', amount: 150, spent: 57.50  },
  { id: '3', category: 'Entretenimiento', color: '#ec4899', amount: 100, spent: 95.98  },
  { id: '4', category: 'Salud',           color: '#10b981', amount: 200, spent: 32.80  },
  { id: '5', category: 'Servicios',       color: '#f59e0b', amount: 120, spent: 129.99 },
]

export const mockMonthlyData = [
  { month: 'Nov', income: 3200, expenses: 1820 },
  { month: 'Dic', income: 3800, expenses: 2450 },
  { month: 'Ene', income: 3200, expenses: 1640 },
  { month: 'Feb', income: 4000, expenses: 2100 },
  { month: 'Mar', income: 3200, expenses: 1960 },
  { month: 'Abr', income: 4000, expenses: 424  },
]

export const mockCategoryExpenses = [
  { name: 'Alimentación',    color: '#6366f1', amount: 152.80, pct: 36 },
  { name: 'Transporte',      color: '#8b5cf6', amount: 57.50,  pct: 14 },
  { name: 'Entretenimiento', color: '#ec4899', amount: 95.98,  pct: 23 },
  { name: 'Salud',           color: '#10b981', amount: 32.80,  pct: 8  },
  { name: 'Servicios',       color: '#f59e0b', amount: 129.99, pct: 31 },
]

export const mockUsers = [
  { id: '1', name: 'Juan Pérez',    email: 'juan.perez@email.com',  role: 'admin', transactions: 24, balance: 3693.42, joined: '2025-11-01' },
  { id: '2', name: 'María López',   email: 'maria.lopez@email.com', role: 'user',  transactions: 18, balance: 1240.00, joined: '2025-12-15' },
  { id: '3', name: 'Carlos Ruiz',   email: 'carlos.r@email.com',    role: 'user',  transactions: 31, balance: 850.75,  joined: '2026-01-03' },
  { id: '4', name: 'Ana Martínez',  email: 'ana.m@email.com',       role: 'user',  transactions: 9,  balance: 2100.50, joined: '2026-02-20' },
  { id: '5', name: 'Luis Herrera',  email: 'luis.h@email.com',      role: 'user',  transactions: 42, balance: 420.30,  joined: '2026-03-08' },
]
