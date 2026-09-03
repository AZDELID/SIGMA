"use client";

import { useActionState, useEffect, useRef } from "react";
import { registrarPago, type PagoFormState } from "./actions";
import type { MatriculaResumen } from "@/lib/types/database";

const initialState: PagoFormState = { error: null };

export function PagoForm({
  matriculas,
  matriculaPreseleccionada,
}: {
  matriculas: MatriculaResumen[];
  matriculaPreseleccionada?: string;
}) {
  const [state, formAction, pending] = useActionState(
    registrarPago,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 gap-3 rounded-lg border border-sky-200 bg-white p-4 sm:grid-cols-2 md:grid-cols-3"
    >
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-blue-600">
          Matrícula
        </label>
        <select
          name="matricula_id"
          required
          defaultValue={matriculaPreseleccionada ?? ""}
          className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
        >
          <option value="" disabled>
            Selecciona un alumno con saldo pendiente
          </option>
          {matriculas.map((m) => (
            <option key={m.matricula_id} value={m.matricula_id}>
              {m.alumno_apellidos}, {m.alumno_nombres} · {m.ciclo_nombre} · saldo
              S/ {m.saldo_pendiente.toFixed(2)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-blue-600">
          Monto (S/)
        </label>
        <input
          name="monto"
          type="number"
          min="0.01"
          step="0.01"
          required
          className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-blue-600">
          Método de pago
        </label>
        <select
          name="metodo_pago"
          defaultValue="efectivo"
          className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
        >
          <option value="efectivo">Efectivo</option>
          <option value="yape">Yape</option>
          <option value="plin">Plin</option>
          <option value="transferencia">Transferencia</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-blue-600">
          N.º de comprobante
        </label>
        <input
          name="numero_comprobante"
          className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-blue-600">
          Observación
        </label>
        <input
          name="observacion"
          className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-blue-900 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {pending ? "Registrando..." : "Registrar pago"}
        </button>
      </div>
      {state.error && (
        <p className="text-sm text-red-600 md:col-span-3">{state.error}</p>
      )}
      {state.ok && (
        <p className="text-sm text-green-700 md:col-span-3">
          Pago registrado.
        </p>
      )}
    </form>
  );
}
