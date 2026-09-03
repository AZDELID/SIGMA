"use client";

import { useActionState, useEffect, useRef } from "react";
import { marcarPorCodigo, type MarcarPorCodigoState } from "./actions";

const initialState: MarcarPorCodigoState = { error: null };

export function CodigoForm() {
  const [state, formAction, pending] = useActionState(
    marcarPorCodigo,
    initialState
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pending && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, [pending, state]);

  return (
    <div className="rounded-lg border border-sky-200 bg-white p-4">
      <form action={formAction} className="flex gap-2">
        <input
          ref={inputRef}
          name="codigo"
          autoFocus
          autoComplete="off"
          placeholder="Escanea el carnet o escribe el código y presiona Enter"
          className="flex-1 rounded-md border border-blue-300 bg-white px-3 py-3 text-base text-black"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Marcar
        </button>
      </form>

      {state.error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p
          className={
            state.ok.yaEstabaMarcado
              ? "mt-3 rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-700"
              : "mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
          }
        >
          {state.ok.yaEstabaMarcado
            ? `${state.ok.alumno} — ya tenía una asistencia marcada hoy, se registró otra.`
            : `Asistencia registrada: ${state.ok.alumno}.`}
        </p>
      )}
    </div>
  );
}
