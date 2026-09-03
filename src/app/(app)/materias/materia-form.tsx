"use client";

import { useActionState, useRef, useEffect } from "react";
import { crearMateria, type MateriaFormState } from "./actions";

const initialState: MateriaFormState = { error: null };

export function MateriaForm() {
  const [state, formAction, pending] = useActionState(crearMateria, initialState);
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
      className="flex flex-wrap items-end gap-3 rounded-lg border border-brand-200 bg-white p-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-brand-600">
          Nueva materia
        </label>
        <input
          name="nombre"
          required
          placeholder="Aritmética"
          className="rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-900 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
      >
        {pending ? "Creando..." : "Agregar materia"}
      </button>
      {state.error && <p className="text-sm text-brand-red-dark">{state.error}</p>}
    </form>
  );
}
