"use client";

import { useActionState, useState } from "react";
import { crearSimulacro, type SimulacroFormState } from "../actions";
import type { Ciclo, Materia } from "@/lib/types/database";

const initialState: SimulacroFormState = { error: null };

export function SimulacroForm({
  ciclos,
  materias,
}: {
  ciclos: Ciclo[];
  materias: Materia[];
}) {
  const [state, formAction, pending] = useActionState(crearSimulacro, initialState);
  const [seleccion, setSeleccion] = useState<
    Record<string, { incluida: boolean; puntajeMaximo: string }>
  >(() =>
    Object.fromEntries(
      materias.map((m) => [m.id, { incluida: false, puntajeMaximo: "20" }])
    )
  );

  function toggle(id: string) {
    setSeleccion((s) => ({
      ...s,
      [id]: { ...s[id], incluida: !s[id].incluida },
    }));
  }

  function setPuntaje(id: string, valor: string) {
    setSeleccion((s) => ({ ...s, [id]: { ...s[id], puntajeMaximo: valor } }));
  }

  function handleSubmit(formData: FormData) {
    const materiasSeleccionadas = materias
      .filter((m) => seleccion[m.id]?.incluida)
      .map((m) => ({
        materia_id: m.id,
        puntaje_maximo: Number(seleccion[m.id].puntajeMaximo),
      }));
    formData.set("materias", JSON.stringify(materiasSeleccionadas));
    formAction(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-brand-200 bg-white shadow-sm shadow-brand-900/5 p-4 sm:grid-cols-3">
        <legend className="px-1 text-sm font-medium text-brand-700">
          Datos del simulacro
        </legend>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Nombre *
          </label>
          <input
            name="nombre"
            required
            placeholder="Simulacro 3"
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Fecha
          </label>
          <input
            name="fecha"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Ciclo *
          </label>
          <select
            name="ciclo_id"
            required
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          >
            <option value="">Selecciona un ciclo</option>
            {ciclos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-brand-200 bg-white shadow-sm shadow-brand-900/5 p-4">
        <legend className="px-1 text-sm font-medium text-brand-700">
          Materias evaluadas
        </legend>
        {materias.length === 0 ? (
          <p className="text-sm text-brand-600">
            No hay materias registradas todavía. Créalas en la sección Materias.
          </p>
        ) : (
          <div className="space-y-2">
            {materias.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={seleccion[m.id]?.incluida ?? false}
                  onChange={() => toggle(m.id)}
                  className="h-4 w-4"
                />
                <span className="w-40 text-sm text-brand-900">{m.nombre}</span>
                <label className="text-xs text-brand-600">Puntaje máximo</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  disabled={!seleccion[m.id]?.incluida}
                  value={seleccion[m.id]?.puntajeMaximo ?? "20"}
                  onChange={(e) => setPuntaje(m.id, e.target.value)}
                  className="w-24 rounded-md border border-brand-300 bg-white px-2 py-1 text-sm text-black disabled:bg-brand-50 disabled:text-brand-400"
                />
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {state.error && <p className="text-sm text-brand-red-dark">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Creando..." : "Crear simulacro"}
      </button>
    </form>
  );
}
