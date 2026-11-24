import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsuarios, activarUsuario, desactivarUsuario } from "../services/usuarios";
import type { UsuarioAdmin } from "../types/auth.types";
import { LoadingState, ErrorState, EmptyState } from "../components/StatusStates";
import { ConfirmModal } from "../components/FeedbackModals";
import { useAuthStore } from "../store/authStore";
import { handleApiError } from "../api/handleApiError";

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const [selectedUser, setSelectedUser] = useState<UsuarioAdmin | null>(null);
  const [actionType, setActionType] = useState<"activar" | "desactivar" | null>(null);

  const {
    data: usuarios = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UsuarioAdmin[]>({
    queryKey: ["adminUsers"],
    queryFn: getUsuarios,
  });

  const toggleUserMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "activar" | "desactivar" }) => {
      if (action === "activar") {
        await activarUsuario(id);
      } else {
        await desactivarUsuario(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setSelectedUser(null);
      setActionType(null);
    },
    onError: (err: unknown) => {
      alert(handleApiError(err));
    },
  });

  const handleConfirmAction = () => {
    if (selectedUser && actionType) {
      toggleUserMutation.mutate({ id: selectedUser.id, action: actionType });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-6 border-b border-slate-200 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Administración de Usuarios
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestión de accesos, roles y estado de cuentas en el sistema
        </p>
      </div>

      {isLoading && <LoadingState message="Cargando usuarios..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && usuarios.length === 0 && (
        <EmptyState message="No hay usuarios registrados en el sistema." />
      )}

      {!isLoading && !isError && usuarios.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {usuarios.map((u) => {
                  const estaActivo = u.deleted_at === null || u.deleted_at === undefined;
                  const esYoMismo = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {u.nombre} {u.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-1.5 flex-wrap">
                          {u.roles.map((rol) => (
                            <span
                              key={rol}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                rol === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {rol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {estaActivo ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                            Desactivado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {esYoMismo ? (
                          <span className="text-xs text-slate-400 font-medium italic">
                            (sesión actual)
                          </span>
                        ) : estaActivo ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType("desactivar");
                            }}
                            className="text-rose-600 hover:text-rose-900 font-medium text-sm hover:underline cursor-pointer"
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType("activar");
                            }}
                            className="text-emerald-600 hover:text-emerald-900 font-medium text-sm hover:underline cursor-pointer"
                          >
                            Activar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={selectedUser !== null && actionType !== null}
        title={actionType === "desactivar" ? "Desactivar Usuario" : "Activar Usuario"}
        message={
          actionType === "desactivar"
            ? `¿Desea desactivar la cuenta de ${selectedUser?.nombre} ${selectedUser?.apellido}? El usuario no podrá iniciar sesión.`
            : `¿Desea reactivar la cuenta de ${selectedUser?.nombre} ${selectedUser?.apellido}?`
        }
        confirmText={actionType === "desactivar" ? "Desactivar" : "Activar"}
        isDestructive={actionType === "desactivar"}
        onConfirm={handleConfirmAction}
        onClose={() => {
          setSelectedUser(null);
          setActionType(null);
        }}
      />
    </div>
  );
};

export default AdminUsersPage;
