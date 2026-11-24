# Frontend - Gestor Gastronómico
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

Frontend SPA interactivo construido con React, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Form, TanStack Table v8, Zustand y Axios con interceptores.

---

## Características Principales

1. **Instancia e Interceptores de Axios:**
   - Instancia configurada en `src/api/axiosInstance.ts` con `baseURL` y `withCredentials: true` para el envío automático de la cookie HttpOnly.
   - Interceptor de respuesta global para capturar errores 401 y limpiar el store de autenticación redirigiendo al login.

2. **Estado Global con Zustand y Persist:**
   - Store global en `src/store/authStore.ts` con las acciones `login`, `register`, `logout` y `checkSession`.
   - Middleware `persist` con `partialize` para guardar únicamente los datos de usuario en `sessionStorage` sin almacenar tokens en el frontend.

3. **Rutas Protegidas y Navegación:**
   - Componente `ProtectedRoute` en `src/components/ProtectedRoute.tsx` para validar sesión activa y verificar roles permitidos (`allowedRoles`).
   - Rutas públicas: `/login`, `/register`, `/unauthorized`.
   - Rutas protegidas: `/categories`, `/products`, `/ingredientes`.
   - Ruta protegida de administración: `/admin/users` accesible únicamente para el rol `admin`.

4. **Interfaz Condicional y Tablas:**
   - Barra de navegación (`Navbar.tsx`) con nombre, apellido y roles del usuario activo, además del botón de cierre de sesión.
   - Botones de creación, edición y eliminación visibles únicamente para usuarios con rol `admin`.
   - Listados interactivos con `TanStack Table v8` que incluyen ordenamiento por columnas, paginación, filtros de búsqueda y visualización de categorías por producto.

---

## Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Comprobar tipado y build:**
   ```bash
   npm run build
   ```
