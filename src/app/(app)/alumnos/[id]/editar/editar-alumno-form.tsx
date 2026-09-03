"use client";

import { useActionState } from "react";
import { actualizarAlumno, type EditarAlumnoState } from "../../actions";
import type { Alumno } from "@/lib/types/database";

const initialState: EditarAlumnoState = { error: null };

export function EditarAlumnoForm({ alumno }: { alumno: Alumno }) {
  const action = actualizarAlumno.bind(null, alumno.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-brand-200 bg-white p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium text-brand-700">
          Datos del alumno
        </legend>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Nombres *
          </label>
          <input
            name="nombres"
            required
            defaultValue={alumno.nombres}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Apellidos *
          </label>
          <input
            name="apellidos"
            required
            defaultValue={alumno.apellidos}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            DNI * (8 dígitos)
          </label>
          <input
            name="dni"
            required
            pattern="\d{8}"
            title="8 dígitos"
            inputMode="numeric"
            maxLength={8}
            defaultValue={alumno.dni}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
          <p className="mt-1 text-xs text-brand-yellow-dark">
            Si lo cambias, el código del alumno (código {alumno.codigo}) se
            regenera y el carnet/QR ya impreso deja de coincidir.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Fecha de nacimiento
          </label>
          <input
            name="fecha_nacimiento"
            type="date"
            defaultValue={alumno.fecha_nacimiento ?? ""}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Teléfono del alumno
          </label>
          <input
            name="telefono"
            defaultValue={alumno.telefono ?? ""}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Teléfono del apoderado
          </label>
          <input
            name="telefono_apoderado"
            defaultValue={alumno.telefono_apoderado ?? ""}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Dirección
          </label>
          <input
            name="direccion"
            defaultValue={alumno.direccion ?? ""}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
          />
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-brand-red-dark">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
