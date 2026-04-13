# FinTrack

Aplicación fullstack de gestión de finanzas personales. Permite registrar ingresos y gastos, organizar presupuestos mensuales o anuales por categoría, visualizar reportes y comparar la evolución del balance en el tiempo.

> Proyecto de portafolio — en desarrollo activo.

---

## Características

- **Dashboard** — resumen del mes con balance, ingresos, gastos y gráfico de barras ingreso vs. gasto de los últimos 6 meses
- **Transacciones** — CRUD completo con búsqueda, filtros por tipo y categoría, paginación y soporte de comprobantes
- **Presupuestos** — límites mensuales o anuales por categoría; barra de progreso con alerta visual al acercarse al límite
- **Reportes** — gráfico de pastel interactivo de gastos por categoría + gráfico de línea de balance neto; exportación CSV
- **Categorías personalizadas** — cada usuario puede crear hasta 3 categorías propias con icono y color personalizado
- **Perfil** — nombre, moneda preferida (símbolo dinámico en todos los montos), gestión de categorías propias
- **Panel de administración** — estadísticas globales, lista de usuarios, CRUD completo de categorías del sistema
- **Dark mode** — toggle persistido en `localStorage`
- **Diseño responsive** — sidebar en desktop, barra de navegación inferior en móvil

---

## Stack tecnológico

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Bundler / dev server |
| React Router | v7 | Enrutamiento SPA |
| TanStack Query | v5 | Server state, caché, background refetch |
| Zustand | v5 | Client state (sesión, perfil) |
| React Hook Form + Zod | — | Formularios y validación |
| Tailwind CSS | v3 | Estilos utilitarios |
| Framer Motion | v12 | Animaciones |
| Lucide React | — | Iconos |
| Sonner | — | Notificaciones toast |
| Supabase JS | v2 | Autenticación + Storage |
| Axios | — | Cliente HTTP hacia el backend |

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| .NET | 9 | Runtime |
| ASP.NET Core Web API | 9 | API REST |
| Entity Framework Core | 9 | ORM |
| Npgsql EF | 9 | Proveedor PostgreSQL |
| AutoMapper | 16 | Mapeo DTO ↔ Model |
| FluentValidation | 11 | Validación de DTOs |
| JWT Bearer Auth | 9 | Verificación de tokens Supabase |
| Scalar | — | Documentación OpenAPI interactiva |

### Infraestructura

| Servicio | Rol |
|---|---|
| Supabase | PostgreSQL + Auth + Storage |
| Vercel | Hosting frontend *(deploy pendiente)* |
| Render | Hosting backend *(deploy pendiente)* |

---

## Arquitectura

```
Browser
  │
  ├─ Supabase JS  ──►  Supabase Auth  (login / registro / JWT)
  │
  └─ Axios  ──────────►  .NET 9 API  ──►  Supabase PostgreSQL
               Bearer JWT              EF Core + RLS
```

**Flujo principal:**

1. El usuario se autentica mediante Supabase → recibe un JWT
2. El JWT se almacena en el store de Zustand (`authStore`)
3. Axios adjunta `Authorization: Bearer <token>` en cada request al backend
4. El backend valida el JWT con el secreto de Supabase y extrae el `sub` como `userId`
5. Las queries de EF Core respetan las políticas RLS de Supabase
6. La subida de archivos (avatares, comprobantes) va directamente del browser a Supabase Storage

---

## Base de datos

### Esquema

```
profiles
  id          uuid  PK (= auth.users.id)
  full_name   text
  currency    text  default 'USD'
  role        text  default 'user'  -- 'user' | 'admin'
  avatar_url  text?
  created_at  timestamptz

categories
  id          uuid  PK
  name        text
  icon        text        -- clave del iconMap de CategoryIcon.jsx
  color       text        -- hex color
  type        text        -- 'expense' | 'income'
  is_system   bool        -- true = categoría global, false = categoría del usuario
  user_id     uuid?  FK → profiles  (null si is_system = true)
  created_at  timestamptz

transactions
  id           uuid  PK
  user_id      uuid  FK → profiles
  category_id  uuid? FK → categories
  description  text
  amount       decimal
  type         text   -- 'expense' | 'income'
  date         date
  receipt_url  text?
  created_at   timestamptz

budgets
  id           uuid  PK
  user_id      uuid  FK → profiles
  category_id  uuid  FK → categories
  amount       decimal
  month        date   -- primer día del mes (ej. 2025-05-01)
  is_annual    bool   default false
  created_at   timestamptz
  UNIQUE (user_id, category_id, month)
```

### Políticas RLS

- `profiles` — los usuarios leen y actualizan solo su propia fila
- `categories` — los usuarios leen todas las categorías del sistema + las propias; escriben solo las propias
- `transactions` / `budgets` — los usuarios acceden únicamente a sus propias filas
- Los admins bypasean RLS vía el backend con verificación de rol en la tabla `profiles`

---

## Configuración local

### Requisitos

- Node.js 18+
- .NET 9 SDK
- Cuenta en [Supabase](https://supabase.com) con proyecto creado

### 1. Clonar el repositorio

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
```

### 3. Backend

Editar `fintrack-backend/fintrack-backend/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.<tu-proyecto>.supabase.co;Database=postgres;Username=postgres;Password=<password>;SSL Mode=Require"
  },
  "Supabase": {
    "JwtSecret": "<jwt-secret-desde-supabase-dashboard>"
  }
}
```

```bash
cd fintrack-backend/fintrack-backend
dotnet restore
dotnet run         # http://localhost:5000
# Documentación API: http://localhost:5000/scalar
```

### Comandos frontend

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build de producción → dist/
npm run lint      # ESLint
npm run preview   # Previsualizar build de producción
```

---

## Estructura del proyecto

```
FinTrack/
├── fintrack-frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/        # SystemCategoryFormModal
│       │   ├── auth/         # AuthProvider
│       │   ├── budgets/      # BudgetModal
│       │   ├── categories/   # CategoryFormModal
│       │   ├── layout/       # AppLayout, Sidebar, Header
│       │   ├── transactions/ # TransactionModal
│       │   └── ui/           # AnimatedNumber, CategoryIcon, CategorySelect,
│       │                     # ConfirmDialog, Modal, ...
│       ├── hooks/            # useTransactions, useBudgets, useCategories,
│       │                     # useReports, useAdmin, useCurrency, ...
│       ├── lib/              # supabaseClient.js, utils.js
│       ├── pages/
│       │   ├── admin/        # AdminPage
│       │   ├── auth/         # LoginPage, RegisterPage
│       │   ├── DashboardPage
│       │   ├── TransactionsPage
│       │   ├── BudgetsPage
│       │   ├── ReportsPage
│       │   └── ProfilePage
│       ├── router/           # index.jsx, ProtectedRoute, GuestRoute
│       ├── services/         # api.js (Axios), *Service.js por recurso
│       └── store/            # authStore.js (Zustand), themeStore.js
│
└── fintrack-backend/
    └── fintrack-backend/
        ├── Controllers/      # Transactions, Budgets, Categories,
        │                     # Reports, Profile, Admin
        ├── DTOs/             # Request/Response DTOs
        ├── Models/           # Profile, Category, Transaction, Budget
        ├── Services/         # AdminService
        ├── Data/             # AppDbContext
        ├── Extensions/       # ClaimsPrincipal.GetUserId()
        └── Mappings/         # AutoMapper profiles
```

---

## API endpoints

Todos los endpoints requieren `Authorization: Bearer <supabase-jwt>`.  
Los endpoints `/admin/*` requieren además `profiles.role = 'admin'`.

### Transacciones — `/api/transactions`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/transactions` | Lista paginada con filtros (`page`, `limit`, `type`, `categoryId`, `search`) |
| POST | `/api/transactions` | Crear transacción |
| PUT | `/api/transactions/{id}` | Actualizar transacción propia |
| DELETE | `/api/transactions/{id}` | Eliminar transacción propia |

### Presupuestos — `/api/budgets`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/budgets?month=YYYY-MM` | Lista de presupuestos del mes con gasto actual |
| POST | `/api/budgets` | Crear presupuesto |
| PUT | `/api/budgets/{id}` | Actualizar presupuesto propio |
| DELETE | `/api/budgets/{id}` | Eliminar presupuesto propio |

### Categorías — `/api/categories`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categories` | Todas las categorías del sistema + las propias del usuario |
| POST | `/api/categories` | Crear categoría propia (máx. 3 por usuario) |
| PUT | `/api/categories/{id}` | Actualizar categoría propia |
| DELETE | `/api/categories/{id}` | Eliminar categoría propia (falla si tiene transacciones) |

### Reportes — `/api/reports`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/reports/by-category?from=&to=` | Gastos agrupados por categoría en el rango de fechas |
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
| GET | `/api/admin/users` | Lista de todos los usuarios con conteo de transacciones |
| POST | `/api/admin/categories` | Crear categoría del sistema |
| PUT | `/api/admin/categories/{id}` | Actualizar categoría del sistema |
| DELETE | `/api/admin/categories/{id}` | Eliminar categoría del sistema (falla si tiene transacciones) |

---

## Deploy

> **Pendiente de documentar.**  
> El frontend se desplegará en **Vercel** y el backend en **Render**.

---

## Mejoras planificadas

- Subida de comprobantes desde el browser a Supabase Storage
- Reportes exportables en PDF
- Notificaciones cuando un presupuesto se acerca al límite
- Múltiples cuentas (banco, tarjeta, efectivo)
- Metas de ahorro con barra de progreso
- Importación de transacciones desde CSV bancario
- Gráficas de tendencia y proyecciones
- PWA / instalable en móvil
