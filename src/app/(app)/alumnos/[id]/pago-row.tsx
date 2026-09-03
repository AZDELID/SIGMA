"use client";

import { useActionState, useState, useTransition } from "react";
import {
  actualizarPago,
  eliminarPago,
  type EditarPagoState,
} from "../../pagos/actions";
import type { Pago } from "@/lib/types/database";

const initialState: EditarPagoState = { error: null };

export function PagoRow({ pago }: { pago: Pago }) {
  const [editando, setEditando] = useState(false);
  const [eliminando, startEliminar] = useTransition();
  const action = actualizarPago.bind(null, pago.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (editando) {
    return (
      <tr>
        <td colSpan={4} className="px-4 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-600">
                Fecha
              </label>
              <input
                name="fecha_pago"
                type="date"
                defaultValue={pago.fecha_pago}
                required
                className="rounded-md border border-brand-300 bg-white px-2 py-1.5 text-sm text-black"
              />
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
                defaultValue={pago.monto}
                required
                className="w-28 rounded-md border border-brand-300 bg-white px-2 py-1.5 text-sm text-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-600">
                Método
              </label>
              <select
                name="metodo_pago"
                defaultValue={pago.metodo_pago}
                className="rounded-md border border-brand-300 bg-white px-2 py-1.5 text-sm text-black"
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
                Comprobante
              </label>
              <input
                name="numero_comprobante"
                defaultValue={pago.numero_comprobante ?? ""}
                className="rounded-md border border-brand-300 bg-white px-2 py-1.5 text-sm text-black"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-brand-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800 disabled:opacity-50"
            >
              {pending ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="text-xs text-brand-600 hover:text-brand-900"
            >
              Cancelar
            </button>
            {state.error && (
              <p className="w-full text-xs text-brand-red-dark">{state.error}</p>
            )}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-4 py-2 text-brand-600">{pago.fecha_pago}</td>
      <td className="px-4 py-2 font-medium text-green-700">
        S/ {Number(pago.monto).toFixed(2)}
      </td>
      <td className="px-4 py-2 text-brand-600 capitalize">{pago.metodo_pago}</td>
      <td className="px-4 py-2 text-right">
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="mr-3 text-xs text-brand-600 hover:text-brand-900"
        >
          Editar
        </button>
        <button
          type="button"
          disabled={eliminando}
          onClick={() => {
            const confirmado = window.confirm(
              `¿Eliminar este pago de S/ ${Number(pago.monto).toFixed(2)}? Esto no se puede deshacer.`
            );
            if (confirmado) {
              startEliminar(() => eliminarPago(pago.id));
            }
          }}
          className="text-xs text-brand-red-dark hover:text-brand-red-darker disabled:opacity-50"
        >
          {eliminando ? "Eliminando..." : "Eliminar"}
        </button>
      </td>
    </tr>
  );
}
