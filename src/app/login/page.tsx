"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-brand-200 bg-white shadow-sm shadow-brand-900/5 shadow-sm">
        <div className="franja-marca h-1.5" />
        <div className="p-8">
          <div className="mb-4 flex justify-center">
            <Image src="/logo.png" alt="SIGMA" width={96} height={96} priority />
          </div>
          <h1 className="mb-1 text-center text-xl font-semibold text-brand-900">
            SIGMA
          </h1>
          <p className="mb-6 text-center text-sm text-brand-600">
            Inicia sesión para continuar.
          </p>

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-brand-700"
              >
                Usuario
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-brand-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black focus:border-brand-500 focus:outline-none"
              />
            </div>

            {state.error && (
              <p className="text-sm text-brand-red-dark">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {pending ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
