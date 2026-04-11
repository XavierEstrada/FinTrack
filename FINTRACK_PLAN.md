# FinTrack — Plan de desarrollo completo

## Contexto del proyecto

App de finanzas personales fullstack para portafolio de desarrollador junior.
Stack: React + Vite (frontend) · .NET 8 Web API (backend) · Supabase (Postgres + Auth + Storage)
Despliegue: Vercel (frontend) · Render (backend) · Supabase (BaaS)

---

## Stack tecnológico

### Frontend
- React 18 + Vite
- React Router v6 (navegación SPA)
- TanStack Query v5 (fetching y caché de datos)
- Zustand (estado global ligero: sesión, filtros activos)
- Recharts (gráficos: línea, barras, pie)
- React Hook Form + Zod (formularios con validación)
- Axios (cliente HTTP con interceptores para JWT)
- Tailwind CSS v3 (estilos utilitarios)
- @supabase/supabase-js (Auth directo desde el cliente)
- date-fns (manejo de fechas)

### Backend
- .NET 8 Web API
- Entity Framework Core 8 (ORM)
- Npgsql (provider PostgreSQL)
- JWT Bearer Authentication (validación de tokens de Supabase)
- AutoMapper (mapeo entidades ↔ DTOs)
- FluentValidation (validación en endpoints)
- Scalar / Swagger (documentación de la API)

### Infraestructura
- Supabase: Postgres + Auth + Storage
- Vercel: hosting frontend (CDN global, deploys por PR)
- Render: hosting API .NET (free tier, cold start ~30s)
- UptimeRobot: ping cada 14 min para evitar cold start durante demos

---

## Modelo de datos (Supabase / Postgres)

```sql
-- Tabla de categorías (algunas son del sistema, otras del usuario)
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon        TEXT,                        -- nombre de icono (ej: "shopping-cart")
  color       TEXT,                        -- hex color para UI
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  is_system   BOOLEAN DEFAULT FALSE,       -- TRUE = categoría predefinida
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla principal de transacciones
CREATE TABLE transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount        NUMERIC(12, 2) NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description   TEXT,
  date          DATE NOT NULL,
  receipt_url   TEXT,                      -- URL de archivo en Supabase Storage
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de presupuestos mensuales por categoría
CREATE TABLE budgets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount        NUMERIC(12, 2) NOT NULL,
  month         DATE NOT NULL,             -- primer día del mes (ej: 2025-01-01)
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, category_id, month)
);

-- Tabla de perfiles de usuario (extensión de auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  currency      TEXT DEFAULT 'USD',
  role          TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) — reglas clave
- Cada usuario solo lee y escribe sus propios registros (filtro `user_id = auth.uid()`)
- El admin (role = 'admin') puede leer todos los registros para el dashboard global
- Las categorías con `is_system = TRUE` son visibles para todos

---

## Arquitectura de autenticación

Supabase Auth emite JWTs firmados. El flujo es:

1. Usuario se registra/loguea en el frontend via `@supabase/supabase-js`
2. Supabase devuelve un `access_token` (JWT)
3. El frontend adjunta ese token en cada request: `Authorization: Bearer <token>`
4. La API .NET valida la firma del JWT usando el JWT Secret de Supabase
5. Extrae el `user_id` del claim `sub` para filtrar datos

El frontend también puede usar Supabase Storage directamente (con el token) para subir archivos sin pasar por el backend.

---

## Roles y permisos

| Acción                        | user | admin |
|-------------------------------|------|-------|
| Ver sus transacciones          | ✅   | ✅    |
| Crear / editar transacciones   | ✅   | ✅    |
| Ver sus presupuestos           | ✅   | ✅    |
| Subir comprobantes             | ✅   | ✅    |
| Ver estadísticas globales      | ❌   | ✅    |
| Ver lista de todos los usuarios| ❌   | ✅    |
| Gestionar categorías del sistema| ❌  | ✅    |

---

## Estructura del proyecto frontend

```
fintrack-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                  # imágenes, íconos estáticos
│   ├── components/
│   │   ├── ui/                  # componentes base reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Spinner.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx    # sidebar + header + outlet
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   ├── transactions/
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionItem.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionFilters.jsx
│   │   ├── budgets/
│   │   │   ├── BudgetCard.jsx
│   │   │   └── BudgetForm.jsx
│   │   ├── charts/
│   │   │   ├── ExpenseByCategory.jsx   # Pie chart
│   │   │   ├── IncomeVsExpense.jsx      # Bar chart mensual
│   │   │   └── BalanceTrend.jsx        # Line chart
│   │   └── admin/
│   │       ├── GlobalStats.jsx
│   │       └── UserTable.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── BudgetsPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── admin/
│   │       └── AdminPage.jsx
│   ├── hooks/
│   │   ├── useTransactions.js   # TanStack Query wrappers
│   │   ├── useBudgets.js
│   │   ├── useCategories.js
│   │   └── useAuth.js
│   ├── services/
│   │   ├── api.js               # instancia Axios con interceptores
│   │   ├── transactionService.js
│   │   ├── budgetService.js
│   │   └── categoryService.js
│   ├── store/
│   │   └── authStore.js         # Zustand: sesión y perfil del usuario
│   ├── lib/
│   │   ├── supabaseClient.js    # inicialización del cliente Supabase
│   │   └── utils.js             # formatCurrency, formatDate, etc.
│   ├── router/
│   │   ├── index.jsx            # definición de rutas con React Router
│   │   └── ProtectedRoute.jsx   # HOC que redirige si no hay sesión
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .env.local                   # variables locales (no subir a git)
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Variables de entorno frontend (.env.local)

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:5000/api    # en prod: https://fintrack-api.onrender.com/api
```

---

## Páginas y funcionalidades

### /login y /register
- Formularios con React Hook Form + Zod
- Login con email/password via Supabase Auth
- Registro crea perfil en tabla `profiles` automáticamente (trigger en Supabase o llamada al backend)
- Redirección a `/dashboard` si ya hay sesión activa

### /dashboard
- Resumen del mes actual: total ingresos, total gastos, balance neto
- 3 KPI cards en la parte superior
- Gráfico de barras: ingresos vs gastos de los últimos 6 meses
- Gráfico pie: gastos por categoría del mes actual
- Lista de últimas 5 transacciones con acceso rápido a `/transactions`

### /transactions
- Tabla paginada de transacciones (10 por página)
- Filtros: rango de fechas, categoría, tipo (income/expense), búsqueda por descripción
- Botón "Nueva transacción" abre un modal con el formulario
- Cada fila tiene acciones: editar, eliminar, ver comprobante
- Al crear/editar: subida de comprobante (imagen o PDF) a Supabase Storage

### /budgets
- Grid de tarjetas por categoría mostrando presupuesto vs gasto real del mes
- Barra de progreso con color (verde < 75%, amarillo 75-99%, rojo ≥ 100%)
- Modal para crear/editar presupuesto de una categoría
- Selector de mes para ver presupuestos históricos

### /reports
- Selector de rango de fechas personalizado
- Gráfico de línea: evolución del balance neto por mes
- Tabla de resumen por categoría: total gastado, % del total, vs presupuesto
- Botón de exportar a CSV (generado en el cliente con los datos ya cargados)

### /profile
- Editar nombre y foto de perfil (sube imagen a Supabase Storage)
- Cambiar moneda preferida (afecta el formato en toda la app)
- Cambiar contraseña via Supabase Auth

### /admin (solo role = 'admin')
- Estadísticas globales: total usuarios, total transacciones, volumen total
- Tabla de usuarios registrados con fecha y número de transacciones
- Gestión de categorías del sistema (CRUD)

---

## Endpoints de la API .NET (referencia para el frontend)

```
Auth (validado por JWT en todos los endpoints protegidos)

GET    /api/transactions          → lista paginada, soporta query params: page, limit, type, categoryId, from, to, search
POST   /api/transactions          → crea transacción
PUT    /api/transactions/{id}     → edita transacción (solo si user_id coincide)
DELETE /api/transactions/{id}     → elimina transacción

GET    /api/budgets               → presupuestos del mes (query param: month=2025-01)
POST   /api/budgets               → crea/actualiza presupuesto de una categoría
DELETE /api/budgets/{id}          → elimina presupuesto

GET    /api/categories            → categorías del usuario + categorías del sistema
POST   /api/categories            → crea categoría personalizada
PUT    /api/categories/{id}       → edita categoría
DELETE /api/categories/{id}       → elimina categoría (solo si no tiene transacciones)

GET    /api/reports/summary       → resumen: ingresos, gastos, balance por rango de fechas
GET    /api/reports/by-category   → gastos agrupados por categoría
GET    /api/reports/monthly-trend → balance neto de los últimos N meses

GET    /api/profile               → perfil del usuario autenticado
PUT    /api/profile               → actualiza nombre, moneda

-- Solo admin --
GET    /api/admin/stats           → estadísticas globales
GET    /api/admin/users           → lista de usuarios
GET    /api/admin/categories      → gestión de categorías del sistema
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

---

## Orden de desarrollo frontend (fases)

### Fase 1 — Fundación (empezar aquí)
1. Inicializar proyecto: `npm create vite@latest fintrack-frontend -- --template react`
2. Instalar dependencias
3. Configurar Tailwind CSS
4. Crear `supabaseClient.js` con variables de entorno
5. Crear `authStore.js` con Zustand (user, session, setSession, logout)
6. Crear `ProtectedRoute.jsx` y estructura base del router
7. Implementar páginas `/login` y `/register` con Supabase Auth
8. Crear `AppLayout.jsx` con Sidebar y Header básicos
9. Conectar el flujo de auth completo (login → dashboard → logout)

### Fase 2 — Transacciones (core del MVP)
10. Crear instancia Axios con interceptor que adjunta el JWT
11. Implementar `transactionService.js` y hook `useTransactions.js`
12. Página `/transactions`: tabla, filtros y paginación
13. Modal de creación/edición con `TransactionForm.jsx`
14. Subida de comprobantes a Supabase Storage

### Fase 3 — Dashboard y gráficos
15. Implementar `reportService.js` y hooks de reportes
16. KPI cards en `/dashboard`
17. Gráfico de barras ingresos vs gastos (Recharts)
18. Gráfico pie de gastos por categoría (Recharts)
19. Lista de últimas transacciones

### Fase 4 — Presupuestos
20. Implementar `budgetService.js` y hook `useBudgets.js`
21. Página `/budgets` con tarjetas y barras de progreso
22. Modal crear/editar presupuesto

### Fase 5 — Reportes y perfil
23. Página `/reports` con gráfico de tendencia y tabla de resumen
24. Exportación CSV del cliente
25. Página `/profile` con edición de datos y foto

### Fase 6 — Admin y pulido
26. Página `/admin` protegida por role
27. Revisión de responsividad mobile
28. Loading states, error boundaries y mensajes vacíos
29. Animaciones y transiciones (Tailwind transition utilities)

---

## Comandos de instalación

```bash
npm create vite@latest fintrack-frontend -- --template react
cd fintrack-frontend

npm install \
  react-router-dom \
  @tanstack/react-query \
  zustand \
  axios \
  @supabase/supabase-js \
  react-hook-form \
  zod \
  @hookform/resolvers \
  recharts \
  date-fns

npm install -D \
  tailwindcss \
  postcss \
  autoprefixer

npx tailwindcss init -p
```

---

## Notas importantes para el desarrollo

- El JWT de Supabase expira en 1 hora. Usar `supabase.auth.onAuthStateChange` para refrescarlo automáticamente y actualizar el store de Zustand.
- Para subida de archivos, el frontend llama directamente a Supabase Storage con el token del cliente — no pasa por el backend .NET.
- Los archivos de comprobantes se guardan en el bucket `receipts/{user_id}/{transaction_id}`.
- En desarrollo local, la API .NET corre en `http://localhost:5000`. El proxy de Vite puede configurarse para evitar problemas de CORS.
- Todas las cantidades se guardan en la moneda base del usuario (campo `currency` en `profiles`). La conversión es solo visual.
- Para el admin dashboard, los datos globales vienen del backend (que tiene acceso total a la DB) — el frontend no llama directamente a Supabase para esos datos.
