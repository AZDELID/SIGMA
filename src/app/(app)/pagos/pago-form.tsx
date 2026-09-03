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
      className="grid grid-cols-1 gap-3 rounded-lg border border-brand-200 bg-brand-surface p-4 sm:grid-cols-2 md:grid-cols-3"
    >
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Matrícula
        </label>
        <select
          name="matricula_id"
          required
          defaultValue={matriculaPreseleccionada ?? ""}
          className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
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
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Monto (S/)
        </label>
        <input
          name="monto"
          type="number"
          min="0.01"
          step="0.01"
          required
          className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Método de pago
        </label>
        <select
          name="metodo_pago"
          defaultValue="efectivo"
          className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
        >
          <option value="efectivo">Efectivo</option>
          <option value="yape">Yape</option>
          <option value="plin">Plin</option>
          <option value="transferencia">Transferencia</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          N.º de comprobante
        </label>
        <input
          name="numero_comprobante"
          className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
        />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Observación
        </label>
        <input
          name="observacion"
          className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? "Registrando..." : "Registrar pago"}
        </button>
      </div>
      {state.error && (
        <p className="text-sm text-brand-red-dark md:col-span-3">{state.error}</p>
      )}
      {state.ok && (
        <p className="text-sm text-brand-success md:col-span-3">
          Pago registrado.
        </p>
      )}
    </form>
  );
}
