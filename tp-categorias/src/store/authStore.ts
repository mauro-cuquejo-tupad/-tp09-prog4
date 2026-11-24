import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UsuarioAuth, RegisterFormData } from "../types/auth.types";
import { axiosInstance } from "../api/axiosInstance";

interface AuthState {
  user: UsuarioAuth | null;
  isChecking: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isChecking: true,
      isSubmitting: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isSubmitting: true, error: null });
        try {
          const formData = new URLSearchParams();
          formData.append("username", email);
          formData.append("password", password);

          await axiosInstance.post("/api/v1/auth/token", formData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          const meRes = await axiosInstance.get<UsuarioAuth>("/api/v1/auth/me");
          set({ user: meRes.data, error: null });
        } catch (err: any) {
          const detail = err.response?.data?.detail;
          const msg = typeof detail === "string" ? detail : "Credenciales incorrectas";
          set({ user: null, error: msg });
          throw new Error(msg);
        } finally {
          set({ isSubmitting: false });
        }
      },

      register: async (data: RegisterFormData) => {
        set({ isSubmitting: true, error: null });
        try {
          await axiosInstance.post("/api/v1/auth/register", data);
        } catch (err: any) {
          const detail = err.response?.data?.detail;
          const msg = typeof detail === "string" ? detail : "Error al registrar usuario";
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ isSubmitting: false });
        }
      },

      checkSession: async () => {
        try {
          const res = await axiosInstance.get<UsuarioAuth>("/api/v1/auth/me");
          set({ user: res.data });
        } catch {
          set({ user: null });
        } finally {
          set({ isChecking: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/api/v1/auth/logout");
        } finally {
          set({ user: null, error: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
