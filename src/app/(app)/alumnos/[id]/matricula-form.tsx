"use client";

import { useActionState } from "react";
import { crearMatricula, type MatriculaFormState } from "../actions";
import type { Ciclo } from "@/lib/types/database";

const initialState: MatriculaFormState = { error: null };

export function MatriculaForm({
  alumnoId,
  ciclosDisponibles,
}: {
  alumnoId: string;
  ciclosDisponibles: Ciclo[];
}) {
  const action = crearMatricula.bind(null, alumnoId);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (ciclosDisponibles.length === 0) {
    return (
      <p className="text-sm text-brand-600">
        Ya está matriculado en todos los ciclos activos.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Ciclo
        </label>
        <select
          name="ciclo_id"
          required
          className="rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
        >
          {ciclosDisponibles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Monto pactado (S/)
        </label>
        <input
          name="monto_pactado"
          type="number"
          min="0"
          step="0.01"
          required
          className="w-32 rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Agregar matrícula"}
      </button>
      {state.error && (
        <p className="w-full text-sm text-brand-red-dark">{state.error}</p>
      )}
    </form>
  );
}
