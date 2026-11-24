# Trabajo Práctico 09 - Estado Global con Zustand y Autenticación
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

---

## Descripción General

El proyecto integra un frontend desarrollado en **React + TypeScript + Vite + Tailwind CSS + Zustand + Axios** con un backend en **FastAPI + SQLModel + PostgreSQL**.

- **Frontend:**
  - Instancia centralizada de Axios en `src/api/axiosInstance.ts` con `withCredentials: true` e interceptor de respuesta para manejo global de 401.
  - Store global de autenticación en `src/store/authStore.ts` con Zustand y middleware `persist` en `sessionStorage` para mantener los datos del usuario entre recargas sin manipular tokens JWT en JavaScript.
  - Páginas de autenticación con `TanStack Form`: `LoginPage.tsx` y `RegisterPage.tsx`.
  - Página de acceso denegado: `UnauthorizedPage.tsx`.
  - Panel de administración de usuarios en `AdminUsersPage.tsx` con activación y desactivación de cuentas mediante soft delete.
  - Componente `ProtectedRoute.tsx` para control de sesión y autorización granular por roles (`allowedRoles`).
  - Interfaz condicional en `Navbar.tsx`, `CategoriaList.tsx` y `ProductoList.tsx`, mostrando controles de creación, edición y eliminación exclusivamente a usuarios con rol `admin`.
  - Mantenimiento del catálogo de productos con visualización de sus categorías asignadas.

- **Backend:**
  - Módulo de identidad y acceso en `app/modules/usuarios/` con modelos `Usuario`, `Rol` y `UsuarioRol`.
  - Endpoints de autenticación bajo prefijo `/api/v1/auth`: `/register`, `/token`, `/logout`, `/me` y `/admin/usuarios` con activar y desactivar.
  - Hashing de contraseñas con bcrypt y generación de JSON Web Tokens transportados en cookies HttpOnly con atributos `samesite="lax"`.
  - Dependencias reutilizables de FastAPI: `get_current_user`, `get_current_active_user` y `require_role(allowed_roles)` que verifica roles vigentes.
  - Protección de endpoints de escritura en `Categorias`, `Productos` e `Ingredientes` exigiendo rol `admin`.
  - Soporte de creación de pedidos y direcciones para usuarios `user` y `admin` tomando el `usuario_id` de la sesión.
  - Borrado lógico implementado mediante el campo `deleted_at`.
  - Suite de pruebas automatizadas con `pytest` en `fastapi-productos/tests/test_auth.py` cubriendo autenticación, roles, RBAC y borrado lógico.
  - Archivos de pruebas HTTP para REST Client: `auth.http`, `productos.http`, `pedidos.http` e `ingredientes.http`.

---

## Estructura del Repositorio

```text
Cuquejo_TP09/
├── fastapi-productos/             # Backend FastAPI + SQLModel + PostgreSQL
│   ├── app/
│   │   ├── core/                  # config, security, deps, uow, database
│   │   ├── modules/
│   │   │   └── usuarios/          # model, schemas, repository, service, router
│   │   ├── categoria/             # CRUD Categorías protegido
│   │   ├── producto/              # CRUD Productos y ProductoCategoria protegido
│   │   ├── ingrediente/           # CRUD Ingredientes protegido
│   │   └── pedidos/               # Pedidos y Direcciones asociados a sesión
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_auth.py           # 13 pruebas automatizadas con pytest
│   ├── auth.http                  # Pruebas HTTP del módulo de autenticación
│   ├── productos.http             # Pruebas HTTP de Categorías y Productos
│   ├── pedidos.http               # Pruebas HTTP de Pedidos y Direcciones
│   ├── ingredientes.http          # Pruebas HTTP de Ingredientes
│   ├── seed.py                    # Carga inicial de roles, usuarios y catálogos
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── tp-categorias/                 # Frontend React + TypeScript + Vite + Zustand + Axios
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.ts   # Instancia Axios con interceptores y credentials
│   │   │   └── handleApiError.ts  # Manejo centralizado de errores
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Barra con info de usuario, rol y logout
│   │   │   ├── ProtectedRoute.tsx # Guardia de rutas por sesión y rol
│   │   │   ├── CategoriaList.tsx  # Tabla con visibilidad condicional
│   │   │   └── ProductoList.tsx   # Tabla con categorías y visibilidad condicional
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx      # Login con TanStack Form
│   │   │   ├── RegisterPage.tsx   # Registro con TanStack Form
│   │   │   ├── CategoriasPage.tsx # CRUD Categorías
│   │   │   ├── ProductsPage.tsx   # CRUD Productos
│   │   │   ├── AdminUsersPage.tsx # Gestión de usuarios para Admin
│   │   │   └── UnauthorizedPage.tsx
│   │   ├── store/
│   │   │   └── authStore.ts       # Store global Zustand con persist
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── App.tsx                # Configuración de rutas públicas y protegidas
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml
└── README.md
```

---

## Puesta en Marcha

### 1. Base de Datos
Iniciar PostgreSQL con Docker:
```bash
docker compose up -d
```

### 2. Backend
1. Entrar a `fastapi-productos`:
   ```bash
   cd fastapi-productos
   ```
2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecutar servidor:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Correr pruebas unitarias e integrales:
   ```bash
   pytest
   ```

### 3. Frontend
1. Entrar a `tp-categorias`:
   ```bash
   cd tp-categorias
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Comprobar build y tipado:
   ```bash
   npm run build
   ```
