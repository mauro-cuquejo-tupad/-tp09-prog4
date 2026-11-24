import { axiosInstance } from "../api/axiosInstance";
import type { UsuarioAdmin } from "../types/auth.types";

const URL = "/api/v1/auth/admin/usuarios";

export const getUsuarios = async (): Promise<UsuarioAdmin[]> => {
  const response = await axiosInstance.get<UsuarioAdmin[]>(URL);
  return response.data;
};

export const activarUsuario = async (id: number): Promise<UsuarioAdmin> => {
  const response = await axiosInstance.post<UsuarioAdmin>(`${URL}/${id}/activar`);
  return response.data;
};

export const desactivarUsuario = async (id: number): Promise<UsuarioAdmin> => {
  const response = await axiosInstance.post<UsuarioAdmin>(`${URL}/${id}/desactivar`);
  return response.data;
};
