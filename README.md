# FinTrack

Aplicación fullstack de gestión de finanzas personales. Permite registrar ingresos y gastos, controlar presupuestos mensuales o anuales por categoría, definir metas de ahorro, visualizar reportes y comparar la evolución del balance en el tiempo.

**Demo en vivo:** [fin-track-wheat-two.vercel.app](https://fin-track-wheat-two.vercel.app)  
**Documentación técnica:** [/showcase](https://fin-track-wheat-two.vercel.app/showcase)

---

## Características

- **Dashboard** — balance del mes, ingresos y gastos; gráfico de barras últimos 6 meses; gráfico de dona por categoría; resumen de metas de ahorro
- **Transacciones** — CRUD completo; búsqueda en tiempo real; filtros por tipo, categoría y rango de fechas; paginación; comprobantes (PDF/imagen); barra de totales para el conjunto filtrado
- **Presupuestos** — límites mensuales o anuales por categoría; barra de progreso con alerta visual; navegador de mes; copia rápida entre meses
- **Metas de ahorro** — objetivos por mes con barra de progreso; estados visuales (cumplida / cerca / lejos); resumen en el dashboard
- **Reportes** — gráfico de dona interactivo por categoría + gráfico de línea de balance neto; exportación CSV
- **Categorías personalizadas** — hasta 3 categorías propias por usuario con icono y color personalizados
- **Perfil** — nombre, moneda preferida, gestión de categorías, cambio de contraseña, eliminación de cuenta
- **Panel de administración** — estadísticas globales, lista de usuarios, CRUD de categorías del sistema; ruta protegida por rol `admin`
- **i18n** — interfaz bilingüe (Español / English), toggle persistido en `localStorage`
- **UX** — dark mode; diseño responsive (sidebar en desktop, nav inferior en móvil); skeletons de carga; animaciones con Framer Motion; confirmación al cerrar con cambios sin guardar; Error Boundary global

---

## Stack tecnológico

### Frontend

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Bundler / dev server |
| React Router | 7 | Enrutamiento SPA |
| TanStack Query | 5 | Server state, caché, background refetch |
| Zustand | 5 | Client state (sesión, perfil, tema) |
| React Hook Form + Zod | 7 / 4 | Formularios y validación tipada |
| Tailwind CSS | 3 | Estilos utilitarios |
| Framer Motion | 12 | Animaciones y transiciones |
| i18next + react-i18next | 26 / 17 | Internacionalización ES/EN |
| Lucide React | 1 | Iconos |
| Sonner | 2 | Notificaciones toast |
| Supabase JS | 2 | Autenticación + Storage |
| Axios | 1 | Cliente HTTP hacia el backend |
| Vitest | 4 | Tests unitarios |

### Backend

| Tecnología | Versión | Rol |
|---|---|---|
| .NET | 9 | Runtime |
| ASP.NET Core Web API | 9 | API REST |
| Entity Framework Core | 9 | ORM |
| Npgsql EF Provider | 9 | Driver PostgreSQL |
| AutoMapper | 16 | Mapeo DTO ↔ Model |
| JWT Bearer (ES256) | 9 | Validación de tokens Supabase via JWKS |
| xUnit + FluentAssertions | — | Tests de integración |
| Scalar | — | Documentación OpenAPI interactiva |

### Infraestructura

| Servicio | Rol |
|---|---|
| Supabase | PostgreSQL + Auth + Storage |
| Vercel | Hosting frontend |
| Render | Hosting backend |

---

## Arquitectura

```
Browser
  │
  ├─ Supabase JS  ──►  Supabase Auth  (login / registro / JWT ES256)
  │
  └─ Axios  ──────────►  .NET 9 API  ──────►  Supabase PostgreSQL
          Bearer JWT        ASP.NET Core         EF Core + RLS
                            valida via JWKS
```

**Flujo principal:**

1. El usuario se autentica con Supabase → recibe un JWT firmado con ES256
2. El JWT se almacena en el store de Zustand (`authStore`)
3. Axios adjunta `Authorization: Bearer <token>` en cada request
4. El backend valida el JWT descargando las claves públicas desde el endpoint JWKS de Supabase (`{issuer}/.well-known/jwks.json`)
5. Las queries de EF Core operan bajo las políticas RLS de PostgreSQL
6. La subida de archivos (comprobantes, avatares) va directamente del browser a Supabase Storage usando el mismo JWT — sin pasar por el backend

---

## Tests

| Suite | Framework | Cobertura |
|---|---|---|
| Frontend — 28 tests | Vitest | `formatCurrency`, `formatDate`, `formatRelativeDate`, `monthLabel`, `getAvatarGradient`, `receiptService` (validación MIME, tamaño, rutas de Storage) |
| Backend — 12 tests | xUnit + FluentAssertions + EF InMemory | Paginación, filtros (tipo, búsqueda, fechas), cálculo de totales, CRUD — cada test con su propia DB en memoria |

```bash
# Frontend
cd fintrack-frontend && npm test

# Backend
cd fintrack-backend && dotnet test
```

---

## Base de datos

### Esquema

```
profiles
  id          uuid  PK  (= auth.users.id)
  full_name   text
  currency    text  default 'USD'
  role        text  default 'user'   -- 'user' | 'admin'
  avatar_url  text?
  created_at  timestamptz

categories
  id          uuid  PK
  name        text
  icon        text        -- clave Lucide
  color       text        -- hex
  type        text        -- 'expense' | 'income'
  is_system   bool
  user_id     uuid?  FK → profiles   (null si is_system = true)

transactions
  id           uuid  PK
  user_id      uuid  FK → profiles
  category_id  uuid? FK → categories
  description  text
  amount       decimal
  type         text   -- 'expense' | 'income'
  date         date
  receipt_url  text?

budgets
  id           uuid  PK
  user_id      uuid  FK → profiles
  category_id  uuid  FK → categories
  amount       decimal
  month        date   -- primer día del mes (ej. 2025-05-01)
  is_annual    bool   default false
  UNIQUE (user_id, category_id, month)

savings_goals
  id             uuid  PK
  user_id        uuid  FK → profiles
  name           text
  target_amount  decimal
  month          date
  icon           text
  color          text
```

### Políticas RLS

- `profiles` — cada usuario lee y edita solo su propia fila
- `categories` — lectura de todas las del sistema + las propias; escritura solo de las propias
- `transactions`, `budgets`, `savings_goals` — acceso exclusivo a filas propias
- Los admins ejecutan queries privilegiadas mediante el backend con verificación de rol en `profiles`

---

## Configuración local

### Requisitos

- Node.js 18+
- .NET 9 SDK
- Cuenta en [Supabase](https://supabase.com) con proyecto creado

### 1. Clonar

```bash
git clone https://github.com/XGuadamuz/FinTrack.git
cd FinTrack
```

### 2. Frontend

```bash
cd fintrack-frontend
npm install
```

Crear `fintrack-frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev        # http://localhost:5173
npm run build      # Build de producción → dist/
npm run lint       # ESLint
npm run test       # Vitest
```

### 3. Backend

Crear `fintrack-backend/fintrack-backend/appsettings.Development.json` (excluido del repositorio):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=aws-0-us-east-1.pooler.supabase.com;Database=postgres;Username=postgres.<project-ref>;Password=<password>;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Supabase": {
    "Issuer": "https://<project-ref>.supabase.co/auth/v1",
    "ProjectUrl": "https://<project-ref>.supabase.co",
    "ServiceRoleKey": "<service-role-key>"
  }
}
```

> El JWT Secret **no se configura manualmente** — el backend valida los tokens ES256 descargando las claves públicas automáticamente desde el endpoint JWKS de Supabase.

```bash
cd fintrack-backend/fintrack-backend
dotnet restore
dotnet run         # http://localhost:5000
# Documentación interactiva: http://localhost:5000/scalar
```

---

## API endpoints

Todos los endpoints requieren `Authorization: Bearer <supabase-jwt>`.  
Los endpoints `/api/admin/*` requieren además `profiles.role = 'admin'`.

### Transacciones — `/api/transactions`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/transactions` | Lista paginada. Query params: `page`, `limit`, `type`, `categoryId`, `search`, `from` (YYYY-MM-DD), `to` (YYYY-MM-DD). Respuesta incluye `totalIncome` y `totalExpense` del conjunto filtrado |
| POST | `/api/transactions` | Crear transacción |
| PUT | `/api/transactions/{id}` | Actualizar transacción propia |
| DELETE | `/api/transactions/{id}` | Eliminar transacción propia |

### Presupuestos — `/api/budgets`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/budgets?month=YYYY-MM` | Presupuestos del mes con gasto actual. Los anuales (`isAnnual=true`) se incluyen en todos los meses del año |
| POST | `/api/budgets` | Crear presupuesto (mensual o anual) |
| PUT | `/api/budgets/{id}` | Actualizar presupuesto propio |
| DELETE | `/api/budgets/{id}` | Eliminar presupuesto propio |

### Metas de ahorro — `/api/savings-goals`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/savings-goals?month=YYYY-MM` | Metas del mes con progreso calculado |
| POST | `/api/savings-goals` | Crear meta |
| PUT | `/api/savings-goals/{id}` | Actualizar meta |
| DELETE | `/api/savings-goals/{id}` | Eliminar meta |

### Categorías — `/api/categories`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categories` | Categorías del sistema + propias del usuario |
| POST | `/api/categories` | Crear categoría propia (máx. 3) |
| PUT | `/api/categories/{id}` | Actualizar categoría propia |
| DELETE | `/api/categories/{id}` | Eliminar categoría propia |

### Reportes — `/api/reports`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/reports/summary?from=&to=` | Ingresos, gastos y balance en el rango |
| GET | `/api/reports/by-category?from=&to=` | Gastos por categoría con porcentaje |
| GET | `/api/reports/monthly-trend?months=6` | Balance neto por mes (últimos N meses) |

### Perfil — `/api/profile`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/profile` | Perfil del usuario autenticado |
| PUT | `/api/profile` | Actualizar nombre, moneda y avatar |

### Administración — `/api/admin` *(solo admins)*

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/stats` | Total de usuarios, transacciones y volumen global |
| GET | `/api/admin/users` | Lista de todos los usuarios |
| POST | `/api/admin/categories` | Crear categoría del sistema |
| PUT | `/api/admin/categories/{id}` | Actualizar categoría del sistema |
| DELETE | `/api/admin/categories/{id}` | Eliminar categoría del sistema |

---

## Estructura del proyecto

```
FinTrack/
├── fintrack-frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/         # SystemCategoryFormModal
│       │   ├── budgets/       # BudgetModal, QuickCopyModal
│       │   ├── categories/    # CategoryFormModal
│       │   ├── layout/        # AppLayout, Sidebar, Header
│       │   ├── savings/       # SavingsGoalModal
│       │   ├── transactions/  # TransactionModal
│       │   └── ui/            # CategoryIcon, CategoryPieChart, CategorySelect,
│       │                      # ConfirmDialog, ErrorBoundary, LanguageToggle,
│       │                      # Modal, Skeleton, UserAvatar, ...
│       ├── hooks/             # useTransactions, useBudgets, useCategories,
│       │                      # useReports, useSavingsGoals, useAdmin, useCurrency, ...
│       ├── i18n/              # Configuración i18next + locales (es.json, en.json)
│       ├── lib/               # supabaseClient.js, utils.js
│       ├── pages/
│       │   ├── auth/          # LoginPage, RegisterPage
│       │   ├── admin/         # AdminPage
│       │   ├── DashboardPage, TransactionsPage, BudgetsPage
│       │   ├── ReportsPage, SavingsPage, ProfilePage
│       │   ├── LandingPage, ShowcasePage, NotFoundPage
│       ├── router/            # index.jsx, ProtectedRoute, AdminRoute, GuestRoute
│       ├── services/          # api.js (Axios) + *Service.js por recurso
│       ├── store/             # authStore.js, themeStore.js
│       └── test/              # utils.test.js, receiptService.test.js
│
└── fintrack-backend/
    └── fintrack-backend/
        ├── Controllers/       # Transactions, Budgets, Categories,
        │                      # Reports, SavingsGoals, Profile, Admin
        ├── DTOs/              # Request / Response DTOs
        ├── Models/            # Profile, Category, Transaction, Budget, SavingsGoal
        ├── Services/          # Lógica de negocio por recurso
        ├── Data/              # AppDbContext
        ├── Extensions/        # ClaimsPrincipal.GetUserId()
        ├── Mappings/          # AutoMapper profiles
        └── Tests/             # xUnit — TransactionService (12 tests)
```

---

## Deploy

### Frontend — Vercel

Variables de entorno en Vercel → Settings → Environment Variables:

```
VITE_SUPABASE_URL     = https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...
VITE_API_URL          = https://<tu-backend>.onrender.com/api
```

### Backend — Render

Variables de entorno en Render → Environment:

```
ASPNETCORE_ENVIRONMENT          = Production
ConnectionStrings__DefaultConnection = Host=...;Password=<real>;...
Supabase__Issuer                = https://<project-ref>.supabase.co/auth/v1
Supabase__ProjectUrl            = https://<project-ref>.supabase.co
Supabase__ServiceRoleKey        = <service-role-key>
```

> `appsettings.json` solo contiene valores de desarrollo y placeholders. Los valores reales de producción se configuran exclusivamente como variables de entorno en cada plataforma.
