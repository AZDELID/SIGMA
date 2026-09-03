"use client";

import { useActionState, useMemo, useState } from "react";
import { crearAlumno, type AlumnoFormState } from "../actions";
import type { Ciclo } from "@/lib/types/database";

const initialState: AlumnoFormState = { error: null };

export function AlumnoForm({ ciclos }: { ciclos: Ciclo[] }) {
  const [state, formAction, pending] = useActionState(
    crearAlumno,
    initialState
  );
  const [cicloId, setCicloId] = useState("");

  const cicloSeleccionado = useMemo(
    () => ciclos.find((c) => c.id === cicloId),
    [ciclos, cicloId]
  );

  return (
    <form action={formAction} className="space-y-6">
      <fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-sky-200 bg-white p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium text-blue-700">
          Datos del alumno
        </legend>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Nombres *
          </label>
          <input
            name="nombres"
            required
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Apellidos *
          </label>
          <input
            name="apellidos"
            required
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            DNI
          </label>
          <input
            name="dni"
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Fecha de nacimiento
          </label>
          <input
            name="fecha_nacimiento"
            type="date"
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Teléfono del alumno
          </label>
          <input
            name="telefono"
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Teléfono del apoderado
          </label>
          <input
            name="telefono_apoderado"
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Dirección
          </label>
          <input
            name="direccion"
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-sky-200 bg-white p-4 sm:grid-cols-3">
        <legend className="px-1 text-sm font-medium text-blue-700">
          Matrícula
        </legend>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Ciclo *
          </label>
          <select
            name="ciclo_id"
            required
            value={cicloId}
            onChange={(e) => setCicloId(e.target.value)}
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          >
            <option value="">Selecciona un ciclo</option>
            {ciclos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Monto pactado (S/) *
          </label>
          <input
            name="monto_pactado"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={cicloSeleccionado?.monto_default ?? ""}
            key={cicloSeleccionado?.id ?? "sin-ciclo"}
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-blue-600">
            Fecha de matrícula
          </label>
          <input
            name="fecha_matricula"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Matricular alumno"}
      </button>
    </form>
  );
}
