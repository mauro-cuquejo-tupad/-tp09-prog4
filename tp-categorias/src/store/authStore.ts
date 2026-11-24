import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UsuarioAuth } from "../types/auth.types";
import { requestLogin, requestLogout, requestMe } from "../services/auth";

interface AuthState {
  user: UsuarioAuth | null;
  isChecking: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const mensajeDeError = (e: unknown): string => {
  if (axios.isAxiosError(e) && typeof e.response?.data?.detail === "string") {
    return e.response.data.detail;
  }
  return "Credenciales incorrectas";
};

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
          await requestLogin(email, password);
          const usuario = await requestMe();
          set({ user: usuario, error: null });
        } catch (err: unknown) {
          const msg = mensajeDeError(err);
          set({ user: null, error: msg });
          throw new Error(msg);
        } finally {
          set({ isSubmitting: false });
        }
      },

      checkSession: async () => {
        try {
          const usuario = await requestMe();
          set({ user: usuario });
        } catch {
          set({ user: null });
        } finally {
          set({ isChecking: false });
        }
      },

      logout: async () => {
        try {
          await requestLogout();
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

export const useEsAdmin = () =>
  useAuthStore((s) => s.user?.roles?.includes("admin") ?? false);
