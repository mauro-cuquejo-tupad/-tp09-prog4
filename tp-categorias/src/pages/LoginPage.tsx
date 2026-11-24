import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useAuthStore } from "../store/authStore";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isSubmitting } = useAuthStore();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value.email.trim(), value.password);
        navigate("/categories");
      } catch {
        // El error ya queda registrado en el store y se muestra en pantalla sin recargar
      }
    },
  });

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Ingresá con tu cuenta para acceder al sistema
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  !value || !value.trim() ? "El correo electrónico es requerido" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="usuario@foodstore.com"
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value ? "La contraseña es requerida" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor="login-pass" className="block text-sm font-medium text-slate-700">
                    Contraseña *
                  </label>
                  <input
                    id="login-pass"
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isFormSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isFormSubmitting || isSubmitting}
                className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting || isFormSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            )}
          </form.Subscribe>

          <div className="text-center text-sm text-slate-600">
            ¿No tenés una cuenta?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Registrate acá
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
