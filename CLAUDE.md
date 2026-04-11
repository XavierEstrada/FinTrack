# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FinTrack is a fullstack personal finance management app (portfolio project). The frontend lives in `fintrack-frontend/` and uses React + Vite. The backend is a planned .NET 8 Web API (not yet in this repo). Infrastructure: Supabase (Postgres + Auth + Storage), Vercel (frontend), Render (backend).

The detailed development plan is in [FINTRACK_PLAN.md](FINTRACK_PLAN.md) (written in Spanish).

## Commands

All commands run from `fintrack-frontend/`:

```bash
npm run dev       # Start dev server with HMR (Vite)
npm run build     # Production build → dist/
npm run lint      # ESLint across all files
npm run preview   # Serve the production build locally
```

No test framework is configured yet.

## Architecture

### Data Flow

1. User authenticates via `@supabase/supabase-js` → Supabase returns a JWT
2. Zustand `authStore` holds the session and user profile
3. Axios instance in `src/services/api.js` attaches `Authorization: Bearer <token>` to every request
4. .NET API validates the JWT using Supabase's JWT secret, extracts `sub` as `user_id`
5. File uploads (receipts, avatars) go directly from the browser to Supabase Storage using the same token — no backend round-trip

### Frontend Structure (planned — not yet implemented)

```
src/
├── components/
│   ├── ui/            # Base reusable components (Button, Input, Modal, Badge, Card, Spinner)
│   ├── layout/        # AppLayout (sidebar + header + <Outlet>), Sidebar, Header
│   ├── transactions/  # TransactionList, TransactionItem, TransactionForm, TransactionFilters
│   ├── budgets/       # BudgetCard, BudgetForm
│   ├── charts/        # ExpenseByCategory (pie), IncomeVsExpense (bar), BalanceTrend (line)
│   └── admin/         # GlobalStats, UserTable
├── pages/             # One file per route: DashboardPage, TransactionsPage, BudgetsPage, ReportsPage, ProfilePage, auth/*, admin/*
├── hooks/             # TanStack Query wrappers: useTransactions, useBudgets, useCategories, useAuth
├── services/          # api.js (Axios instance) + per-resource services calling the .NET API
├── store/             # authStore.js — Zustand store for session + user profile
├── lib/               # supabaseClient.js, utils.js (formatCurrency, formatDate)
└── router/            # index.jsx (route definitions), ProtectedRoute.jsx (redirects if no session)
```

### Database Schema (Supabase / Postgres)

Four tables: `profiles` (extends `auth.users`), `categories` (user or system-wide), `transactions` (core financial records with optional `receipt_url`), `budgets` (monthly limit per category, unique on `user_id + category_id + month`).

RLS rules: users see only their own rows (`user_id = auth.uid()`). Admins bypass this to access global stats. System categories (`is_system = TRUE`) are readable by everyone.

### Roles

Two roles stored in `profiles.role`: `user` (default) and `admin`. Admins can view global stats, all users, and manage system categories.

## Environment Variables

Create `fintrack-frontend/.env.local` (never commit it):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:5000/api
```

All Vite env vars must be prefixed with `VITE_` to be accessible in the browser.

## Key Conventions

- **ESLint**: Flat config (v9). Uppercase variable names are explicitly allowed (covers React components and constants).
- **Routing**: React Router v6 with a `ProtectedRoute` wrapper that redirects unauthenticated users.
- **Data fetching**: TanStack Query v5 handles caching and background refetching; raw Axios calls live in `services/`, not in components.
- **State**: Only session/auth state lives in Zustand. Server state lives in TanStack Query cache.
- **Forms**: React Hook Form + Zod for all user input.
- **Dates**: Always use `date-fns`. Budget `month` field is stored as the first day of the month (e.g., `2025-01-01`).
- **Currency formatting**: Use `formatCurrency` from `src/lib/utils.js`; respects the user's `profiles.currency` preference.
