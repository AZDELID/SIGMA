"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="12"
            y1="2.5"
            x2="12"
            y2="5.5"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </g>
    </svg>
  );
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-brand-200 bg-brand-surface">
        <div className="franja-marca h-1.5 animate-login-sweep" />
=======
    <div className="marca-fondo flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-lg border border-brand-200 bg-white shadow-md shadow-brand-900/10">
        <div className="franja-marca h-1.5" />
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
        <div className="p-8">
          <div className="relative mb-4 flex justify-center">
            <div
              aria-hidden="true"
              className="animate-login-glow absolute inset-0 -z-10 m-auto h-28 w-28 rounded-full bg-brand-sky-100 blur-xl"
              style={{ animationDelay: "60ms" }}
            />
            <Image
              src="/logo.png"
              alt="SIGMA"
              width={96}
              height={96}
              priority
              className="animate-login-mark"
              style={{ animationDelay: "90ms" }}
            />
          </div>

          <div
            className="animate-login-rise"
            style={{ animationDelay: "160ms" }}
          >
            <h1 className="relative mb-1 text-center font-sans text-2xl font-bold tracking-tight text-brand-ink">
              SIGMA
              <span
                aria-hidden="true"
                className="animate-login-underline absolute inset-x-0 top-full mx-auto mt-1 h-[3px] w-10 rounded-full bg-brand-yellow"
                style={{ animationDelay: "420ms" }}
              />
            </h1>
            <p className="mb-6 text-center text-sm text-brand-600">
              Inicia sesión para continuar.
            </p>
          </div>

          <form
            action={formAction}
            className="animate-login-rise space-y-4"
            style={{ animationDelay: "220ms" }}
          >
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
                className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field focus:border-brand-500 focus:outline-none"
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
                className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field focus:border-brand-500 focus:outline-none"
              />
            </div>

            {state.error && (
              <p
                key={state.error}
                className="animate-login-alert rounded-md border border-brand-red-100 bg-brand-red-50 px-3 py-2 text-sm text-brand-red-dark"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {pending && (
                <GearIcon className="h-4 w-4 motion-safe:animate-spin" />
              )}
              {pending ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
