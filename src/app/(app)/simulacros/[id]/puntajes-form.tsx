"use client";

import { useActionState } from "react";
import { guardarPuntajes, type GuardarPuntajesState } from "../actions";
import type { Alumno } from "@/lib/types/database";

const initialState: GuardarPuntajesState = { error: null };

export function PuntajesForm({
  simulacroId,
  simulacroMateriaId,
  materiaNombre,
  puntajeMaximo,
  alumnos,
  puntajesActuales,
}: {
  simulacroId: string;
  simulacroMateriaId: string;
  materiaNombre: string;
  puntajeMaximo: number;
  alumnos: Alumno[];
  puntajesActuales: Record<string, number>;
}) {
  const action = guardarPuntajes.bind(null, simulacroId, simulacroMateriaId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <details className="rounded-lg border border-brand-200 bg-brand-surface">
      <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium text-brand-ink">
        {materiaNombre}{" "}
        <span className="font-normal text-brand-600">
          (puntaje máximo {puntajeMaximo})
        </span>
      </summary>
      <form
        action={formAction}
        className="space-y-3 border-t border-brand-100 p-4"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {alumnos.map((a) => (
            <div key={a.id}>
              <label className="mb-1 block truncate text-xs text-brand-600">
                {a.apellidos}, {a.nombres}
              </label>
              <input
                type="number"
                name={`puntaje_${a.id}`}
                min="0"
                step="0.01"
                defaultValue={puntajesActuales[a.id] ?? ""}
                placeholder="—"
                className="w-full rounded-md border border-brand-300 bg-brand-surface px-2 py-1.5 text-sm text-brand-field"
              />
            </div>
          ))}
        </div>
        {alumnos.length === 0 && (
          <p className="text-sm text-brand-400">
            No hay alumnos matriculados en el ciclo de este simulacro.
          </p>
        )}
        {alumnos.length > 0 && (
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-brand-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Guardar puntajes"}
          </button>
        )}
        {state.error && (
          <p className="text-xs text-brand-red-dark">{state.error}</p>
        )}
        {state.ok && <p className="text-xs text-brand-success">Guardado.</p>}
      </form>
    </details>
  );
}
