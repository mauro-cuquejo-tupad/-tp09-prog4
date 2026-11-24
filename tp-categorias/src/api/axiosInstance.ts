import axios from "axios";
import type { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  timeout: 10000,
  withCredentials: true,
});

const RUTAS_DE_AUTH = ["/auth/token", "/auth/me"];

axiosInstance.interceptors.request.use((config) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    const esDeAuth = RUTAS_DE_AUTH.some((r) => url.includes(r));
    if (error.response?.status === 401 && !esDeAuth) {
      useAuthStore.setState({ user: null });
    }
    return Promise.reject(error);
  }
);
