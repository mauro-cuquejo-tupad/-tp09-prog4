import { axiosInstance } from "../api/axiosInstance";
import type { UsuarioAuth, RegisterFormData } from "../types/auth.types";

const AUTH = "/api/v1/auth";

export const requestLogin = async (email: string, password: string): Promise<void> => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  await axiosInstance.post(`${AUTH}/token`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const requestMe = async (): Promise<UsuarioAuth> => {
  const response = await axiosInstance.get<UsuarioAuth>(`${AUTH}/me`);
  return response.data;
};

export const requestLogout = async (): Promise<void> => {
  await axiosInstance.post(`${AUTH}/logout`);
};

export const requestRegister = async (data: RegisterFormData): Promise<UsuarioAuth> => {
  const response = await axiosInstance.post<UsuarioAuth>(`${AUTH}/register`, data);
  return response.data;
};
