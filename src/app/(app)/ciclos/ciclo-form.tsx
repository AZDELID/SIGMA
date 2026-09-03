"use client";

import { useActionState, useRef, useEffect } from "react";
import { crearCiclo, type CicloFormState } from "./actions";

const initialState: CicloFormState = { error: null };

export function CicloForm() {
  const [state, formAction, pending] = useActionState(crearCiclo, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) {
      formRef.current?.reset();
    }
  }, [pending, state.error]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 gap-3 rounded-lg border border-brand-200 bg-white p-4 sm:grid-cols-2 md:grid-cols-4"
    >
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Nombre
        </label>
        <input
          name="nombre"
          required
          placeholder="Ciclo Verano 2026"
          className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Inicio
        </label>
        <input
          name="fecha_inicio"
          type="date"
          required
          className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Fin
        </label>
        <input
          name="fecha_fin"
          type="date"
          required
          className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Monto por defecto (S/)
        </label>
        <input
          name="monto_default"
          type="number"
          min="0"
          step="0.01"
          required
          className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
        >
          {pending ? "Creando..." : "Crear ciclo"}
        </button>
      </div>
      {state.error && (
        <p className="text-sm text-brand-red-dark md:col-span-4">{state.error}</p>
      )}
    </form>
  );
}
