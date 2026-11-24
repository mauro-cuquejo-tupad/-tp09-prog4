import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CategoriasPage from "./pages/CategoriasPage";
import ProductsPage from "./pages/ProductsPage";
import IngredientesPage from "./pages/IngredientesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Footer } from "./components/Footer";
import { useAuthStore } from "./store/authStore";

function App() {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/categories" replace />} />
          <Route path="/categorias" element={<Navigate to="/categories" replace />} />
          <Route path="/productos" element={<Navigate to="/products" replace />} />

          {/* Rutas Protegidas para usuarios autenticados */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ingredientes"
            element={
              <ProtectedRoute>
                <IngredientesPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta Protegida solo para Administrador */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta desconocida redirige a /categories */}
          <Route path="*" element={<Navigate to="/categories" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
